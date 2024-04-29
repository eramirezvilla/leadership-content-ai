"use client"
import { useState } from "react";
import { themes } from "@prisma/client";

export default function ThemeTab({ allThemes }: { allThemes: themes[] }) {
  const [selectedTheme, setSelectedTheme] = useState(null as themes | null);

  const handleThemeClick = (theme: themes) => {
    setSelectedTheme(theme);
  };

  return (
    <div className="flex w-full">
      <div className="flex w-1/4 flex-col">
        {allThemes.map((theme) => (
          <div
            key={theme.id}
            onClick={() => handleThemeClick(theme)}
            className={`border-1 flex justify-between rounded-md border px-8 py-4 ${selectedTheme === theme ? "bg-orange-500/50 hover:bg-orange-500/15" : ""} hover:cursor-pointer hover:bg-black/15`}
          >
            <p className="w-prose">{theme.title}</p>
          </div>
        ))}
      </div>
        <div className="flex w-3/4 flex-col p-4">
            {selectedTheme && (
            <div className="flex flex-col items-center justify-center px-8 gap-4">
                <h1 className="text-title_1 pb-4">{selectedTheme.title}</h1>
                <div className="flex flex-col w-full justify-start gap-2 border border-1 rounded-md px-6 py-4">
                    <h2 className="text-title_3">Description</h2>
                    <p>{selectedTheme.description}</p>
                </div>
                <div className="flex flex-col w-full justify-start gap-2 border border-1 rounded-md px-6 py-4">
                    <h2 className="text-title_3">Connection to the audience</h2>
                    <p>{selectedTheme.audience_connection}</p>
                </div>
                <div className="flex flex-col w-full justify-start gap-2 border border-1 rounded-md px-6 py-4">
                    <h2 className="text-title_3">Connection to our company</h2>
                    <p>{selectedTheme.company_connection}</p>
                </div>
            </div>
            )}
            </div>
    </div>
  );
}
