import { notesIndex } from "@/lib/db/pinecone";
import prisma from "@/lib/db/prisma";
import openai, { getEmbedding } from "@/lib/openai";
import { auth } from "@clerk/nextjs";
import { type ChatCompletionMessage } from "openai/resources/index.mjs";
import {OpenAIStream, StreamingTextResponse} from "ai"

export async function POST(req: Request){
    try {
        const body = await req.json();
        const messages: ChatCompletionMessage[] = body.messages;

        //get the last 6 messages to send to the api
        const messagesTruncated = messages.slice(-6);

        const embedding = await getEmbedding(
            messagesTruncated.map((message) => message.content).join("\n")
        );

        const {userId} = auth();
        
        //topK is the number of results to return
        //fetches the vector embeddings from pinecone
        const vectorQueryResponse = await notesIndex.query({
            vector: embedding,
            topK: 13,
            filter: { userId },
    })

    //fetches the notes from the prisma database
    const relevantNotes = await prisma.note.findMany({
        where: {
            id: {
                in: vectorQueryResponse.matches.map((match) => BigInt(match.id)),
            },
        },
    });

    console.log("Relevant notes found: ", relevantNotes);

    //make the request to chatgpt api
    const systemMessage: ChatCompletionMessage = {
        role: "assistant",
        content: "You are an intelligent note-taking app. You answer the user's question based on their existing notes. " +
        "The relevant notes for this question are:\n" +
        relevantNotes.map((note) => `Title: ${note.title}\n\nContent:\n${note.content}`).join("\n\n"),
    };
    
    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        stream: true,
        messages: [systemMessage, ...messagesTruncated]
    });

    //creates the stream from open ai using the vercel sdk
    const stream = OpenAIStream(response)
    return new StreamingTextResponse(stream);

        

    } catch(error){
        console.error(error);
        return Response.json("An error occurred", { status: 500 });
    }
}