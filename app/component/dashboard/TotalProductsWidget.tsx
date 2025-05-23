interface TotalProductsWidgetProps {
  darkMode: boolean
}

const TotalProductsWidget = ({ darkMode }: TotalProductsWidgetProps) => {
  return (
    <div className="col-span-12 md:col-span-4 bg-[#1e4d36] text-white rounded-lg p-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-2 space-y-2 sm:space-y-0">
        <h3 className="text-lg font-medium">Total Products & Customers</h3>
        <p className="text-sm text-white/70">Inventory Track</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="border-r border-white/20 pr-4">
          <div className="text-base md:text-lg font-medium">Total Products</div>
          <div className="text-4xl font-bold">343</div>
          <div className="text-2xl font-medium text-green-400">201</div>
          <div className="text-lg">187</div>
        </div>
        <div>
          <div className="text-base md:text-lg font-medium">Total Customers</div>
          <div className="text-4xl font-bold">3201</div>
          <div className="text-2xl font-medium text-green-400">2010</div>
          <div className="text-lg">1432</div>
        </div>
      </div>
      <div className="flex items-center justify-center gap-4 mt-4">
        <div className="rounded-full w-2 h-2 p-0 bg-white"></div>
        <div className="rounded-full w-2 h-2 p-0 bg-white/50"></div>
        <div className="rounded-full w-2 h-2 p-0 bg-white/50"></div>
      </div>
    </div>
  )
}

export default TotalProductsWidget 