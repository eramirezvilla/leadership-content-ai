"use client"
import { useState } from "react"
import type { post } from "@prisma/client"

interface CalendarPostProps {
    post: post
}

export default function CalendarPost({ post }: CalendarPostProps) {

    const { title, schedule_date } = post

    return (
        <div className="flex flex-col ">
            <h1 className="text-sm text-brand_background">{title}</h1>
            <p className="text-xs text-brand_background">{schedule_date?.toLocaleDateString("en-US")}</p>
        </div>
    )
}