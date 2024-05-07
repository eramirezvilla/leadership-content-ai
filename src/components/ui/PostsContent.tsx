"use client"
import { type post} from '@prisma/client'
import GridPost from './GridPost'
import { LayoutGrid, MenuIcon } from "lucide-react"
import { useState } from 'react'

export default function PostsContent({ allPosts }: { allPosts: post[] }){
    const [layoutView, setLayoutView] = useState('grid')

    return(
        <>
        <div className="flex gap-2.5">
            <LayoutGrid size={20} className="hover:stroke-brand_purple hover:cursor-pointer" onClick={() => setLayoutView('grid')}/>
            <MenuIcon size={20} className="hover:stroke-brand_purple hover:cursor-pointer" onClick={() => setLayoutView('list')}/>
          </div>
        {layoutView === 'grid' ? (
            
        <div className="flex w-full flex-wrap gap-4 px-4">
        {allPosts.length > 0 ? (
          allPosts.map((post) => (
            <GridPost post={post} key={post.id} />
          ))
        ) : (
          <p>No posts found</p>
        )}
      </div>
        ) : (
            <div className="flex w-full flex-col gap-4 px-4">
        <p>list view</p>
        </div>
            )}
        </>

    )
}