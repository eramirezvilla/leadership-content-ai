import { type post } from "@prisma/client";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./dialog";

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
  const { title, content, created_at, created_from_topic, relevant_files, schedule_date, approved } =
    postToEdit;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="max-w-prose">{title}</DialogTitle>
        </DialogHeader>
        <div className="flex gap-2 5">
            <p className="text-sm font-bold text-black/50">Scheduled For: </p>
            <p className="text-sm font-medium text-black/50">
              {created_at.toLocaleDateString("en-US")}
            </p>
            {approved ? (
            <p className="text-sm font-medium text-green-500">Approved</p>
          ) : (
            <p className="text-sm font-medium text-red-500">Pending</p>
          )}
        </div>
        <div className="flex max-w-prose px-6 border border-1 py-4 rounded-lg">
            <p className="text-sm">{content}</p>
        </div>
        <p>Rel:{relevant_files}</p>
        <DialogFooter>
          <button onClick={() => setOpen(false)}>Close</button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
