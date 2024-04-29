import prisma from "~/lib/server/prisma"

export default async function PostsPage() {
    const allPosts = await prisma.post.findMany()

    return (
        <div>
            <h1>Posts</h1>
        </div>
    )
}