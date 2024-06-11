import { getRelevantFilesSchema } from "~/lib/validation/RelevantFile";
import prisma from "~/lib/server/prisma";
import { supabase } from "~/lib/server/supabase";
import { z } from "zod";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const query = Object.fromEntries(url.searchParams.entries());
    const params = getRelevantFilesSchema.parse(query);

    const idsArray = params.ids.split(",").map((id) => id.trim());

    const idsSchema = z.array(z.string());
    const validatedIds = idsSchema.parse(idsArray);

    const relevantFiles = await prisma.post.findMany({
      select: {
        relevant_files: true,
      },
      where: {
        id: {
          in: validatedIds.map((id) => Number(id)),
        },
      },
    });

    if (!relevantFiles) {
      return Response.json("No relevant files found", { status: 404 });
    }

    const filenames = await prisma.file.findMany({
      select: {
        filename: true,
      },
      where: {
        id: {
          in: relevantFiles.map((file) => Number(file.relevant_files)),
        },
      },
    });

    const downloadLinks = filenames.map((file) => {
      return supabase.storage.from("testing-specs").getPublicUrl(file.filename)
        .data.publicUrl;
    });

    return Response.json(downloadLinks, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json("An error occurred", { status: 500 });
  }
}
