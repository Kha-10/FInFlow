import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
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
import { CalendarIcon, Trash } from "lucide-react";
import { format } from "date-fns";
import { useForm, useFieldArray } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect } from "react";
import { DevTool } from "@hookform/devtools";
import { useToast } from "@/hooks/use-toast";
import axios from "@/helper/axios";

export default function EditTransactionDialog({
  transaction,
  categories,
  onUpdate,
  onClose,
  setPurchases,
}) {
  const form = useForm({
    defaultValues: {
      type: "expense",
      category: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
      items: [],
      amount: 0,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const { toast } = useToast();

  const watchItems = form.watch("items");
  const total = watchItems?.reduce(
    (sum, item) => sum + (parseFloat(item.quantity) || 0) * (item.price || 0),
    0
  );

  useEffect(() => {
    if (transaction) {
      const updatedTransaction = {
        ...transaction,
        category: transaction.category?._id || "",
        amount: parseFloat(transaction.amount) || 0,
      };
      form.reset(updatedTransaction);
    }
  }, [form, transaction]);

  if (!transaction) return null;

  async function onSubmit(values) {
    console.log(values);
    try {
      const res = await axios.patch(`/api/purchases/${values._id}`, values);
      if (res.status === 200) {
        toast({
          title: "Transaction updated",
          description: "The transaction has been updated successfully.",
          duration: 3000,
        });
        setPurchases((prevItems) =>
          prevItems.map((item) =>
            item._id === values._id ? { ...item, ...res.data } : item
          )
        );
        form.reset();
        onClose();
      }
    } catch (error) {
      console.error("Error updating transaction:", error);
      toast({
        title: "Error",
        description: error.response.data
          ? error.response.data.msg
          : "There was an issue updating the transaction. Please try again.",
        status: "error",
      });
    }
  }

  return (
    <Dialog open={!!transaction} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] lg:max-w-[800px] w-[90vw] max-h-[90vh] rounded-lg flex flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle>Edit Transaction</DialogTitle>
          <DialogDescription className="hidden"></DialogDescription>
        </DialogHeader>
        <div className="flex-grow overflow-y-auto">
          {/* <ScrollArea className="h-full"> */}
          {/* <div className="p-4 pb-1"> */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="flex-grow overflow-y-auto pr-4 -mr-4 h-full">
                <div className="space-y-6 pb-1 px-1">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="transactionType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full bg-primary-foreground focus:ring-blue-500 focus:ring-2 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0">
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="income">Income</SelectItem>
                              <SelectItem value="outcome">Outcome</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full bg-primary-foreground focus:ring-blue-500 focus:ring-2 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0">
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem
                                  key={category._id}
                                  value={category._id}
                                >
                                  {category.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Input
                              autoComplete="off"
                              {...field}
                              className="w-full bg-primary-foreground focus:ring-blue-500 focus:ring-2 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal bg-primary-foreground focus:ring-blue-500 focus:ring-2 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(new Date(field.value), "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={
                                  field.value
                                    ? new Date(field.value)
                                    : undefined
                                }
                                onSelect={(date) =>
                                  field.onChange(
                                    date ? date.toISOString().split("T")[0] : ""
                                  )
                                }
                                disabled={(date) =>
                                  date > new Date() ||
                                  date < new Date("1900-01-01")
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Amount</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              {...field}
                              className="w-full bg-primary-foreground focus:ring-blue-500 focus:ring-2 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  {fields.map((field, index) => (
                    <div key={field.id} className="space-y-4">
                      <FormField
                        control={form.control}
                        name={`items.${index}.name`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Item Name</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                className="w-full bg-primary-foreground focus:ring-blue-500 focus:ring-2 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name={`items.${index}.quantity`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Quantity</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  className="w-full bg-primary-foreground focus:ring-blue-500 focus:ring-2 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`items.${index}.price`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Price</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  step="0.01"
                                  {...field}
                                  className="w-full bg-primary-foreground focus:ring-blue-500 focus:ring-2 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => remove(index)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  {form.getValues("purchaseType") == "Full Form" && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        append({ name: "", quantity: "", price: 0 })
                      }
                      className="mt-2"
                    >
                      Add Item
                    </Button>
                  )}
                </div>
              </div>
              <div className="mt-4 border-t pt-4">
                <Button
                  type="submit"
                  className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white"
                >
                  Add Purchase
                </Button>
              </div>
            </form>
          </Form>
          {/* </div> */}
          {/* </ScrollArea> */}
        </div>
        {/* <div className="p-4 border-t mt-4">
          <Button
            type="submit"
            className="w-full mt-4 bg-btn hover:bg-blue-600 text-white"
          >
            Update Transaction
          </Button>
        </div> */}
      </DialogContent>
      <DevTool control={form.control} />
    </Dialog>
  );
}
