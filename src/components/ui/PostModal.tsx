"use client";
import { type post } from "@prisma/client";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./dialog";
import { Check, X, Redo2, ZoomOut, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import ZoomOutLoader from "./ZoomOutLoader";
import { Button } from "./button";
import Image from "next/image";

interface PostModalProps {
  postToEdit: post;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function PostModal({
  postToEdit,
  open,
  setOpen,
}: PostModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedContent, setUpdatedContent] = useState(postToEdit.content);
  const [updatedTitle, setUpdatedTitle] = useState(postToEdit.title);
  const [availImages, setImages] = useState<string[]>([]);
  const [genImage, setGenImage] = useState<string>("");
  const [generatingImage, setGeneratingImage] = useState(false);

  async function generateImage() {
    try {
      setGeneratingImage(true);
      const response = await fetch(`/api/image`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ post_content: updatedContent }),
      });
      if (response.ok) {
        const data = await response.json();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        setGenImage(data);
        console.log("Generated Image: ", data);
      } else {
        throw new Error("Failed to generate image");
      }
    } catch (error) {
      console.error(error);
    }
    setGeneratingImage(false);
  }

  useEffect(() => {
    async function getImages(id: string) {
      try {
        const response = await fetch(`/api/image?id=${id}`);
        if (response.ok) {
          const data = await response.json();
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          setImages(data);
          console.log("Images: ", data);
        } else {
          throw new Error("Failed to fetch images");
        }
      } catch (error) {
        console.error(error);
      }
    }

    if (postToEdit?.id) {
      void getImages(postToEdit.id.toString());
    }
  }, [postToEdit?.id]);

  async function updateApproval(
    post_id: string,
    approved: boolean,
    content: string,
    title: string,
  ) {
    // console.log("post with id: ", post_id, " has been approved: ", approved)
    setIsSubmitting(true);
    const response = await fetch(`/api/post`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: post_id,
        approved: approved,
        content: content,
        title: title,
      }),
    });
    setIsSubmitting(false);

    router.refresh();
    setOpen(false);
    if (response.ok) {
      console.log("Post approval updated successfully");
    } else {
      console.error("Failed to update post approval status");
    }
  }

  async function deletePost(post_id: string) {
    setIsSubmitting(true);
    const response = await fetch(`/api/post`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: post_id }),
    });
    setIsSubmitting(false);
    router.refresh();
    setOpen(false);
    if (response.ok) {
      console.log("Post deleted successfully");
    } else {
      console.error("Failed to delete post");
    }
  }

  const {
    id,
    title,
    content,
    created_at,
    created_from_topic,
    relevant_files,
    schedule_date,
    approved,
  } = postToEdit;
  const router = useRouter();

  async function handleClick() {
    console.log("Save post with id: ", id);
    console.log("New content: ", updatedContent);
    await updateApproval(
      id.toString(),
      approved!,
      updatedContent!,
      updatedTitle!,
    );
    setIsEditing(false);
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="max-w-prose">
            {isEditing ? (
              <input
                className="w-full"
                defaultValue={title ?? ""}
                placeholder="Enter title here"
                onChange={(e) => setUpdatedTitle(e.target.value)}
              />
            ) : (
              <h2>{title}</h2>
            )}
          </DialogTitle>
        </DialogHeader>
        <div className="flex gap-2">
          <p className="text-sm font-bold text-black/50">Scheduled For: </p>
          <p className="text-sm font-medium text-black/50">
            {schedule_date?.toLocaleDateString("en-US")}
          </p>
          {approved === true ? (
            <p className="text-sm font-medium text-green-500">Approved</p>
          ) : approved === false ? (
            <p className="text-sm font-medium text-red-500">Rejected</p>
          ) : (
            <p className="text-sm font-medium text-yellow-500">Pending</p>
          )}
        </div>

        <div className="border-1 flex max-w-prose whitespace-break-spaces rounded-lg border px-6 py-4">
          {isEditing ? (
            <textarea
              className="min-h-80 w-full text-sm"
              defaultValue={content ?? ""}
              placeholder="Enter content here"
              onChange={(e) => setUpdatedContent(e.target.value)}
            ></textarea>
          ) : (
            <p className="text-sm">{content}</p>
          )}
        </div>
        {availImages && availImages.length > 0 ? (
          <div className="flex flex-col gap-4">
            <h1 className="text-sm">Relevant Images:</h1>
            <div className="flex w-full flex-wrap gap-2.5">
              {availImages.map((image) => (
                <div key={image} className="relative">
                  <Image
                    src={image}
                    alt="extracted image"
                    height={200}
                    width={200}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <h1 className="text-sm font-bold text-red-300">
            No relevant product images found
          </h1>
        )}
        <div className="flex" onClick={() => generateImage()}>
          <ZoomOutLoader
            color="brand"
            size="l"
            style="zoom-out"
            loading={generatingImage}
          >
            Generate Image
          </ZoomOutLoader>
        </div>
        {genImage && (
          <div className="relative">
            <Image
              src={genImage}
              alt="generated image"
              height={400}
              width={400}
            />
          </div>
        )}

        <DialogFooter>
          <div className="flex w-full justify-between">
            <div className="flex gap-2.5">
              <Button
                onClick={() => deletePost(id.toString())}
                variant="destructive"
              >
                <Trash2 size={16} />
              </Button>
              <Button
                onClick={() => setIsEditing(!isEditing)}
                variant="secondary"
              >
                {isEditing ? "Cancel" : "Edit"}
              </Button>
            </div>
            {isEditing && (
              <div className="flex" onClick={() => handleClick()}>
                <ZoomOutLoader
                  color="green"
                  size="l"
                  style="zoom-out"
                  loading={isSubmitting}
                >
                  Save
                </ZoomOutLoader>
              </div>
            )}
            {!isEditing && (
              <div className="flex gap-2.5">
                <div
                  className="flex"
                  onClick={() =>
                    updateApproval(
                      id.toString(),
                      false,
                      updatedContent!,
                      updatedTitle!,
                    )
                  }
                >
                  <ZoomOutLoader
                    color="red"
                    size="l"
                    style="zoom-out"
                    loading={isSubmitting}
                  >
                    <X size={16} />
                  </ZoomOutLoader>
                </div>
                <div
                  className="flex"
                  onClick={() =>
                    updateApproval(
                      id.toString(),
                      true,
                      updatedContent!,
                      updatedTitle!,
                    )
                  }
                >
                  <ZoomOutLoader
                    color="green"
                    size="l"
                    style="zoom-out"
                    loading={isSubmitting}
                  >
                    <Check size={16} />
                  </ZoomOutLoader>
                </div>
              </div>
            )}
            {/* <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-full"><Redo2 size={24}/></button> */}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
