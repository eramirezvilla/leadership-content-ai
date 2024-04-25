"use client"
import {type industry_challenge_mapping as indMap} from "@prisma/client"
import { ChevronRightIcon } from '@radix-ui/react-icons'
import { useState } from 'react'

// eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
type IndustryMap = {
    [key: string]: Omit<indMap, 'industry_name'>[];
}

export default function IndustryTab({ industryMap }: { industryMap: IndustryMap }){
    const [selectedIndustry, setSelectedIndustry] = useState(null as string | null)

    const handleIndustryClick = (industryName: string) => {
        setSelectedIndustry(industryName)
    }

    return (
        <div className="flex w-full pl-2">
            <div className="flex flex-col w-1/4 gap-2">
                    {Object.keys(industryMap).map((industryName) => (
                        <div key={industryName} onClick={() => handleIndustryClick(industryName)} className="flex justify-between py-4 px-8 border border-1 rounded-md hover:bg-black/15 hover:cursor-pointer">
                            <p className='w-prose'>{industryName}</p>
                            <div className="flex justify-end items-center">
                                <ChevronRightIcon />
                            </div>
                        </div>
                    ))}
            </div>
            <div className="flex flex-col w-3/4 p-4">
                {selectedIndustry && (
                    <div className="flex flex-col items-center justify-center">
                        <h1>{selectedIndustry}</h1>
                        <ul>
                            {industryMap[selectedIndustry]!.map((challenge, index) => (
                                <li key={index}>{challenge.discussion_topic} - {challenge.topic_description}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    )
}