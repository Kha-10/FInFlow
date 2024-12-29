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
import { useLocation } from "react-router-dom";
import axios from "@/helper/axios";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function TransactionManagement() {
  const [filters, setFilters] = useState({
    dateRange: undefined,
    category: "all",
    type: "all",
  });
  const [purchases, setPurchases] = useState(null);
  const [categories, setCategories] = useState(null);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [deletingTransaction, setDeletingTransaction] = useState(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [pagination, setPagination] = useState([]);

  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search);
  const page = parseInt(searchQuery.get("page"))
    ? parseInt(searchQuery.get("page"))
    : 1;
  const query = searchQuery.get("search");
  const sort = searchQuery.get("sort") ? searchQuery.get("sort") : "createdAt";
  const sortDirection = searchQuery.get("sortDirection")
    ? searchQuery.get("sortDirection")
    : "desc";

  const { toast } = useToast();

  const getPurhcases = async () => {
    try {
      const response = await axios.get(
        `/api/purchases?page=${page}&sort=${sort}&sortDirection=${sortDirection}${
          query ? `&search=${query}` : ""
        }`
      );
      if (response.status === 200) {
        console.log(response);
        setPurchases(response.data.data.purchases);
        setCategories(response.data.data.categories);
        setPagination(response.data.links);
      }
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }
  };

  useEffect(() => {
    getPurhcases();
  }, [page, query, sort, sortDirection]);

  async function onDelete(id) {
    try {
      const res = await axios.delete(`/api/purchases/${deletingTransaction._id}`);
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

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleRemoveFilter = (key) => {
    setFilters((prev) => ({
      ...prev,
      [key]: key === "dateRange" ? undefined : "all",
    }));
  };

  const resetFilters = () => {
    setFilters({
      dateRange: undefined,
      category: "all",
      type: "all",
    });
  };
  console.log(purchases);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            Transactions
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage your recent transactions
          </p>
        </div>
        <FilterPopover
          filters={filters}
          categories={categories}
          onFilterChange={handleFilterChange}
          onResetFilters={resetFilters}
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

      <FilterBadges filters={filters} onRemoveFilter={handleRemoveFilter} />

      <ScrollArea>
        <div className="space-y-4">
          {!!purchases &&
            purchases.map((purchase) => (
              <Card key={purchase._id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-full",
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
                      <div className="flex items-center text-sm text-muted-foreground">
                        <span>
                          {format(new Date(purchase.date), "MMM d, yyyy")}
                        </span>
                        <ChevronRight className="h-4 w-4 mx-1" />
                        <Badge variant="secondary" className="rounded-md">
                          {purchase.category?.name}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="text-right">
                      <p
                        className={cn(
                          "text-sm font-medium",
                          purchase.transactionType === "income"
                            ? "text-green-500"
                            : "text-red-500"
                        )}
                      >
                        {purchase.transactionType === "income" ? "+" : "-"}$
                        {purchase.amount && Number(purchase.amount).toFixed(2)}
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
                        <Button variant="ghost" size="icon" className="h-8 w-8">
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
                  <div className="mt-4 space-y-2">
                    {purchase.items?.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between text-sm px-4 py-2 rounded-lg bg-muted/50"
                      >
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{item.name}</span>
                          <span className="text-muted-foreground">
                            ×{item.quantity}
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
              />
            </div>
          </div>
        </SheetContent>
      </Sheet>
      {!!pagination && pagination.totalPages > 1 && (
        <PaginationControls
          pagination={pagination}
          currentPage={page}
          query={query}
          sort={sort}
          sortDirection={sortDirection}
        />
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
            <AlertDialogAction onClick={onDelete} className="bg-red-500 text-white hover:bg-red-600">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
