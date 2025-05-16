// Last Modified: 2024-04-15 by Claude
import React from "react"

interface ChartData {
  label: string
  value: number
  color?: string
}

interface DashboardChartProps {
  data: ChartData[]
  type: "bar" | "line" | "pie"
  height?: number
  className?: string
  darkMode?: boolean
}

const DashboardChart: React.FC<DashboardChartProps> = ({
  data,
  type,
  height = 200,
  className = "",
  darkMode = false,
}) => {
  const maxValue = Math.max(...data.map((d) => d.value))

  const renderBarChart = () => (
    <div className="flex items-end justify-between h-[200px] gap-2">
      {data.map((item, i) => (
        <div
          key={i}
          className="flex-1 flex flex-col items-center"
          style={{ height: `${(item.value / maxValue) * 100}%` }}
        >
          <div
            className={`w-full rounded-t ${
              item.color || (darkMode ? "bg-white/70" : "bg-[#1e4d36]")
            } bar-chart-bar`}
            style={{ height: "100%" }}
          />
          <span className={`text-xs mt-2 ${darkMode ? "text-white/70" : "text-[#1e4d36]/70"}`}>
            {item.label}
          </span>
        </div>
      ))}
    </div>
  )

  const renderLineChart = () => (
    <svg className="w-full h-full" viewBox="0 0 800 200">
      <path
        d={data
          .map(
            (point, i) =>
              `${i === 0 ? "M" : "L"} ${(i / (data.length - 1)) * 800},${
                200 - (point.value / maxValue) * 200
              }`
          )
          .join(" ")}
        fill="none"
        stroke={darkMode ? "#ffffff70" : "#1e4d36"}
        strokeWidth="2"
        className="line-chart-path"
      />
      {data.map((point, i) => (
        <circle
          key={i}
          cx={(i / (data.length - 1)) * 800}
          cy={200 - (point.value / maxValue) * 200}
          r="4"
          fill={darkMode ? "#ffffff70" : "#1e4d36"}
        />
      ))}
    </svg>
  )

  const renderPieChart = () => {
    const total = data.reduce((sum, item) => sum + item.value, 0)
    let currentAngle = 0

    return (
      <svg className="w-full h-full" viewBox="0 0 100 100">
        {data.map((item, i) => {
          const angle = (item.value / total) * 360
          const x1 = 50 + 40 * Math.cos((currentAngle * Math.PI) / 180)
          const y1 = 50 + 40 * Math.sin((currentAngle * Math.PI) / 180)
          const x2 = 50 + 40 * Math.cos(((currentAngle + angle) * Math.PI) / 180)
          const y2 = 50 + 40 * Math.sin(((currentAngle + angle) * Math.PI) / 180)
          const largeArcFlag = angle > 180 ? 1 : 0

          currentAngle += angle

          return (
            <path
              key={i}
              d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
              fill={item.color || (darkMode ? "#ffffff70" : "#1e4d36")}
              className="pie-chart-path"
            />
          )
        })}
      </svg>
    )
  }

  return (
    <div className={`${className}`} style={{ height }}>
      {type === "bar" && renderBarChart()}
      {type === "line" && renderLineChart()}
      {type === "pie" && renderPieChart()}
    </div>
  )
}

export default DashboardChart 