import prisma from "~/lib/server/prisma"
import ExistingPostTab from "~/components/ui/ExistingPostTab"
import AddPost from "~/components/ui/AddPost"

export default async function PostsPage() {
    const allPosts = await prisma.post.findMany()
    const allThemes = await prisma.themes.findMany()
    const allIndustries = await prisma.industry_challenge_mapping.findMany()

    return (
        <div className="flex flex-col w-full my-8 gap-4">
            <div className="flex w-1/4 justify-center">
                <h1 className="text-title_2">Posts</h1>
            </div>
            <ExistingPostTab allPosts={allPosts} allThemes={allThemes} allIndustries={allIndustries} />
        </div>
    )
}