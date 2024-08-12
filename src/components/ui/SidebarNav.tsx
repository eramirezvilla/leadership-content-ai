"use client";
import Link from "next/link";
import { useUser, UserButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import {
  Building2,
  FilePen,
  Folder,
  ListChecks,
  ChevronRight,
  Ellipsis,
  CalendarIcon,
  Home,
  MessageSquare
} from "lucide-react";
import Image from "next/image";
import logo from "public/Levata_Icon_RGB.svg";
import { useRouter, usePathname } from "next/navigation";

export default function SidebarNav() {
  const { user } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  const [selectedItem, setSelectedItem] = useState(pathname);

  useEffect(() => {
    setSelectedItem(pathname);
  }, [pathname]);

  return (
    <div className="sticky left-0 top-0 flex h-screen min-w-60 border-r bg-gradient-to-b from-brand_gradient2_purple to-brand_gradient2_blue text-white">
      <div className="mt-4 flex w-full flex-col gap-8 pt-4">
        <div className="flex items-end justify-center gap-2 object-cover">
          <Image src={logo} alt="Capo logo" width={24} height={24} />
          <h1 className="text-lg font-medium">Amplify</h1>
        </div>
        <div className="flex w-full flex-col gap-4 pt-2">
          <div className="flex w-full items-center justify-start gap-2.5 pl-2.5">
            <Ellipsis size={12} className="stroke-brand_light_grey" />
            <h1 className="text-xs font-medium">Home</h1>
          </div>
          <Link href="/dashboard">
            <div
              className={`flex min-h-4 items-center justify-between rounded-lg px-2.5 py-2 hover:text-brand_word_mark_purple ${selectedItem === "/dashboard" ? "bg-gradient-to-br from-brand_gradient1_blue to-brand_gradient2_blue text-white" : ""}`}
            >
              <div className="flex w-full items-center justify-between px-2">
                <div className="flex items-center justify-start gap-2.5 text-subheadline">
                  <Home size={16} />
                  <h3 className="text-sm font-medium">Dashboard</h3>
                </div>
                <ChevronRight size={16} />
              </div>
            </div>
          </Link>

          <div className="flex w-full items-center justify-start gap-2.5 pl-2.5">
            <Ellipsis size={12} className="stroke-brand_light_grey" />
            <h1 className="text-xs font-medium">Content</h1>
          </div>
          <Link href="/posts">
            <div
              className={`flex min-h-4 items-center justify-between rounded-lg px-2.5 py-2 hover:text-brand_word_mark_purple ${selectedItem === "/posts" ? "bg-gradient-to-br from-brand_gradient1_blue to-brand_gradient2_blue text-white" : ""}`}
            >
              <div className="flex w-full items-center justify-between px-2">
                <div className="flex items-center justify-start gap-2.5 text-subheadline">
                  <FilePen size={16} />
                  <h3 className="text-sm font-medium">Posts</h3>
                </div>
                <ChevronRight size={16} />
              </div>
            </div>
          </Link>
          <Link href="/themes">
            <div
              className={`flex min-h-4 items-center justify-between rounded-xl px-2.5 py-2 hover:text-brand_word_mark_purple ${selectedItem === "/themes" ? "bg-gradient-to-br from-brand_gradient1_blue to-brand_gradient2_blue text-white" : ""}`}
            >
              <div className="flex w-full items-center justify-between px-2">
                <div className="flex items-center justify-start gap-2.5 text-subheadline">
                  <ListChecks size={16} />
                  <h3 className="text-sm font-medium">Themes</h3>
                </div>
                <ChevronRight size={16} />
              </div>
            </div>
          </Link>
          <Link href="/calendar">
            <div
              className={`flex min-h-4 items-center justify-between rounded-xl px-2.5 py-2 hover:text-brand_word_mark_purple ${selectedItem === "/calendar" ? "bg-gradient-to-br from-brand_gradient1_blue to-brand_gradient2_blue text-white" : ""}`}
            >
              <div className="flex w-full items-center justify-between px-2">
                <div className="flex items-center justify-start gap-2.5 text-subheadline">
                  <CalendarIcon size={16} />
                  <h3 className="text-sm font-medium">Calendar</h3>
                </div>
                <ChevronRight size={16} />
              </div>
            </div>
          </Link>
          <div className="mt-2 flex w-full items-center justify-start gap-2.5 px-2.5">
            <Ellipsis size={12} className="stroke-brand_light_grey" />
            <h1 className="text-xs font-medium">Data</h1>
          </div>
          <Link href="/industries">
            <div
              className={`flex min-h-4 items-center justify-between rounded-xl px-2.5 py-2 hover:text-brand_word_mark_purple ${selectedItem === "/industries" ? "bg-gradient-to-br from-brand_gradient1_blue to-brand_gradient2_blue text-white" : ""}`}
            >
              <div className="flex w-full items-center justify-between px-2">
                <div className="flex items-center justify-start gap-2.5 text-subheadline">
                  <Building2 size={16} />
                  <h3 className="text-sm font-medium">Industries</h3>
                </div>
                <ChevronRight size={16} />
              </div>
            </div>
          </Link>
          <Link href="/assets">
            <div
              className={`flex min-h-4 items-center justify-between rounded-xl px-2.5 py-2 hover:text-brand_word_mark_purple ${selectedItem === "/assets" ? "bg-gradient-to-br from-brand_gradient1_blue to-brand_gradient2_blue text-white" : ""}`}
            >
              <div className="flex w-full items-center justify-between px-2">
                <div className="flex items-center justify-start gap-2.5 text-subheadline">
                  <Folder size={16} />
                  <h3 className="text-sm font-medium">Assets</h3>
                </div>
                <ChevronRight size={16} />
              </div>
            </div>
          </Link>

          <div className="flex w-full items-center justify-start gap-2.5 pl-2.5">
            <Ellipsis size={12} className="stroke-brand_light_grey" />
            <h1 className="text-xs font-medium">Product Data</h1>
          </div>
          <Link href="/chat">
            <div
              className={`flex min-h-4 items-center justify-between rounded-lg px-2.5 py-2 hover:text-brand_word_mark_purple ${selectedItem === "/posts" ? "bg-gradient-to-br from-brand_gradient1_blue to-brand_gradient2_blue text-white" : ""}`}
            >
              <div className="flex w-full items-center justify-between px-2">
                <div className="flex items-center justify-start gap-2.5 text-subheadline">
                  <MessageSquare size={16} />
                  <h3 className="text-sm font-medium">Chat</h3>
                </div>
                <ChevronRight size={16} />
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
