import prisma from "~/lib/server/prisma";
import AddPost from "~/components/ui/AddPost";
import type { industry_challenge_mapping } from "@prisma/client";
import { auth } from "@clerk/nextjs";
import { LayoutGrid, MenuIcon } from "lucide-react";
import GridPost from "~/components/ui/GridPost";
import PostsContent from "~/components/ui/PostsContent";

export default async function PostsPage() {
  const { userId } = auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const allPosts = await prisma.post.findMany({
    where: {
      user_id: userId,
    },
  });
  const allThemes = await prisma.themes.findMany();
  const allIndustries = await prisma.industry_challenge_mapping.findMany();

  return (
    <div className="my-8 flex w-full flex-col gap-4">
      <div className="flex justify-between gap-6 px-20">
        <div className="flex flex-col gap-2.5">
          <h1 className="text-title_2">Posts</h1>
          {/* <div className="flex gap-2.5">
            <LayoutGrid size={20} className="hover:stroke-brand_purple hover:cursor-pointer"/>
            <MenuIcon size={20} className="hover:stroke-brand_purple hover:cursor-pointer"/>
          </div> */}
        </div>
        <AddPost allThemes={allThemes} allIndustries={allIndustries} />
      </div>
      <PostsContent allPosts={allPosts} />
      
      {/* <div className="flex w-full flex-wrap gap-4 px-4">
        {allPosts.length > 0 ? (
          allPosts.map((post) => (
            <div
              className="border-1 flex w-96 flex-col gap-2 rounded-md border bg-black/5 px-8 py-4"
              key={post.id}
            >
              <div className="border-1 flex h-20 w-full overflow-auto rounded-md border bg-white px-4 py-2">
                <h2 className="text-headline">{post.title}</h2>
              </div>
              <div className="border-1 flex w-full rounded-md border bg-white px-4 py-2">
                <p className="h-80 max-w-lg overflow-auto text-body">
                  {post.content}
                </p>
              </div>
              <div className="border-1 flex h-40 w-full overflow-auto rounded-md border bg-white px-4 py-2">
                {(() => {
                  const industryMapping = getIndustryMapping(
                    Number(post.created_from_mapping),
                    allIndustries,
                  );
                  return industryMapping ? (
                    <p className="max-w-lg text-body">
                      <span className="font-semibold">Industry:</span>{" "}
                      {industryMapping.industry_name}
                      <br />
                      <span className="mt-2 inline-block">
                        <span className="font-semibold">Disussion Topic :</span>{" "}
                        {industryMapping.topic_description}
                      </span>
                    </p>
                  ) : (
                    <p className="max-w-lg text-body">
                      Industry data not available
                    </p>
                  );
                })()}
              </div>
              <div className="border-1 flex w-full rounded-md border bg-white px-4 py-2">
                {(async () => {
                  const relevantFiles = getRelevantFiles(
                    post.relevant_files as number[],
                  );
                  if (relevantFiles !== null && relevantFiles !== undefined) {
                    return (
                      <p className="max-w-lg text-body">
                        Relevant Files:{" "}
                        {(await relevantFiles).map((file) => file.filename)}
                      </p>
                    );
                  } else {
                    return (
                      <p className="max-w-lg text-body">
                        No relevant files found
                      </p>
                    );
                  }
                })()}
              </div>
            </div>
          ))
        ) : (
          <p>No posts found</p>
        )}
      </div> */}
    </div>
  );
}

export function getIndustryMapping(
  id: number,
  allIndustries: industry_challenge_mapping[],
) {
  return allIndustries.find((industry) => Number(industry.id) === id);
}

export async function getRelevantFiles(ids: number[]) {
  const relevantFiles = await prisma.file.findMany({
    where: {
      id: {
        in: ids,
      },
    },
  });
  return relevantFiles;
}
