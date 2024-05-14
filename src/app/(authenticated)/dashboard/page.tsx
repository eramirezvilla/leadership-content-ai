import { UserButton, useUser } from '@clerk/nextjs'
import CalendarTest from '~/components/ui/FullCalendar';
import AddScheduler from '~/components/ui/AddScheduler';
import prisma from '~/lib/server/prisma';

export default async function DashboardPage() {

  const availableThemes = await prisma.themes.findMany();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
    <UserButton />
    <CalendarTest />  
    <AddScheduler availableThemes={availableThemes} />
    </main>
  );
}