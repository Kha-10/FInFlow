import { X } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"


export default function FilterBadges({ filters, onRemoveFilter }) {
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {filters.dateRange?.from && filters.dateRange?.to && (
        <Badge variant="secondary" className="px-2 py-1">
          <span className="mr-1">
            {format(filters.dateRange.from, "MMM d, yyyy")} - {format(filters.dateRange.to, "MMM d, yyyy")}
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="h-auto p-0 text-muted-foreground hover:text-foreground"
            onClick={() => onRemoveFilter('dateRange')}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      )}
      {filters.category !== 'all' && (
        <Badge variant="secondary" className="px-2 py-1">
          <span className="mr-1">Category: {filters.category}</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-auto p-0 text-muted-foreground hover:text-foreground"
            onClick={() => onRemoveFilter('category')}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      )}
      {filters.type !== 'all' && (
        <Badge variant="secondary" className="px-2 py-1">
          <span className="mr-1">Type: {filters.type === 'income' ? 'Income' : 'Expense'}</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-auto p-0 text-muted-foreground hover:text-foreground"
            onClick={() => onRemoveFilter('type')}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      )}
    </div>
  )
}