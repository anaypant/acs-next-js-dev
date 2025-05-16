interface NavigationWidgetProps {
  darkMode: boolean
}

const NavigationWidget = ({ darkMode }: NavigationWidgetProps) => {
  return (
    <div className="col-span-12 md:col-span-4 bg-[#1e4d36] text-white rounded-lg p-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-2 space-y-2 sm:space-y-0">
        <h3 className="text-lg font-medium">Navigation & Organization</h3>
      </div>
      <div className="space-y-6">
        <div>
          <button className="bg-white text-[#1e4d36] px-3 py-2 text-sm rounded-md inline-block hover:bg-white/90 w-full sm:w-auto text-left">
            Lead Conversion Product (LCP)
          </button>
          <div className="text-sm mt-2">
            Lorem ipsum: lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum
            lorem ipsum
          </div>
        </div>

        <div>
          <button className="bg-white text-[#1e4d36] px-3 py-2 text-sm rounded-md inline-block hover:bg-white/90 w-full sm:w-auto text-left">
            Expected Value (EV) Analysis
          </button>
          <div className="text-sm mt-2">
            Lorem ipsum: lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum
            lorem ipsum
          </div>
        </div>

        <div>
          <button className="bg-white text-[#1e4d36] px-3 py-2 text-sm rounded-md inline-block hover:bg-white/90 w-full sm:w-auto text-left">
            Lead Generation Workflow (LGW)
          </button>
          <div className="text-sm mt-2">
            Lorem ipsum: lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum
            lorem ipsum
          </div>
        </div>
      </div>
    </div>
  )
}

export default NavigationWidget 