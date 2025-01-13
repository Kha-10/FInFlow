import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function TransactionSkeleton() {
  return (
    <Card className="p-3 sm:p-4 bg-gray-50 dark:bg-gray-700">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 sm:space-x-4">
          <Skeleton className="h-8 w-8 sm:h-10 sm:w-10 rounded-full" />
          <div className="space-y-1">
            <Skeleton className="h-4 w-24 sm:w-32" />
            <Skeleton className="h-3 w-20 sm:w-24" />
          </div>
        </div>
        <div className="flex items-start space-x-2 sm:space-x-4">
          <div className="text-right">
            <Skeleton className="h-4 w-16 sm:w-20" />
            <Skeleton className="h-3 w-12 sm:w-14 mt-1" />
          </div>
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>

      <div className="mt-3 sm:mt-4 space-y-2">
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
      </div>
    </Card>
  );
}
