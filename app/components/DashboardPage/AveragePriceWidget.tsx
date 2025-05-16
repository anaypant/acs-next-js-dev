import { ChevronDown } from "lucide-react"

interface AveragePriceWidgetProps {
  darkMode: boolean
  selectedMonth: string
}

const AveragePriceWidget = ({ darkMode, selectedMonth }: AveragePriceWidgetProps) => {
  return (
    <div className={`col-span-12 md:col-span-8 ${darkMode ? "bg-[#1e4d36]/80" : "bg-white"} rounded-lg p-4`}>
      <div className="flex flex-row items-center justify-between pb-2">
        <div>
          <h3 className={`text-lg font-medium ${darkMode ? "text-white" : "text-[#1e4d36]"}`}>
            Average Price & Total Turnover
          </h3>
          <p className={`text-sm ${darkMode ? "text-white/70" : "text-[#1e4d36]/70"}`}>Overview of Profit</p>
        </div>
        <div className="relative">
          <button
            className={`flex items-center gap-2 text-xs border ${
              darkMode ? "border-white/30 text-white" : "border-gray-300 text-[#1e4d36]"
            } rounded-md px-2 py-1`}
          >
            {selectedMonth}
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-6 mb-4">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-green-500"></div>
          <span className={`text-xs ${darkMode ? "text-white" : "text-[#1e4d36]"}`}>New Pricing Trends</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-[#1e4d36]"></div>
          <span className={`text-xs ${darkMode ? "text-white" : "text-[#1e4d36]"}`}>Financial Performance</span>
        </div>
      </div>
      <div className="h-[200px] w-full relative">
        <div className={`absolute left-0 top-0 text-xs ${darkMode ? "text-white/70" : "text-[#1e4d36]/70"}`}>4k</div>
        <div className={`absolute left-0 top-[33%] text-xs ${darkMode ? "text-white/70" : "text-[#1e4d36]/70"}`}>3k</div>
        <div className={`absolute left-0 top-[66%] text-xs ${darkMode ? "text-white/70" : "text-[#1e4d36]/70"}`}>2k</div>
        <div className={`absolute left-0 bottom-0 text-xs ${darkMode ? "text-white/70" : "text-[#1e4d36]/70"}`}>1k</div>
        <div className={`absolute left-0 bottom-0 text-xs ${darkMode ? "text-white/70" : "text-[#1e4d36]/70"}`}>0</div>

        <div className={`absolute bottom-0 left-[10%] text-xs ${darkMode ? "text-white/70" : "text-[#1e4d36]/70"}`}>
          16/04
        </div>
        <div className={`absolute bottom-0 left-[25%] text-xs ${darkMode ? "text-white/70" : "text-[#1e4d36]/70"}`}>
          17/05
        </div>
        <div className={`absolute bottom-0 left-[40%] text-xs ${darkMode ? "text-white/70" : "text-[#1e4d36]/70"}`}>
          18/06
        </div>
        <div className={`absolute bottom-0 left-[55%] text-xs ${darkMode ? "text-white/70" : "text-[#1e4d36]/70"}`}>
          19/07
        </div>
        <div className={`absolute bottom-0 left-[70%] text-xs ${darkMode ? "text-white/70" : "text-[#1e4d36]/70"}`}>
          20/08
        </div>
        <div className={`absolute bottom-0 left-[85%] text-xs ${darkMode ? "text-white/70" : "text-[#1e4d36]/70"}`}>
          21/09
        </div>
        <div className={`absolute bottom-0 right-0 text-xs ${darkMode ? "text-white/70" : "text-[#1e4d36]/70"}`}>
          22/10
        </div>

        <svg className="h-full w-full" viewBox="0 0 800 200">
          {/* Grid lines */}
          <line x1="0" y1="0" x2="800" y2="0" stroke={darkMode ? "#ffffff30" : "#e5e7eb"} strokeWidth="1" />
          <line x1="0" y1="50" x2="800" y2="50" stroke={darkMode ? "#ffffff30" : "#e5e7eb"} strokeWidth="1" />
          <line x1="0" y1="100" x2="800" y2="100" stroke={darkMode ? "#ffffff30" : "#e5e7eb"} strokeWidth="1" />
          <line x1="0" y1="150" x2="800" y2="150" stroke={darkMode ? "#ffffff30" : "#e5e7eb"} strokeWidth="1" />
          <line x1="0" y1="200" x2="800" y2="200" stroke={darkMode ? "#ffffff30" : "#e5e7eb"} strokeWidth="1" />

          <line x1="80" y1="0" x2="80" y2="200" stroke={darkMode ? "#ffffff30" : "#e5e7eb"} strokeWidth="1" />
          <line x1="200" y1="0" x2="200" y2="200" stroke={darkMode ? "#ffffff30" : "#e5e7eb"} strokeWidth="1" />
          <line x1="320" y1="0" x2="320" y2="200" stroke={darkMode ? "#ffffff30" : "#e5e7eb"} strokeWidth="1" />
          <line x1="440" y1="0" x2="440" y2="200" stroke={darkMode ? "#ffffff30" : "#e5e7eb"} strokeWidth="1" />
          <line x1="560" y1="0" x2="560" y2="200" stroke={darkMode ? "#ffffff30" : "#e5e7eb"} strokeWidth="1" />
          <line x1="680" y1="0" x2="680" y2="200" stroke={darkMode ? "#ffffff30" : "#e5e7eb"} strokeWidth="1" />
          <line x1="800" y1="0" x2="800" y2="200" stroke={darkMode ? "#ffffff30" : "#e5e7eb"} strokeWidth="1" />

          {/* Financial Performance Line */}
          <path
            d="M0,150 C80,120 160,100 240,80 C320,60 400,100 480,120 C560,140 640,60 720,40 L800,60"
            fill="none"
            stroke="#1e4d36"
            strokeWidth="2"
            className="line-chart-path"
          />

          {/* New Pricing Trends Line */}
          <path
            d="M0,180 C80,160 160,140 240,160 C320,180 400,100 480,140 C560,180 640,140 720,120 L800,100"
            fill="none"
            stroke="#10b981"
            strokeWidth="2"
            className="line-chart-path"
          />
        </svg>
      </div>
    </div>
  )
}

export default AveragePriceWidget 