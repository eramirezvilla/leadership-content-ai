"use client"
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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "~/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover"
import { Input } from "./input";
import { useRouter } from "next/navigation";
import { useState } from "react";
import LoadingButton from "./loadingbutton";
import { type post, industry_challenge_mapping, themes } from "@prisma/client";
import { CreatePostSchema, createPostSchema } from "~/lib/validation/Post";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "./button";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { cn } from "~/lib/utils";

// eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
type IndustryMap = {
  [key: string]: Omit<industry_challenge_mapping, "industry_name">[];
};
interface AddPostProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    allIndustries: industry_challenge_mapping[];
    allThemes: themes[];
}

export default function AddPost({open, setOpen, allIndustries, allThemes} : AddPostProps) {
  // const [open, setOpen] = useState(true);
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

  async function onSubmit(input : CreatePostSchema) {
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
        const response = await fetch("/api/post", {
          method: "POST",
          body: JSON.stringify(input),
        });
  
        if (!response.ok) {
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

  // async function deleteNote() {
  //   if(!noteToEdit) return;
  //   setDeleteInProgress(true);
  //   try {
  //     const response = await fetch("/api/notes", {
  //       method: "DELETE",
  //       body: JSON.stringify({ id: noteToEdit.id.toString() }),
  //     });

  //     if (!response.ok) {
  //       throw Error("An error occurred");
  //     }

  //     router.refresh();
  //     setOpen(false);
  //   } catch (error) {
  //     console.error(error);
  //     alert("something went wrong");
  //   } finally {
  //     setDeleteInProgress(false);
  //   }
  // }

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
              name="theme_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-[200px] justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? allThemes.find(
                            (theme) => theme.title === field.value
                          )?.title
                        : "Select theme"}
                      <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search framework..."
                      className="h-9"
                    />
                    <CommandEmpty>No framework found.</CommandEmpty>
                    <CommandGroup>
                      {allThemes.map((theme) => (
                        <CommandItem
                          value={theme.title!}
                          key={theme.title}
                          onSelect={() => {
                            form.setValue("theme_name", theme.title!)
                          }}
                        >
                          {theme.title}
                          <CheckIcon
                            className={cn(
                              "ml-auto h-4 w-4",
                              theme.title === field.value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="industry_name"
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
              name="discussion_topic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Input placeholder="Content" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="gap-1 sm:gap-0">
              {/* {noteToEdit && (
                <LoadingButton
                variant="destructive"
                loading={deleteInProgress}
                disabled={form.formState.isSubmitting}
                onClick={deleteNote}
                type="button"
                >
                  Delete note
                </LoadingButton>
                )} */}
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
