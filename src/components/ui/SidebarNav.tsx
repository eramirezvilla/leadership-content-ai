"use client";
import Link from "next/link";
import { useUser, UserButton } from "@clerk/nextjs";
import { useState } from "react";

export default function SidebarNav() {
  const { user } = useUser();

  const [selectedItem, setSelectedItem] = useState("");

  const handleItemClick = (item: string) => {
    setSelectedItem(item);
  };

  return (
    <div className="sticky left-0 top-0 flex h-screen w-60 min-w-60 border-r">
      <div className="flex w-full flex-col pt-4">
        <div className="flex flex-col items-center justify-center gap-2 object-cover">
          <UserButton />
          <h1 className="text-md font-medium">Welcome, {user?.firstName} </h1>
        </div>
        <div className="flex w-full flex-col gap-2 pl-4 pr-2 pt-2">
          {/* <div className="flex w-full ">
            <h2 className="text-xs font-medium">Import</h2>
          </div> */}
          <Link href="/posts">
            <div 
            onClick={() => handleItemClick("Posts")}
            className={`flex min-h-4 w-full items-center justify-center gap-2.5 rounded-xl px-2.5 py-2 outline outline-1 outline-black hover:bg-black/15 ${selectedItem === "Posts" ? "bg-orange/50 hover:bg-orange/500" : ""}`}>
              {/* <FileText size={24} /> */}
              <h3 className="text-sm font-medium">Posts</h3>
            </div>
          </Link>
          <Link href="/themes">
            <div 
            onClick={() => handleItemClick("Themes")}
            className={`flex min-h-4 w-full items-center justify-center gap-2.5 rounded-xl px-2.5 py-2 outline outline-1 outline-black hover:bg-black/15 ${selectedItem === "Themes" ? "bg-orange/50 hover:bg-orange/500" : ""}`}>
              {/* <TextSearch size={24} /> */}
              <h3 className="text-sm font-medium">Themes</h3>
            </div>
          </Link>
          <Link href="/industries">
            <div 
            onClick={() => handleItemClick("Industries")}
            className={`flex min-h-4 w-full items-center justify-center gap-2.5 rounded-xl px-2.5 py-2 outline outline-1 outline-black hover:bg-black/15 ${selectedItem === "Industries" ? "bg-orange/50 hover:bg-orange/500" : ""}`}>
              {/* <TextSearch size={24} /> */}
              <h3 className="text-sm font-medium">Industries</h3>
            </div>
          </Link>
          <Link href="/assets">
            <div 
            onClick={() => handleItemClick("Assets")}
            className={`flex min-h-4 w-full items-center justify-center gap-2.5 rounded-xl px-2.5 py-2 outline outline-1 outline-black hover:bg-black/15 ${selectedItem === "Assets" ? "bg-orange/50 hover:bg-orange/500" : ""}`}>
              {/* <TextSearch size={24} /> */}
              <h3 className="text-sm font-medium">Assets</h3>
            </div>
          </Link>
        </div>
        <div className="my-1 flex h-px w-full bg-black/10" />
      </div>
    </div>
  );
}
