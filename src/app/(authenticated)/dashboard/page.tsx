import { UserButton, useUser } from '@clerk/nextjs'

export default function DashboardPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
    <UserButton />
    </main>
  );
}