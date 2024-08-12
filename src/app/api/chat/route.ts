import { getRelevantProducts } from "~/lib/validation/ProductQuery";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const query = Object.fromEntries(url.searchParams.entries());
    const params = getRelevantProducts.safeParse(query);
    if (!params) {
        return Response.json("Invalid input at entry", { status: 400 });
      }
    const { sku, part_number } = params.data!;
    const searchType = sku ? "sku" : "part_number";

    let queryVector
    if(searchType === "sku"){
        return Response.json(queryBySku(sku!), { status: 200 });
        // const response = await secondProductDataIndx.fetch([sku!]);
        // if (response.records) {
        //     queryVector = response.records[sku!]!.values;
        //     console.log(queryVector);
        //   }
        // return Response.json(response, { status: 200 });
    }
    else if(searchType === "part_number"){
        const dummyVector = new Array(3072).fill(0);
        const response = await secondProductDataIndx.query({
            vector: dummyVector,
            filter: {
              "part number": { $eq: part_number }
            },
            topK: 1,
            includeMetadata: true
          });
        if (response.matches.length > 0) {
            const product_id  = response.matches[0]!.id;
            const funcResponse = await queryBySku(product_id);
            console.log("reponse: ", funcResponse);
        }
        return Response.json(response, { status: 200 });
    }

    return Response.json({ sku, part_number }, { status: 200 });


  } catch (error) {
    console.error(error);
    return Response.json("An error occurred", { status: 500 });
  }
}
