import { type industry_challenge_mapping as industryType } from "@prisma/client";
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


interface EditIndustryDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    industryToEdit?: industryType;
  }

export default function EditIndustryDialog({ open, setOpen, industryToEdit } : EditIndustryDialogProps) {

      // use zod to validate the form
  const form = useForm<CreateIndustrySchema>({
    resolver: zodResolver(createIndustrySchema),
    defaultValues: {
      title: industryToEdit?.title ?? "",
      content: industryToEdit?.content ?? "",
    },
  });


    return (
        <>
        </>
    )
}