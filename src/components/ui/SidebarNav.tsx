"use client";
import Link from "next/link";
import { useUser, UserButton } from "@clerk/nextjs";
import { useState } from "react";
import {Building2, FilePen, Folder, ListChecks, ChevronRight, Ellipsis, CalendarIcon} from "lucide-react"
import Image from "next/image";
import logo from "public/new-capo-logo.svg";

export default function SidebarNav() {
  const { user } = useUser();

  const [selectedItem, setSelectedItem] = useState<string>("");

  const handleItemClick = (item: string) => {
    setSelectedItem(item);
    console.log("selectedItem: ", selectedItem)
  };

  return (
    <div className="sticky left-0 top-0 flex h-screen min-w-60 border-r bg-brand_background text-brand_white">
      <div className="flex w-full flex-col pt-4 px-4 gap-8 mt-4">
        <div className="flex flex-col items-center justify-center gap-2 object-cover">
        {/* <Image src={logo} alt="Capo logo" width={50} height={50} className="rounded-2xl bg-gradient-to-b from-brand_purple/50 to-brand_purple/50 via-brand_purple/80" /> */}
          <h1 className="text-md font-medium">Welcome, {user?.firstName} </h1>
        </div>
        <div className="flex w-full flex-col gap-4 px-2 pt-2">
          <div className="flex w-full justify-start items-center gap-2.5 pl-2.5">
            <Ellipsis size={12} />
            <h1 className="text-xs font-medium text-brand_white/75">Content</h1>
          </div>
          <Link href="/posts">
            <div 
            onClick={() => handleItemClick("Posts")}
            className={`flex min-h-4 items-center justify-between hover:text-white hover:bg-brand_primary rounded-xl pl-2.5 py-2 ${selectedItem === "Posts" ? "bg-orange/50 hover:bg-orange/500" : ""}`}>              
                <div className="flex items-center justify-start text-subheadline gap-2.5">
                  <FilePen size={24} />
                  <h3 className="text-sm font-medium">Posts</h3>
                </div>
                <ChevronRight size={24} />
            </div>
          </Link>
          <Link href="/themes">
            <div 
            onClick={() => handleItemClick("Themes")}
            className={`flex min-h-4 items-center justify-between hover:text-white hover:bg-brand_primary rounded-xl pl-2.5 py-2 ${selectedItem === "Themes" ? "bg-orange/50 hover:bg-orange/500" : ""}`}>
              <div className="flex items-center justify-start text-subheadline gap-2.5">
                <ListChecks size={24} />
                <h3 className="text-sm font-medium">Themes</h3>
              </div>
              <ChevronRight size={24} />
            </div>
          </Link>
          <Link href="/calendar">
            <div 
            onClick={() => handleItemClick("Calendar")}
            className={`flex min-h-4 items-center justify-between hover:text-white hover:bg-brand_primary rounded-xl pl-2.5 py-2 ${selectedItem === "Calendar" ? "bg-orange/50 hover:bg-orange/500" : ""}`}>
              <div className="flex items-center justify-start text-subheadline gap-2.5">
                <CalendarIcon size={24} />
                <h3 className="text-sm font-medium">Calendar</h3>
              </div>
              <ChevronRight size={24} />
            </div>
          </Link>
          <div className="flex w-full justify-start items-center mt-2 gap-2.5 pl-2.5">
            <Ellipsis size={12} />
            <h1 className="text-xs font-medium text-brand_white/75">Data</h1>
          </div>
          <Link href="/industries">
            <div 
            onClick={() => handleItemClick("Industries")}
            className={`flex min-h-4 items-center justify-between hover:text-white hover:bg-brand_primary rounded-xl pl-2.5 py-2 ${selectedItem === "Industries" ? "bg-orange/50 hover:bg-orange/500" : ""}`}>
              <div className="flex items-center justify-start text-subheadline gap-2.5">
                <Building2 size={24} />
                <h3 className="text-sm font-medium">Industries</h3>
              </div>
              <ChevronRight size={24} />
            </div>
          </Link>
          <Link href="/assets">
            <div 
            onClick={() => handleItemClick("Assets")}
            className={`flex min-h-4 items-center justify-between hover:text-white hover:bg-brand_primary rounded-xl pl-2.5 py-2 ${selectedItem === "Assets" ? "bg-orange/50 hover:bg-orange/500" : ""}`}>
              <div className="flex items-center justify-start text-subheadline gap-2.5">
                <Folder size={24} />
                <h3 className="text-sm font-medium">Assets</h3>
              </div>
              <ChevronRight size={24} />
            </div>
          </Link>
        </div>
        {/* <div className="my-1 flex h-px w-full bg-black/10" /> */}
      </div>
    </div>
  );
}
