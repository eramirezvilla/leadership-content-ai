import { UserButton, useUser } from "@clerk/nextjs";
import CalendarTest from "~/components/ui/FullCalendar";
import AddScheduler from "~/components/ui/AddScheduler";
import prisma from "~/lib/server/prisma";
import { type post } from "@prisma/client";

export default async function DashboardPage() {
  const availableThemes = await prisma.themes.findMany();
  // const scheduledPostsForThisWeek = await prisma.post.findMany({
  //   where: {
  //     schedule_date: {
  //       gte: new Date(new Date().setHours(0, 0, 0, 0)),
  //       lte: new Date(new Date().setDate(new Date().getDate() + 7)),
  //     },
  //   },
  // });
  const postsWithSchedule = await prisma.post.findMany({
    where: {
      schedule_date: {
        not: null,
      },
    },
  });

  const scheduledPostsForThisWeek = postsWithSchedule.filter(
    (post) =>
      post.schedule_date! >= new Date(new Date().setHours(0, 0, 0, 0)) &&
      post.schedule_date! <=
        new Date(new Date().setDate(new Date().getDate() + 7)),
  );

  const amtPostsWithSchedule = postsWithSchedule.length;
  const amtPostsNeedingApproval = postsWithSchedule.filter(
    (post) => post.approved === false || post.approved === null,
  ).length;

  return (
    <div className="flex w-full gap-4 px-8">
      <div className="min-h-screen flex-1 flex-col items-center justify-center">
        <CalendarTest events={scheduledPostsForThisWeek} />
      </div>
      <div className="w-full flex-1 items-center justify-center">
          <div className="flex justify-end h-16">
            <AddScheduler availableThemes={availableThemes} />
          </div>
        <div className="flex justify-center gap-8">
        <div className="flex flex-col items-center justify-center border border-1 rounded-lg h-40 w-40 gap-2.5">
            <div className="flex w-full flex-1 items-center justify-center">
              <h2 className="text-3xl font-bold">{amtPostsWithSchedule}</h2>
            </div>
            <div className="flex w-full flex-1 items-start justify-center">
              <p className="text-md text-center font-medium whitespace-pre-wrap">Scheduled Posts</p>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center border border-1 rounded-lg h-40 w-40 gap-2.5">
          <div className="flex w-full flex-1 items-center justify-center">
            <h2 className="text-3xl font-bold">{amtPostsNeedingApproval}</h2>
            </div>
            <div className="flex w-full flex-1 items-start justify-center">
            <p className="text-md text-center font-medium whitespace-pre-wrap">Posts Pending Approval</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
