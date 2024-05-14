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
import { type scheduler } from "@prisma/client";
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

interface SchedulerModalProps {
  schedulerToEdit?: scheduler;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function AddScheduler({
  schedulerToEdit,
  open,
  setOpen,
}: SchedulerModalProps) {
  const form = useForm<CreateScheduleSchema>({
    resolver: zodResolver(createScheduleSchema),
    defaultValues: {
      title: "",
      item_type: "",
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

  return <></>;
}
