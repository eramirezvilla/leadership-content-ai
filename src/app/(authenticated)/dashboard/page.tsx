import { UserButton, useUser } from '@clerk/nextjs'
import CalendarTest from '~/components/ui/FullCalendar';
import AddScheduler from '~/components/ui/AddScheduler';
import prisma from '~/lib/server/prisma';

export default async function DashboardPage() {

  const availableThemes = await prisma.themes.findMany();
  const scheduledPostsForThisWeek = await prisma.post.findMany({
    where: {
      schedule_date: {
        gte: new Date(),
        lte: new Date(new Date().setDate(new Date().getDate() + 7)),
      },
    },
  });


  return (
    <div className="flex w-full px-8 gap-4">
    <div className="flex-1 min-h-screen flex-col items-center justify-center">
    <CalendarTest events={scheduledPostsForThisWeek} />
    </div>
    <div className="flex-1 w-full justify-center items-center border border-red-500">
    <AddScheduler availableThemes={availableThemes} />
    </div>

    </div>
  );
}