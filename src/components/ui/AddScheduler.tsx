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
import { PlusIcon } from "lucide-react";

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
      return (
      <>
        <Button
          type="button"
          onClick={() => setOpen(true)}
          className="bg-brand_purple"
        >
          <div className="flex items-center justify-center gap-2.5">
            <PlusIcon size={20} />
            <p className="text-subheadline text-white"> New Post</p>
          </div>
        </Button>
        <Dialog open={open} onOpenChange={setOpen} modal={false}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Post</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-3"
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
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
                      <Popover
                        open={industryOpen}
                        onOpenChange={setIndustryOpen}
                      >
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
                              {field.value ? field.value : "Select industry"}
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
                                {Object.keys(industryMap).map(
                                  (industryName) => (
                                    <CommandItem
                                      value={industryName}
                                      key={industryName}
                                      onSelect={() => {
                                        form.setValue(
                                          "industry_name",
                                          industryName,
                                        );
                                        setIndustryTopics(
                                          industryMap[industryName] ?? [],
                                        );
                                        console.log(
                                          "industryMap[industryName]",
                                          industryMap[industryName] ?? [],
                                        );
                                        form.setValue(
                                          "discussion_topic",
                                          "Select topic",
                                        );
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
                                  ),
                                )}
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
                      <Popover
                        open={dicussionOpen}
                        onOpenChange={setDicussionOpen}
                      >
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
                        <PopoverContent className="h-full w-full overflow-scroll p-0">
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
                                    value={
                                      topic.discussion_topic ?? "Select topic"
                                    }
                                    key={topic.id.toString() ?? ""}
                                    onSelect={() => {
                                      form.setValue(
                                        "discussion_topic",
                                        topic.discussion_topic!,
                                      );
                                      setDicussionOpen(false);
                                      form.setValue(
                                        "topic_description",
                                        topic.topic_description ?? "",
                                      );
                                      form.setValue(
                                        "mapping_id",
                                        Number(topic.id) ?? 0,
                                      );
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
                <div className="flex w-full flex-col gap-2">
                  <h1 className="text-lg font-semibold">Topic Description</h1>
                  <p className="text-muted-foreground text-sm">
                    {" "}
                    {form.watch("topic_description")}
                  </p>
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
    </>
  );
}
