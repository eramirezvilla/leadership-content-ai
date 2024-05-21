import { UserButton, useUser } from "@clerk/nextjs";
import CalendarTest from "~/components/ui/FullCalendar";
import AddScheduler from "~/components/ui/AddScheduler";
import prisma from "~/lib/server/prisma";
import { type post } from "@prisma/client";
import Link from "next/link";
import SnapshotWidget from "~/components/ui/UICard";
import FullCalendar from "@fullcalendar/react";
import { ThemeChart } from "~/components/ui/charts";

export default async function DashboardPage() {
  const availableThemes = await prisma.themes.findMany();

  const themeNames = availableThemes.map((theme) => theme.title);

  const postsWithSchedule = await prisma.post.findMany({
    where: {
      schedule_date: {
        not: null,
      },
    },
  });

  const today = new Date();
  
  // Calculate the most recent Monday
  const getMonday = (date: Date): Date => {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is Sunday
    return new Date(date.setDate(diff));
  };

  const monday = getMonday(new Date(today));

  // Calculate the upcoming Friday
  const friday = new Date(monday);
  friday.setDate(monday.getDate() + 4);

  const scheduledPostsForThisWeek = postsWithSchedule.filter(
    (post) =>
      post.schedule_date! >= monday &&
      post.schedule_date! <= friday,
  );

  // Calculate the first day of the current month
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  
  // Calculate the last day of the current month
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  const scheduledPostForThisMonth = postsWithSchedule.filter(
    (post) =>
      post.schedule_date! >= firstDayOfMonth &&
      post.schedule_date! <= lastDayOfMonth,
  );
  const alreadyPostedThisMonth = scheduledPostForThisMonth.filter(
    (post) => post.schedule_date! <= new Date(),
  );


  const alreadyPostedThisWeek = scheduledPostsForThisWeek.filter(
    (post) => post.schedule_date! <= new Date(),
  );

  const amtPostsWithSchedule = postsWithSchedule.length;
  const amtPostsNeedingApproval = postsWithSchedule.filter(
    (post) => post.approved === false || post.approved === null && post.schedule_date! <= new Date(),
  ).length;



  return (
    <div className="flex flex-col w-full pt-4 gap-4">
      <div className="flex w-full justify-evenly px-10">
      <SnapshotWidget title="Scheduled Posts" whole={scheduledPostsForThisWeek.length} value={alreadyPostedThisWeek.length} frequency="This Week"/>
      <SnapshotWidget title="Scheduled Posts" whole={scheduledPostForThisMonth.length} value={alreadyPostedThisMonth.length} frequency="This Month"/>
      <SnapshotWidget title="Pending" whole={postsWithSchedule.length} value={amtPostsNeedingApproval} frequency="Current"/>
      </div>
    <div className="flex w-full gap-4 px-8">
      <div className="min-h-screen flex-1 flex-col items-center justify-center">
        <CalendarTest events={scheduledPostsForThisWeek} />
      </div>
      <div className="w-full flex-1 items-center justify-center">
        <div className="flex h-16 justify-end">
          <AddScheduler availableThemes={availableThemes} />
        </div>
        <ThemeChart availableThemes={themeNames} postsWithSchedule={postsWithSchedule}/>
      </div>
    </div>
    </div>
  );
}
