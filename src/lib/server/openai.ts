import OpenAi from "openai";

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  throw new Error("No OpenAI API key found");
}

const openai = new OpenAi({ apiKey });

export default openai;

export async function getEmbedding(text: string) {
    const response = await openai.embeddings.create({
        model: "text-embedding-3-large",
        input: text,
    });

    const embedding = response.data[0]?.embedding;
    if (!embedding) {
        throw new Error("No embedding found");
    }

    console.log(embedding);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return embedding;
}
