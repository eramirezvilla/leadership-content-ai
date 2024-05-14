"use client"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
  } from "./dialog";
import { type scheduler } from "@prisma/client"
import { useForm } from "react-hook-form";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "./form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "./button";
import { cn } from "~/lib/utils";
import {type CreateScheduleSchema, createScheduleSchema} from "~/lib/validation/Scheduler";

interface SchedulerModalProps {
    schedulerToEdit?: scheduler;
    open: boolean;
    setOpen: (open: boolean) => void;
}

export default function AddScheduler({ schedulerToEdit, open, setOpen }: SchedulerModalProps){

    return (
        <>
        </>
    )

}
