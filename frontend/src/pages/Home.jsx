import { useState, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";
import TransactionForm from "@/components/TransactionForm";
import TransactionList from "@/components/TransactionList";
import Summary from "@/components/summary";
import CategoryForm from "@/components/CategoryForm";
import ItemManagement from "@/components/Items/ItemList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Plus } from "lucide-react";
import { isWithinInterval, parseISO } from "date-fns";
import ChartArea from "@/components/ChartArea";
import ChartPie from "@/components/ChartPie";

function Home() {
  const [transactions, setTransactions] = useState([]);
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

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground antialiased">
      <main className="flex-1 relative">
        <div className="container mx-auto space-y-6 p-4 pb-20">
          <Summary transactions={filteredTransactions} />
          <div className="w-full gap-5 flex flex-col xl:flex-row items-center">
            <ChartArea className="flex-1" />
            <ChartPie className="flex-1" />
          </div>
        </div>
      </main>
      <Toaster />
    </div>
  );
}

export default Home