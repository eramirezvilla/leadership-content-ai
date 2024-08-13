
interface ProductQueryResultProps {
    sku: string;
    part_number: string;
    description: string;
    isMainProduct?: boolean;
}

export default function ProductQueryResult({sku, part_number, description, isMainProduct}: ProductQueryResultProps) {

    return (
        <div className={`flex flex-col w-full items-start border px-4 py-2 gap-2.5 rounded-md shadow-sm ${isMainProduct ? "bg-black/5" : ""}`}>
            <div className="flex w-full">
                <p><span className="font-semibold">SKU:</span> {sku}</p>
            </div>
            <div className="flex w-full">
                <p><span className="font-semibold">Part Number:</span> {part_number}</p>
            </div>
            <div className="flex w-full">
                <p><span className="font-semibold">Description:</span> {description}</p>
            </div>
        </div>
    )
}