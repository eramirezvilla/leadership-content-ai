import { SignIn } from "@clerk/nextjs";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Capo - Sign In",
};

export default function SignInPage() {
  return (
    <>
      <div className="flex h-screen items-center justify-center">
        <SignIn appearance={{ variables: { colorPrimary: "#0F172A" } }} />
      </div>
    </>
  );
}
