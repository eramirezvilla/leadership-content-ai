import prisma from "~/lib/server/prisma"

export default async function AssetPage() {

    const allFiles = await prisma.file.findMany()
    allFiles.map((file) => {
        console.log(file)
    })

    return (
        <div className="grid">
            <h1>Assets</h1>
            <div className="grid grid-cols-3 gap-4">
                {allFiles.map((file) => {
                    return (
                        <div key={file.id} className="bg-gray-100 p-4">
                            <h2>{file.filename}</h2>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}