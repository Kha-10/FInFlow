import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardSkeleton() {
  return (
    <div className="flex min-h-screen bg-white dark:bg-gray-900">
      {/* Main Content */}
      <main className="flex-1 relative overflow-y-auto">
        <div className="container mx-auto space-y-6 p-4 pb-20 min-h-[calc(100vh-8rem)]">
          {/* Date Range Picker */}
          <div className="flex flex-col gap-2">
            <Skeleton className="h-10 w-full rounded-md" /> {/* Date picker */}
          </div>

          {/* Metric Cards */}
          <div className="space-y-4">
            {/* Total Income Card */}
            <div className="p-4 rounded-lg bg-slate-100 dark:bg-slate-800">
              <div className="flex justify-between items-center">
                <div className="space-y-2">
                  <Skeleton className="h-6 w-24" /> {/* Amount */}
                  <Skeleton className="h-4 w-20" /> {/* Label */}
                </div>
                <Skeleton className="h-8 w-8 rounded-full" /> {/* Icon */}
              </div>
            </div>

            {/* Total Outcome Card */}
            <div className="p-4 rounded-lg bg-slate-100 dark:bg-slate-800">
              <div className="flex justify-between items-center">
                <div className="space-y-2">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            </div>

            {/* Balance Card */}
            <div className="p-4 rounded-lg bg-slate-100 dark:bg-slate-800">
              <div className="flex justify-between items-center">
                <div className="space-y-2">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            </div>
          </div>

          {/* Financial Overview */}
          <div className="space-y-4">
            <div className="space-y-1">
              <Skeleton className="h-6 w-48" /> {/* Title */}
              <Skeleton className="h-4 w-full" /> {/* Subtitle */}
            </div>
            <Skeleton className="h-[200px] w-full rounded-lg" /> {/* Chart */}
          </div>
          <div>
            <div className="flex justify-between items-center mb-4">
              <Skeleton className="h-8 w-48" /> {/* Section title */}
              <div className="flex gap-2">
                <Skeleton className="h-8 w-24" /> {/* Toggle button */}
                <Skeleton className="h-8 w-24" /> {/* Toggle button */}
              </div>
            </div>
            <div className="flex justify-center">
              <Skeleton className="h-[300px] w-[300px] rounded-full" />{" "}
              {/* Donut chart placeholder */}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
