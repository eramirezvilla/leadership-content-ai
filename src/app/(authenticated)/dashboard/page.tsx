import { UserButton, useUser } from '@clerk/nextjs'
import CalendarTest from '~/components/ui/CalendarTest';

export default function DashboardPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
    <UserButton />
    <CalendarTest />  
    </main>
  );
}