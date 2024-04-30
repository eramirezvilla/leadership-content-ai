import { productDataIndx } from "~/lib/server/pinecone";
import prisma from "~/lib/server/prisma";
import openai, { getEmbedding } from "~/lib/server/openai";
import { auth } from "@clerk/nextjs";
import { createPostSchema } from "~/lib/validation/Post";

export async function POST(req: Request){
    try {
        const body = await req.json();
        const parseResult = createPostSchema.safeParse(body);

        if (!parseResult.success) {
            return Response.json({ error: "Invalid input" }, { status: 400 });
          }
        
        const { theme_name, industry_name, discussion_topic, topic_description} = parseResult.data;

        const embedding = await getEmbedding(industry_name + "\n\n" + discussion_topic + "\n\n" + topic_description);
        
        //topK is the number of results to return
        //fetches the vector embeddings from pinecone
        const vectorQueryResponse = await productDataIndx.query({
            vector: embedding,
            topK: 4,
    })

    // fetches the notes from the prisma database
    const relevantFiles = await prisma.file.findMany({
        where: {
            id: {
                in: vectorQueryResponse.matches.map((match) => Number(match.id)),
            },
        },
    });

    console.log("query ", parseResult.data)
    console.log("Relevant notes found: ", relevantFiles);

    
    //make the request to chatgpt api
    const openaiResponse = await openai.chat.completions.create({
        messages: [{ role: "system", content: "You are a social media manager specializing in LinkedIn content. You will be posting from the C-Suite Executives accounts with the intention of generating new sales leads. Ensure that the post you generate relates to the audience and ties in to the products offered. These are the relevant product files you will need for this post: " + relevantFiles.map((file) => file.filename).join(", ") + ".\n\nThe discussion topic is: " + discussion_topic + ".\n\nThe topic description is: " + topic_description + ".\n\nPlease generate a post that will engage the audience and promote the products. Remember to include a call to action."}],
        model: "gpt-3.5-turbo",
  });
    console.log("OpenAI response: ", openaiResponse?.choices[0]?.message.content);
    return Response.json(relevantFiles);

    } catch(error){
        console.error(error);
        return Response.json("An error occurred", { status: 500 });
    }
}