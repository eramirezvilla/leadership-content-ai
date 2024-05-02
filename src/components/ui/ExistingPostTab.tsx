"use client";
import type { post, themes, industry_challenge_mapping } from "@prisma/client";
import AddPost from "./AddPost";
import { Button } from "./button";
import { useState, useEffect } from "react";
import prisma from "~/lib/server/prisma";

interface ExistingPostTabProps {
  allPosts: post[];
  allThemes: themes[];
  allIndustries: industry_challenge_mapping[];
}

export default function ExistingPostTab({
  allPosts,
  allThemes,
  allIndustries,
}: ExistingPostTabProps) {
  const [showAddDialog, setShowAddDialog] = useState(false);

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex w-full flex-wrap gap-4 px-4">
        {allPosts.length > 0 ? (
          allPosts.map((post) => (
            <div
              className="border-1 flex w-96 flex-col gap-2 rounded-md border bg-black/5 px-8 py-4"
              key={post.id}
            >
              <div className="border-1 h-20 overflow-auto flex w-full rounded-md border bg-white px-4 py-2">
                <h2 className="text-headline">{post.title}</h2>
              </div>
              <div className="border-1 flex w-full rounded-md border bg-white px-4 py-2">
                <p className="h-80 max-w-lg overflow-auto text-body">
                  {post.content}
                </p>
              </div>
              <div className="border-1 flex w-full rounded-md border bg-white px-4 py-2">
                {(() => {
                  const industryMapping = getIndustryMapping(
                    Number(post.created_from_mapping),
                    allIndustries,
                  );
                  return industryMapping ? (
                    <p className="max-w-lg text-body">
                      Industry: {industryMapping.industry_name}
                      <br />
                      Disussion Topic : {industryMapping.topic_description}
                    </p>
                  ) : (
                    <p className="max-w-lg text-body">
                      Industry data not available
                    </p>
                  );
                })()}
              </div>

              {/* <div className="border-1 flex w-full rounded-md border bg-white px-4 py-2">
                {(() => {
                  const relevantFiles = getRelevantFiles(post.relevant_files as number[]);
                  // eslint-disable-next-line @typescript-eslint/no-misused-promises
                  return relevantFiles ? (
                    <p className="max-w-lg text-body">
                      Relevant Files: {relevantFiles.map((file) => file.filename)}
                    </p>
                  ) : (
                    <p className="max-w-lg text-body">No relevant files found</p>
                  );
              })()}
              </div> */}
            </div>
          ))
        ) : (
          <p>No posts found</p>
        )}
      </div>
      <div className="flex w-full items-center justify-center">
        <Button type="button" onClick={() => setShowAddDialog(true)}>
          Add Post
        </Button>
        <AddPost
          open={showAddDialog}
          setOpen={setShowAddDialog}
          allIndustries={allIndustries}
          allThemes={allThemes}
        />
      </div>
    </div>
  );
}

//function to get the industry_mapping using the id and prisma
export function getIndustryMapping(
  id: number,
  allIndustries: industry_challenge_mapping[],
) {
  return allIndustries.find((industry) => Number(industry.id) === id);
}

export async function getRelevantFiles(ids: number[]) {
  try {
    const promises = ids.map(id => {
      return prisma.file.findUnique({
        where: { id }
      });
    });

    const files = await Promise.all(promises);

    return files.filter(file => file !== null);
  } catch (error) {
    console.error('Failed to fetch files:', error);
    throw error;
  }
}
