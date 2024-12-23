import React, { useState, useMemo } from "react";
import TransactionForm from "@/components/TransactionForm";
import TransactionList from "@/components/TransactionList";
import CategoryForm from "@/components/CategoryForm";
import ItemManagement from "@/components/Items/ItemManagement";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

const AddToPurchases = () => {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isItemSheetOpen, setIsItemSheetOpen] = useState(false);
  const [filters, setFilters] = useState({
    dateRange: { from: null, to: null },
    category: "all",
    type: "all",
  });
  const { toast } = useToast();

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const transactionDate = parseISO(transaction.date);

      const { dateRange = { from: null, to: null }, category, type } = filters;

      const hasValidDateRange =
        dateRange.from !== null && dateRange.to !== null;

      const matchesDateRange =
        !hasValidDateRange ||
        isWithinInterval(transactionDate, {
          start: dateRange.from,
          end: dateRange.to,
        });

      const matchesCategory =
        category === "all" || transaction.category === category;

      const matchesType = type === "all" || transaction.type === type;

      return matchesDateRange && matchesCategory && matchesType;
    });
  }, [transactions, filters]);

  const handleAddTransaction = (values) => {
    const newTransaction = { ...values, id: uuidv4() };
    setTransactions([newTransaction, ...transactions]);
    setIsSheetOpen(false);
    toast({
      title: "Transaction added",
      description: `${
        values.type === "cash-in" ? "Cash in" : "Cash out"
      } of $${values.amount.toFixed(2)} added successfully.`,
      duration: 3000,
    });
  };

  const handleUpdateTransaction = (id, updatedTransaction) => {
    setTransactions(
      transactions.map((t) =>
        t.id === id ? { ...t, ...updatedTransaction } : t
      )
    );
    toast({
      title: "Transaction updated",
      description: "The transaction has been updated successfully.",
    });
  };

  const handleDeleteTransaction = (id) => {
    setTransactions(transactions.filter((t) => t.id !== id));
    toast({
      title: "Transaction deleted",
      description: "The transaction has been deleted successfully.",
    });
  };

  const handleAddCategory = (name) => {
    const newCategory = { id: uuidv4(), name };
    setCategories([...categories, newCategory]);
    toast({
      title: "Category added",
      description: `Category "${name}" has been added successfully.`,
    });
  };

  const handleUpdateCategory = (id, name) => {
    setCategories(
      categories.map((cat) => (cat.id === id ? { ...cat, name } : cat))
    );
    toast({
      title: "Category updated",
      description: `Category has been updated to "${name}".`,
    });
  };

  const handleDeleteCategory = (id) => {
    setCategories(categories.filter((cat) => cat.id !== id));
    toast({
      title: "Category deleted",
      description: "The category has been deleted successfully.",
    });
  };

  const handleAddItem = (newItem) => {
    const itemWithId = { ...newItem, id: uuidv4() };
    setItems([...items, itemWithId]);
    toast({
      title: "Item added",
      description: `${newItem.name} has been added to your items list.`,
      duration: 3000,
    });
  };

  const handleUpdateItem = (id, updatedItem) => {
    setItems(
      items.map((item) => (item.id === id ? { ...item, ...updatedItem } : item))
    );
    toast({
      title: "Item updated",
      description: `${updatedItem.name} has been updated successfully.`,
      duration: 3000,
    });
  };

  const handleDeleteItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
    toast({
      title: "Item deleted",
      description: "The item has been deleted successfully.",
      duration: 3000,
    });
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground antialiased">
      {/* <Header /> */}
      <main className="flex-1 relative">
        <div className="container mx-auto space-y-6 p-4 pb-20">
          <Tabs defaultValue="purchases" className="w-full">
            <TabsList className="grid h-10 items-center w-full grid-cols-4 rounded-lg">
              <TabsTrigger
                value="purchases"
                className="h-8 px-4 text-sm font-medium transition-all data-[state=active]:text-blue-500"
              >
                Purchases
              </TabsTrigger>
              <TabsTrigger
                value="categories"
                className="h-8 px-4 text-sm font-medium transition-all data-[state=active]:text-blue-500"
              >
                Categories
              </TabsTrigger>
              <TabsTrigger
                value="items"
                className="h-8 px-4 text-sm font-medium transition-all data-[state=active]:text-blue-500"
              >
                Items
              </TabsTrigger>
              <TabsTrigger
                value="reports"
                className="h-8 px-4 text-sm font-medium transition-all data-[state=active]:text-blue-500"
              >
                Reports
              </TabsTrigger>
            </TabsList>
            <TabsContent value="purchases">
              <div className="space-y-6">
                <div>
                  <h2 className="mb-4 text-xl font-semibold">
                    Recent Purchases
                  </h2>
                  <TransactionList
                    transactions={filteredTransactions}
                    onUpdate={handleUpdateTransaction}
                    onDelete={handleDeleteTransaction}
                    categories={categories}
                    onFilter={handleFilterChange}
                  />
                  <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                    <SheetTrigger asChild>
                      <Button
                        className="fixed bottom-20 md:bottom-4 right-4 h-14 w-14 rounded-full shadow-lg bg-blue-500 hover:bg-blue-600 text-white transition duration-300 ease-in-out transform hover:scale-105"
                        size="icon"
                      >
                        <Plus className="h-6 w-6" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="bottom" className="h-[90vh] rounded-t-[20px] sm:rounded-t-[30px]">
                      <div className="h-full flex flex-col">
                        <h2 className="text-xl font-semibold mb-4">
                          Add New Purchase
                        </h2>
                        <div className="flex-grow overflow-auto">
                          <TransactionForm
                            onSubmit={handleAddTransaction}
                            categories={categories}
                            items={items}
                          />
                        </div>
                        {/* <div className="mt-4 border-t pt-4">
                          <Button
                            type="submit"
                            form="transaction-form"
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                          >
                            Add Purchase
                          </Button>
                        </div> */}
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="categories">
              <div className="space-y-6">
                <div>
                  <h2 className="mb-4 text-xl font-semibold">
                    Add New Category
                  </h2>
                  <CategoryForm
                    categories={categories}
                    onSubmit={handleAddCategory}
                    onUpdate={handleUpdateCategory}
                    onDelete={handleDeleteCategory}
                  />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="items">
              <ItemManagement/>
            </TabsContent>
            <TabsContent value="reports">
              <div className="space-y-6">
                <div>
                  <h2 className="mb-4 text-xl font-semibold">Reports</h2>
                  <p>Report functionality to be implemented.</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Toaster />
    </div>
  );
};

export default AddToPurchases;