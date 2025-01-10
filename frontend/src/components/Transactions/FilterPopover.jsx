import { useState } from "react";
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
  categories,
  onResetFilters,
  children,
  handleDateRangeChange,
  date,
  setDate,
  category,
  handleCategory,
  type,
  handleTransactionType,
}) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handleCalendarOpen = (open) => {
    setIsCalendarOpen(open);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-[300px] p-4" align="end">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Date Range</Label>
            <div className="grid gap-2">
              <Popover open={isCalendarOpen} onOpenChange={handleCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal bg-primary-foreground",
                      !date.from && "text-muted-foreground",
                      "focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0",
                      isCalendarOpen && "ring-2 ring-blue-500 ring-offset-2"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date?.from ? (
                      date.to ? (
                        <>
                          {format(date.from, "LLL dd, y")} -{" "}
                          {format(date.to, "LLL dd, y")}
                        </>
                      ) : (
                        <> {format(date.from, "LLL dd, y")} - Select end date</>
                      )
                    ) : (
                      <span>Pick a date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="range"
                    defaultMonth={date?.from}
                    selected={date}
                    onSelect={(newDate) => {
                      setDate(newDate || { from: undefined, to: undefined });
                      if (newDate?.from && newDate.to) {
                        handleDateRangeChange(newDate);
                        setIsCalendarOpen(false);
                      }
                    }}
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
              onValueChange={(value) => handleCategory(value)}
              value={category || ""}
            >
              <SelectTrigger
                className="w-full
                  hover:bg-primary-foreground text-foreground bg-primary-foreground focus:ring-blue-500 focus:ring-2 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0"
              >
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {!!categories &&
                  categories.map((category) => (
                    <SelectItem key={category._id} value={category._id}>
                      {category.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Type</Label>
            <Select
              onValueChange={(value) => handleTransactionType(value)}
              value={type || ""}
            >
              <SelectTrigger className="w-full bg-primary-foreground hover:bg-primary-foreground text-foreground focus:ring-blue-500 focus:ring-2 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="outcome">Outcome</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={onResetFilters}
              variant="outline"
              className="w-full border border-blue-500 text-blue-500"
            >
              Reset
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
