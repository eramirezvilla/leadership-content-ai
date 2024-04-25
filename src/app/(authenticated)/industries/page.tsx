import prisma from '~/server/prisma'
import { type industry_challenge_mapping } from '@prisma/client';
import { ChevronRightIcon } from '@radix-ui/react-icons';
import IndustryTab from '~/components/ui/IndustryTab';

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
        <div className="flex w-full pt-6">
            <IndustryTab industryMap={industryMap} />
        </div>
    )
}