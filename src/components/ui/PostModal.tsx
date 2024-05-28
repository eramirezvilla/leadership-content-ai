"use client"
import { type post } from "@prisma/client";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./dialog";
import { Check, X, Redo2, ZoomOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ZoomOutLoader from "./ZoomOutLoader";
import { Button } from "./button";

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

    async function updateApproval(post_id: string, approved: boolean) {
        // console.log("post with id: ", post_id, " has been approved: ", approved)
        setIsSubmitting(true);
      const response = await fetch(`/api/post`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: post_id, approved: approved }),
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="max-w-prose">{title}</DialogTitle>
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
          <p className="text-sm">{content}</p>
        </div>
        {/* <p>Rel:{relevant_files}</p> */}
        <DialogFooter>
          <div className="flex w-full justify-between">
          <div className="flex gap-2.5">
              <Button
                onClick={() => setIsEditing(!isEditing)}
                variant="secondary"
              >
                {isEditing ? "Cancel" : "Edit"}
              </Button>
              <Button
                onClick={() => {
                  console.log("Delete post with id: ", id);
                }}
                variant="destructive"
              >
                Delete
              </Button>
          </div>
            <div className="flex gap-2.5">
              <div className="flex" onClick={() => updateApproval(id.toString(), false)}>
                  <ZoomOutLoader color="red" size="l" style="zoom-out" loading={isSubmitting}>
                  <X size={24} />
                  </ZoomOutLoader>
              </div>
              <div className="flex" onClick={() => updateApproval(id.toString(), true)}>
                  <ZoomOutLoader color="green" size="l" style="zoom-out" loading={isSubmitting}>
                      <Check size={24} />
                  </ZoomOutLoader>
              </div>
              {/* <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-full"><Redo2 size={24}/></button> */}
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
