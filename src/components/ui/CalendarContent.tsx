"use client";
import { useState } from "react";
import CalendarTest from "~/components/ui/FullCalendar";
import AddScheduler from "~/components/ui/AddScheduler";
import type { post, themes } from "@prisma/client";
import { Circle } from "lucide-react";

interface CalendarContentProps {
  availableThemes: themes[];
  postsWithSchedule: post[];
}

export default function CalendarContent({
  availableThemes,
  postsWithSchedule,
}: CalendarContentProps) {
  const [selectedThemes, setSelectedThemes] =
    useState<themes[]>(availableThemes);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([
    "Approved",
    "Pending",
    "Rejected",
  ]);

  const filteredPosts = postsWithSchedule.filter((post) => {
    const hasMatchingTheme = selectedThemes.some(theme => theme.title === post.created_from_theme || post.created_from_theme === null);
  const hasMatchingStatus = (
    (selectedStatus.includes("Approved") && post.approved === true) ||
    (selectedStatus.includes("Pending") && post.approved === null) ||
    (selectedStatus.includes("Rejected") && post.approved === false)
  );
  return hasMatchingTheme && hasMatchingStatus;
  });

  return (
    <div className="border-1 grid h-full w-full grid-cols-3 items-center justify-center rounded-lg border px-4 py-2">
      <div className="col-span-1 h-full px-6">
        <div className="flex h-full w-full flex-col justify-start gap-4 py-2 pl-2 pr-6">
          <AddScheduler availableThemes={availableThemes} />
          <div className="flex h-full w-full flex-col gap-2.5 rounded-lg px-4 py-2">
            <div className="border-1 flex w-full flex-col gap-2.5 rounded-lg border px-6 py-4">
              <h1 className="text-sm">Themes</h1>
              {availableThemes.map((theme) => (
                <div
                  key={theme.id}
                  className={`hover:bg-brand_light_grey border-1 hover:cursor-pointer border-brand_gradient1_blue flex w-full items-center justify-start gap-2.5 rounded-xl border px-4 py-2 ${selectedThemes.includes(theme) ? "text-brand_gradient1_purple" : ""}`}
                  onClick={() => {
                    if (selectedThemes.includes(theme)) {
                      setSelectedThemes(
                        selectedThemes.filter((t) => t !== theme),
                      );
                    } else {
                      setSelectedThemes([...selectedThemes, theme]);
                    }
                  }}
                >
                  <div className="flex min-w-10">
                    {selectedThemes.includes(theme) ? (
                      <Circle size={10} fill="#784DFF" stroke="#784DFF" />
                    ) : (
                      <Circle size={10} />
                    )}
                  </div>
                  <div className="flex">
                    <p className="text-sm">{theme.title}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-1 flex w-full flex-col gap-2.5 rounded-lg border px-6 py-4">
              <h1 className="text-sm">Status</h1>
              <div
                className={`hover:bg-brand_light_grey border-1 hover:cursor-pointer border-brand_gradient1_blue flex w-full items-center justify-start gap-2.5 rounded-xl border px-4 py-2 ${selectedStatus.includes("Approved") ? "text-brand_gradient1_purple" : ""}`}
                onClick={() => {
                  if (selectedStatus.includes("Approved")) {
                    setSelectedStatus(
                      selectedStatus.filter((t) => t !== "Approved"),
                    );
                  } else {
                    setSelectedStatus([...selectedStatus, "Approved"]);
                  }
                }}
              >
                <div className="flex min-w-10">
                  {selectedStatus.includes("Approved") ? (
                    <Circle size={10} fill="#784DFF" stroke="#784DFF" />
                  ) : (
                    <Circle size={10} />
                  )}
                </div>
                <div className="flex">
                  <p className="text-sm">Approved</p>
                </div>
              </div>
              <div
                className={`hover:bg-brand_light_grey border-1 hover:cursor-pointer border-brand_gradient1_blue flex w-full items-center justify-start gap-2.5 rounded-xl border px-4 py-2 ${selectedStatus.includes("Pending") ? "text-brand_gradient1_purple" : ""}`}
                onClick={() => {
                  if (selectedStatus.includes("Pending")) {
                    setSelectedStatus(
                      selectedStatus.filter((t) => t !== "Pending"),
                    );
                  } else {
                    setSelectedStatus([...selectedStatus, "Pending"]);
                  }
                }}
              >
                <div className="flex min-w-10">
                  {selectedStatus.includes("Pending") ? (
                    <Circle size={10} fill="#784DFF" stroke="#784DFF" />
                  ) : (
                    <Circle size={10} />
                  )}
                </div>
                <div className="flex">
                  <p className="text-sm">Pending</p>
                </div>
              </div>

              <div
                className={`hover:bg-brand_light_grey border-1 hover:cursor-pointer border-brand_gradient1_blue flex w-full items-center justify-start gap-2.5 rounded-xl border px-4 py-2 ${selectedStatus.includes("Rejected") ? "text-brand_gradient1_purple" : ""}`}
                onClick={() => {
                  if (selectedStatus.includes("Rejected")) {
                    setSelectedStatus(
                      selectedStatus.filter((t) => t !== "Rejected"),
                    );
                  } else {
                    setSelectedStatus([...selectedStatus, "Rejected"]);
                  }
                }}
              >
                <div className="flex min-w-10">
                  {selectedStatus.includes("Rejected") ? (
                    <Circle size={10} fill="#784DFF" stroke="#784DFF" />
                  ) : (
                    <Circle size={10} />
                  )}
                </div>
                <div className="flex">
                  <p className="text-sm">Rejected</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-span-2 w-full">
        <CalendarTest events={filteredPosts} view="dayGridMonth" />
      </div>
    </div>
  );
}
