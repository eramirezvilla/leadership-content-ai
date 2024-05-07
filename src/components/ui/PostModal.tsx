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
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
      </DialogHeader>
      <DialogContent>
        <p>{content}</p>
        <p>{created_at.toLocaleDateString("en-US")}</p>
        <p>{created_from_mapping}</p>
        <p>{relevant_files}</p>
      </DialogContent>
      <DialogFooter>
        {/* <button onClick={() => setOpen(false)}>Close</button> */}
      </DialogFooter>
    </Dialog>
  );
}
