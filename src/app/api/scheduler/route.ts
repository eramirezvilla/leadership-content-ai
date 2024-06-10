import prisma from "~/lib/server/prisma";
import { createScheduleSchema } from "~/lib/validation/Scheduler";
import { productDataIndx } from "~/lib/server/pinecone";
import openai, { getEmbedding } from "~/lib/server/openai";
import { auth } from "@clerk/nextjs";

interface CreateAPost {
  created_from_theme: string;
  industry_name: string;
  discussion_topic: string;
  topic_description: string;
  mapping_id: number;
  schedule_date: Date;
  schedule_id: number;
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

    const { title, created_from_theme, start_from, end_on, frequency } =
      parseResult.data;

    // create schedule in database
    const newScheduler = await prisma.scheduler.create({
      data: {
        title: title,
        theme_name: created_from_theme,
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
    const postsToCreate = [];
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

      // const industryChallengeMapping =
      //   await prisma.industry_challenge_mapping.findFirst({
      //     where: {
      //       already_used: false,
      //     },
      //   });
      const count = await prisma.industry_challenge_mapping.count({
        where: {
          already_used: false,
        },
      });
      
      // Step 2: Generate a random offset
      const randomOffset = Math.floor(Math.random() * count);
      
      // Step 3: Retrieve a row using the random offset
      const industryChallengeMappingArr = await prisma.industry_challenge_mapping.findMany({
        where: {
          already_used: false,
        },
        skip: randomOffset,
        take: 1,
      });
      const industryChallengeMapping = industryChallengeMappingArr[0];

      if (!industryChallengeMapping) {
        console.log("No more industry_challenge_mapping available");
        break;
      }
      const { id, industry_name, discussion_topic, topic_description } =
        industryChallengeMapping;

      //create post from api call
      postsToCreate.push({
        created_from_theme: parseResult.data.created_from_theme,
        industry_name: industry_name,
        discussion_topic: discussion_topic!,
        topic_description: topic_description!,
        mapping_id: Number(id),
        schedule_date: new Date(currentDate),
        schedule_id: Number(newScheduler.id),
      });
      // console.log("newPostValues: ", newPostValues);

      //   await createPost(
      //       newPostValues.created_from_theme,
      //       newPostValues.industry_name,
      //       newPostValues.discussion_topic!,
      //       newPostValues.topic_description!,
      //       newPostValues.mapping_id,
      //       newPostValues.schedule_date,
      //       newPostValues.schedule_id,
      //       userId,
      //   );

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
    await Promise.all(
      postsToCreate.map(async (post) => {
        await createPost(post, userId);
      }),
    );

    return Response.json("Success", { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json("An error occurred", { status: 500 });
  }
}

async function createPost(
  post: CreateAPost,
  userId: string,
) {
  const {
    created_from_theme,
    industry_name,
    discussion_topic,
    topic_description,
    mapping_id,
    schedule_date,
    schedule_id,
  } = post;
  const themeVals = await prisma.themes.findFirst({
    where: {
      title: created_from_theme,
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
  console.log("OpenAI response: ", openaiResponse?.choices[0]?.message.content);

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
        created_from_theme: created_from_theme,
      },
    });
  }
}
