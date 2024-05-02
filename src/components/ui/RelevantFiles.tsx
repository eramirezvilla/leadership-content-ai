import type { file } from "@prisma/client"
import prisma from "~/lib/server/prisma"

interface RelevantFilesProps {
    relevantFiles: number[]
}

export default async function RelevantFiles(ids: RelevantFilesProps){
    const getRelevantFiles = async (ids: number[]) => {
        const relevantFiles = await prisma.file.findMany({
            where: {
                id: {
                    in: ids
                }
            }
        })
        return relevantFiles
    }

    return (
        <div className="flex w-full">
            {(await getRelevantFiles(ids.relevantFiles)).map((file: file) => (
                <p key={file.id} className="max-w-lg text-body">
                    Relevant Files: {file.filename}
                </p>
            ))}
        </div>
    )
}