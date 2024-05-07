"use client"
import { type post} from '@prisma/client'
import GridPost from './GridPost'
import { LayoutGrid, MenuIcon } from "lucide-react"
import { useState } from 'react'
import { type ColumnDef } from '@tanstack/react-table'
import { DataTable } from './DataTable'

const columns: ColumnDef<post>[] = [
    {
        header: 'Title',
        accessorKey: 'title',
    },
    {
        header: 'Content',
        accessorKey: 'content',
    },
    {
        header: 'Created At',
        accessorKey: 'created_at',
        cell: ({row}) => {
            const date = row.getValue('created_at')
            if (date instanceof Date){
                const formattedDate = date.toLocaleDateString('en-US')
                return <p className="text-sm">{formattedDate}</p>
            }
        }
    },
]

export default function PostsContent({ allPosts }: { allPosts: post[] }){
    const [layoutView, setLayoutView] = useState('grid')

    return(
        <>
        <div className="flex gap-2.5 pl-8">
            <LayoutGrid size={20} className={`hover:stroke-brand_purple hover:cursor-pointer ${layoutView === 'grid' ? 'stroke-brand_purple' : ''}`} onClick={() => setLayoutView('grid')}/>
            <MenuIcon size={20} className={`hover:stroke-brand_purple hover:cursor-pointer ${layoutView === 'list' ? 'stroke-brand_purple' : ''}`} onClick={() => setLayoutView('list')}/>
          </div>
        {layoutView === 'grid' ? (
            
        <div className="flex w-full flex-wrap gap-4 px-8">
        {allPosts.length > 0 ? (
          allPosts.map((post) => (
            <GridPost post={post} key={post.id} />
          ))
        ) : (
          <p>No posts found</p>
        )}
      </div>
        ) : (
            // list view
            <div className="flex px-8">
                <DataTable columns={columns} data={allPosts} />
            </div>
            )}
        </>

    )
}