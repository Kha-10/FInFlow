import { useState, useEffect } from "react";
import Summary from "@/components/Summary";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import ChartArea from "@/components/ChartArea";
import ChartPie from "@/components/ChartPie";
import axios from "@/helper/axios";
import {
  subMonths,
  subYears,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
} from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import { format } from "date-fns";
import { useSearchParams } from "react-router-dom";

function Home() {
  const [transactions, setTransactions] = useState([]);
  const [chartDatas, setChartDatas] = useState([]);
  const [chartPie, setChartPie] = useState([]);
  const [dayChartDatas, setDayChartDatas] = useState([]);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [date, setDate] = useState({
    from: undefined,
    to: undefined,
  });

  const [searchParams, setSearchParams] = useSearchParams();

  const filterRangeBy = searchParams.get("filterRangeBy");
  const dateRange = searchParams.get("dateRange");
  const sortBy = searchParams.get("sortBy") || "outcome";
  console.log(dateRange);
  const getPurhcases = async () => {
    try {
      const token = localStorage.getItem("twj");
      const response = await axios.get(
        `/api/purchases/chart?sortBy=${sortBy}${
          dateRange ? `&dateRange=${dateRange}` : ""
        }`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        setTransactions(response.data.data.purchases);
        setChartDatas(response.data.data.chartData);
        setChartPie(response.data.data.chartPie);
        setDayChartDatas(response.data.data.dayData);
      }
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }
  };

  useEffect(() => {
    getPurhcases();
  }, [filterRangeBy, dateRange, sortBy]);

  const handlePresetChange = (preset) => {
    searchParams.set("filterRangeBy", preset);
    searchParams.delete("dateRange");
    setSearchParams(searchParams);
    setDate({});
    const now = new Date();
    let from;
    let to;

    switch (preset) {
      case "this-month":
        from = startOfMonth(now); // Start of last month
        to = endOfMonth(now);
        break;
      case "last-month":
        // from = startOfWeek(now);
        // to = endOfWeek(now);
        from = startOfMonth(subMonths(now, 1)); // Start of last month
        to = endOfMonth(subMonths(now, 1));
        break;
      case "last-3-months":
        // from = startOfMonth(now);
        // to = endOfMonth(now);
        from = startOfMonth(subMonths(now, 3)); // Start of the 3 months ago
        to = endOfMonth(subMonths(now, 1));
        break;
      case "last-6-months":
        // from = subMonths(now, 6);
        // to = now;
        from = startOfMonth(subMonths(now, 6)); // Start of the 6 months ago
        to = endOfMonth(subMonths(now, 1));
        break;
      case "this-year":
        from = startOfYear(now); // Start of the current year
        to = endOfYear(now);
        break;
      case "last-year":
        // from = subYears(now, 1);
        // to = now;
        from = startOfYear(subYears(now, 1)); // Start of the previous year
        to = endOfYear(subYears(now, 1));
        break;
      default:
        return;
    }
    const utcFrom = new Date(
      Date.UTC(from.getFullYear(), from.getMonth(), from.getDate())
    );
    const utcTo = new Date(
      Date.UTC(to.getFullYear(), to.getMonth(), to.getDate(), 23, 59, 59, 999)
    );

    const formattedFrom = utcFrom.toISOString();
    const formattedTo = utcTo.toISOString();

    const dateRange = `${formattedFrom},${formattedTo}`;

    console.log("dateRange", dateRange);

    setDate({ from, to });
    searchParams.set("dateRange", dateRange);
    setSearchParams(searchParams);
  };

  const handleDateRangeChange = ({ from, to }) => {
    // const dateRange = `${from.toISOString().split("T")[0]},${
    //   to.toISOString().split("T")[0]
    // }`;
    // Convert local dates to UTC for server communication
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

  return (
    <div className="flex min-h-screen flex-col bg-gray-100 dark:bg-gray-900 text-foreground antialiased">
      <main className="flex-1 relative">
        <div className="flex items-center justify-end gap-2 mt-3 px-5">
          <Select
            onValueChange={handlePresetChange}
            value={filterRangeBy || ""}
          >
            <SelectTrigger
              className="w-[180px] bg-white dark:bg-gray-800
                  hover:bg-primary-foreground text-foreground focus:ring-blue-500 focus:ring-2 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0"
            >
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent className="mt-2">
              <SelectItem value="this-month">This Month</SelectItem>
              <SelectItem value="last-month">Last Month</SelectItem>
              <SelectItem value="last-3-months">Last 3 Months</SelectItem>
              <SelectItem value="last-6-months">Last 6 Months</SelectItem>
              <SelectItem value="this-year">This Year</SelectItem>
              <SelectItem value="last-year">Last Year</SelectItem>
            </SelectContent>
          </Select>

          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[280px] justify-start text-left bg-white dark:bg-gray-800 hover:bg-primary-foreground font-normal focus:ring-blue-500 focus:ring-2 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0",
                  !date?.from && "text-muted-foreground"
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
            <PopoverContent className="w-auto p-0 mt-2 mr-4" align="start">
              <Calendar
                initialFocus
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
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="container mx-auto space-y-6 p-4 pb-20">
          <Summary
            transactions={transactions}
            dayChartDatas={dayChartDatas}
            chartDatas={chartDatas}
          />
          <div className="w-full gap-5 flex flex-col xl:flex-row items-center">
            <ChartArea
              className="flex-1"
              chartDatas={chartDatas}
              filterRangeBy={filterRangeBy}
              dayChartDatas={dayChartDatas}
              dateRange={dateRange}
            />
          </div>
          <ChartPie className="flex-1" chartPie={chartPie} />
        </div>
      </main>
      <Toaster />
    </div>
  );
}

export default Home;
