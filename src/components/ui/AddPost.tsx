"use client";
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
  CommandList,
} from "~/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { useRouter } from "next/navigation";
import { useState } from "react";
import LoadingButton from "./loadingbutton";
import { type industry_challenge_mapping, type themes } from "@prisma/client";
import { type CreatePostSchema, createPostSchema } from "~/lib/validation/Post";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "./button";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { PlusIcon } from 'lucide-react'
import { cn } from "~/lib/utils";


// eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
type IndustryMap = {
  [key: string]: Omit<industry_challenge_mapping, "industry_name">[];
};
interface AddPostProps {
  // open: boolean;
  // setOpen: (open: boolean) => void;
  allIndustries: industry_challenge_mapping[];
  allThemes: themes[];
}

export default function AddPost({
  // open,
  // setOpen,
  allIndustries,
  allThemes,
}: AddPostProps) {
  const [themeOpen, setThemeOpen] = useState(false);
  const [industryOpen, setIndustryOpen] = useState(false);
  const [dicussionOpen, setDicussionOpen] = useState(false);
  const [industryTopics, setIndustryTopics] = useState<Omit<industry_challenge_mapping, "industry_name">[]>([]);
  const [open, setOpen] = useState(false);

  const [deleteInProgress, setDeleteInProgress] = useState(false);
  
  const router = useRouter();

  const industryMap = allIndustries.reduce<IndustryMap>((acc, industry) => {
    const { industry_name, ...otherValues } = industry;
    if (industry_name === null) return acc; // Skip if industry_name is null

    if (!acc[industry_name]) {
      acc[industry_name] = [];
    }
    acc[industry_name]?.push(otherValues);
    return acc;
  }, {});

  const form = useForm<CreatePostSchema>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      theme_name: "",
      industry_name: "",
      discussion_topic: "Select topic",
      topic_description: "None selected",
      mapping_id: 0,
    },
  });

  async function onSubmit(input: CreatePostSchema) {
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
        console.log("input", input);
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
    <>
    <Button type="button" onClick={() => setOpen(true)} className="bg-gradient-to-r from-brand_gradient1_purple to-brand_gradient1_blue hover:bg-gradient-to-r hover:from-brand_gradient2_purple hover:to-brand_gradient2_blue">
      <div className="flex gap-2.5 items-center justify-center">
        <PlusIcon size={20}/>  
        <p className="text-white text-subheadline"> New Post</p>
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
              name="theme_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Theme Name</FormLabel>
                  <Popover open={themeOpen} onOpenChange={setThemeOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full justify-between",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value
                            ? allThemes?.find(
                                (theme) => theme.title === field.value,
                              )?.title
                            : "Select theme"}
                          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput
                          placeholder="Search themes..."
                          className="h-9"
                        />
                        <CommandEmpty>No theme found.</CommandEmpty>
                        <CommandList>
                        <CommandGroup>
                          {allThemes.map((theme) => (
                            <CommandItem
                              value={theme.title ?? ""}
                              key={theme.id.toString()}
                              onSelect={() => {
                                form.setValue("theme_name", theme.title!);
                                setThemeOpen(false);
                              }}
                            >
                              {theme.title}
                              <CheckIcon
                                className={cn(
                                  "ml-auto h-4 w-4",
                                  theme.title === field.value
                                    ? "opacity-100"
                                    : "opacity-0",
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                        </CommandList>
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
                  <FormLabel>Industry Name</FormLabel>
                  <Popover open={industryOpen} onOpenChange={setIndustryOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full justify-between",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value
                            ? field.value
                            : "Select industry"}
                          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput
                          placeholder="Search industries..."
                          className="h-9"
                        />
                        <CommandEmpty>No industry found.</CommandEmpty>
                        <CommandList>
                        <CommandGroup>
                        {Object.keys(industryMap).map((industryName) => (
                            <CommandItem
                              value={industryName}
                              key={industryName}
                              onSelect={() => {
                                form.setValue("industry_name", industryName);
                                setIndustryTopics(industryMap[industryName] ?? []);
                                console.log("industryMap[industryName]", industryMap[industryName] ?? [])
                                form.setValue("discussion_topic", "Select topic")
                                setIndustryOpen(false);
                                form.setValue("topic_description", "");
                              }}
                            >
                              {industryName}
                              <CheckIcon
                                className={cn(
                                  "ml-auto h-4 w-4",
                                  industryName === field.value
                                    ? "opacity-100"
                                    : "opacity-0",
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
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
                  <Popover open={dicussionOpen} onOpenChange={setDicussionOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full justify-between",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value ?? "Select topic"}
                          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-full h-full p-0 overflow-scroll">
                      <Command>
                        <CommandInput
                          placeholder="Search topics..."
                          className="h-9"
                        />
                        <CommandEmpty>No topics found.</CommandEmpty>
                        <CommandList>
                        <CommandGroup>
                          {industryTopics.map((topic) => (
                            <CommandItem
                              value={topic.discussion_topic ?? "Select topic"}
                              key={topic.id.toString() ?? ""}
                              onSelect={() => {
                                form.setValue("discussion_topic", topic.discussion_topic!);
                                setDicussionOpen(false);
                                form.setValue("topic_description", topic.topic_description ?? "");
                                form.setValue("mapping_id", Number(topic.id) ?? 0);
                              }}
                            >
                              {topic.discussion_topic}
                              <CheckIcon
                                className={cn(
                                  "ml-auto h-4 w-4",
                                  topic.discussion_topic === field.value
                                    ? "opacity-100"
                                    : "opacity-0",
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col gap-2 w-full">
              <h1 className="text-lg font-semibold">Topic Description</h1>
              <p className="text-sm text-muted-foreground"> {form.watch("topic_description")}</p>
            </div>
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
    </>
  );
}
