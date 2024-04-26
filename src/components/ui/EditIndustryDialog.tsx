import { type industry_challenge_mapping as industryType } from "@prisma/client";
import {
  type CreateIndustrySchema,
  createIndustrySchema,
} from "~/lib/validation/IndustryChallenge";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Textarea } from "./textarea";
import { Button } from "./button";
import LoadingButton from "./loadingbutton";

interface EditIndustryDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  industryToEdit?: industryType;
}

export default function EditIndustryDialog({
  open,
  setOpen,
  industryToEdit,
}: EditIndustryDialogProps) {
    console.log(industryToEdit)
  const [deleteInProgress, setDeleteInProgress] = useState(false);
  const router = useRouter();
  // use zod to validate the form
  const form = useForm<CreateIndustrySchema>({
    resolver: zodResolver(createIndustrySchema),
    defaultValues: {
      industry_name: industryToEdit?.industry_name ?? "",
      discussion_topic: industryToEdit?.discussion_topic ?? "",
      topic_description: industryToEdit?.topic_description ?? "",
    },
  });

  async function onSubmit(input: CreateIndustrySchema) {
    try {
      if (industryToEdit) {
        const response = await fetch("/api/notes", {
          method: "PUT",
          body: JSON.stringify({
            id: industryToEdit.id,
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

  async function deleteIndustry() {
    if (!industryToEdit) return;

    try {
      const response = await fetch("/api/industries", {
        method: "DELETE",
        body: JSON.stringify({ id: industryToEdit.id.toString() }),
      });

      if (!response.ok) {
        throw Error("An error occurred");
      }

      router.refresh();
      setOpen(false);
    } catch (error) {
      console.error(error);
      alert("something went wrong");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{industryToEdit ? "Edit Note" : "Add Note"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="industry_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Industry Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Industry Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="discussion_topic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discussion Topic</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Content" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="topic_description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Topic Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Topic Description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="gap-1 sm:gap-0">
              {industryToEdit && (
                <LoadingButton
                  variant="destructive"
                  loading={deleteInProgress}
                  disabled={form.formState.isSubmitting}
                  onClick={deleteIndustry}
                  type="button"
                >
                  Delete industry challenge
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
