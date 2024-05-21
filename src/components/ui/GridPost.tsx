"use client";
import { type post } from "@prisma/client";
import { Clock } from "lucide-react";
import { useState } from "react";
import PostModal from "./PostModal";

export default function GridPost({ post }: { post: post }) {
  const { title, content, schedule_date, approved } = post;
  const [showEditModal, setShowEditModal] = useState(false);

  return (
    <>
      <div
        className="flex max-h-52 w-72 flex-col items-start gap-2 rounded-lg border border-black px-4 py-2 hover:cursor-pointer"
        onClick={() => setShowEditModal(true)}
      >
        <div className="flex items-center justify-center gap-2.5">
          <Clock size={16} />
          <p className="text-sm font-medium text-black/50">
            {schedule_date?.toLocaleDateString("en-US")}
          </p>
          {approved ? (
            <p className="text-sm font-medium text-green-500">Approved</p>
          ) : (
            <p className="text-sm font-medium text-red-500">Pending</p>
          )}
        </div>
        <h1 className="text-sm font-semibold">{title}</h1>
        <p className="overflow-scroll whitespace-break-spaces text-xs font-normal text-black/50">
          {content}
        </p>
      </div>
      <PostModal
        open={showEditModal}
        setOpen={setShowEditModal}
        postToEdit={post}
      ></PostModal>
    </>
  );
}
