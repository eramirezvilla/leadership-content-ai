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

export default function ExistingPostTab({ allPosts, allThemes, allIndustries}: ExistingPostTabProps) {
    const [showAddDialog, setShowAddDialog] = useState(false);
  return (
    <div>
      <h1>Posts</h1>
      {allPosts.length > 0 ? (
        allPosts.map((post) => (
          <div key={post.id}>
            <h2>{post.title}</h2>
            <p>{post.content}</p>
          </div>
        ))
      ) : (
        <>
        <Button type="button" onClick={() => setShowAddDialog(true)}>
            Add Post
        </Button>
        <AddPost open={showAddDialog} setOpen={setShowAddDialog} allIndustries={allIndustries} allThemes={allThemes} />
        </>
      )}
    </div>
  );
}
