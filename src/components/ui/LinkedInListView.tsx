"use client";
import LinkedInPost from "./LinkedInPost";
import { useState } from "react";
import type { post } from "@prisma/client";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function LinkedInListView({
  scheduledPostsForThisWeek,
}: {
  scheduledPostsForThisWeek: post[];
}) {
  const [mondayOpen, setMondayOpen] = useState(false);
  const [tuesdayOpen, setTuesdayOpen] = useState(false);
  const [wednesdayOpen, setWednesdayOpen] = useState(false);
  const [thursdayOpen, setThursdayOpen] = useState(false);
  const [fridayOpen, setFridayOpen] = useState(false);

  return (
    <>
      <div className="border-1 flex max-h-screen w-full flex-1 flex-col items-center justify-start gap-4 overflow-x-scroll rounded-lg border bg-white py-4">
        <h1 className="text-lg font-medium text-black">
          Posts This Week
          <span className="pl-2.5 text-sm font-semibold text-black/50">
            LinkedIn
          </span>
        </h1>
        {/* <CalendarTest events={scheduledPostsForThisWeek} /> */}
        {/* {scheduledPostsForThisWeek.length > 0 ? (
          scheduledPostsForThisWeek.map((post) => (
            <LinkedInPost post={post} key={post.id}/>
          ))
          ) : (
          <p className="text-black/50 font-semibold text-lg">No posts scheduled for this week</p>
          )}  */}
        <div
          className="bg-brand_periwinkle flex w-full justify-between px-4 py-2 hover:cursor-pointer"
          onClick={() => setMondayOpen(!mondayOpen)}
        >
          <h1 className="text-lg font-medium text-white">Monday</h1>
          {mondayOpen ? (
            <ChevronUp stroke="white" />
          ) : (
            <ChevronDown stroke="white" />
          )}
        </div>
        {mondayOpen && (
          scheduledPostsForThisWeek
            .filter((post) => post.schedule_date!.getDay() === 1)
            .map((post) => <LinkedInPost post={post} key={post.id} />)
        )}
        <div
          className="bg-brand_periwinkle flex w-full justify-between px-4 py-2 hover:cursor-pointer"
          onClick={() => setTuesdayOpen(!tuesdayOpen)}
        >
          <h1 className="text-lg font-medium text-white">Tuesday</h1>
          {tuesdayOpen ? (
            <ChevronUp stroke="white" />
          ) : (
            <ChevronDown stroke="white" />
          )}
        </div>
        {tuesdayOpen && (
          scheduledPostsForThisWeek
            .filter((post) => post.schedule_date!.getDay() === 2)
            .map((post) => <LinkedInPost post={post} key={post.id} />)
        ) }
        <div
          className="bg-brand_periwinkle flex w-full justify-between px-4 py-2 hover:cursor-pointer"
          onClick={() => setWednesdayOpen(!wednesdayOpen)}
        >
          <h1 className="text-lg font-medium text-white">Wednesday</h1>
          {wednesdayOpen ? (
            <ChevronUp stroke="white" />
          ) : (
            <ChevronDown stroke="white" />
          )}
        </div>
        {wednesdayOpen && (
          scheduledPostsForThisWeek
            .filter((post) => post.schedule_date!.getDay() === 3)
            .map((post) => <LinkedInPost post={post} key={post.id} />)
        ) }
        <div
          className="bg-brand_periwinkle flex w-full justify-between px-4 py-2 hover:cursor-pointer"
          onClick={() => setThursdayOpen(!thursdayOpen)}
        >
          <h1 className="text-lg font-medium text-white">Thursday</h1>
          {thursdayOpen ? (
            <ChevronUp stroke="white" />
          ) : (
            <ChevronDown stroke="white" />
          )}
        </div>
        {thursdayOpen && (
          scheduledPostsForThisWeek
            .filter((post) => post.schedule_date!.getDay() === 4)
            .map((post) => <LinkedInPost post={post} key={post.id} />)
        ) }
        <div
          className="bg-brand_periwinkle flex w-full justify-between px-4 py-2 hover:cursor-pointer"
          onClick={() => setFridayOpen(!fridayOpen)}
        >
          <h1 className="text-lg font-medium text-white">Friday</h1>
          {fridayOpen ? (
            <ChevronUp stroke="white" />
          ) : (
            <ChevronDown stroke="white" />
          )}
        </div>
        {fridayOpen && (
          scheduledPostsForThisWeek
            .filter((post) => post.schedule_date!.getDay() === 5)
            .map((post) => <LinkedInPost post={post} key={post.id} />)
        ) }
      </div>
    </>
  );
}
