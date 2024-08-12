"use client";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { SetStateAction, useState } from "react";
import { type GetRelevantProducts } from "~/lib/validation/ProductQuery";

export default function ChatPage() {
  const [skuSearch, setSkuSearch] = useState("");
  const [partNumberSearch, setPartNumberSearch] = useState("");
  const [chatQuery, setChatQuery] = useState("");
  const [productData, setProductData] = useState<GetRelevantProducts[] | null>(
    null,
  );

  const handleSkuSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSkuSearch(e.target.value);
    setPartNumberSearch("");
    setChatQuery("");
  };

  const handlePartNumberSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPartNumberSearch(e.target.value);
    setSkuSearch("");
    setChatQuery("");
  };

  const handleChatQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChatQuery(e.target.value);
    setSkuSearch("");
    setPartNumberSearch("");
  };

  const handleSearch = async () => {
    const submittedValue = skuSearch || partNumberSearch || chatQuery;
    if (!submittedValue) {
      console.log("Please enter a value");
      return;
    }
    let searchType;
    if (skuSearch) {
      searchType = "sku";
    } else if (partNumberSearch) {
      searchType = "part_number";
    } else if (chatQuery) {
      searchType = "chatQuery";
    }
    const response = await fetch(`/api/chat?${searchType}=${submittedValue}`);
    if (response.ok) {
      const data: GetRelevantProducts[] = await response.json();
      setProductData(data);
    }
  };

  return (
    <div className="flex h-full w-full">
      <div className="flex h-full w-1/4">
        <div className="flex h-full w-full flex-col gap-8 px-2">
          <div className="flex w-full">
            <h1>Find Similar Items By:</h1>
          </div>
          <div className="flex w-full flex-col items-center gap-4">
            <div className="flex w-full">
              <Input
                placeholder="SKU"
                value={skuSearch}
                onChange={handleSkuSearch}
              />
            </div>
            <div className="flex w-full justify-center">
              <p className="text-sm font-bold">OR</p>
            </div>
            <div className="flex w-full">
              <Input
                placeholder="Part Number"
                value={partNumberSearch}
                onChange={handlePartNumberSearch}
              />
            </div>
            <div className="flex w-full justify-center">
              <p className="text-sm font-bold">OR</p>
            </div>
            <div className="flex w-full">
              <Input
                placeholder="Search by text"
                value={chatQuery}
                onChange={handleChatQuery}
                className="h-24 text-center"
              />
            </div>
          </div>
          <Button variant="outline" onClick={handleSearch}>
            Search
          </Button>
        </div>
      </div>
      <div className="flex h-full w-3/4">
        <div className="flex w-full">
          <h1>Results</h1>
          {productData && (
            <div className="flex w-full flex-col gap-4">
              {productData.map((product) => (
                <div className="flex w-full" key={product.sku}>
                  <p>{product.sku}</p>
                  <p>{product.part_number}</p>
                  <p>{product.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
