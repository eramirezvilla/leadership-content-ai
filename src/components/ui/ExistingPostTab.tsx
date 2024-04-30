"use client";
import { type post, themes, industry_challenge_mapping } from "@prisma/client";
import AddPost from "./AddPost";
import { Button } from "./button";
import { useState } from "react";

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
    <div className="flex flex-col gap-4">
      <div className="flex flex-col w-full items-center gap-4">
        {allPosts.length > 0 ? (
          allPosts.map((post) => (
            <div
              className="border-1 flex flex-col gap-2 rounded-md border px-8 py-4"
              key={post.id}
            >
              <h2 className="text-headline">{post.title}</h2>
              <p className="text-body max-w-prose overflow-auto">{post.content}</p>
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
