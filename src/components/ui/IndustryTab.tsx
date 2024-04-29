"use client";
import { type industry_challenge_mapping } from "@prisma/client";
import { ChevronRightIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import EditIndustryDialog from "~/components/ui/EditIndustryDialog";

// eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
type IndustryMap = {
  [key: string]: Omit<industry_challenge_mapping, "industry_name">[];
};

export default function IndustryTab({
  allIndustries,
}: {
    allIndustries: industry_challenge_mapping[];
}) {
    const industryMap = allIndustries.reduce<IndustryMap>((acc, industry) => {
        const { industry_name, ...otherValues } = industry;
        if (industry_name === null) return acc; // Skip if industry_name is null
    
        if (!acc[industry_name]) {
            acc[industry_name] = [];
        }
        acc[industry_name]!.push(otherValues);
        return acc;
    }, {});

  const [selectedIndustry, setSelectedIndustry] = useState(
    null as string | null,
  );
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [challenge, setChallenge] = useState(null as industry_challenge_mapping | null);

  const handleIndustryClick = (industryName: string) => {
    setSelectedIndustry(industryName);
  };

  const handleChallengeClick = (challenge: industry_challenge_mapping) => {
    setShowEditDialog(true);
    setChallenge(challenge);
  }

  return (
    <>
    <div className="flex w-full pl-2">
      <div className="flex w-1/4 flex-col gap-2">
        {Object.keys(industryMap).map((industryName) => (
          <div
            key={industryName}
            onClick={() => handleIndustryClick(industryName)}
            className={`border-1 flex justify-between rounded-md border px-8 py-4 hover:cursor-pointer hover:bg-black/15 ${selectedIndustry === industryName ? "bg-orange-500/50 hover:bg-orange-500/15" : ""}`}
          >
            <p className="w-prose">{industryName}</p>
            <div className="flex items-center justify-end">
              <ChevronRightIcon />
            </div>
          </div>
        ))}
      </div>
      <div className="flex w-3/4 flex-col p-4">
        {selectedIndustry && (
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-title_1 pb-4">{selectedIndustry}</h1>
            <div className="flex flex-col gap-4">
              {industryMap[selectedIndustry]!.map((challenge, index) => (
                <div key={index}
                // onClick={() => handleChallengeClick(allIndustries.find((industry) => industry.id === challenge.id)!)}
                className="flex flex-col items-start gap-1 border border-1 rounded-md px-4 py-2 max-w-prose">
                  <h2 className="text-title_2" >{challenge.discussion_topic}</h2>
                  <p className="text-body max-w-prose">{challenge.topic_description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
         <EditIndustryDialog
         open={showEditDialog}
         setOpen={setShowEditDialog}
         industryToEdit={challenge ?? undefined}
     ></EditIndustryDialog>
</>
  );
}
