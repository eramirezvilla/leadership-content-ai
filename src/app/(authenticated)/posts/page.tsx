import prisma from "~/lib/server/prisma"
import ExistingPostTab from "~/components/ui/ExistingPostTab"
import AddPost from "~/components/ui/AddPost"

export default async function PostsPage() {
    const allPosts = await prisma.post.findMany()
    const allThemes = await prisma.themes.findMany()
    const allIndustries = await prisma.industry_challenge_mapping.findMany()

    return (
        <div>
            <ExistingPostTab allPosts={allPosts} allThemes={allThemes} allIndustries={allIndustries} />
        </div>
    )
}