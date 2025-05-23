import { useState, useEffect } from 'react'
import { GripVertical, X, Grid, Check } from 'lucide-react'
import WelcomeSection from './WelcomeSection'
import TotalSalesWidget from './TotalSalesWidget'
import EarningsWidget from './EarningsWidget'
import AveragePriceWidget from './AveragePriceWidget'
import TotalProductsWidget from './TotalProductsWidget'
import CampaignDistributionWidget from './CampaignDistributionWidget'
import NavigationWidget from './NavigationWidget'

interface Widget {
  id: string
  name: string
  component: React.ComponentType<any>
  enabled: boolean
  order: number
  gridPosition: {
    row: number
    col: number
    span: number
  }
}

interface EditDashboardProps {
  darkMode: boolean
  widgets: Widget[]
  onWidgetsChange: (widgets: Widget[]) => void
  onClose: () => void
}

const availableWidgets: Omit<Widget, 'enabled' | 'order' | 'gridPosition'>[] = [
  {
    id: "welcome",
    name: "Welcome Section",
    component: WelcomeSection,
  },
  {
    id: "totalSales",
    name: "Total Sales",
    component: TotalSalesWidget,
  },
  {
    id: "earnings",
    name: "Earnings",
    component: EarningsWidget,
  },
  {
    id: "averagePrice",
    name: "Average Price",
    component: AveragePriceWidget,
  },
  {
    id: "totalProducts",
    name: "Total Products",
    component: TotalProductsWidget,
  },
  {
    id: "campaignDistribution",
    name: "Campaign Distribution",
    component: CampaignDistributionWidget,
  },
  {
    id: "navigation",
    name: "Navigation",
    component: NavigationWidget,
  },
]

const EditDashboard = ({ darkMode, widgets, onWidgetsChange, onClose }: EditDashboardProps) => {
  const [previewMode, setPreviewMode] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState("March 2022")
  const [activeWidgets, setActiveWidgets] = useState<Widget[]>(widgets)
  const [draggedWidget, setDraggedWidget] = useState<Widget | Omit<Widget, "enabled" | "order" | "gridPosition"> | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  useEffect(() => {
    setActiveWidgets(widgets)
  }, [widgets])

  const handleDragStart = (widget: Widget | Omit<Widget, "enabled" | "order" | "gridPosition">) => {
    setDraggedWidget(widget)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    setDragOverIndex(index)
  }

  const handleDrop = (targetIndex: number) => {
    if (!draggedWidget) return

    const sourceIndex = activeWidgets.findIndex(w => w.id === draggedWidget.id)
    if (sourceIndex === -1) {
      // Widget is coming from available widgets
      const widgetExists = activeWidgets.some(w => w.id === draggedWidget.id)
      if (widgetExists) return // Prevent duplicates

      const newWidget: Widget = {
        ...draggedWidget,
        enabled: true,
        order: activeWidgets.length + 1,
        gridPosition: {
          row: Math.floor(activeWidgets.length / 3),
          col: activeWidgets.length % 3,
          span: draggedWidget.id === "welcome" ? 2 : 1
        }
      }

      const newWidgets = [...activeWidgets]
      newWidgets.splice(targetIndex, 0, newWidget)
      setActiveWidgets(newWidgets.map((w, i) => ({ ...w, order: i + 1 })))
    } else {
      // Reordering existing widgets
      const newWidgets = [...activeWidgets]
      const [movedWidget] = newWidgets.splice(sourceIndex, 1)
      newWidgets.splice(targetIndex, 0, movedWidget)
      setActiveWidgets(newWidgets.map((w, i) => ({ ...w, order: i + 1 })))
    }

    setDraggedWidget(null)
    setDragOverIndex(null)
  }

  const removeWidget = (widgetId: string) => {
    const newWidgets = activeWidgets.filter(w => w.id !== widgetId)
    setActiveWidgets(newWidgets)
    onWidgetsChange(newWidgets)
  }

  const handleConfirm = () => {
    onWidgetsChange(activeWidgets)
    onClose()
  }

  const renderWidgetPreview = (widget: Widget) => {
    const WidgetComponent = widget.component
    return (
      <div
        key={widget.id}
        className={`p-4 rounded-lg ${
          darkMode ? 'bg-[#2a5a42]' : 'bg-gray-50'
        }`}
        style={{
          gridColumn: `span ${widget.gridPosition.span}`,
          gridRow: `span 1`
        }}
      >
        <WidgetComponent
          darkMode={darkMode}
          selectedMonth={selectedMonth}
          userName="Admin"
        />
      </div>
    )
  }

  return (
    <div className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 ${darkMode ? 'dark' : ''}`}>
      <div className={`${darkMode ? 'bg-[#1e4d36]' : 'bg-white'} rounded-lg p-6 w-full max-w-6xl h-[80vh] flex flex-col`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-[#1e4d36]'}`}>
            Configure Dashboard
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className={`p-2 rounded-lg ${
                darkMode ? 'hover:bg-white/10 text-white' : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <Grid className="h-5 w-5" />
            </button>
            <button
              onClick={handleConfirm}
              className={`p-2 rounded-lg ${
                darkMode ? 'hover:bg-white/10 text-white' : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <Check className="h-5 w-5" />
            </button>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg ${
                darkMode ? 'hover:bg-white/10 text-white' : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {previewMode ? (
          <div className="grid grid-cols-3 gap-4 overflow-auto flex-1">
            {activeWidgets.map(renderWidgetPreview)}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 h-full">
            <div className="space-y-4 overflow-auto">
              <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'} sticky top-0 bg-inherit py-2`}>
                Available Widgets
              </h3>
              <div className="space-y-2">
                {availableWidgets.map((widget, index) => {
                  const isActive = activeWidgets.some(w => w.id === widget.id)
                  return (
                    <div
                      key={widget.id}
                      draggable={!isActive}
                      onDragStart={() => handleDragStart(widget)}
                      className={`flex items-center justify-between p-4 rounded-lg ${
                        darkMode ? 'bg-[#2a5a42]' : 'bg-gray-50'
                      } ${isActive ? 'opacity-50 cursor-not-allowed' : 'cursor-grab'}`}
                    >
                      <div className="flex items-center gap-4">
                        <GripVertical className={`h-5 w-5 ${darkMode ? 'text-white/50' : 'text-gray-400'}`} />
                        <span className={`${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {widget.name}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="space-y-4 overflow-auto">
              <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'} sticky top-0 bg-inherit py-2`}>
                Current Layout
              </h3>
              <div className="space-y-2">
                {activeWidgets.map((widget, index) => (
                  <div
                    key={widget.id}
                    draggable
                    onDragStart={() => handleDragStart(widget)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDrop={() => handleDrop(index)}
                    className={`flex items-center justify-between p-4 rounded-lg ${
                      darkMode ? 'bg-[#2a5a42]' : 'bg-gray-50'
                    } ${dragOverIndex === index ? 'border-2 border-dashed border-white/50' : ''} cursor-grab`}
                  >
                    <div className="flex items-center gap-4">
                      <GripVertical className={`h-5 w-5 ${darkMode ? 'text-white/50' : 'text-gray-400'}`} />
                      <span className={`${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {widget.name}
                      </span>
                    </div>
                    <button
                      onClick={() => removeWidget(widget.id)}
                      className={`p-2 rounded-lg ${
                        darkMode ? 'hover:bg-white/10 text-white' : 'hover:bg-gray-100 text-gray-600'
                      }`}
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                ))}
                {activeWidgets.length === 0 && (
                  <div className={`p-8 rounded-lg border-2 border-dashed ${
                    darkMode ? 'border-white/20 text-white/50' : 'border-gray-200 text-gray-400'
                  } text-center`}>
                    Drag widgets here to add them to your dashboard
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default EditDashboard 