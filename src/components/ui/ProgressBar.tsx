

export default function ProgressBar({ percentage } : { percentage: number }){

    return (
        <div className="h-1 bg-gray-200 rounded-full">
            <div className="h-1 bg-gradient-to-r from-brand_gradient2_purple to-brand_gradient2_blue rounded-full" style={{ width: `${percentage}%` }}></div>
          </div>
    )
}