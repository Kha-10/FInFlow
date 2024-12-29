import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

export default function FilterPopover({
  filters,
  categories,
  onFilterChange,
  onResetFilters,
  children,
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-[300px] p-4" align="end">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Date Range</Label>
            <div className="grid gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal bg-primary-foreground focus:ring-blue-500 focus:ring-2 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0",
                      !filters.dateRange && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.dateRange?.from ? (
                      filters.dateRange.to ? (
                        <>
                          {format(filters.dateRange.from, "LLL dd, y")} -{" "}
                          {format(filters.dateRange.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(filters.dateRange.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Pick a date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={filters.dateRange?.from}
                    selected={filters.dateRange}
                    onSelect={(range) => onFilterChange("dateRange", range)}
                    numberOfMonths={1}
                    classNames={{
                      daySelected: "bg-blue-500 text-white",
                      dayRangeStart: "bg-green-500 text-white", 
                      dayRangeEnd: "bg-red-500 text-white", 
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Category</Label>
            <Select
              onValueChange={(value) => onFilterChange("category", value)}
              value={filters.category}
            >
              <SelectTrigger className="w-full bg-primary-foreground focus:ring-blue-500 focus:ring-2 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {!!categories &&
                  categories.map((category) => (
                    <SelectItem key={category._id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Type</Label>
            <Select
              onValueChange={(value) => onFilterChange("type", value)}
              value={filters.type}
            >
              <SelectTrigger className="w-full bg-primary-foreground focus:ring-blue-500 focus:ring-2 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={onResetFilters}
              variant="outline"
              className="w-full"
            >
              Reset
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
