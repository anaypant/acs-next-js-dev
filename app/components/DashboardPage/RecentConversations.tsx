// Last Modified: 2024-04-15 by Claude
import React from "react"

interface RecentConversationsProps {
  darkMode: boolean
}

const RecentConversations: React.FC<RecentConversationsProps> = ({ darkMode }) => {
  const conversations = [
    { time: "09:46", status: "green", text: "Calls Scheduled" },
    { time: "09:46", status: "green", text: "Minutes of recent conversation" },
    { time: "12:22", status: "green", text: "New Lead Interactions" },
    { time: "12:22", status: "yellow", text: "Minutes of new lead interaction" },
    { time: "09:46", status: "green", text: "Project meeting" },
    { time: "09:46", status: "green", text: "Minutes of project meeting" },
    {
      time: "09:46",
      status: "green",
      text: (
        <>
          New sale recorded <span className="text-blue-400 cursor-pointer hover:underline">#ML-3467</span>
        </>
      ),
    },
    { time: "09:46", status: "green", text: "Minutes of project meeting" },
  ]

  return (
    <div className="col-span-12 md:col-span-4 bg-[#1e4d36] text-white rounded-lg p-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-2 space-y-2 sm:space-y-0">
        <h3 className="text-lg font-medium">Recent Conversations & Lead Interactions</h3>
        <p className="text-sm text-white/70">Client Discussions Position</p>
      </div>
      <div className="space-y-4 max-h-[300px] overflow-y-auto">
        {conversations.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="text-sm">{item.time}</div>
            <div
              className={`h-2 w-2 rounded-full ${
                item.status === "green" ? "bg-green-400" : "bg-yellow-400"
              }`}
            ></div>
            <div className="text-sm">{item.text}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RecentConversations 