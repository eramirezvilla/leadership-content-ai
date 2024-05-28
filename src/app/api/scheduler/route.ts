import prisma from "~/lib/server/prisma";
import { createScheduleSchema } from "~/lib/validation/Scheduler";
import { productDataIndx } from "~/lib/server/pinecone";
import openai, { getEmbedding } from "~/lib/server/openai";
import { auth } from "@clerk/nextjs";

async function getRelatedTopics(keyword : string) {
  const words = keyword.split(' ').map(word => word.trim()).filter(word => word.length > 0);

  const searchConditions = words.map(word => ({
    OR: [
      {
        industry_name: {
          contains: word,
          mode: 'insensitive',
        },
      },
      {
        discussion_topic: {
          contains: word,
          mode: 'insensitive',
        },
      },
      {
        topic_description: {
          contains: word,
          mode: 'insensitive',
        },
      },
    ],
  }));

  const relatedTopics = await prisma.industry_challenge_mapping.findMany({
    where: {
      AND: [
        { already_used: false },
        ...searchConditions,
      ],
    },
  });

  if (relatedTopics.length === 0) {
    console.log("No related topics available");
    return [];
  }

  return relatedTopics;
}


export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("body", body);

    const parseResult = createScheduleSchema.safeParse(body);
    console.log("parseResult", parseResult);

    const { userId } = auth();
    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!parseResult.success) {
      return Response.json({ error: "Invalid input" }, { status: 400 });
    }

    const { title, theme_name, start_from, end_on, frequency, focus_topic } =
      parseResult.data;

    // create schedule in database
    const newScheduler = await prisma.scheduler.create({
      data: {
        title: title,
        theme_name: theme_name,
        start_from: new Date(start_from),
        end_on: new Date(end_on),
        frequency_sun_start: frequency,
      },
    });

    console.log(
      "newScheduler: \n",
      "start_from: ",
      new Date(start_from),
      "\nend_on: ",
      new Date(end_on),
      "\nfrequency: ",
      frequency,
    );

    // generate posts for the schedule with schedule_date between the start_from and end_on dates, according to the frequency

    const currentDate = new Date(parseResult.data.start_from);
    while (currentDate <= new Date(parseResult.data.end_on)) {
      // get day of the week for currentDate
      const day = currentDate.getDay();
      console.log("day: ", day, "currentDate: ", currentDate);

      //compare the day of the week with the frequency array
      if (!parseResult.data.frequency[day]) {
        console.log("skipping day: ", currentDate);
        currentDate.setDate(currentDate.getDate() + 1);
        continue;
      }

      //TODO: create way to include natural language query for industry_challenge_mapping i.e. "Focus on RFID technology in the healthcare industry."
      

      const industryChallengeMapping =
        await prisma.industry_challenge_mapping.findFirst({
          where: {
            already_used: false,
          },
        });
      if (!industryChallengeMapping) {
        console.log("No more industry_challenge_mapping available");
        break;
      }
      const { id, industry_name, discussion_topic, topic_description } =
        industryChallengeMapping;

      //create post from api call
      const newPostValues = {
        theme_name: parseResult.data.theme_name,
        industry_name: industry_name,
        discussion_topic: discussion_topic,
        topic_description: topic_description,
        mapping_id: Number(id),
        schedule_date: currentDate,
        schedule_id: Number(newScheduler.id),
      };
      console.log("newPostValues: ", newPostValues);

        await createPost(
            newPostValues.theme_name,
            newPostValues.industry_name,
            newPostValues.discussion_topic!,
            newPostValues.topic_description!,
            newPostValues.mapping_id,
            newPostValues.schedule_date,
            newPostValues.schedule_id,
            userId,
        );

      // set already_used to true
      await prisma.industry_challenge_mapping.update({
        where: {
          id: industryChallengeMapping.id,
        },
        data: {
          already_used: true,
        },
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return Response.json("Success", { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json("An error occurred", { status: 500 });
  }
}


async function createPost( theme_name: string, industry_name: string, discussion_topic: string, topic_description: string, mapping_id: number, schedule_date: Date, schedule_id: number, userId: string ){
    const themeVals = await prisma.themes.findFirst({
        where: {
          title: theme_name,
        },
      });
      if (!themeVals) {
        return Response.json("Theme not found", { status: 404 });
      }
      const { description, audience_connection, company_connection } = themeVals;

    const embedding = await getEmbedding(
        industry_name + "\n\n" + discussion_topic + "\n\n" + topic_description,
      );
  
      //topK is the number of results to return
      //fetches the vector embeddings from pinecone
      const vectorQueryResponse = await productDataIndx.query({
        vector: embedding,
        topK: 4,
      });
  
  
      const fileIds = vectorQueryResponse.matches.map((match) =>
        Number(match.id.split("-")[0]),
      );
      console.log("File IDs to retrieve:", fileIds);
  
      // fetches the notes from the prisma database
      const relevantFiles = await prisma.file.findMany({
        where: {
          id: {
            in: fileIds,
          },
        },
      });
  
    //   console.log("query ", parseResult.data);
      console.log("Relevant files found: ", relevantFiles);
  
      //make the request to chatgpt api
      const openaiResponse = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content:
              "You are a social media manager specializing in LinkedIn content. You will be posting from the C-Suite Executives accounts with the intention of generating new sales leads. For this post you will: " +
              description +
              audience_connection +
              company_connection +
              " These are the relevant product files you will need for this post: " +
              relevantFiles.map((file) => file.filename).join(", ") +
              ".\n\nThe discussion topic is: " +
              discussion_topic +
              ".\n\nThe topic description is: " +
              topic_description +
              ".\n\nGenerate a post that will engage the audience and promote the products. Remember to include a call to action. Keep a professional, yet engaging tone.",
          },
        ],
        model: "gpt-3.5-turbo",
      });
      console.log(
        "OpenAI response: ",
        openaiResponse?.choices[0]?.message.content,
      );
  
      if (!openaiResponse) {
        return Response.json("An error occurred", { status: 500 });
      } else {
        const relevantFileIds = relevantFiles.map((file) => Number(file.id));
        await prisma.post.create({
          data: {
            title: discussion_topic,
            content: openaiResponse?.choices[0]?.message.content,
            created_from_topic: mapping_id,
            relevant_files: relevantFileIds,
            user_id: userId,
            schedule_date: schedule_date,
            schedule_id: schedule_id,
          },
        });
      }
}