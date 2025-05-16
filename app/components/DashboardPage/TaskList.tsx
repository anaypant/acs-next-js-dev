// Last Modified: 2024-04-15 by Claude
import React from "react"
import { CheckCircle2, Circle, Clock, MoreVertical, ListTodo, Filter } from "lucide-react"

interface Task {
  id: number
  title: string
  status: "completed" | "pending" | "in-progress"
  dueDate: string
  priority: "high" | "medium" | "low"
}

interface TaskListProps {
  tasks: Task[]
  onStatusChange: (taskId: number) => void
  darkMode: boolean
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onStatusChange, darkMode }) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-500"
      case "medium":
        return "text-yellow-500"
      case "low":
        return "text-green-500"
      default:
        return "text-gray-500"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      case "in-progress":
        return <Clock className="h-5 w-5 text-yellow-500" />
      default:
        return <Circle className="h-5 w-5 text-gray-400" />
    }
  }

  return (
    <div 
      className={`col-span-12 md:col-span-8 ${
        darkMode ? "bg-gradient-to-br from-[#1e4d36]/90 to-[#2a5a42]/80" : "bg-gradient-to-br from-white to-green-50"
      } rounded-lg p-6 shadow-lg border ${darkMode ? "border-[#2a5a42]" : "border-green-100"}`}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <ListTodo className={`h-5 w-5 ${darkMode ? "text-white" : "text-[#1e4d36]"}`} />
          <h3 className={`text-lg font-medium ${darkMode ? "text-white" : "text-[#1e4d36]"}`}>Task List</h3>
        </div>
        <div className="flex items-center gap-2">
          <button 
            className={`p-2 rounded-lg ${
              darkMode ? "bg-[#1e4d36]/40 hover:bg-[#2a5a42]" : "bg-white hover:bg-gray-50"
            } transition-colors border ${darkMode ? "border-[#2a5a42]" : "border-green-100"}`}
          >
            <Filter className={`h-4 w-4 ${darkMode ? "text-white" : "text-[#1e4d36]"}`} />
          </button>
          <button 
            className={`p-2 rounded-lg ${
              darkMode ? "bg-[#1e4d36]/40 hover:bg-[#2a5a42]" : "bg-white hover:bg-gray-50"
            } transition-colors border ${darkMode ? "border-[#2a5a42]" : "border-green-100"}`}
          >
            <MoreVertical className={`h-4 w-4 ${darkMode ? "text-white" : "text-[#1e4d36]"}`} />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`flex items-center justify-between p-4 rounded-lg ${
              darkMode ? "bg-[#1e4d36]/40 hover:bg-[#2a5a42]" : "bg-white hover:bg-gray-50"
            } transition-all border ${darkMode ? "border-[#2a5a42]" : "border-green-100"}`}
          >
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => onStatusChange(task.id)}
                className={`p-1 rounded-lg transition-colors ${
                  darkMode ? "hover:bg-[#2a5a42]" : "hover:bg-gray-100"
                }`}
              >
                {getStatusIcon(task.status)}
              </button>
              <div>
                <h4
                  className={`text-sm font-medium ${darkMode ? "text-white" : "text-gray-900"} ${
                    task.status === "completed" ? "line-through opacity-70" : ""
                  }`}
                >
                  {task.title}
                </h4>
                <p className={`text-xs ${darkMode ? "text-white/70" : "text-gray-500"}`}>Due {task.dueDate}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span 
                className={`text-xs font-medium px-2 py-1 rounded-md ${
                  task.priority === "high"
                    ? darkMode 
                      ? "bg-red-500/20 text-red-400"
                      : "bg-red-50 text-red-600"
                    : task.priority === "medium"
                      ? darkMode
                        ? "bg-yellow-500/20 text-yellow-400"
                        : "bg-yellow-50 text-yellow-600"
                      : darkMode
                        ? "bg-green-500/20 text-green-400"
                        : "bg-green-50 text-green-600"
                }`}
              >
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </span>
              <button 
                className={`p-1.5 rounded-lg ${
                  darkMode ? "hover:bg-[#2a5a42]" : "hover:bg-gray-100"
                } transition-colors`}
              >
                <MoreVertical className={`h-4 w-4 ${darkMode ? "text-white/70" : "text-gray-600"}`} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TaskList 