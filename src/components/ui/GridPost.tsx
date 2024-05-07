import { type post} from '@prisma/client'

export default function GridPost({ post }: { post: post }){
    const { title, content, created_at } = post;

    return (
        <>
        </>
    )
}