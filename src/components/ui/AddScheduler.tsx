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
import { Calendar } from "~/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { ToggleGroup, ToggleGroupItem } from "~/components/ui/toggle-group";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { type scheduler, themes } from "@prisma/client";
import { useForm } from "react-hook-form";
import { Button } from "./button";
import { cn } from "~/lib/utils";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
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
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);
  const [selectedDays, setSelectedDays] = useState([
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ]);

  const daysOfWeek = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];

  const handleSelect = (day: string) => {
    const dayIndex = daysOfWeek.indexOf(day);
    setSelectedDays((prevSelectedDays) => {
      const newSelectedDays = [...prevSelectedDays];
      newSelectedDays[dayIndex] = !newSelectedDays[dayIndex];
      return newSelectedDays;
    });
    // console.log("selectedDays", selectedDays);
  };

  
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

  useEffect(() => {
    console.log('Updated selected days:', selectedDays);
    form.setValue("frequency", selectedDays)
}, [selectedDays, form]);

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

      console.log("data", data)
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
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Posting Schedule</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-8">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    {/* <FormLabel>Title</FormLabel> */}
                    <FormControl>
                    <div className="flex items-center w-full">
                        <div className="flex min-w-40">
                            <p className="mr-2 text-sm font-medium">Title </p>
                        </div>
                      <Input placeholder="Title" {...field} />
                      </div>
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
                    {/* <FormLabel>Industry Name</FormLabel> */}
                    <FormControl>
                      <div className="flex items-center w-full">
                        <div className="flex min-w-40">
                            <p className="mr-2 text-sm font-medium">Select Industry: </p>
                        </div>
                        {/* {availableThemes.map((theme) => ( */}
                        {/* //   <div
                        //     key={theme.id}
                        //     className={`${form.getValues("item_type") === Number(theme.id) ? "bg-brand_purple/15" : "bg-black/10"}  col-span-1 items-center justify-center rounded-lg px-2 py-1 hover:cursor-pointer`}
                        //     onClick={() => {
                        //       form.setValue("item_type", Number(theme.id));
                        //       console.log(
                        //         "item_type",
                        //         form.getValues("item_type"),
                        //       );
                        //     }}
                        //   >
                        //     {theme.title}
                        //   </div> */}
                        <select {...field} className="border border-1 pl-2 py-1 rounded-lg" onChange={(e) => field.onChange(Number(e.target.value))}>
                            {availableThemes.map((theme) => (
                                <option key={theme.id} value={Number(theme.id)}>
                                    {theme.title}
                                </option>
                            ))}
                        </select>
                        {/* ))} */}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="start_from"
                render={({ field }) => (
                  <FormItem>
                    {/* <FormLabel>Start Date</FormLabel> */}
                    <FormControl>
                    <div className="flex items-center w-full">
                        <div className="flex min-w-40">
                            <p className="mr-2 text-sm font-medium">Start Date </p>
                        </div>
                      <Popover
                        open={startDateOpen}
                        onOpenChange={setStartDateOpen}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[240px] justify-start text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={(date) => {
                              field.onChange(date);
                              setStartDateOpen(false);
                            }}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="end_on"
                render={({ field }) => (
                  <FormItem>
                    {/* <FormLabel>End Date</FormLabel> */}
                    <FormControl>
                    <div className="flex items-center w-full">
                        <div className="flex min-w-40">
                            <p className="mr-2 text-sm font-medium">End Date </p>
                        </div>
                      <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[240px] justify-start text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={(date) => {
                              field.onChange(date);
                              setEndDateOpen(false);
                            }}
                            disabled={(date) =>
                              date < new Date() ||
                              date < form.getValues("start_from")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="frequency"
                render={({ field }) => (
                  <FormItem>
                    {/* <FormLabel>Frequency</FormLabel> */}
                    <FormControl>
                    <div className="flex items-center w-full">
                        <div className="flex min-w-40">
                            <p className="mr-2 text-sm font-medium">Frequency </p>
                        </div>
                      <ToggleGroup type="multiple" variant="outline">
                        {daysOfWeek.map((day, index) => (
                          <ToggleGroupItem
                            key={day}
                            value={day}
                            aria-label={`Toggle ${day.charAt(0).toUpperCase() + day.slice(1)}`}
                            onClick={() => {
                                handleSelect(day)
                            }}
                          >
                            <div className="flex h-4 w-4 items-center justify-center">
                              {day.charAt(0).toUpperCase()}
                            </div>
                          </ToggleGroupItem>
                        ))}
                      </ToggleGroup>
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
