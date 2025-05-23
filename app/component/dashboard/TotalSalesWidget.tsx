import { Bell } from "lucide-react"

interface TotalSalesWidgetProps {
  darkMode: boolean
}

const TotalSalesWidget = ({ darkMode }: TotalSalesWidgetProps) => {
  return (
    <div className="bg-[#1e4d36] text-white rounded-lg p-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Total Number of Sales</h3>
        <Bell className="h-5 w-5" />
      </div>
      <div className="text-2xl font-bold mt-1">592</div>
      <div className="h-2 w-full bg-white/20 rounded-full mt-2">
        <div className="h-2 w-[65%] bg-white rounded-full"></div>
      </div>
      <div className="flex justify-end mt-1">
        <span className="bg-white text-[#1e4d36] text-xs px-2 py-0.5 rounded-full">65%</span>
      </div>
    </div>
  )
}

export default TotalSalesWidget 