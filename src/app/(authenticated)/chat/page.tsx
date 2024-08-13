"use client";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { useState } from "react";
import { type GetRelevantProducts } from "~/lib/validation/ProductQuery";
import ProductQueryResult from "~/components/ui/ProductQueryResult";

export default function ChatPage() {
  const [skuSearch, setSkuSearch] = useState("");
  const [partNumberSearch, setPartNumberSearch] = useState("");
  const [chatQuery, setChatQuery] = useState("");
  const [productData, setProductData] = useState<GetRelevantProducts[] | null>(
    null,
  );
  const [noValEntered, setNoValEntered] = useState(false);
  const [queryProduct, setQueryProduct] = useState<GetRelevantProducts | null>(
    null,
  );
  const [isChatQuery, setIsChatQuery] = useState(false);
  const [submittedQuery, setSubmittedQuery] = useState("");

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
      setNoValEntered(true);
      return;
    }
    let searchType;
    if (skuSearch) {
      setIsChatQuery(false);
      setSubmittedQuery("");
      searchType = "sku";
    } else if (partNumberSearch) {
      setIsChatQuery(false);
      setSubmittedQuery("");
      searchType = "part_number";
    } else if (chatQuery) {
      setIsChatQuery(true);
      setSubmittedQuery(chatQuery);
      searchType = "chatQuery";
    }
    const response = await fetch(`/api/chat?${searchType}=${submittedValue}`);
    if (response.ok) {
      setNoValEntered(false);
      const data: GetRelevantProducts[] = await response.json();
      const similarProducts = data.map((item) => ({
        sku: item.sku,
        part_number: item.part_number,
        description: item.description,
      }));
      if (isChatQuery) {
        setProductData(similarProducts);
        return;
      }
      const queriedProduct = data[0];
      setQueryProduct(queriedProduct!);
      similarProducts.shift();
      setProductData(similarProducts);
    }
  };

  return (
    <div className="flex h-full w-full">
      <div className="flex h-full w-96 flex-col items-start gap-8 border-r px-8 pt-4">
        <div className="flex w-full">
          <h1>Find Similar Items By:</h1>
        </div>
        <div className="flex w-full flex-col items-center gap-4">
          <div className="flex w-full">
            <Input
              placeholder="SKU"
              value={skuSearch}
              onChange={handleSkuSearch}
              className={noValEntered ? "border-red-500" : ""}
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
              className={noValEntered ? "border-red-500" : ""}
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
              className={`h-24 ${noValEntered ? "border-red-500" : ""}`}
            />
          </div>
        </div>
        <div className="flex w-full justify-end">
          <Button variant="outline" onClick={handleSearch} className="w-36">
            Search
          </Button>
        </div>
      </div>
      <div className="mb-8 flex h-full max-h-screen w-full overflow-y-scroll">
        <div className="flex w-full flex-col gap-5 px-8 pt-4">
          {queryProduct && !isChatQuery && (
            <div className="flex w-full flex-col gap-2.5">
              <div className="flex pr-8">
                <h1>Query</h1>
              </div>
              <ProductQueryResult
                sku={queryProduct.sku}
                part_number={queryProduct.part_number}
                description={queryProduct.description}
                isMainProduct={true}
              />
            </div>
          )}
          {isChatQuery && submittedQuery && (
            <div className="flex w-full flex-col gap-2.5">
              <div className="flex pr-8">
                <h1>Query</h1>
              </div>
              <div className="flex w-full rounded-lg border bg-black/5 px-4 py-2 shadow-sm">
                <p className="max-w-prose text-sm">{submittedQuery}</p>
              </div>
            </div>
          )}

          {productData && (
            <div className="flex w-full flex-col gap-2.5">
              <div className="flex pr-8">
                <h1>Results</h1>
              </div>
              {productData.map((product) => (
                <div
                  className="flex h-full w-full flex-col gap-4"
                  key={product.sku}
                >
                  <ProductQueryResult
                    sku={product.sku}
                    part_number={product.part_number}
                    description={product.description}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
