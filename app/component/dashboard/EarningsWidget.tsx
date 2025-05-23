import { ArrowUp } from "lucide-react"

interface EarningsWidgetProps {
  darkMode: boolean
}

const EarningsWidget = ({ darkMode }: EarningsWidgetProps) => {
  return (
    <div className={`${darkMode ? "bg-[#1e4d36]/80" : "bg-white"} rounded-lg p-4`}>
      <div className="flex justify-between items-center">
        <h3 className={`text-lg font-medium ${darkMode ? "text-white" : "text-[#1e4d36]"}`}>Earnings</h3>
      </div>
      <div className={`text-2xl font-bold ${darkMode ? "text-white" : "text-[#1e4d36]"}`}>$678,298</div>
      <div className="flex items-center gap-1 text-xs text-green-500">
        <ArrowUp className="h-3 w-3" />
        <span>+9% Growth</span>
      </div>
      <div className="flex items-end justify-between h-[80px] mt-2">
        {[40, 60, 50, 70, 65, 75, 70, 80, 75, 85, 90, 85].map((height, i) => (
          <div
            key={i}
            className="w-[5px] bg-green-500 rounded-full bar-chart-bar"
            style={{
              height: `${height}%`,
            }}
          ></div>
        ))}
      </div>
    </div>
  )
}

export default EarningsWidget 