import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

export default function FilterBadges({
  date,
  filteredCategory,
  type,
  searchParams,
  setSearchParams,
  clearDate,
}) {

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {date?.from && date.to && (
        <Badge variant="secondary" className="px-2 py-1">
          <span className="mr-1">
            {format(date?.from, "MMM d, yyyy")} -{" "}
            {format(date?.to, "MMM d, yyyy")}
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="h-auto p-0 text-muted-foreground hover:text-foreground"
            onClick={() => {
              searchParams.delete("dateRange");
              setSearchParams(searchParams);
              clearDate()
            }}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      )}
      {!!filteredCategory && filteredCategory?.name !== "all" && (
        <Badge variant="secondary" className="px-2 py-1">
          <span className="mr-1">Category: {filteredCategory?.name}</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-auto p-0 text-muted-foreground hover:text-foreground"
            onClick={() => {
              searchParams.delete("category");
              setSearchParams(searchParams);
            }}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      )}
      {!!type && type !== "all" && (
        <Badge variant="secondary" className="px-2 py-1">
          <span className="mr-1">
            Type: {type === "income" ? "Income" : "Outcome"}
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="h-auto p-0 text-muted-foreground hover:text-foreground"
            onClick={() => {
              searchParams.delete("type");
              setSearchParams(searchParams);
            }}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      )}
    </div>
  );
}
