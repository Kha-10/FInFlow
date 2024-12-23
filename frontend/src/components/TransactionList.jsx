import { useState } from "react";
import {
  CalendarIcon,
  ChevronDownIcon,
  FilterIcon,
  PlusIcon,
  MinusIcon,
  Trash,
  Pencil,
  X
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
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
    const newFilters = { ...filters, [key]: key === 'dateRange' ? undefined : 'all' };
    setFilters(newFilters);
    onFilter(newFilters);
  }


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
                              day_selected: "bg-blue-500 text-white hover:bg-blue-600 hover:text-white focus:bg-blue-600",
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
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.name}>
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
                    <Button onClick={applyFilters} className="w-1/2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg">
                      Apply
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          {renderActiveFilters()}
          <CardDescription>Manage your recent transactions</CardDescription>
          {/* <div className={cn("flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0 lg:space-x-2", 
            showFilters ? "block" : "hidden lg:flex")}>
            <DateRangePicker 
              dateRange={filters.dateRange}
              onDateRangeChange={(range) => handleFilterChange('dateRange', range)}
            />
            <CategoryFilter 
              categories={categories}
              selectedCategory={filters.category}
              onCategoryChange={(category) => handleFilterChange('category', category)}
            />
            <TypeFilter 
              selectedType={filters.type}
              onTypeChange={(type) => handleFilterChange('type', type)}
            />
          </div> */}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <TransactionCard
              key={transaction.id}
              transaction={transaction}
              isExpanded={expandedRows.includes(transaction.id)}
              onToggleExpand={() => toggleRowExpansion(transaction.id)}
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

function DateRangePicker({ dateRange, onDateRangeChange }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start text-left font-normal lg:w-[300px]"
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {dateRange?.from ? (
            dateRange.to ? (
              <>
                {format(dateRange.from, "LLL dd, y")} -{" "}
                {format(dateRange.to, "LLL dd, y")}
              </>
            ) : (
              format(dateRange.from, "LLL dd, y")
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
          defaultMonth={dateRange?.from}
          selected={dateRange}
          onSelect={onDateRangeChange}
          numberOfMonths={1}
        />
      </PopoverContent>
    </Popover>
  );
}

function CategoryFilter({ categories, selectedCategory, onCategoryChange }) {
  return (
    <Select value={selectedCategory} onValueChange={onCategoryChange}>
      <SelectTrigger className="w-full lg:w-[300px]">
        <SelectValue placeholder="Select category" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Categories</SelectItem>
        {categories.map((category) => (
          <SelectItem key={category.id} value={category.name}>
            {category.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function TypeFilter({ selectedType, onTypeChange }) {
  return (
    <Select value={selectedType} onValueChange={onTypeChange}>
      <SelectTrigger className="w-full lg:w-[300px]">
        <SelectValue placeholder="Select type" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Types</SelectItem>
        <SelectItem value="cash-in">Cash In</SelectItem>
        <SelectItem value="cash-out">Cash Out</SelectItem>
      </SelectContent>
    </Select>
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
  return (
    <Card
      className={cn(
        "transition-all duration-200 ease-in-out",
        transaction.type === "cash-in"
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
                transaction.type === "cash-in"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-orange-100 text-orange-700"
              )}
            >
              {transaction.type === "cash-in" ? (
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
                {transaction.category} • {transaction.date}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div
              className={cn(
                "text-xl font-semibold",
                transaction.type === "cash-in"
                  ? "text-blue-600"
                  : "text-orange-600"
              )}
            >
              ${transaction.amount.toFixed(2)}
            </div>
            <Badge variant="secondary">
              {transaction.items.length} item
              {transaction.items.length !== 1 ? "s" : ""}
            </Badge>
            <div className="flex">
              <EditTransactionDialog
                transaction={transaction}
                onUpdate={onUpdate}
                categories={categories}
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(transaction.id)}
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
            {transaction.items.map((item, index) => (
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

function EditTransactionDialog({ transaction, onUpdate, categories }) {
  const [editedTransaction, setEditedTransaction] = useState(transaction);

  const handleUpdate = () => {
    onUpdate(transaction.id, editedTransaction);
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...editedTransaction.items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setEditedTransaction({ ...editedTransaction, items: updatedItems });
  };

  const handleAddItem = () => {
    setEditedTransaction({
      ...editedTransaction,
      items: [
        ...editedTransaction.items,
        { name: "", quantity: "1", price: 0 },
      ],
    });
  };

  const handleRemoveItem = (index) => {
    const updatedItems = editedTransaction.items.filter((_, i) => i !== index);
    setEditedTransaction({ ...editedTransaction, items: updatedItems });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Transaction</DialogTitle>
          <DialogDescription>
            Make changes to your transaction here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">
              Type
            </Label>
            <Select
              value={editedTransaction.type}
              onValueChange={(value) =>
                setEditedTransaction({ ...editedTransaction, type: value })
              }
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash-in">Cash In</SelectItem>
                <SelectItem value="cash-out">Cash Out</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Category
            </Label>
            <Select
              value={editedTransaction.category}
              onValueChange={(value) =>
                setEditedTransaction({ ...editedTransaction, category: value })
              }
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.name}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Input
              id="description"
              value={editedTransaction.description}
              onChange={(e) =>
                setEditedTransaction({
                  ...editedTransaction,
                  description: e.target.value,
                })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right">
              Date
            </Label>
            <Input
              id="date"
              type="date"
              value={editedTransaction.date}
              onChange={(e) =>
                setEditedTransaction({
                  ...editedTransaction,
                  date: e.target.value,
                })
              }
              className="col-span-3"
            />
          </div>
          <Separator />
          <div>
            <h4 className="mb-4 font-semibold">Items</h4>
            {editedTransaction.items.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-4 items-center gap-4 mb-2"
              >
                <Input
                  value={item.name}
                  onChange={(e) =>
                    handleItemChange(index, "name", e.target.value)
                  }
                  placeholder="Item name"
                />
                <Input
                  value={item.quantity}
                  onChange={(e) =>
                    handleItemChange(index, "quantity", e.target.value)
                  }
                  placeholder="Quantity"
                />
                <Input
                  type="number"
                  value={item.price}
                  onChange={(e) =>
                    handleItemChange(index, "price", parseFloat(e.target.value))
                  }
                  placeholder="Price"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveItem(index)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button onClick={handleAddItem} className="mt-2">
              Add Item
            </Button>
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <Button type="submit" onClick={handleUpdate}>
            Save changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}