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

    return Response.json({ sku, part_number }, { status: 200 });


  } catch (error) {
    console.error(error);
    return Response.json("An error occurred", { status: 500 });
  }
}
