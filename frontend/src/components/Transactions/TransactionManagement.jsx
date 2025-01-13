import { useState, useEffect } from "react";
import {
  Filter,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import FilterPopover from "./FilterPopover";
import FilterBadges from "./FilterBadges";
import TransactionForm from "./TransactionForm";
import EditTransactionDialog from "./EditTransactionDialog";
import PaginationControls from "../PaginationControls";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetHeader,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import axios from "@/helper/axios";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSearchParams } from "react-router-dom";
import TransactionSkeleton from "../Skeleton";

export default function TransactionManagement() {
  const [filters, setFilters] = useState({
    dateRange: undefined,
    category: "all",
    type: "all",
  });
  const [purchases, setPurchases] = useState(null);
  const [categories, setCategories] = useState(null);
  const [items, setItems] = useState(null);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [deletingTransaction, setDeletingTransaction] = useState(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [pagination, setPagination] = useState([]);
  const [date, setDate] = useState({
    from: undefined,
    to: undefined,
  });
  const [loading, setLoading] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page"))
    ? parseInt(searchParams.get("page"))
    : 1;
  const dateRange = searchParams.get("dateRange");
  const category = searchParams.get("category");
  const type = searchParams.get("type");

  const filteredCategory = categories?.find((f) => f._id === category);

  const { toast } = useToast();

  const getPurhcases = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("twj");
      const response = await axios.get(
        `/api/purchases?page=${page}${
          dateRange ? `&dateRange=${dateRange}` : ""
        }${category ? `&category=${category}` : ""}${
          type ? `&type=${type}` : ""
        }`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        console.log(response.data.data.purchases);
        setPurchases(response.data.data.purchases);
        setCategories(response.data.data.categories);
        setItems(response.data.data.items);
        setPagination(response.data.links);
      }
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      setLoading(false);
    }
  };

  useEffect(() => {
    getPurhcases();
  }, [page, dateRange, category, type]);

  async function onDelete() {
    try {
      const token = localStorage.getItem("twj");
      const res = await axios.delete(
        `/api/purchases/${deletingTransaction._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.status === 200) {
        toast({
          title: "Purchase deleted",
          description: "The Purchase has been deleted successfully.",
          duration: 3000,
        });
        setPurchases((prevItems) =>
          prevItems.filter((item) => item._id !== deletingTransaction._id)
        );
      }
    } catch (error) {
      console.error("Error deleting purchase:", error);
      toast({
        title: "Error",
        description: error.response.data
          ? error.response.data.msg
          : "There was an issue deleting the purchase. Please try again.",
        status: "error",
      });
    }
  }

  const resetFilters = () => {
    searchParams.delete("dateRange");
    searchParams.delete("category");
    searchParams.delete("type");
    setSearchParams(searchParams);
    setDate({});
  };

  const handleDateRangeChange = ({ from, to }) => {
    const utcFrom = new Date(
      Date.UTC(from.getFullYear(), from.getMonth(), from.getDate())
    );
    const utcTo = new Date(
      Date.UTC(to.getFullYear(), to.getMonth(), to.getDate(), 23, 59, 59, 999)
    );

    const formattedFrom = utcFrom.toISOString();
    const formattedTo = utcTo.toISOString();

    const dateRange = `${formattedFrom},${formattedTo}`;

    searchParams.set("dateRange", dateRange);
    searchParams.delete("filterRangeBy");
    setSearchParams(searchParams);
  };

  const handleCategory = (id) => {
    searchParams.set("category", id);
    setSearchParams(searchParams);
  };

  const handleTransactionType = (value) => {
    searchParams.set("type", value);
    setSearchParams(searchParams);
  };

  return (
    <div className="space-y-6 pt-3">
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-text-foreground">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">
              Transactions
            </h2>
            <p className="text-sm text-muted-foreground">
              Manage your recent transactions
            </p>
          </div>
          <FilterPopover
            categories={categories}
            onResetFilters={resetFilters}
            handleDateRangeChange={handleDateRangeChange}
            date={date}
            setDate={setDate}
            category={category}
            handleCategory={handleCategory}
            type={type}
            handleTransactionType={handleTransactionType}
          >
            <Button
              variant="outline"
              size="sm"
              className="h-8 border-dashed border-btn"
            >
              <Filter className="mr-2 h-4 w-4 text-btn" />
              <span className="text-btn">Filters</span>
            </Button>
          </FilterPopover>
        </div>

        <FilterBadges
          date={date}
          filteredCategory={filteredCategory}
          type={type}
          searchParams={searchParams}
          setSearchParams={setSearchParams}
          clearDate={() => setDate({})}
        />
        {loading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <TransactionSkeleton key={index} />
          ))
        ) : purchases && purchases.length === 0 ? (
          <p className="text-muted-foreground text-sm text-center mt-8">
            No purchases added yet? Tap the + icon below to get started!
          </p>
        ) : (
          <ScrollArea className="h-[calc(100vh-12rem)]">
            <div className="space-y-4 py-4">
              {loading
                ? Array.from({ length: 6 }).map((_, index) => (
                    <TransactionSkeleton key={index} />
                  ))
                : !!purchases &&
                  purchases.map((purchase) => (
                    <Card
                      key={purchase._id}
                      className="p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 hover:shadow-md transition-all  dark:hover:shadow-gray-700/50 hover:border-gray-300 dark:hover:border-gray-500"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 sm:space-x-4">
                          <div
                            className={cn(
                              "flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full",
                              purchase.transactionType === "income"
                                ? "bg-green-500/20 text-green-500"
                                : "bg-red-500/20 text-red-500"
                            )}
                          >
                            {purchase.transactionType === "income" ? (
                              <ArrowUpRight className="h-5 w-5" />
                            ) : (
                              <ArrowDownRight className="h-5 w-5" />
                            )}
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-medium leading-none">
                              {purchase.description}
                            </p>
                            <div className="flex flex-wrap items-center text-xs sm:text-sm text-muted-foreground">
                              <span>
                                {format(new Date(purchase.date), "MMM d, yyyy")}
                              </span>
                              <ChevronRight className="h-4 w-4 mx-1" />
                              <Badge
                                variant="secondary"
                                className="mt-1 md:mt-0 rounded-md text-xs bg-gray-200 text-gray-800 border-gray-300 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600"
                              >
                                {purchase.category?.name}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-start space-x-2 sm:space-x-4">
                          <div className="text-right">
                            <p
                              className={cn(
                                "text-sm font-medium",
                                purchase.transactionType === "income"
                                  ? "text-green-500"
                                  : "text-red-500"
                              )}
                            >
                              {purchase.transactionType === "income"
                                ? "+"
                                : "-"}
                              $
                              {(purchase.amount || purchase.total) &&
                                Number(
                                  purchase.amount || purchase.total
                                ).toFixed(2)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {purchase.items?.length >= 1
                                ? `${purchase.items.length} `
                                : 0}{" "}
                              {purchase.items?.length === 1 ? "item" : "items"}
                            </p>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => setEditingTransaction(purchase)}
                              >
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => setDeletingTransaction(purchase)}
                                className="text-red-500 focus:text-red-500"
                              >
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>

                      {/* Items Section */}
                      {!!purchase.items && (
                        <div className="mt-3 sm:mt-4 space-y-2">
                          {purchase.items?.map((item, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between text-xs sm:text-sm px-3 py-1 sm:px-4 sm:py-2 rounded-lg bg-muted"
                            >
                              <div className="flex items-center space-x-2">
                                <span className="font-medium">{item.name}</span>
                                <span className="text-muted-foreground">
                                  ×{item.unitValue ? item.unitValue : 1}
                                </span>
                              </div>
                              <span>${item.price.toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </Card>
                  ))}
            </div>
          </ScrollArea>
        )}
      </div>
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger asChild>
          <Button
            className="fixed bottom-20 md:bottom-4 right-4 h-14 w-14 rounded-full shadow-lg bg-blue-500 hover:bg-blue-600 text-white transition duration-300 ease-in-out transform hover:scale-105"
            size="icon"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="bottom"
          className="h-[90vh] sm:max-w-full rounded-t-[20px]"
        >
          <div className="h-full flex flex-col">
            <SheetTitle className="text-lg font-semibold text-foreground">
              Add New Purchase
            </SheetTitle>
            <SheetDescription className="hidden"></SheetDescription>
            <div className="mt-4 h-[calc(90vh-120px)]">
              <TransactionForm
                setIsSheetOpen={setIsSheetOpen}
                setPurchases={setPurchases}
                categories={categories}
                itemlist={items}
              />
            </div>
          </div>
        </SheetContent>
      </Sheet>
      {!!pagination && pagination.totalPages > 1 && (
        <PaginationControls pagination={pagination} currentPage={page} />
      )}
      <EditTransactionDialog
        transaction={editingTransaction}
        categories={categories}
        onUpdate={(updatedTransaction) => {
          onUpdate(updatedTransaction.id, updatedTransaction);
          setEditingTransaction(null);
        }}
        onClose={() => setEditingTransaction(null)}
        setPurchases={setPurchases}
      />
      <AlertDialog
        open={!!deletingTransaction}
        onOpenChange={() => setDeletingTransaction(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete this transaction permanently?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this transaction? You won't be
              able to recover it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={onDelete}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
