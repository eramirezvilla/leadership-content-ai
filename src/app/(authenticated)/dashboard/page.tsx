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
    <main className="flex min-h-screen w-full flex-col items-center justify-center">
    <CalendarTest events={scheduledPostsForThisWeek} />
    <AddScheduler availableThemes={availableThemes} />
    </main>
  );
}