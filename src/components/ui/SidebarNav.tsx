"use client";
import Link from "next/link";
import { useUser, UserButton } from "@clerk/nextjs";
import { useState } from "react";
import {Building2, FilePen, Folder, ListChecks} from "lucide-react"

export default function SidebarNav() {
  const { user } = useUser();

  const [selectedItem, setSelectedItem] = useState<string>("");

  const handleItemClick = (item: string) => {
    setSelectedItem(item);
  };

  return (
    <div className="sticky left-0 top-0 flex h-screen w-40 min-w-40 border-r">
      <div className="flex w-full flex-col pt-4 gap-8 mt-4">
        <div className="flex flex-col items-center justify-center gap-2 object-cover">
          <UserButton />
          <h1 className="text-md font-medium">Welcome, {user?.firstName} </h1>
        </div>
        <div className="flex w-full flex-col gap-4 px-2 pt-2">
          <Link href="/posts">
            <div 
            onClick={() => handleItemClick("Posts")}
            className={`flex flex-col min-h-4 items-center justify-center gap-2.5 rounded-xl px-2.5 py-2 outline outline-1 outline-black hover:bg-black/15 ${selectedItem === "Posts" ? "bg-orange/50 hover:bg-orange/500" : ""}`}>
              <FilePen size={24} />
              <h3 className="text-sm font-medium">Posts</h3>
            </div>
          </Link>
          <Link href="/themes">
            <div 
            onClick={() => handleItemClick("Themes")}
            className={`flex flex-col min-h-4 w-full items-center justify-center gap-2.5 rounded-xl px-2.5 py-2 outline outline-1 outline-black hover:bg-black/15 ${selectedItem === "Themes" ? "bg-orange/50 hover:bg-orange/500" : ""}`}>
              <ListChecks size={24} />
              <h3 className="text-sm font-medium">Themes</h3>
            </div>
          </Link>
          <Link href="/industries">
            <div 
            onClick={() => handleItemClick("Industries")}
            className={`flex flex-col min-h-4 w-full items-center justify-center gap-2.5 rounded-xl px-2.5 py-2 outline outline-1 outline-black hover:bg-black/15 ${selectedItem === "Industries" ? "bg-orange/50 hover:bg-orange/500" : ""}`}>
              <Building2 size={24} />
              <h3 className="text-sm font-medium">Industries</h3>
            </div>
          </Link>
          <Link href="/assets">
            <div 
            onClick={() => handleItemClick("Assets")}
            className={`flex flex-col min-h-4 w-full items-center justify-center gap-2.5 rounded-xl px-2.5 py-2 outline outline-1 outline-black hover:bg-black/15 ${selectedItem === "Assets" ? "bg-orange/50 hover:bg-orange/500" : ""}`}>
              <Folder size={24} />
              <h3 className="text-sm font-medium">Assets</h3>
            </div>
          </Link>
        </div>
        {/* <div className="my-1 flex h-px w-full bg-black/10" /> */}
      </div>
    </div>
  );
}
