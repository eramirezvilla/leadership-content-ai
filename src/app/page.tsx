import { Button } from "~/components/ui/moving-border";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs";
import { SparklesCore } from "~/components/ui/sparkles";
import logo from "public/new-capo-logo.svg";
import Image from "next/image";

export default function HomePage() {
  const { userId } = auth();
  if (userId) {
    redirect("/dashboard");
  }

  return (
    <main className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden rounded-md bg-black">
      <div className="absolute inset-0 h-screen w-full">
        <SparklesCore
          id="tsparticlesfullpage"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={100}
          className="h-full w-full"
          particleColor="#FFFFFF"
        />
      </div>
      <div className="relative z-20 flex h-full w-full flex-col items-center justify-center gap-4">
        <Image src={logo} alt="Capo logo" width={400} height={400} />
        <p className="max-w-prose text-lg font-semibold text-white">
          AI generated content designed for your audience using your content.
        </p>
        <div className="flex w-full justify-center">
          <Link href="/sign-in">
            <Button type="button" className="bg-black/50 text-white font-semibold hover:bg-white/10 text-lg">Sign In</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
