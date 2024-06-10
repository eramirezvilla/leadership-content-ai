import prisma from "~/lib/server/prisma";
import { supabase } from "~/lib/server/supabase";
import {querySchema} from "~/lib/validation/Post"

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
      const query = Object.fromEntries(url.searchParams.entries());
      const params = querySchema.parse(query);
      const relevantFiles = await prisma.post.findUnique({
        select: {
          relevant_files: true
        },
        where: {
          id: Number(params.id)
        }
      });

      if (!relevantFiles) {
        return Response.json("No relevant files found", { status: 404 });
      }
        const allImages: string[] = [];
      
        // Use Promise.all with map to handle async operations
        const imagePromises = relevantFiles.relevant_files.map(async (file) => {
          const imagesToAdd = await prisma.image.findMany({
            where: {
              source_file: Number(file), // Assuming relevant_files contains file IDs
            },
          });
          return imagesToAdd.map((image) => supabase.storage.from("extracted-images").getPublicUrl(image.filename).data.publicUrl);
        });
      
        // Wait for all promises to resolve
        const imagesArray = await Promise.all(imagePromises);
      
        // Flatten the array of arrays and add to allImages
        imagesArray.forEach((images) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          allImages.push(...images);
        });
            
      // const allImages = await prisma.image.findMany({
      //   where: {
      //     source_file: Number(params.id)
      //   }
      // });


      // if (!allImages) {
      //   return Response.json("No images found", { status: 404 });
      // }

      // const allAvailableImages: { id: number; filename: string; url: string; }[] = []
      // allImages.forEach((image) => {
      //   allAvailableImages.push({
      //     id: image.id,
      //     filename: image.filename,
      //     url: supabase.storage.from("extracted-images").getPublicUrl(image.filename).data.publicUrl ?? null
      //   })
      // }
      // )

    return Response.json(allImages, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json("An error occurred", { status: 500 });
  }
}
