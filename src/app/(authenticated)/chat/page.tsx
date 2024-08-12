"use client"
import { Input } from "~/components/ui/input"
import { Button } from "~/components/ui/button"
import { SetStateAction, useState } from "react"

export default function ChatPage(){
    const [skuSearch, setSkuSearch] = useState("")
    const [partNumberSearch, setPartNumberSearch] = useState("")

    const handleSkuSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSkuSearch(e.target.value)
        setPartNumberSearch("")
    }

    const handlePartNumberSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPartNumberSearch(e.target.value)
        setSkuSearch("")
    }

    return (
        <div className="flex w-full h-full">
            <div className="flex w-1/4 h-full">
                <div className="flex flex-col h-full w-full gap-8 px-2">
                    <div className="flex w-full">
                        <h1>Find Similar Items By:</h1>
                    </div>
                    <div className="flex flex-col w-full items-center gap-4">
                        <div className="flex w-full">
                            <Input placeholder="SKU" value={skuSearch} onChange={handleSkuSearch}/>
                        </div>
                        <div className="flex w-full justify-center">
                            <p className="text-sm font-bold">OR</p>
                        </div>
                        <div className="flex w-full">
                            <Input placeholder="Part Number" value={partNumberSearch} onChange={handlePartNumberSearch}/>
                        </div>
                    </div>
                    <Button variant="outline">Search</Button>
                </div>
            </div>
            <div className="flex w-3/4 h-full">
                <div className="flex w-full h-1/4">
                    <h1>Chat</h1>
                </div>
                <div className="flex w-full h-3/4">
                    <Input placeholder="Search for a user"/>
                </div>
            </div>
        </div>
    )
}