import prisma from "~/lib/server/prisma"
import { useState } from "react"
import { type themes } from "@prisma/client"
import ThemeTab from "~/components/ui/ThemeTab"

export default async function ThemesPage() {
    const allThemes = await prisma.themes.findMany()

    return (
        <div className="flex flex-col w-full mt-8 gap-4">
            <div className="flex w-1/4 justify-center">
                <h1 className="text-title_2">Themes</h1>
            </div>
            <ThemeTab allThemes={allThemes} />
        </div>
    )
}