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
  const { title, content, schedule_date, approved, featured_image_filename } =
    post;
  const [showEditModal, setShowEditModal] = useState(false);
  const [featuredImage, setFeaturedImage] = useState(
    featured_image_filename ?? "",
  );
  const [availImages, setImages] = useState<string[]>([]);
  const { user } = useUser();

  useEffect(() => {
    if (featured_image_filename) {
      setFeaturedImage(featured_image_filename);
    }
  }, [featured_image_filename]);

  useEffect(() => {
    async function getImages(id: string) {
      try {
        const response = await fetch(`/api/image?id=${id}`);
        if (response.ok) {
          const data = await response.json();
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          setImages(data);
        } else {
          throw new Error("Failed to fetch images");
        }
      } catch (error) {
        console.error(error);
      }
    }
    if (post.id) {
      void getImages(post.id.toString());
    }
  }, [post.id]);

  return (
    <>
      <div
        className="border-1 flex w-[555px] flex-col items-start gap-2 rounded-lg border bg-white px-4 pb-6 pt-2 shadow-md hover:cursor-pointer"
        onClick={() => setShowEditModal(true)}
      >
        <div className="flex w-full justify-center">
          {approved === true ? (
            <p className="text-sm font-semibold text-green-500">
              Approved
              <span className="text-sx pl-2.5 text-black/50">
                Will Post On: {post.schedule_date?.toLocaleDateString("en-US")}
              </span>
            </p>
          ) : approved === false ? (
            <p className="text-sm font-semibold text-red-500">Rejected</p>
          ) : (
            <p className="text-sm font-semibold text-yellow-500">Pending</p>
          )}
        </div>
        <div className="flex items-center justify-center gap-2.5">
          <UserButton />
          <div className="flex flex-col">
            <p className="text-sm font-semibold text-black">{user?.fullName}</p>
            <p className="text-xs font-medium text-black/50">Levata</p>
            <p className="text-xs font-medium text-black/50">
              {schedule_date?.toLocaleDateString("en-US")}
            </p>
          </div>
        </div>
        <h1 className="text-sm font-semibold">{title}</h1>
        <p className="max-w-prose overflow-scroll whitespace-break-spaces text-xs font-normal text-black/70">
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
        {(!featuredImage && availImages.length > 0) ? (
          <div className="flex min-w-full max-w-full min-h-20 justify-start items-center overflow-scroll gap-2.5 bg-gradient-to-r from-brand_gradient1_purple to-brand_gradient2_blue">
          {availImages.map((image) => (
            <div key={image} className={`p-2 min-w-20 min-h-20`}>
              <Image
                src={image}
                alt="extracted image"
                height={200}
                width={200}
              />
            </div>
          ))}
        </div>
        ): null}
      </div>
      <PostModal
        open={showEditModal}
        setOpen={setShowEditModal}
        postToEdit={post}
      ></PostModal>
    </>
  );
}
