import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardSkeleton() {
  return (
    <div className="flex min-h-screen bg-white dark:bg-gray-900">

      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Skeleton className="h-10 w-32" /> {/* Date range label */}
          <Skeleton className="h-10 w-48" /> {/* Date picker */}
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Total Income Card */}
          <div className="p-6 rounded-lg bg-gray-100 dark:bg-gray-800">
            <Skeleton className="h-8 w-32 mb-2" /> {/* Amount */}
            <Skeleton className="h-4 w-24" /> {/* Label */}
          </div>
          {/* Total Outcome Card */}
          <div className="p-6 rounded-lg bg-gray-100 dark:bg-gray-800">
            <Skeleton className="h-8 w-32 mb-2" />
            <Skeleton className="h-4 w-24" />
          </div>
          {/* Balance Card */}
          <div className="p-6 rounded-lg bg-gray-100 dark:bg-gray-800">
            <Skeleton className="h-8 w-32 mb-2" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>

        {/* Financial Overview Chart */}
        <div className="mb-8">
          <Skeleton className="h-8 w-48 mb-4" /> {/* Section title */}
          <Skeleton className="h-4 w-96 mb-6" /> {/* Subtitle */}
          <Skeleton className="h-[300px] w-full rounded-lg" /> {/* Chart placeholder */}
        </div>

        {/* Financial Breakdown */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <Skeleton className="h-8 w-48" /> {/* Section title */}
            <div className="flex gap-2">
              <Skeleton className="h-8 w-24" /> {/* Toggle button */}
              <Skeleton className="h-8 w-24" /> {/* Toggle button */}
            </div>
          </div>
          <div className="flex justify-center">
            <Skeleton className="h-[300px] w-[300px] rounded-full" /> {/* Donut chart placeholder */}
          </div>
        </div>
      </div>
    </div>
  )
}