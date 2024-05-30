import { UserButton } from '@clerk/nextjs'

export default function Header(){

    return (
        <>
        <div className="flex w-full justify-end px-12 py-6 gap-2.5 items-center">
            <UserButton showName={true}/>
        </div>
        <div className="border-b border-gray-200"></div>
        </>
    )
}