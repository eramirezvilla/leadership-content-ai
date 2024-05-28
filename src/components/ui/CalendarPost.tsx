"use client";
import { useState } from "react";
import type { post } from "@prisma/client";
import PostModal from "./PostModal";

interface CalendarPostProps {
  post: post;
}

export default function CalendarPost({ post }: CalendarPostProps) {
  const { title, schedule_date, approved } = post;
  const [showEditModal, setShowEditModal] = useState(false);

  return (
    <>
      <div
        className="flex flex-col rounded-lg border border-black px-1 py-1 hover:cursor-pointer"
        onClick={() => setShowEditModal(true)}
      >
        {approved === true ? (
          <p className="text-xs text-green-500">Approved</p>
        ) : approved === false ? (
          <p className="text-xs text-red-500">Rejected</p>
        ) : (
          <p className="text-xs text-yellow-500">Pending</p>
        )}
        <h1 className="text-brand_background whitespace-normal text-xs">
          {title}
        </h1>
      </div>
      <PostModal
        open={showEditModal}
        setOpen={setShowEditModal}
        postToEdit={post}
      ></PostModal>
    </>
  );
}
