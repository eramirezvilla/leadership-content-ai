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

type fileWithPublicURL = {
  filename: string;
  supaURL: string;
};

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
  const [generatingImage, setGeneratingImage] = useState(false);
  const [featuredImage, setFeaturedImage] = useState(postToEdit.featured_image_filename ?? "");
  const [generatedImages, setGeneratedImages] = useState(postToEdit.generated_image_filenames ?? []);
  const [relevantFilesURLs, setRelevantFilesURLs] = useState<fileWithPublicURL[]>();

  useEffect(() => {
    setGeneratedImages(postToEdit.generated_image_filenames ?? []);
  }
  , [postToEdit.generated_image_filenames]);


  async function updateFeaturedImage(post_id: string, image_url: string) {
    try {
      const response = await fetch(`/api/image`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: post_id, image_url: image_url }),
      });
      if (response.ok) {
        console.log("Featured Image updated successfully");
      } else {
        throw new Error("Failed to update featured image");
      }
    }
    catch (error) {
      console.error(error);
    }
  }

  function handleFeatureImage(image: string) {
    setFeaturedImage(image);
    void updateFeaturedImage(postToEdit.id.toString(), image.toString());
  }

  async function generateImage() {
    try {
      setGeneratingImage(true);
      const response = await fetch(`/api/image`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: postToEdit.id.toString(), post_content: updatedContent }),
      });
      if (response.ok) {
        const data = await response.json();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        setGeneratedImages([...generatedImages, data]);
      } else {
        throw new Error("Failed to generate image");
      }
    } catch (error) {
      console.error(error);
    }
    setGeneratingImage(false);
  }

  useEffect(() => {
    async function getRelevantFiles(ids: string[]) {
      try {
        const response = await fetch(`/api/file?ids=${ids.join(",")}`);
        if (response.ok) {
          const data = await response.json();
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          setRelevantFilesURLs(data);

        } else {
          throw new Error("Failed to fetch relevant files");
        }
      } catch (error) {
        console.error(error);
      }
    }

    if (postToEdit?.relevant_files && postToEdit.relevant_files.length > 0) {
      const relevantFiles = postToEdit.relevant_files.map(String);
      void getRelevantFiles(relevantFiles);
    }

  } , []);

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
    featured_image_filename,
    generated_image_filenames,
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
              <p>{title}</p>
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
        {featuredImage && (
          <div className={`flex justify-center hover:cursor-pointer`}>
            <Image
              src={featuredImage}
              alt="featured image"
              height={400}
              width={400}
            />
          </div>
        )}

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
                <div key={image} className={`relative hover:cursor-pointer p-2 ${featuredImage === image ? 'border-brand_gradient1_purple border-2' : ''}`} onClick={() => handleFeatureImage(image)}>
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
        {generatedImages && generatedImages.length > 0 ? (
          <div className="flex flex-col gap-4">
            <h1 className="text-sm">Generated Images:</h1>
            <div className="flex w-full flex-wrap justify-start">
              {generatedImages.map((image) => (
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                <div key={image} className={`relative p-2 hover:cursor-pointer ${featuredImage === image ? 'border-brand_gradient1_purple border-2' : ''}`} onClick={() => handleFeatureImage(image)}>
                  <Image
                    src={image}
                    alt="generated image"
                    height={200}
                    width={200}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <h1 className="text-sm font-bold text-red-300">
            No generated images found
          </h1>
        )}
        {relevantFilesURLs && relevantFilesURLs.length > 0 ? (
          <div className="flex flex-col gap-4">
            <h1 className="text-sm">Relevant Files:</h1>
            <div className="flex w-full flex-col gap-2.5 pl-2">
              {relevantFilesURLs.map((file) => (
                <div key={file.filename} className="flex gap-2.5">
                  <a
                    href={file.supaURL}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm underline text-brand_dark_purple_grey hover:text-brand_gradient1_purple"
                  >
                    {file.filename}
                  </a>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <h1 className="text-sm font-bold text-red-300">
            No relevant files found
          </h1>
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
