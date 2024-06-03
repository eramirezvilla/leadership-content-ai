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
import { Calendar } from "~/components/ui/Calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { ToggleGroup, ToggleGroupItem } from "~/components/ui/toggle-group";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import type { scheduler, themes } from "@prisma/client";
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
import ProgressBar from "./ProgressBar";

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
  const [percentageComplete, setPercentageComplete] = useState(0);

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
  };

  const form = useForm<CreateScheduleSchema>({
    resolver: zodResolver(createScheduleSchema),
    defaultValues: {
      title: "New Scheduled Theme " + new Date().toLocaleDateString(),
      created_from_theme: availableThemes[0]?.title,
      start_from: undefined,
      end_on: undefined,
      frequency: [false, false, false, false, false, false, false],
    },
  });

  useEffect(() => {
    // console.log("Updated selected days:", selectedDays);
    form.setValue("frequency", selectedDays);
  }, [selectedDays, form]);

  const router = useRouter();

  async function onSubmit(data: CreateScheduleSchema) {
    console.log("theme_name", data.created_from_theme);
    const interval = setInterval(() => {
      setPercentageComplete((prev) => (prev < 95 ? prev + 5 : prev));
    }, 2000);

    try {
      const response = await fetch("/api/scheduler", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        console.log("input", data);
        throw Error("An error occurred");
      }

      form.reset();
      setPercentageComplete(100);
      clearInterval(interval);
      router.refresh();
      setOpen(false);
      setPercentageComplete(0);
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
        className="bg-gradient-to-r from-brand_gradient1_purple to-brand_gradient1_blue hover:bg-gradient-to-r hover:from-brand_gradient2_purple hover:to-brand_gradient2_blue"
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
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="mt-8 space-y-8"
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex w-full items-center">
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
                name="created_from_theme"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex w-full items-center">
                        <div className="flex min-w-40">
                          <p className="mr-2 text-sm font-medium">
                            Select Theme:{" "}
                          </p>
                        </div>
                        <select
                          {...field}
                          className="border-1 rounded-lg border py-1 pl-2"
                          onChange={(e) => field.onChange(e.target.value)}
                          value={field.value}
                        >
                          {availableThemes.map((theme) => (
                            <option key={theme.id} value={theme.title}>
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
                    <FormControl>
                      <div className="flex w-full items-center">
                        <div className="flex min-w-40">
                          <p className="mr-2 text-sm font-medium">
                            Start Date{" "}
                          </p>
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
                              selected={new Date(field.value)}
                              onSelect={(date) => {
                                field.onChange(date?.toISOString());
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
                    <FormControl>
                      <div className="flex w-full items-center">
                        <div className="flex min-w-40">
                          <p className="mr-2 text-sm font-medium">End Date </p>
                        </div>
                        <Popover
                          open={endDateOpen}
                          onOpenChange={setEndDateOpen}
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
                              selected={new Date(field.value)}
                              onSelect={(date) => {
                                field.onChange(date?.toISOString());
                                setEndDateOpen(false);
                              }}
                              disabled={(date) =>
                                date < new Date() ||
                                date < new Date(form.getValues("start_from"))
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
                    <FormControl>
                      <div className="flex w-full items-center">
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
                                handleSelect(day);
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
                {form.formState.isSubmitting && (
                  <ProgressBar percentage={percentageComplete} />
                )}
              <DialogFooter className="gap-1 sm:gap-0">
                <LoadingButton
                  type="submit"
                  loading={form.formState.isSubmitting}
                  disabled={deleteInProgress}
                  className="bg-gradient-to-r from-brand_gradient1_purple to-brand_gradient1_blue hover:to-brand_gradient2_blue"
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
