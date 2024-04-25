import { Button } from "~/components/ui/button";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs"

export default function HomePage() {

  const { userId } = auth();
  if (userId) {
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
      <Link href="/sign-in">
        <Button>Sign In</Button>
      </Link>
    </main>
  );
}
