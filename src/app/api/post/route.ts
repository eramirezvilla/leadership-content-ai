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

    return Response.json(relevantFiles);

    // //make the request to chatgpt api
    // const systemMessage: ChatCompletionMessage = {
    //     role: "assistant",
    //     content: "You are an intelligent note-taking app. You answer the user's question based on their existing notes. " +
    //     "The relevant notes for this question are:\n" +
    //     relevantNotes.map((note) => `Title: ${note.title}\n\nContent:\n${note.content}`).join("\n\n"),
    // };
    
    // const response = await openai.chat.completions.create({
    //     model: "gpt-3.5-turbo",
    //     stream: true,
    //     messages: [systemMessage, ...messagesTruncated]
    // });

    // //creates the stream from open ai using the vercel sdk
    // const stream = OpenAIStream(response)
    // return new StreamingTextResponse(stream);

        

    } catch(error){
        console.error(error);
        return Response.json("An error occurred", { status: 500 });
    }
}