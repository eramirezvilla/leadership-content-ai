"use client";
import { type post, file } from "@prisma/client";
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
import { useState, useEffect } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { DataTable } from "./DataTable";
import ListViewPost from "./ListViewPost";
import LinkedInListView from "./LinkedInListView";
import LinkedInPost from "./LinkedInPost";

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

interface PostsContentProps {
  allPosts: post[];
  allImages: Record<string, string[]>;
  allFiles: file[];
}

export default function PostsContent({ allPosts, allImages, allFiles }: PostsContentProps) {
  const [layoutView, setLayoutView] = useState("grid");
  const [openPending, setOpenPending] = useState(true);
  const [openApproved, setOpenApproved] = useState(true);
  const [openRejected, setOpenRejected] = useState(true);
  const [pendingPosts, setPendingPosts] = useState<post[]>([]);
  const [approvedPosts, setApprovedPosts] = useState<post[]>([]);
  const [rejectedPosts, setRejectedPosts] = useState<post[]>([]);

 const getImageUrlsForEachPost = (postToGet : post) => {
    const imageUrls: string[] = [];
    postToGet.relevant_files.forEach((file_id) => {
      const file = allFiles.find((file) => file.id === file_id);
      if (!file) return;
      const urls = allImages[file.filename];
      if (urls) {
        imageUrls.push(...urls);
      }
    }
  )
  console.log("imageUrls for post: ", imageUrls)
  console.log("relevant files for post: ", postToGet.relevant_files)
  return imageUrls;
  }

  useEffect(() => {
    setPendingPosts(allPosts.filter((post) => post.approved === null));
    setApprovedPosts(allPosts.filter((post) => post.approved === true))
    setRejectedPosts(allPosts.filter((post) => post.approved === false))
  }, [allPosts]);

  return (
    <>
      <div className="flex w-full justify-start gap-2.5 pl-20">
        <div
          className={`border-1 hover:bg-brand_light_grey flex rounded-md border p-1 ${layoutView === "grid" ? "bg-white" : "bg-brand_light_grey"}`}
        >
          <LayoutGrid
            size={22}
            className={`hover:stroke-brand_gradient2_blue hover:cursor-pointer ${layoutView === "grid" ? "stroke-brand_gradient1_purple" : ""}`}
            onClick={() => setLayoutView("grid")}
          />
        </div>
        <div
          className={`border-1 hover:bg-brand_light_grey flex rounded-md border p-1 ${layoutView === "list" ? "bg-white" : "bg-brand_light_grey"}`}
        >
          <MenuIcon
            size={22}
            className={`hover:stroke-brand_gradient2_blue hover:cursor-pointer ${layoutView === "list" ? "stroke-brand_gradient1_purple" : ""}`}
            onClick={() => setLayoutView("list")}
          />
        </div>
      </div>
      <div className="flex flex-col">
        <div className="flex w-full flex-col gap-2.5 pb-8">
          <div
            className="from-brand_gradient1_purple to-brand_gradient1_blue hover:to-brand_gradient2_blue flex h-10 w-full items-center justify-between bg-gradient-to-br px-20 text-white hover:cursor-pointer"
            onClick={() => setOpenPending(!openPending)}
          >
            <div className="flex w-full gap-2.5">
              <Clock size={20} className="stroke-yellow-300" />
              <p className="text-sm font-semibold">Pending</p>
              <p className="text-brand_light_grey/80 text-sm font-bold">
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
                <div className="flex w-full flex-wrap justify-evenly gap-4 px-20">
                  {pendingPosts.map((post) =>
                    layoutView === "grid" ? (
                      <LinkedInPost post={post} key={post.id} allImages={getImageUrlsForEachPost(post)}/>
                    ) : (
                      <ListViewPost post={post} key={post.id} images={getImageUrlsForEachPost(post)}/>
                    ),
                  )}
                </div>
              ) : (
                <div className="flex w-full px-20">
                  <div className="bg-brand_periwinkle flex w-full px-8 py-4">
                    <p className="text-sm font-bold text-white">
                      No pending posts found
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="flex w-full flex-col gap-2.5 pb-8">
          <div
            className="from-brand_gradient1_purple to-brand_gradient1_blue hover:to-brand_gradient2_blue flex h-10 w-full items-center justify-between bg-gradient-to-br px-20 text-white hover:cursor-pointer"
            onClick={() => setOpenApproved(!openApproved)}
          >
            <div className="flex w-full gap-2.5">
              <Check size={20} className="stroke-green-300" />
              <p className="text-sm font-semibold">Approved</p>
              <p className="text-brand_light_grey/80 text-sm font-bold">
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
                <div className="flex w-full flex-wrap justify-evenly gap-4 px-20">
                  {approvedPosts.map((post) =>
                    layoutView === "grid" ? (
                      <LinkedInPost post={post} key={post.id} allImages={getImageUrlsForEachPost(post)}/>
                    ) : (
                      <ListViewPost post={post} key={post.id} images={getImageUrlsForEachPost(post)}/>
                    ),
                  )}
                </div>
              ) : (
                <div className="flex w-full px-20">
                  <div className="bg-brand_periwinkle flex w-full px-8 py-4">
                    <p className="text-sm font-bold text-white">
                      No approved posts found
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex w-full flex-col gap-2.5 pb-8">
          <div
            className="from-brand_gradient1_purple to-brand_gradient1_blue hover:to-brand_gradient2_blue flex h-10 w-full items-center justify-between bg-gradient-to-br px-20 text-white hover:cursor-pointer"
            onClick={() => setOpenRejected(!openRejected)}
          >
            <div className="flex w-full gap-2.5">
              <X size={20} className="stroke-red-300" />
              <p className="text-sm font-semibold">Rejected</p>
              <p className="text-brand_light_grey/80 text-sm font-bold">
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
                <div className="flex w-full flex-wrap justify-evenly gap-4 px-20">
                  {rejectedPosts.map((post) =>
                    layoutView === "grid" ? (
                      <LinkedInPost post={post} key={post.id} allImages={getImageUrlsForEachPost(post)}/>
                    ) : (
                      <ListViewPost post={post} key={post.id} images={getImageUrlsForEachPost(post)}/>
                    ),
                  )}
                </div>
              ) : (
                <div className="flex w-full px-20">
                  <div className="bg-brand_periwinkle flex w-full px-8 py-4">
                    <p className="text-sm font-bold text-white">
                      No rejected posts found
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
