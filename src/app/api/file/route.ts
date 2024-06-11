import { getRelevantFilesSchema } from "~/lib/validation/RelevantFile";
import prisma from "~/lib/server/prisma";
import { supabase } from "~/lib/server/supabase";
import { z } from "zod";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const query = Object.fromEntries(url.searchParams.entries());
    const params = getRelevantFilesSchema.parse(query);
    if (!params) {
      return Response.json("Invalid input at entry", { status: 400 });
    }

    const idsArray = params.ids.split(",").map((id) => id.trim());

    const idsSchema = z.array(z.string());
    const validatedIds = idsSchema.parse(idsArray);


    if (!validatedIds) {
      return Response.json("Invalid input at split", { status: 400 });
    }

    const filenames = await prisma.file.findMany({
      select: {
        filename: true,
      },
      where: {
        id: {
          in: validatedIds.map((id) => Number(id)),
        },
      },
    });

    const downloadLinks = filenames.map((file) => {
      return supabase.storage.from("testing-specs").getPublicUrl(file.filename + ".pdf")
        .data.publicUrl;
    });

    return Response.json(downloadLinks, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json("An error occurred", { status: 500 });
  }
}
