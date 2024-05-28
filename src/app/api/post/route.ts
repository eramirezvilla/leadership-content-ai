import { productDataIndx } from "~/lib/server/pinecone";
import prisma from "~/lib/server/prisma";
import openai, { getEmbedding } from "~/lib/server/openai";
import { createPostSchema, updatePostSchema, deletePostSchema } from "~/lib/validation/Post";
import { auth } from "@clerk/nextjs";


export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parseResult = createPostSchema.safeParse(body);

    if (!parseResult.success) {
      return Response.json({ error: "Invalid input" }, { status: 400 });
    }

    const { userId } = auth();
    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      created_from_theme,
      industry_name,
      discussion_topic,
      topic_description,
      mapping_id,
      schedule_date,
      schedule_id
    } = parseResult.data;

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

    console.log("query ", parseResult.data);
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
            ".\n\nPlease generate a post that will engage the audience and promote the products. Remember to include a call to action.",
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
          created_from_theme: created_from_theme,
          relevant_files: relevantFileIds,
          user_id: userId,
          schedule_date: schedule_date,
          schedule_id: schedule_id,
        },
      });
    }
    return Response.json(relevantFiles);
  } catch (error) {
    console.error(error);
    return Response.json("An error occurred", { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const parseResult = updatePostSchema.safeParse(body);

    if (!parseResult.success) {
      return Response.json({ error: "Invalid input" }, { status: 400 });
    }
    //update post approval in database with prisma
    const { id, approved, content, title } = parseResult.data;
    await prisma.post.update({
      where: {
        id: Number(id),
      },
      data: {
        approved: approved,
        content: content,
        title: title,
      },
    });

    return Response.json("Post updated successfully", { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json("An error occurred", { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const parseResult = deletePostSchema.safeParse(body);

    if (!parseResult.success) {
      return Response.json({ error: "Invalid input" }, { status: 400 });
    }

    const { id } = parseResult.data;
    await prisma.post.delete({
      where: {
        id: Number(id),
      },
    });

    return Response.json("Post deleted successfully", { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json("An error occurred", { status: 500 });
  }
}