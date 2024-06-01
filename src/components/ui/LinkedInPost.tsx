"use client";
import { type post } from "@prisma/client";
import { Clock, User } from "lucide-react";
import { useState } from "react";
import PostModal from "./PostModal";
import { UserButton, useUser } from "@clerk/nextjs";

export default function LinkedInPost({ post }: { post: post }) {
  const { title, content, schedule_date, approved } = post;
  const [showEditModal, setShowEditModal] = useState(false);
  const { user } = useUser();

  return (
    <>
      <div
        className="flex max-h-80 w-[555px] flex-col items-start gap-2 rounded-lg border border-black bg-white px-4 py-2 hover:cursor-pointer"
        onClick={() => setShowEditModal(true)}
      >
          <div className="flex w-full justify-center">
              {approved === true ? (
                <p className="text-sm font-medium text-green-500">Approved</p>
              ) : approved === false ? (
                <p className="text-sm font-medium text-red-500">Rejected</p>
              ) : (
                <p className="text-sm font-medium text-yellow-500">Pending</p>
              )}
          </div>
        <div className="flex items-center justify-center gap-2.5">
          <UserButton />
          <div className="flex flex-col">
            <p className="text-sm font-semibold text-black">
              {user?.fullName}
            </p>
            <p className="text-xs font-medium text-black/50">Levata</p>
            <p className="text-xs font-medium text-black/50">
              {schedule_date?.toLocaleDateString("en-US")}
            </p>
          </div>

        </div>
        <h1 className="text-sm font-semibold">{title}</h1>
        <p className="overflow-scroll whitespace-break-spaces max-w-prose text-xs font-normal text-black/70">
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
