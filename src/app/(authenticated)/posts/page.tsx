import prisma from "~/lib/server/prisma"
import ExistingPostTab from "~/components/ui/ExistingPostTab"

export default async function PostsPage() {
    const allPosts = await prisma.post.findMany()

    return (
        <div>
            {allPosts.length > 0 ? 
            <ExistingPostTab allPosts={allPosts} />
            : <h1>No posts found</h1>}
        </div>
    )
}