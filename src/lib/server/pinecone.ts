import { Pinecone } from "@pinecone-database/pinecone"

const apiKey = process.env.PINECONE_API_KEY;
const secondApiKey = process.env.SECOND_PINECONE_API_KEY;

if(!apiKey || !secondApiKey) {
  throw new Error('No Pinecone API key found');
}

const pinecone = new Pinecone({ 
    apiKey
});

const secondPinecone = new Pinecone({
    apiKey: secondApiKey
});

export const productDataIndx = pinecone.Index("product-content");

export const secondProductDataIndx = secondPinecone.Index("product-data");
