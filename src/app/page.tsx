import { Button } from "~/components/ui/moving-border";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs";
import { SparklesCore } from "~/components/ui/sparkles";
import logo from "public/Levata_Icon_RGB.svg";
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
      <div className="relative z-20 flex h-full w-full flex-col items-center justify-center gap-8">
        <div className="flex gap-2.5 items-center">
          <Image src={logo} alt="Levata logo" width={50} height={50} />
          <h1 className="text-5xl font-black text-white">Amplify</h1>
        </div>
        <div className="flex flex-col items-center justify-center gap-6 w-full">
          <div className="flex flex-col items-start gap-4">
            <p className="max-w-[450px] text-xl font-bold text-white justify-center">
            Turning data into leads, made easy.
            </p>
            {/* <p className="font-medium text-base text-white justify-center max-w-[400px]">
              
            </p> */}
          </div>
          <div className="flex w-full justify-center">
            <Link href="/sign-in">
              <Button type="button" className="bg-black/50 text-white font-semibold hover:bg-white/10 text-base">Sign In</Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
