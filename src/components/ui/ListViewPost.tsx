"use client";
import { type post } from "@prisma/client";
import { useState } from "react";
import PostModal from "./PostModal";
import { Clock } from "lucide-react"

interface ListViewPostProps {
    post: post;
    images: string[];
}

export default function ListViewPost({ post, images }: ListViewPostProps){
    const { title, content, created_from_theme, approved, schedule_date } = post;
    const [showEditModal, setShowEditModal] = useState(false);


    return (
        <>
        <div className="flex w-full max-h-40 gap-2.5 items-start justify-start px-4 border border-1 rounded-lg shadow-md py-2 hover:cursor-pointer hover:bg-brand_periwinkle/5"
        onClick={() => setShowEditModal(true)}
        >
            <div className="flex flex-col items-center justify-start pt-1 h-full">
                <div className="flex gap-2.5 items-center">
                    <Clock size={16} />
                    <p className="text-sm font-medium text-black/50">
                        {schedule_date?.toLocaleDateString("en-US")}
                    </p>
                </div>
                {approved === true ? (
                    <p className="text-sm font-medium text-green-500">Approved</p>
                ) : approved === false ? (
                    <p className="text-sm font-medium text-red-500">Rejected</p>
                ) : (
                    <p className="text-sm font-medium text-yellow-500">Pending</p>
                )}
            </div>
            <div className="flex flex-col w-full gap-2.5 justify-start">
                <div className="flex w-full gap-2.5 items-center">
                    <h1 className="text-base font-medium max-w-prose">{title}</h1>
                    <p className="text-sm font-semibold text-black/50">{created_from_theme}</p>
                </div>
                <p className="text-xs overflow-hidden max-h-16">{content}</p>
            </div>
        </div>
        <PostModal open={showEditModal} setOpen={setShowEditModal} postToEdit={post} images={images}></PostModal>
        </>
    )
}