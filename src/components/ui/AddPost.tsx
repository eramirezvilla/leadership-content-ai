import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./form";
import { Input } from "./input";
import { useRouter } from "next/navigation";
import { useState } from "react";
import LoadingButton from "./loadingbutton";
import { type post, industry_challenge_mapping } from "@prisma/client";
import { CreatePostSchema, createPostSchema } from "~/lib/validation/Post";
import { zodResolver } from "@hookform/resolvers/zod";

// eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
type IndustryMap = {
  [key: string]: Omit<industry_challenge_mapping, "industry_name">[];
};
interface AddPostProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    allIndustries: industry_challenge_mapping[];
}

export default function AddPost({open, setOpen, allIndustries} : AddPostProps) {
  const [deleteInProgress, setDeleteInProgress] = useState(false);
  const router = useRouter();
  const industryMap = allIndustries.reduce<IndustryMap>((acc, industry) => {
    const { industry_name, ...otherValues } = industry;
    if (industry_name === null) return acc; // Skip if industry_name is null

    if (!acc[industry_name]) {
        acc[industry_name] = [];
    }
    acc[industry_name]!.push(otherValues);
    return acc;
}, {});

  const form = useForm<CreatePostSchema>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      theme_name: "",
      discussion_topic: ""
    },
  });

  async function onSubmit(input) {
    try {
      if (noteToEdit) {
        const response = await fetch("/api/notes", {
          method: "PUT",
          body: JSON.stringify({
            id: noteToEdit.id.toString(),
            ...input,
            }),
          });
          if (!response.ok) {
            throw Error("An error occurred");
          }

      } else {
        const response = await fetch("/api/notes", {
          method: "POST",
          body: JSON.stringify(input),
        });
  
        if (!response.ok) {
          throw Error("An error occurred");
        }
  
        form.reset();

      }      
      router.refresh();
      setOpen(false);
    } catch (error) {
      console.error(error);
      alert("something went wrong");
    }
  }

  async function deleteNote() {
    if(!noteToEdit) return;
    setDeleteInProgress(true);
    try {
      const response = await fetch("/api/notes", {
        method: "DELETE",
        body: JSON.stringify({ id: noteToEdit.id.toString() }),
      });

      if (!response.ok) {
        throw Error("An error occurred");
      }

      router.refresh();
      setOpen(false);
    } catch (error) {
      console.error(error);
      alert("something went wrong");
    } finally {
      setDeleteInProgress(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Post</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    {/* <Textarea placeholder="Content" {...field} /> */}
                    <Tiptap onChange={field.onChange} content={field.value}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="gap-1 sm:gap-0">
              {noteToEdit && (
                <LoadingButton
                variant="destructive"
                loading={deleteInProgress}
                disabled={form.formState.isSubmitting}
                onClick={deleteNote}
                type="button"
                >
                  Delete note
                </LoadingButton>
                )}
              <LoadingButton
                type="submit"
                loading={form.formState.isSubmitting}
                disabled={deleteInProgress}
              >
                Submit
              </LoadingButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
