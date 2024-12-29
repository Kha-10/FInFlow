import { useState } from "react";
import EditTransactionDialog from "./EditTransactionDialog";
import {
  CalendarIcon,
  ChevronDownIcon,
  FilterIcon,
  PlusIcon,
  MinusIcon,
  Trash,
  Pencil,
  X,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

export default function TransactionList({
  transactions,
  onUpdate,
  onDelete,
  categories,
  onFilter,
  purchases,
  setPurchases,
}) {
  const [expandedRows, setExpandedRows] = useState([]);
  const [filters, setFilters] = useState({
    dateRange: undefined,
    category: "all",
    type: "all",
  });
  const [showFilters, setShowFilters] = useState(false);

  const toggleRowExpansion = (id) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  const applyFilters = () => {
    onFilter(filters);
    setShowFilters(false);
  };

  const removeFilter = (key) => {
    const newFilters = {
      ...filters,
      [key]: key === "dateRange" ? undefined : "all",
    };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  const resetFilters = () => {
    const defaultFilters = {
      dateRange: undefined,
      category: "all",
      type: "all",
    };
    setFilters(defaultFilters);
    onFilter(defaultFilters);
    setIsFilterOpen(false);
  };

  const renderActiveFilters = () => {
    const activeFilters = [];
    if (filters.dateRange?.from && filters.dateRange?.to) {
      activeFilters.push(
        <Badge
          key="dateRange"
          variant="secondary"
          className="flex items-center gap-1"
        >
          <span>
            Date: {format(filters.dateRange.from, "MMM d, yyyy")} -{" "}
            {format(filters.dateRange.to, "MMM d, yyyy")}
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="h-4 w-4 p-0"
            onClick={() => removeFilter("dateRange")}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      );
    }
    if (filters.category !== "all") {
      activeFilters.push(
        <Badge
          key="category"
          variant="secondary"
          className="flex items-center gap-1"
        >
          <span>Category: {filters.category}</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-4 w-4 p-0"
            onClick={() => removeFilter("category")}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      );
    }
    if (filters.type !== "all") {
      activeFilters.push(
        <Badge
          key="type"
          variant="secondary"
          className="flex items-center gap-1"
        >
          <span>
            Type: {filters.type === "cash-in" ? "Cash In" : "Cash Out"}
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="h-4 w-4 p-0"
            onClick={() => removeFilter("type")}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      );
    }

    if (activeFilters.length === 0) return null;

    return <div className="flex flex-wrap gap-2 mt-2">{activeFilters}</div>;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <CardTitle>Transactions</CardTitle>
            <Popover open={showFilters} onOpenChange={setShowFilters}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <FilterIcon className="h-4 w-4" />
                  Filters
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[300px] p-4">
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
                              "w-full bg-primary-foreground focus:ring-blue-500 focus:ring-2 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0 justify-start text-left font-normal",
                              !filters.dateRange && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {filters.dateRange?.from ? (
                              filters.dateRange.to ? (
                                <>
                                  {format(filters.dateRange.from, "LLL dd, y")}{" "}
                                  - {format(filters.dateRange.to, "LLL dd, y")}
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
                            onSelect={(range) =>
                              handleFilterChange("dateRange", range)
                            }
                            numberOfMonths={1}
                            className="w-full"
                            classNames={{
                              day_selected:
                                "bg-blue-500 text-white hover:bg-blue-600 hover:text-white focus:bg-blue-600",
                              day_today: "bg-accent text-accent-foreground",
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select
                      onValueChange={(value) =>
                        handleFilterChange("category", value)
                      }
                      value={filters.category}
                    >
                      <SelectTrigger className="w-full bg-primary-foreground focus:ring-blue-500 focus:ring-2 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {!!categories &&
                          categories.map((category) => (
                            <SelectItem
                              key={category._id}
                              value={category.name}
                            >
                              {category.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Select
                      onValueChange={(value) =>
                        handleFilterChange("type", value)
                      }
                      value={filters.type}
                    >
                      <SelectTrigger className="w-full bg-primary-foreground focus:ring-blue-500 focus:ring-2 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="cash-in">Cash In</SelectItem>
                        <SelectItem value="cash-out">Cash Out</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={resetFilters}
                      variant="outline"
                      className="w-1/2"
                    >
                      Reset
                    </Button>
                    <Button
                      onClick={applyFilters}
                      className="w-1/2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg"
                    >
                      Apply
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          {renderActiveFilters()}
          <CardDescription>Manage your recent transactions</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {purchases.map((purchase) => (
            <TransactionCard
              key={purchase._id}
              transaction={purchase}
              isExpanded={expandedRows.includes(purchase._id)}
              onToggleExpand={() => toggleRowExpansion(purchase._id)}
              onUpdate={onUpdate}
              onDelete={onDelete}
              categories={categories}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function TransactionCard({
  transaction,
  isExpanded,
  onToggleExpand,
  onUpdate,
  onDelete,
  categories,
}) {
  const [editingTransaction, setEditingTransaction] = useState(null);
  return (
    <Card
      className={cn(
        "transition-all duration-200 ease-in-out",
        transaction.transactionType === "cash-in"
          ? "border-l-4 border-l-blue-500"
          : "border-l-4 border-l-orange-500"
      )}
    >
      <CardHeader className="p-4">
        <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div className="flex items-center space-x-4">
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full",
                transaction.transactionType === "cash-in"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-orange-100 text-orange-700"
              )}
            >
              {transaction.transactionType === "cash-in" ? (
                <PlusIcon className="h-6 w-6" />
              ) : (
                <MinusIcon className="h-6 w-6" />
              )}
            </div>
            <div>
              <CardTitle className="text-lg">
                {transaction.description}
              </CardTitle>
              <CardDescription>
                {transaction.category.name} • {transaction.date}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div
              className={cn(
                "text-xl font-semibold",
                transaction.transactionType === "cash-in"
                  ? "text-blue-600"
                  : "text-orange-600"
              )}
            >
              ${transaction.amount.toFixed(2)}
            </div>
            <Badge variant="secondary">
              {/* {transaction.items.length} item
              {transaction.items.length !== 1 ? "s" : ""} */}
            </Badge>
            <div className="flex">
              <EditTransactionDialog
                transaction={editingTransaction}
                onUpdate={onUpdate}
                categories={categories}
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setEditingTransaction(transaction)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(transaction._id)}
              >
                <Trash className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={onToggleExpand}>
                <ChevronDownIcon
                  className={cn(
                    "h-4 w-4 transition-transform",
                    isExpanded && "rotate-180"
                  )}
                />
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      {isExpanded && (
        <CardContent className="p-4">
          <Separator className="my-4" />
          <div className="space-y-2">
            {!!transaction.items &&
              transaction.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span>{item.name}</span>
                  <span>
                    {item.quantity} x ${item.price.toFixed(2)}
                  </span>
                </div>
              ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
