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
  const { title, content, created_at, created_from_mapping, relevant_files } =
    postToEdit;

  return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
      <DialogHeader>
        <DialogTitle className="max-w-prose">{title}</DialogTitle>
      </DialogHeader>
      <p className="text-sm font-medium text-black/50">{created_at.toLocaleDateString("en-US")}</p>
        <p className="max-w-prose">{content}</p>
        <p>Rel:{relevant_files}</p>
      <DialogFooter>
        <button onClick={() => setOpen(false)}>Close</button>
      </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
