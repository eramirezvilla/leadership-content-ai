"use client";
import { type post } from "@prisma/client";
import GridPost from "./GridPost";
import { LayoutGrid, MenuIcon, Clock, Check, X } from "lucide-react";
import { useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { DataTable } from "./DataTable";

const columns: ColumnDef<post>[] = [
  {
    header: "Title",
    accessorKey: "title",
  },
  {
    header: "Content",
    accessorKey: "content",
  },
  {
    header: "Created At",
    accessorKey: "created_at",
    cell: ({ row }) => {
      const date = row.getValue("created_at");
      if (date instanceof Date) {
        const formattedDate = date.toLocaleDateString("en-US");
        return <p className="text-sm">{formattedDate}</p>;
      }
    },
  },
];

export default function PostsContent({ allPosts }: { allPosts: post[] }) {
  const [layoutView, setLayoutView] = useState("grid");

  const pendingPosts = allPosts.filter((post) => post.approved === null);
  const approvedPosts = allPosts.filter((post) => post.approved === true);
  const rejectedPosts = allPosts.filter((post) => post.approved === false);

  return (
    <>
      <div className="flex gap-2.5 pl-8">
        <LayoutGrid
          size={20}
          className={`hover:cursor-pointer hover:stroke-brand_purple ${layoutView === "grid" ? "stroke-brand_purple" : ""}`}
          onClick={() => setLayoutView("grid")}
        />
        <MenuIcon
          size={20}
          className={`hover:cursor-pointer hover:stroke-brand_purple ${layoutView === "list" ? "stroke-brand_purple" : ""}`}
          onClick={() => setLayoutView("list")}
        />
      </div>
      {layoutView === "grid" ? (
        <div className="flex flex-col">
          <div className="flex w-full flex-col gap-2.5 pb-8">
            <div className="flex h-10 w-full items-center gap-2.5 bg-brand_black/60 pl-8 text-brand_white">
              <Clock size={20} className="stroke-yellow-300" />
              <p className="text-sm">Pending Posts</p>
              <p className="text-sm font-bold text-white/40">
                {pendingPosts.length}
              </p>
            </div>
            <div className="flex w-full px-4">
              {pendingPosts.length > 0 ? (
                <div className="flex w-full flex-wrap justify-evenly gap-4">
                  {pendingPosts.map((post) => (
                    <GridPost post={post} key={post.id} />
                  ))}
                </div>
              ) : (
                <p>No pending posts found</p>
              )}
            </div>
          </div>
          <div className="flex w-full flex-col gap-2.5 pb-8">
          <div className="flex h-10 w-full items-center gap-2.5 bg-brand_black/60 pl-8 text-white">
            <Check size={20} className="stroke-green-300" />
            <p className="text-sm">Approved Posts</p>
            <p className="text-sm font-bold text-white/40">
              {approvedPosts.length}
            </p>
          </div>
            <div className="flex w-full px-4">
                {approvedPosts.length > 0 ? (
                <div className="flex w-full flex-wrap justify-evenly gap-4">
                    {approvedPosts.map((post) => (
                    <GridPost post={post} key={post.id} />
                    ))}
                </div>
                ) : (
                <p>No approved posts found</p>
                )}
            </div>
          </div>
          <div className="flex w-full flex-col gap-2.5 pb-8">
          <div className="flex h-10 w-full items-center gap-2.5 bg-brand_black/60 pl-8 text-white">
            <X size={20} className="stroke-red-300" />
            <p className="text-sm">Rejected Posts</p>
            <p className="text-sm font-bold text-white/40">
              {rejectedPosts.length}
            </p>
          </div>
            <div className="flex w-full px-4">
                {rejectedPosts.length > 0 ? (
                <div className="flex w-full flex-wrap justify-evenly gap-4">
                    {rejectedPosts.map((post) => (
                        <GridPost post={post} key={post.id}/>
                    ))}
                </div>
                ) : (
                <p>No rejected posts found</p>
                )}
            </div>
          </div>
          <div className="flex w-full flex-wrap gap-4 px-8">
            {/* {allPosts.length > 0 ? (
            allPosts.map((post) => <GridPost post={post} key={post.id} />)
          ) : (
            //TODO: add instructions to make a post
            <p>No posts found</p>
          )} */}
          </div>
        </div>
      ) : (
        // list view
        <div className="flex px-8">
          <DataTable columns={columns} data={allPosts} />
        </div>
      )}
    </>
  );
}
