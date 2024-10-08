import { UserButton, useUser } from "@clerk/nextjs";
import CalendarTest from "~/components/ui/FullCalendar";
import AddScheduler from "~/components/ui/AddScheduler";
import prisma from "~/lib/server/prisma";
import { type post } from "@prisma/client";
import Link from "next/link";
import SnapshotWidget from "~/components/ui/UICard";
import { ThemeChart } from "~/components/ui/charts";
import LinkedInPost from "~/components/ui/LinkedInPost";
import LinkedInListView from "~/components/ui/LinkedInListView";
import { auth } from "@clerk/nextjs";

export default async function DashboardPage() {
  const { userId } = auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const availableThemes = await prisma.themes.findMany();

  const themeNames = availableThemes.map((theme) => theme.title);

  const postsWithSchedule = await prisma.post.findMany({
    where: {
      schedule_date: {
        not: null,
      },
      user_id: userId,
    },
  });

  const today = new Date();

  // Calculate the most recent Monday
  const getMonday = (date: Date): Date => {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is Sunday
    const monday = new Date(date.setDate(diff));
    monday.setHours(0,0,0,0)
    return monday
  };

  const monday = getMonday(new Date(today));

  // Calculate the upcoming Friday
  const friday = new Date(monday);
  friday.setDate(monday.getDate() + 4);
  friday.setHours(23,59,59,999)

  const scheduledPostsForThisWeek = postsWithSchedule.filter(
    (post) => post.schedule_date! >= monday && post.schedule_date! <= friday,
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
    (post) => post.approved === null && post.schedule_date! >= new Date(),
  ).length;

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <div className="mb-20 flex w-full flex-col gap-8 pt-6">
      <div className="flex w-full flex-col items-start gap-6 bg-white rounded-lg border border-1 p-4">
        <h1 className="pl-20 text-lg font-medium text-black">Dashboard</h1>
        <div className="flex w-full justify-evenly px-10">
          <SnapshotWidget
            title="Upcoming Posts"
            whole={scheduledPostsForThisWeek.length}
            value={alreadyPostedThisWeek.length}
            frequency="This Week"
          />
          <SnapshotWidget
            title="Scheduled Posts"
            whole={scheduledPostForThisMonth.length}
            value={alreadyPostedThisMonth.length}
            frequency={monthNames[today.getMonth()]!}
          />
          <SnapshotWidget
            title="Pending"
            whole={amtPostsWithSchedule}
            value={amtPostsNeedingApproval}
            frequency="Current"
          />
        </div>
      </div>
      <div className="flex w-full gap-4 px-2 overflow-x-hidden">
        <LinkedInListView scheduledPostsForThisWeek={scheduledPostsForThisWeek} />
        {/* <div className="border-1 flex max-h-screen w-full gap-4 flex-1 flex-col items-center justify-start overflow-x-scroll rounded-lg border bg-white px-4 py-4">
          <h1 className="text-lg font-medium text-black">Posts This Week<span className="text-sm text-black/50 font-semibold pl-2.5">LinkedIn</span></h1>
          <div className="flex w-full px-4 py-2 bg-brand_periwinkle">
            <h1 className="text-lg font-medium text-white">Monday</h1>
          </div>
          {scheduledPostsForThisWeek
            .filter((post) => post.schedule_date!.getDay() === 1)
            .map((post) => (
              <LinkedInPost post={post} key={post.id} />
            ))}
          <h1 className="text-lg font-medium text-black">Tuesday</h1>
          {scheduledPostsForThisWeek
            .filter((post) => post.schedule_date!.getDay() === 2)
            .map((post) => (
              <LinkedInPost post={post} key={post.id} />
            ))}
          <h1 className="text-lg font-medium text-black">Wednesday</h1>
          {scheduledPostsForThisWeek
            .filter((post) => post.schedule_date!.getDay() === 3)
            .map((post) => (
              <LinkedInPost post={post} key={post.id} />
            ))}
          <h1 className="text-lg font-medium text-black">Thursday</h1>
          {scheduledPostsForThisWeek
            .filter((post) => post.schedule_date!.getDay() === 4)
            .map((post) => (
              <LinkedInPost post={post} key={post.id} />
            ))}
          <h1 className="text-lg font-medium text-black">Friday</h1>
          {scheduledPostsForThisWeek
            .filter((post) => post.schedule_date!.getDay() === 5)
            .map((post) => (
              <LinkedInPost post={post} key={post.id} />
            ))}
        </div> */}

        <div className="border-1 flex w-full flex-1 flex-col items-center rounded-lg border bg-white px-4 py-4">
          <h1 className="text-lg font-medium text-black">
            Posts By Theme
          </h1>
          <ThemeChart
            availableThemes={themeNames}
            postsWithSchedule={postsWithSchedule}
          />
        </div>
      </div>
    </div>
  );
}
