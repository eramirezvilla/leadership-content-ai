"use client";
import { type post } from "@prisma/client";
import { Clock, User } from "lucide-react";
import { useEffect, useState } from "react";
import PostModal from "./PostModal";
import { UserButton, useUser } from "@clerk/nextjs";
import Image from "next/image";

interface LinkedInPostProps {
  post: post;
}

export default function LinkedInPost({ post }: LinkedInPostProps) {
  const { title, content, schedule_date, approved, featured_image_filename } = post;
  const [showEditModal, setShowEditModal] = useState(false);
  const [featuredImage, setFeaturedImage] = useState(featured_image_filename ?? "");
  const { user } = useUser();

  useEffect(() => {
    if (featured_image_filename) {
      setFeaturedImage(featured_image_filename);
    }
  }, [featured_image_filename]);

  

  return (
    <>
      <div
        className="flex w-[555px] flex-col items-start gap-2 rounded-lg border border-1 shadow-md bg-white px-4 pt-2 pb-6 hover:cursor-pointer"
        onClick={() => setShowEditModal(true)}
      >
          <div className="flex w-full justify-center">
              {approved === true ? (
                  <p className="text-sm font-semibold text-green-500">Approved<span className="pl-2.5 text-sx text-black/50">Will Post On: {post.schedule_date?.toLocaleDateString("en-US")}</span></p>
                  ) : approved === false ? (
                      <p className="text-sm font-semibold text-red-500">Rejected</p>
              ) : (
                <p className="text-sm font-semibold text-yellow-500">Pending</p>
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
        {featuredImage && (
          <div className="flex justify-center hover:cursor-pointer">
            <Image
              src={featuredImage}
              alt="featured image"
              height={400}
              width={400}
            />
          </div>
        )}
      </div>
      <PostModal
        open={showEditModal}
        setOpen={setShowEditModal}
        postToEdit={post}
      ></PostModal>
    </>
  );
}
