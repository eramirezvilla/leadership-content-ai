import { type post} from '@prisma/client'
import { Clock } from "lucide-react"

export default function GridPost({ post }: { post: post }){
    const { title, content, created_at } = post;

    return (
        <div className="flex flex-col items-start w-72 max-h-52 border gap-2 border-black rounded-lg px-4 py-2">
            <div className="flex gap-2.5 items-center justify-center">
                <Clock size={16} />
                <p className='text-sm font-medium text-black/50'>{created_at.toLocaleDateString("en-US")}</p>
            </div>
            <h1 className='text-sm font-semibold'>{title}</h1>
            <p className='text-xs font-normal text-black/50 whitespace-break-spaces overflow-scroll'>{content}</p>
        </div>
    )
}