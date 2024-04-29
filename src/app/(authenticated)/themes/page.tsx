import prisma from "~/lib/server/prisma"
import { useState } from "react"
import { type themes } from "@prisma/client"
import ThemeTab from "~/components/ui/ThemeTab"

export default async function ThemesPage() {
    const allThemes = await prisma.themes.findMany()

    return (
        <div className="flex w-full">
            <ThemeTab allThemes={allThemes} />
        </div>
    )
}