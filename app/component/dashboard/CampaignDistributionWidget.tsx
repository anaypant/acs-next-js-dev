interface CampaignDistributionWidgetProps {
  darkMode: boolean
}

const CampaignDistributionWidget = ({ darkMode }: CampaignDistributionWidgetProps) => {
  return (
    <div className={`${darkMode ? "bg-[#2a5a42]/30" : "bg-green-100"} rounded-lg p-4`}>
      <div className={`text-lg font-medium ${darkMode ? "text-white" : "text-[#1e4d36]"}`}>
        Campaign Distribution
      </div>
      <div className="h-[150px] w-full flex items-center justify-center">
        <div className="relative h-[100px] w-[100px]">
          <svg viewBox="0 0 100 100" className="h-full w-full">
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#1e4d36"
              strokeWidth="20"
              strokeDasharray="75 175"
              className="pie-chart-path"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#10b981"
              strokeWidth="20"
              strokeDasharray="25 175"
              strokeDashoffset="-75"
              className="pie-chart-path"
            />
          </svg>
        </div>
      </div>
    </div>
  )
}

export default CampaignDistributionWidget 