"use client";
import Link from "next/link";
import { useUser, UserButton } from "@clerk/nextjs";
import { useState } from "react";
import {Building2, FilePen, Folder, ListChecks, ChevronRight, Ellipsis, CalendarIcon, Home} from "lucide-react"
import Image from "next/image";
import logo from "public/Levata_Icon_RGB.svg";

export default function SidebarNav() {
  const { user } = useUser();

  const [selectedItem, setSelectedItem] = useState<string>("Dashboard");

  const handleItemClick = (item: string) => {
    setSelectedItem(item);
    console.log("selectedItem: ", item)
  };

  return (
    <div className="sticky left-0 top-0 flex h-screen min-w-60 border-r bg-gradient-to-b from-brand_gradient2_purple to-brand_gradient2_blue text-white">
      <div className="flex w-full flex-col pt-4 gap-8 mt-4">
        <div className="flex items-end justify-center gap-2 object-cover">
        <Image src={logo} alt="Capo logo" width={24} height={24}/>
        <h1 className="text-lg font-medium">Amplify</h1>
          {/* <h1 className="text-md font-medium text-brand_white">Welcome, {user?.firstName} </h1> */}
        </div>
        <div className="flex w-full flex-col gap-4 pt-2">
        <div className="flex w-full justify-start items-center gap-2.5 pl-2.5">
            <Ellipsis size={12} className="stroke-brand_light_grey"/>
            <h1 className="text-xs font-medium">Home</h1>
          </div>
          <Link href="/dashboard">
            <div 
            onClick={() => handleItemClick("Dashboard")}
            className={`flex min-h-4 items-center justify-between hover:text-brand_word_mark_purple rounded-lg px-2.5 py-2 ${selectedItem === "Dashboard" ? "bg-gradient-to-br from-brand_gradient1_blue to-brand_gradient2_blue text-white" : ""}`}>              
                <div className="flex w-full px-2 justify-between items-center">
                  <div className="flex items-center justify-start text-subheadline gap-2.5">
                    <Home size={16} />
                    <h3 className="text-sm font-medium">Dashboard</h3>
                  </div>
                  <ChevronRight size={16} />
                </div>
            </div>
          </Link>

          <div className="flex w-full justify-start items-center gap-2.5 pl-2.5">
            <Ellipsis size={12} className="stroke-brand_light_grey"/>
            <h1 className="text-xs font-medium">Content</h1>
          </div>
          <Link href="/posts">
            <div 
            onClick={() => handleItemClick("Posts")}
            className={`flex min-h-4 items-center justify-between hover:text-brand_word_mark_purple rounded-lg px-2.5 py-2 ${selectedItem === "Posts" ? "bg-gradient-to-br from-brand_gradient1_blue to-brand_gradient2_blue text-white" : ""}`}>              
                <div className="flex w-full px-2 justify-between items-center">
                  <div className="flex items-center justify-start text-subheadline gap-2.5">
                    <FilePen size={16} />
                    <h3 className="text-sm font-medium">Posts</h3>
                  </div>
                  <ChevronRight size={16} />
                </div>
            </div>
          </Link>
          <Link href="/themes">
            <div 
            onClick={() => handleItemClick("Themes")}
            className={`flex min-h-4 items-center justify-between hover:text-brand_word_mark_purple rounded-xl px-2.5 py-2 ${selectedItem === "Themes" ? "bg-gradient-to-br from-brand_gradient1_blue to-brand_gradient2_blue text-white" : ""}`}>
              <div className="flex w-full px-2 justify-between items-center">
                <div className="flex items-center justify-start text-subheadline gap-2.5">
                  <ListChecks size={16} />
                  <h3 className="text-sm font-medium">Themes</h3>
                </div>
                <ChevronRight size={16} />
              </div>
            </div>
          </Link>
          <Link href="/calendar">
            <div 
            onClick={() => handleItemClick("Calendar")}
            className={`flex min-h-4 items-center justify-between hover:text-brand_word_mark_purple rounded-xl px-2.5 py-2 ${selectedItem === "Calendar" ? "bg-gradient-to-br from-brand_gradient1_blue to-brand_gradient2_blue text-white" : ""}`}>
              <div className="flex w-full px-2 justify-between items-center">
                <div className="flex items-center justify-start text-subheadline gap-2.5">
                  <CalendarIcon size={16} />
                  <h3 className="text-sm font-medium">Calendar</h3>
                </div>
                <ChevronRight size={16} />
              </div>
            </div>
          </Link>
          <div className="flex w-full justify-start items-center mt-2 gap-2.5 px-2.5">
            <Ellipsis size={12} className="stroke-brand_light_grey"/>
            <h1 className="text-xs font-medium">Data</h1>
          </div>
          <Link href="/industries">
            <div 
            onClick={() => handleItemClick("Industries")}
            className={`flex min-h-4 items-center justify-between hover:text-brand_word_mark_purple rounded-xl px-2.5 py-2 ${selectedItem === "Industries" ? "bg-gradient-to-br from-brand_gradient1_blue to-brand_gradient2_blue text-white" : ""}`}>
              <div className="flex w-full px-2 justify-between items-center">
                <div className="flex items-center justify-start text-subheadline gap-2.5">
                  <Building2 size={16} />
                  <h3 className="text-sm font-medium">Industries</h3>
                </div>
                <ChevronRight size={16} />
              </div>
            </div>
          </Link>
          <Link href="/assets">
            <div 
            onClick={() => handleItemClick("Assets")}
            className={`flex min-h-4 items-center justify-between hover:text-brand_word_mark_purple rounded-xl px-2.5 py-2 ${selectedItem === "Assets" ? "bg-gradient-to-br from-brand_gradient1_blue to-brand_gradient2_blue text-white" : ""}`}>
              <div className="flex w-full px-2 justify-between items-center">
                <div className="flex items-center justify-start text-subheadline gap-2.5">
                  <Folder size={16} />
                  <h3 className="text-sm font-medium">Assets</h3>
                </div>
                <ChevronRight size={16} />
              </div>
            </div>
          </Link>
        </div>
        {/* <div className="my-1 flex h-px w-full bg-black/10" /> */}
      </div>
    </div>
  );
}
