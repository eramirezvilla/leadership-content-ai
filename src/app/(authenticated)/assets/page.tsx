import prisma from "~/lib/server/prisma"
import Image from "next/image"
import { supabase } from "~/lib/server/supabase"

export default async function AssetPage() {

    const allFiles = await prisma.file.findMany();
    const filesWithImageURL: Record<string, string[]> = {};

    await Promise.all(
        allFiles.map(async (file) => {
            if (file.extracted_imgs && file.extracted_imgs.length > 0) {
                await Promise.all(
                    file.extracted_imgs.map(async (img: number) => {
                        const imageURL = await prisma.image.findUnique({
                            select: {
                                filename: true,
                            },
                            where: {
                                id: img,
                            },
                        });
                        if (!imageURL) return;
                        const { data } = supabase.storage
                            .from("extracted-images")
                            .getPublicUrl(imageURL.filename);
                        filesWithImageURL[file.filename] = [
                            ...(filesWithImageURL[file.filename] ?? []),
                            data.publicUrl,
                        ];
                    })
                );
            }
        })
    );


    return (
        <div className="grid mx-4 mt-8 gap-2.5">
            <h1 className="text-title_3">Assets</h1>
            <div className="grid grid-cols-3 gap-4">
                {Object.entries(filesWithImageURL).map(([filename, urls]) => (
                    <div key={filename} className="flex flex-col gap-6 px-4 py-2 rounded-md border border-1 shadow-sm bg-slate-300">
                        <div className="flex w-full justify-center">
                            <h2 className="text-headline">{filename}</h2>
                        </div>
                        <div className="flex flex-wrap gap-2 w-full justify-center items-center">
                            {urls.map((url) => (
                                <div key={url} className="relative w-24 h-24">
                                    <Image
                                        src={url}
                                        alt="extracted image"
                                        layout="fill"
                                        objectFit="cover"
                                    />
                                </div>
                            ))}
                        </div>
                        </div>
                    ))}     
            </div>
        </div>
    )
}