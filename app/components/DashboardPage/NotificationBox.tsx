// Last Modified: 2024-04-15 by Claude
import React from "react"
import { User, Bell, Calendar, Activity } from "lucide-react"

interface NotificationBoxProps {
  notifications: {
    newLeads: boolean
    followUps: boolean
    recentUpdates: boolean
  }
  toggleNotification: (type: string) => void
  darkMode: boolean
}

const NotificationBox: React.FC<NotificationBoxProps> = ({ notifications, toggleNotification, darkMode }) => {
  return (
    <div 
      className={`col-span-12 md:col-span-4 ${
        darkMode ? "bg-gradient-to-br from-[#1e4d36]/90 to-[#2a5a42]/80" : "bg-gradient-to-br from-white to-green-50"
      } rounded-lg p-4 shadow-lg border ${darkMode ? "border-[#2a5a42]" : "border-green-100"}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-2 space-y-2 sm:space-y-0">
        <div className="flex items-center gap-2">
          <Bell className={`h-5 w-5 ${darkMode ? "text-white" : "text-[#1e4d36]"}`} />
          <h3 className={`text-lg font-medium ${darkMode ? "text-white" : "text-[#1e4d36]"}`}>Notification Box</h3>
        </div>
        <div className={`flex items-center gap-1 text-sm ${darkMode ? "text-white/70" : "text-[#1e4d36]/70"}`}>
          <Calendar className="h-4 w-4" />
          16 Apr, 2022
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between mb-4 gap-4 sm:gap-6">
        <div className={`flex items-center gap-2 ${darkMode ? "bg-[#1e4d36]/40" : "bg-white"} p-2 rounded-lg flex-1`}>
          <Calendar className={`h-4 w-4 ${darkMode ? "text-white/70" : "text-[#1e4d36]/70"}`} />
          <div>
            <div className={`text-xs ${darkMode ? "text-white/70" : "text-[#1e4d36]/70"}`}>Due Date</div>
            <div className={`text-sm font-medium ${darkMode ? "text-white" : "text-[#1e4d36]"}`}>Oct 23, 2022</div>
          </div>
        </div>
        <div className={`flex items-center gap-2 ${darkMode ? "bg-[#1e4d36]/40" : "bg-white"} p-2 rounded-lg flex-1`}>
          <Activity className={`h-4 w-4 ${darkMode ? "text-white/70" : "text-[#1e4d36]/70"}`} />
          <div>
            <div className={`text-xs ${darkMode ? "text-white/70" : "text-[#1e4d36]/70"}`}>Recent Activity</div>
            <div className={`text-sm font-medium ${darkMode ? "text-white" : "text-[#1e4d36]"}`}>28th Oct</div>
          </div>
        </div>
      </div>

      <div className={`border-t border-b py-4 my-4 ${darkMode ? "border-[#2a5a42]" : "border-green-100"}`}>
        <div className={`text-sm mb-3 font-medium ${darkMode ? "text-white" : "text-[#1e4d36]"}`}>Notification Settings</div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <button
            className={`flex items-center justify-center gap-1 transition-all px-3 py-2 rounded-lg text-xs ${
              notifications.newLeads
                ? "bg-blue-600 text-white shadow-md"
                : darkMode
                  ? "bg-[#1e4d36]/40 text-blue-400 border border-blue-400/30"
                  : "bg-white text-blue-600 border border-blue-600/30"
            }`}
            onClick={() => toggleNotification("newLeads")}
          >
            New Leads
          </button>
          <button
            className={`flex items-center justify-center gap-1 transition-all px-3 py-2 rounded-lg text-xs ${
              notifications.followUps
                ? "bg-green-600 text-white shadow-md"
                : darkMode
                  ? "bg-[#1e4d36]/40 text-green-400 border border-green-400/30"
                  : "bg-white text-green-600 border border-green-600/30"
            }`}
            onClick={() => toggleNotification("followUps")}
          >
            Follow-ups
          </button>
          <button
            className={`flex items-center justify-center gap-1 transition-all px-3 py-2 rounded-lg text-xs ${
              notifications.recentUpdates
                ? "bg-orange-600 text-white shadow-md"
                : darkMode
                  ? "bg-[#1e4d36]/40 text-orange-400 border border-orange-400/30"
                  : "bg-white text-orange-600 border border-orange-600/30"
            }`}
            onClick={() => toggleNotification("recentUpdates")}
          >
            Recent Updates
          </button>
        </div>
      </div>

      <div>
        <div className={`text-sm mb-3 font-medium flex items-center gap-2 ${darkMode ? "text-white" : "text-[#1e4d36]"}`}>
          <User className="h-4 w-4" />
          Team Leaders
        </div>
        <div className="flex -space-x-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`relative h-10 w-10 rounded-full ${
                darkMode ? "bg-[#1e4d36]/40" : "bg-white"
              } border-2 ${
                darkMode ? "border-[#2a5a42]" : "border-green-100"
              } overflow-hidden cursor-pointer hover:scale-110 transition-transform shadow-sm`}
            >
              <User 
                className={`h-6 w-6 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${
                  darkMode ? "text-white/70" : "text-[#1e4d36]/70"
                }`} 
              />
            </div>
          ))}
          <button 
            className={`relative h-10 w-10 rounded-full ${
              darkMode ? "bg-[#1e4d36]/40" : "bg-white"
            } border-2 border-dashed ${
              darkMode ? "border-[#2a5a42]" : "border-green-100"
            } flex items-center justify-center hover:scale-110 transition-transform`}
          >
            <span className={`text-lg ${darkMode ? "text-white/70" : "text-[#1e4d36]/70"}`}>+</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default NotificationBox 