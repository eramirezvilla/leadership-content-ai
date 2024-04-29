import { type post } from "@prisma/client"

export default function ExistingPostTab(allPosts: post[]) {
    return (
        <div>
            <h1>Posts</h1>
            {allPosts.map((post) => (
                <div key={post.id}>
                    <h2>{post.title}</h2>
                    <p>{post.content}</p>
                </div>
            ))}
        </div>
    )
}