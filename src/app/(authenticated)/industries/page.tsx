import prisma from '~/server/prisma'
import { type industry_challenge_mapping } from '@prisma/client';
import { ChevronRightIcon } from '@radix-ui/react-icons';
import { useState } from 'react';

// eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
type IndustryMap = {
    [key: string]: Omit<industry_challenge_mapping, 'industry_name'>[];
}

export default async function IndustriesPage() {
    const allIndustries = await prisma.industry_challenge_mapping.findMany()
    const industryMap = allIndustries.reduce<IndustryMap>((acc, industry) => {
        const { industry_name, ...otherValues } = industry;
        if (industry_name === null) return acc; // Skip if industry_name is null
    
        if (!acc[industry_name]) {
            acc[industry_name] = [];
        }
        acc[industry_name]!.push(otherValues);
        return acc;
    }, {});

    return (
        <div className="flex w-full pl-2">
            <div className="flex flex-col w-1/4 gap-2">
                    {Object.keys(industryMap).map((industryName) => (
                        <div key={industryName} className="flex justify-between py-4 px-8 border border-1 rounded-md hover:bg-black/15 hover:cursor-pointer">
                            <p className='w-prose'>{industryName}</p>
                            <div className="flex justify-end items-center">
                                <ChevronRightIcon />
                            </div>
                        </div>
                    ))}
            </div>
            <div className="flex w-3/4">
                {Object.entries(industryMap).map(([industryName, challenges]) => (
                    <div key={industryName} className="flex flex-col items-center justify-center">
                        <h1>{industryName}</h1>
                        <ul>
                            {challenges.map((challenge) => (
                                <>
                                <li key={challenge.discussion_topic}>{challenge.discussion_topic}</li>
                                <li key={challenge.topic_description}>{challenge.topic_description}</li>
                                </>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
        // <div className="flex flex-col w-full items-center justify-center">
        //     {Object.entries(industryMap).map(([industryName, challenges]) => (
        //         <div key={industryName} className="flex flex-col items-center justify-center">
        //             <h1>{industryName}</h1>
        //             <ul>
        //                 {challenges.map((challenge) => (
        //                     <>
        //                     <li key={challenge.discussion_topic}>{challenge.discussion_topic}</li>
        //                     <li key={challenge.topic_description}>{challenge.topic_description}</li>
        //                     </>
        //                 ))}
        //             </ul>
        //             </div>
        //     ))}
        // </div>
    )
}