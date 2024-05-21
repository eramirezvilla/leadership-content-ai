
interface SnapshotWidgetProps {
    title: string;
    value: number;
    whole: number;
    frequency: string;
    }

export default function SnapshotWidget({ title, value, whole, frequency }: SnapshotWidgetProps) {
    const percentage = (value / whole) * 100;
  return (
    <div className="md:col-6 xl:col-3 mb-4">
      <div className="relative bg-white shadow rounded-lg overflow-hidden">
        <div className="p-4">
          <div className="mb-4 flex justify-between items-center">
            <h5 className="text-lg font-semibold">{title}</h5>
            <span className="bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded">
              {frequency}
            </span>
          </div>
          <div className="flex items-center mb-4">
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{whole}</h2>
            </div>
            <div className="text-right">
              <span className="text-gray-500">
                {percentage}% Complete <i className="mdi mdi-arrow-down text-red-500"></i>
              </span>
            </div>
          </div>
          <div className="h-1 bg-gray-200 rounded-full">
            <div className="h-1 bg-red-500 rounded-full" style={{ width: `${percentage}%` }}></div>
          </div>
        </div>
        <div className="absolute inset-0 bg-gray-200 opacity-80 cursor-progress hidden">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-dark h-8 w-8 animate-spin rounded-md"></div>
        </div>
      </div>
    </div>
  );
};

