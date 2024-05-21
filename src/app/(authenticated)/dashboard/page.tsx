import { UserButton, useUser } from "@clerk/nextjs";
import CalendarTest from "~/components/ui/FullCalendar";
import AddScheduler from "~/components/ui/AddScheduler";
import prisma from "~/lib/server/prisma";
import { type post } from "@prisma/client";
import Link from "next/link";
import SnapshotWidget from "~/components/ui/UICard";

export default async function DashboardPage() {
  const availableThemes = await prisma.themes.findMany();

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

  // const scheduledPostsForThisWeek = postsWithSchedule.filter(
  //   (post) =>
  //     post.schedule_date! >= new Date(new Date().setHours(0, 0, 0, 0)) &&
  //     post.schedule_date! <=
  //       new Date(new Date().setDate(new Date().getDate() + 7)),
  // );

  const scheduledPostsForThisWeek = postsWithSchedule.filter(
    (post) =>
      post.schedule_date! >= monday &&
      post.schedule_date! <= friday,
  );

  const alreadyPostedThisWeek = scheduledPostsForThisWeek.filter(
    (post) => post.schedule_date! <= new Date(),
  );

  const amtPostsWithSchedule = postsWithSchedule.length;
  const amtPostsNeedingApproval = postsWithSchedule.filter(
    (post) => post.approved === false || post.approved === null,
  ).length;

  return (
    <div className="flex w-full gap-4 px-8 pt-4">
      <div className="min-h-screen flex-1 flex-col items-center justify-center">
        <CalendarTest events={scheduledPostsForThisWeek} />
      </div>
      <div className="w-full flex-1 items-center justify-center">
        <div className="flex h-16 justify-end">
          <AddScheduler availableThemes={availableThemes} />
        </div>
        <div className="flex justify-center gap-8">
          <Link href="/posts">
          <div className="border-1 flex h-40 w-40 flex-col items-center justify-center gap-2.5 rounded-lg border">
            <div className="flex w-full flex-1 items-center justify-center">
              <h2 className="text-3xl font-bold">{amtPostsWithSchedule}</h2>
            </div>
            <div className="flex w-full flex-1 items-start justify-center">
              <p className="text-md whitespace-pre-wrap text-center font-medium">
                Scheduled Posts
              </p>
            </div>
          </div>
          </Link>
          <div className="border-1 flex h-40 w-40 flex-col items-center justify-center gap-2.5 rounded-lg border">
            <div className="flex w-full flex-1 items-center justify-center">
              <h2 className="text-3xl font-bold">{amtPostsNeedingApproval}</h2>
            </div>
            <div className="flex w-full flex-1 items-start justify-center">
              <p className="text-md whitespace-pre-wrap text-center font-medium">
                Posts Pending Approval
              </p>
            </div>
          </div>
        </div>
          <SnapshotWidget title="Scheduled Posts" whole={scheduledPostsForThisWeek.length} value={alreadyPostedThisWeek.length} frequency="This Week"/>
      </div>
    </div>
  );
}
