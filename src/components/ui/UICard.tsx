
interface SnapshotWidgetProps {
    title: string;
    value: number;
    whole: number;
    frequency: string;
    }

export default function SnapshotWidget({ title, value, whole, frequency }: SnapshotWidgetProps) {
    let percentage = (value / whole) * 100;
    if (title === "Pending") {
      percentage = 100 - percentage;
    }
  return (
    <div className="md:col-6 xl:col-3 mb-4">
      <div className="relative bg-white shadow rounded-lg overflow-hidden border border-1">
        <div className="p-4">
          <div className="mb-4 flex justify-between items-center">
            <h5 className="text-md font-semibold min-w-52">{title}</h5>
            <p className="bg-brand_periwinkle text-white text-xs font-medium px-2 py-0.5 rounded min-w-12 text-center">
              {frequency}
            </p>
          </div>
          <div className="flex items-center mb-4">
            <div className="flex-1">
              <h2 className="text-3xl font-bold">{value} <span className="text-sm text-black/50 font-black">/ {whole}</span></h2>
            </div>
            <div className="text-right">
              <span className="text-gray-500 text-xs">
                {title === "Pending" ? "Remaining" : "Completed"}
              </span>
            </div>
          </div>
          <div className="h-1 bg-gray-200 rounded-full">
            <div className="h-1 bg-gradient-to-r from-brand_gradient2_purple to-brand_gradient2_blue rounded-full" style={{ width: `${percentage}%` }}></div>
          </div>
        </div>
        <div className="absolute inset-0 bg-gray-200 opacity-80 cursor-progress hidden">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-dark h-8 w-8 animate-spin rounded-md"></div>
        </div>
      </div>
    </div>
  );
};

