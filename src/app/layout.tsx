import "~/styles/globals.css";
import { ClerkProvider } from '@clerk/nextjs'

import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Amplify - AI Content For Leadership",
  description: "An AI-integrated platform that helps you create and schedule content for your LinkedIn profile.",
  icons: [{ rel: "icon", url: "/Levata_Icon_RGB_Orig.svg" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body className={`font-sans ${inter.variable}`}>{children}</body>
    </html>
    </ClerkProvider>
  );
}
