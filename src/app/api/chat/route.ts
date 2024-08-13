import { getRelevantProducts } from "~/lib/validation/ProductQuery";
import { secondProductDataIndx } from "~/lib/server/pinecone";
import openai, { getEmbedding } from "~/lib/server/openai";

async function queryBySku(sku: string) {
  let queryVector;
  const response = await secondProductDataIndx.fetch([sku]);
  if (response.records) {
    queryVector = response.records[sku]!.values;
    return queryVector;
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const query = Object.fromEntries(url.searchParams.entries());
    const params = getRelevantProducts.safeParse(query);
    if (!params) {
      return Response.json("Invalid input at entry", { status: 400 });
    }
    const { sku, part_number, chatQuery } = params.data!;
    let searchType;
    if (sku) {
      searchType = "sku";
    } else if (part_number) {
      searchType = "part_number";
    } else if (chatQuery) {
      searchType = "chatQuery";
    }

    let queryVector;
    let product_id = "";
    if (searchType === "sku" && sku) {
      product_id = sku;
      queryVector = await queryBySku(sku);
    } else if (searchType === "part_number" && part_number) {
      const dummyVector = new Array(3072).fill(0);
      const response = await secondProductDataIndx.query({
        vector: dummyVector,
        filter: {
          "part number": { $eq: part_number },
        },
        topK: 1,
        includeMetadata: true,
      });
      if (response.matches.length > 0) {
        product_id = response.matches[0]!.id;
        queryVector = await queryBySku(product_id);
      }
    } else if (searchType === "chatQuery" && chatQuery) {
      const chatEmbedding = await getEmbedding(chatQuery);
      const response = await secondProductDataIndx.query({
        vector: chatEmbedding,
        topK: 10,
        includeMetadata: true,
        filter: {
          is_enabled: { $eq: 1 },
        },
      });
      const relevantItems = response.matches.map((item) => ({
        sku: item.id,
        part_number: item.metadata?.["part number"],
        description: item.metadata?.["part description"],
        score: item.score,
      }));
      console.log("relevantItems: ", relevantItems);
      return Response.json(relevantItems, { status: 200 });
    }

    if (!queryVector) {
      return Response.json("No results found", { status: 404 });
    }

    const queryResponse = await secondProductDataIndx.query({
      vector: queryVector,
      topK: 6,
      includeMetadata: true,
      filter: {
        is_enabled: { $eq: 1 },
      },
    });

    // const filteredResults = queryResponse.matches.filter(
    //   (item) => item.id !== product_id,
    // );

    // const similarProducts = filteredResults.map((item) => ({
    //   sku: item.id,
    //   part_number: item.metadata?.["part number"],
    //   description: item.metadata?.["part description"],
    //   score: item.score,
    // }));

    const similarProducts = queryResponse.matches.map((item) => ({
        sku: item.id,
        part_number: item.metadata?.["part number"],
        description: item.metadata?.["part description"],
        score: item.score,
      }));

    // This requires adding accessories to the index first
    // May also need to create a base vector for accessories and concatenate it with the product descripiton
    //TODO: use the metadata description to create a vector for accessory items and query the index for similar items

    return Response.json(similarProducts, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json("An error occurred", { status: 500 });
  }
}
