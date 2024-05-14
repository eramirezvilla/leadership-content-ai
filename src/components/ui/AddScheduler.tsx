"use client";
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
import { type scheduler, themes } from "@prisma/client";
import { useForm } from "react-hook-form";
import { Button } from "./button";
import { cn } from "~/lib/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";
import LoadingButton from "./loadingbutton";
import {
  type CreateScheduleSchema,
  createScheduleSchema,
} from "~/lib/validation/Scheduler";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon } from "lucide-react";
import { Input } from "./input";

interface SchedulerModalProps {
  schedulerToEdit?: scheduler;
  //   open: boolean;
  //   setOpen: (open: boolean) => void;
  availableThemes: themes[];
}

export default function AddScheduler({
  schedulerToEdit,
  //   open,
  //   setOpen,
  availableThemes,
}: SchedulerModalProps) {
  const [open, setOpen] = useState(false);
  const [deleteInProgress, setDeleteInProgress] = useState(false);

  const form = useForm<CreateScheduleSchema>({
    resolver: zodResolver(createScheduleSchema),
    defaultValues: {
      title: "Scheduled Theme " + new Date().toLocaleDateString(),
      item_type: 0,
      start_from: new Date(),
      end_on: undefined,
      frequency: [false, false, false, false, false, false, false],
    },
  });

  const router = useRouter();

  async function onSubmit(data: CreateScheduleSchema) {
    try {
      // if (noteToEdit) {
      //   const response = await fetch("/api/notes", {
      //     method: "PUT",
      //     body: JSON.stringify({
      //       id: noteToEdit.id.toString(),
      //       ...input,
      //       }),
      //     });
      //     if (!response.ok) {
      //       throw Error("An error occurred");
      //     }

      // } else {
      const response = await fetch("/api/scheduler", {
        method: "POST",
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        console.log("input", data);
        throw Error("An error occurred");
      }

      form.reset();

      // }
      router.refresh();
      setOpen(false);
    } catch (error) {
      console.error(error);
      alert("something went wrong");
    }
  }

  return (
    <>
      <Button
        type="button"
        onClick={() => setOpen(true)}
        className="bg-brand_purple"
      >
        <div className="flex items-center justify-center gap-2.5">
          <PlusIcon size={20} />
          <p className="text-subheadline text-white"> New Schedule</p>
        </div>
      </Button>
      <Dialog open={open} onOpenChange={setOpen} modal={false}>
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
                name="item_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Industry Name</FormLabel>
                    <FormControl>
                      <div className="grid grid-cols-2 gap-2">
                        {availableThemes.map((theme) => (
                          <div
                            key={theme.id}
                            className={`${form.getValues("item_type") === Number(theme.id) ? "bg-brand_purple/15" : "bg-black/10"}  col-span-1 items-center justify-center rounded-lg px-2 py-1 hover:cursor-pointer`}
                            onClick={() => {
                                form.setValue("item_type", Number(theme.id))
                                console.log("item_type", form.getValues("item_type"))
                            }
                            }
                          >
                            {theme.title}
                          </div>
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="gap-1 sm:gap-0">
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
    </>
  );
}
