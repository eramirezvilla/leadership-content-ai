"use client"
import { useState } from "react"
import CalendarTest from "~/components/ui/FullCalendar";
import AddScheduler from "~/components/ui/AddScheduler";
import type {post, themes} from "@prisma/client"

interface CalendarContentProps {
    availableThemes: themes[];
    postsWithSchedule: post[];
    }

export default function CalendarContent({ availableThemes, postsWithSchedule } : CalendarContentProps){
    const [selectedThemes, setSelectedThemes] = useState<themes[]>(availableThemes)

    const filteredPosts = postsWithSchedule.filter((post) => {
        return selectedThemes.some((theme) => theme.title === post.created_from_theme);
      }
    );

    return (
        <div className="border-1 grid h-full w-full grid-cols-3 items-center justify-center rounded-lg border px-4 py-2">
        <div className="col-span-1 h-full px-6">
          <div className="flex h-full w-full flex-col justify-start gap-4 py-2 pl-2 pr-6">
            <AddScheduler availableThemes={availableThemes} />
            <div className="flex h-full w-full flex-col rounded-lg bg-white px-4 py-2">
              <h1 className="text-sm">Themes</h1>
              {availableThemes.map((theme) => (
                <div
                  key={theme.id}
                  className={`flex w-full flex-row items-center hover:bg-red-500 justify-between py-2 ${selectedThemes.includes(theme) ? 'bg-blue-200' : ''}`}
                  onClick={() => {
                    if (selectedThemes.includes(theme)) {
                      setSelectedThemes(selectedThemes.filter((t) => t !== theme));
                    } else {
                      setSelectedThemes([...selectedThemes, theme]);
                    }
                  }
                  }
                >
                  <p className="text-sm">{theme.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="col-span-2 w-full">
          <CalendarTest events={filteredPosts} view="dayGridMonth" />
        </div>
      </div>
    )
}