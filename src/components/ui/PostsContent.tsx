"use client";
import { type post } from "@prisma/client";
import GridPost from "./GridPost";
import {
  LayoutGrid,
  MenuIcon,
  Clock,
  Check,
  X,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
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
  const [openPending, setOpenPending] = useState(true);
  const [openApproved, setOpenApproved] = useState(true);
  const [openRejected, setOpenRejected] = useState(true);

  const pendingPosts = allPosts.filter((post) => post.approved === null);
  const approvedPosts = allPosts.filter((post) => post.approved === true);
  const rejectedPosts = allPosts.filter((post) => post.approved === false);

  return (
    <>
      <div className="flex w-full justify-start gap-2.5 pl-20">
        <div className={`flex border border-1 rounded-md hover:bg-brand_light_grey p-1 ${layoutView === "grid" ? "bg-white" : "bg-brand_light_grey"}`}>
            <LayoutGrid
              size={22}
              className={`hover:cursor-pointer hover:stroke-brand_gradient2_blue ${layoutView === "grid" ? "stroke-brand_gradient1_purple" : ""}`}
              onClick={() => setLayoutView("grid")}
            />
        </div>
        <div className={`flex border border-1 rounded-md hover:bg-brand_light_grey p-1 ${layoutView === "list" ? "bg-white" : "bg-brand_light_grey"}`}>
        <MenuIcon
          size={22}
          className={`hover:cursor-pointer hover:stroke-brand_gradient2_blue ${layoutView === "list" ? "stroke-brand_gradient1_purple" : ""}`}
          onClick={() => setLayoutView("list")}
        />
        </div>
      </div>
      {layoutView === "grid" ? (
        <div className="flex flex-col">
          <div className="flex w-full flex-col gap-2.5 pb-8">
            <div
              className="flex h-10 w-full items-center justify-between bg-gradient-to-br from-brand_gradient1_purple to-brand_gradient1_blue px-20 text-white hover:cursor-pointer hover:to-brand_gradient2_blue"
              onClick={() => setOpenPending(!openPending)}
            >
              <div className="flex w-full gap-2.5">
                <Clock size={20} className="stroke-yellow-300" />
                <p className="text-sm font-semibold">Pending</p>
                <p className="text-sm font-bold text-brand_light_grey/80">
                  {pendingPosts.length}
                </p>
              </div>
              {openPending ? (
                <ChevronUp size={20} className="stroke-white" />
              ) : (
                <ChevronDown size={20} className="stroke-white" />
              )}
            </div>
            {openPending && (
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
            )}
          </div>
          <div className="flex w-full flex-col gap-2.5 pb-8">
            <div
              className="flex h-10 w-full items-center justify-between bg-gradient-to-br from-brand_gradient1_purple to-brand_gradient1_blue px-20 text-white hover:cursor-pointer hover:to-brand_gradient2_blue"
              onClick={() => setOpenApproved(!openApproved)}
            >
              <div className="flex w-full gap-2.5">
                <Check size={20} className="stroke-green-300" />
                <p className="text-sm font-semibold">Approved</p>
                <p className="text-sm font-bold text-brand_light_grey/80">
                  {approvedPosts.length}
                </p>
              </div>
              {openApproved ? (
                <ChevronUp size={20} className="stroke-white" />
              ) : (
                <ChevronDown size={20} className="stroke-white" />
              )}
            </div>
            {openApproved && (
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
            )}
          </div>

          <div className="flex w-full flex-col gap-2.5 pb-8">
          <div
              className="flex h-10 w-full items-center justify-between bg-gradient-to-br from-brand_gradient1_purple to-brand_gradient1_blue px-20 text-white hover:cursor-pointer hover:to-brand_gradient2_blue"
              onClick={() => setOpenRejected(!openRejected)}
            >
              <div className="flex w-full gap-2.5">
              <X size={20} className="stroke-red-300" />
              <p className="text-sm font-semibold">Rejected</p>
              <p className="text-sm font-bold text-brand_light_grey/80">
                {rejectedPosts.length}
              </p>
            </div>
            {openRejected ? (
              <ChevronUp size={20} className="stroke-white" />
            ) : (
              <ChevronDown size={20} className="stroke-white" />
            )}
            </div>
            {openRejected && (
            <div className="flex w-full px-4">
              {rejectedPosts.length > 0 ? (
                <div className="flex w-full flex-wrap justify-evenly gap-4">
                  {rejectedPosts.map((post) => (
                    <GridPost post={post} key={post.id} />
                  ))}
                </div>
              ) : (
                <p>No rejected posts found</p>
              )}
            </div>
            )}
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
