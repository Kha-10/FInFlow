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
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { CalendarIcon, Trash2, Plus } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect, useRef } from "react";
import { DevTool } from "@hookform/devtools";
import { useToast } from "@/hooks/use-toast";
import axios from "@/helper/axios";

export default function EditTransactionDialog({
  transaction,
  categories,
  onClose,
  setPurchases,
  itemlist,
}) {
  const [activeIndex, setActiveIndex] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef(null);

  const handleClickOutside = (e) => {
    if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
      setShowSuggestions(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const form = useForm({
    defaultValues: {
      transactionType: "outcome",
      category: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
      items: [],
      amount: 0,
      total: 0,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const data = [
    "G",
    "KG",
    "L",
    "ML",
    "PCS",
    "PAX",
    "PACK",
    "QTY",
    "LBS",
    "HOUR",
    "BOX",
  ];

  const { toast } = useToast();

  const watchItems = form.watch("items");
  const total = watchItems?.reduce(
    (sum, item) => sum + parseFloat(item.price || 0),
    0
  );

  useEffect(() => {
    if (total > 0) {
      form.setValue("total", total.toFixed(2));
    }
  }, [total]);

  useEffect(() => {
    if (transaction) {
      const updatedTransaction = {
        ...transaction,
        category: transaction.category?._id || "",
        date: transaction.date
          ? new Date(transaction.date).toISOString().split("T")[0] // Convert to YYYY-MM-DD
          : new Date().toISOString().split("T")[0],
        amount: parseFloat(transaction.amount) || 0,
      };
      form.reset(updatedTransaction);
    }
  }, [form, transaction]);

  if (!transaction) return null;

  async function onSubmit(values) {
    const updatedValues = { ...values };
    if (!updatedValues.amount) {
      delete updatedValues.amount;
    }
    if (!updatedValues.total) {
      delete updatedValues.total;
    }

    try {
      toast({
        title: "Updating transaction",
        description: "Please wait a moment...",
      });
      const token = localStorage.getItem("twj");
      const res = await axios.patch(
        `/api/purchases/${updatedValues._id}`,
        updatedValues,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.status === 200) {
        toast({
          title: "Transaction updated",
          description: "The transaction has been updated successfully.",
          duration: 3000,
          variant: "success",
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
        variant: "error",
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
                              {...form.register("description", {
                                required: {
                                  value: true,
                                  message: "Description is required",
                                },
                              })}
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
                                  {console.log(
                                    "showing Date",
                                    format(new Date(field.value), "PPP")
                                  )}
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
                                onSelect={(selectedDate) => {
                                  if (!selectedDate) return;
                                  const year = selectedDate.getFullYear();
                                  const month = selectedDate.getMonth();
                                  const day = selectedDate.getDate();
                                  const formattedDate = `${year}-${String(
                                    month + 1
                                  ).padStart(2, "0")}-${String(day).padStart(
                                    2,
                                    "0"
                                  )}`;
                                  field.onChange(formattedDate);
                                }}
                                // disabled={(date) =>
                                //   date > new Date() ||
                                //   date < new Date("1900-01-01")
                                // }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {form.formState.defaultValues.purchaseType ===
                      "Quick Add" && (
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
                    )}
                  </div>
                  {form.formState.defaultValues.purchaseType ===
                    "Full Form" && (
                    <div className="space-y-2">
                      <Card>
                        <CardHeader className="w-full flex flex-row items-center justify-between">
                          <CardTitle className="text-base">Items</CardTitle>
                          <Button
                            type="button"
                            variant="outline"
                            className="border border-blue-500 text-blue-500"
                            onClick={() =>
                              append({
                                name: "",
                                price: 0,
                                pricePerUnit: false,
                              })
                            }
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Add item
                          </Button>
                        </CardHeader>
                        {fields.length > 0 && (
                          <CardContent className="space-y-4">
                            {fields.map((field, index) => (
                              <div
                                key={field.id}
                                className="rounded-lg border border-gray-200 p-4 space-y-4"
                              >
                                <div className="flex items-center justify-between">
                                  <h3 className="text-lg font-medium">
                                    Item {index + 1}
                                  </h3>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => remove(index)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                                <div
                                  ref={wrapperRef}
                                  className="relative w-full flex justify-start space-x-4"
                                >
                                  <FormField
                                    control={form.control}
                                    name={`items.${index}.name`}
                                    render={({ field }) => (
                                      <FormItem className="w-full">
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                          <Input
                                            className="w-full bg-primary-foreground focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0"
                                            placeholder="Name"
                                            autoComplete="off"
                                            onFocus={() => {
                                              setActiveIndex(index);
                                              setShowSuggestions(true);
                                            }}
                                            {...field}
                                            {...form.register(
                                              `items.${index}.name`,
                                              {
                                                required: {
                                                  value: true,
                                                  message: "Name is required",
                                                },
                                              }
                                            )}
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  {showSuggestions &&
                                    activeIndex === index &&
                                    itemlist?.length > 0 &&
                                    activeIndex !== null && (
                                      <div className="absolute z-50 top-20 -left-5 w-full bg-background border rounded-md shadow-lg">
                                        <ScrollArea className="max-h-60">
                                          {itemlist.map((item) => (
                                            <Button
                                              key={item._id}
                                              onMouseDown={(e) => {
                                                e.preventDefault();
                                                const currentItems =
                                                  form.getValues("items");
                                                currentItems[index] = {
                                                  ...currentItems[index],
                                                  name: item.name,
                                                };
                                                form.setValue(
                                                  "items",
                                                  currentItems
                                                );
                                                setShowSuggestions(false);
                                              }}
                                              variant="ghost"
                                              type="button"
                                              className="w-full justify-start rounded-none h-auto py-3 px-4 space-y-1"
                                            >
                                              <div className="flex flex-col items-start">
                                                <span className="text-sm font-medium">
                                                  {item.name}
                                                </span>
                                              </div>
                                            </Button>
                                          ))}
                                        </ScrollArea>
                                      </div>
                                    )}
                                  <FormField
                                    control={form.control}
                                    name={`items.${index}.price`}
                                    render={({ field }) => (
                                      <FormItem className="w-full">
                                        <FormLabel>Price</FormLabel>
                                        <FormControl>
                                          <Input
                                            className="w-full bg-primary-foreground focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0"
                                            type="number"
                                            placeholder="0"
                                            min="0"
                                            step="0.01"
                                            {...field}
                                            {...form.register(
                                              `items.${index}.price`,
                                              {
                                                required: {
                                                  value: true,
                                                  message: "Price is required",
                                                },
                                              }
                                            )}
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              field.onChange(
                                                value === ""
                                                  ? ""
                                                  : parseFloat(value)
                                              );
                                            }}
                                            value={field.value || ""}
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </div>
                                <FormField
                                  control={form.control}
                                  name={`items.${index}.pricePerUnit`}
                                  render={({ field }) => (
                                    <FormItem className="flex items-center space-x-3">
                                      <FormControl>
                                        <Checkbox
                                          className="peer data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500 border-gray-300 mt-1"
                                          checked={field.value}
                                          onCheckedChange={(checked) => {
                                            field.onChange(checked);
                                            if (!checked) {
                                              const updatedItems = form
                                                .getValues("items")
                                                .map((item, idx) => {
                                                  if (idx === index) {
                                                    const {
                                                      unit,
                                                      unitValue,
                                                      ...rest
                                                    } = item;
                                                    return rest;
                                                  }
                                                  return item;
                                                });
                                              form.setValue(
                                                "items",
                                                updatedItems
                                              );
                                            }
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel
                                        htmlFor="pricePerUnit"
                                        className="text-sm"
                                      >
                                        Price per unit
                                      </FormLabel>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                {form.watch(`items.${index}.pricePerUnit`) && (
                                  <div className="flex items-center gap-3">
                                    <FormField
                                      control={form.control}
                                      name={`items.${index}.unitValue`}
                                      render={({ field }) => (
                                        <FormItem className="w-full min-h-5">
                                          <FormLabel>Unit value</FormLabel>
                                          <FormControl>
                                            <Input
                                              className="w-full bg-primary-foreground focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0"
                                              type="number"
                                              placeholder="0"
                                              min="0"
                                              step="0.01"
                                              {...field}
                                              {...form.register(
                                                `items.${index}.unitValue`,
                                                {
                                                  required: {
                                                    value: true,
                                                    message:
                                                      "Unit value is required",
                                                  },
                                                }
                                              )}
                                              onChange={(e) => {
                                                const value = e.target.value;
                                                field.onChange(
                                                  value === ""
                                                    ? ""
                                                    : parseFloat(value)
                                                );
                                              }}
                                              value={field.value || ""}
                                            />
                                          </FormControl>
                                          <div className="min-h-[20px]">
                                            <FormMessage />
                                          </div>
                                        </FormItem>
                                      )}
                                    />
                                    <FormField
                                      control={form.control}
                                      name={`items.${index}.unit`}
                                      rules={{
                                        required: "Please select a unit",
                                      }}
                                      render={({ field }) => (
                                        <FormItem className="w-full">
                                          <FormLabel>Unit</FormLabel>
                                          <FormControl>
                                            <Select
                                              value={field.value}
                                              onValueChange={field.onChange}
                                            >
                                              <SelectTrigger className="w-full bg-primary-foreground focus:ring-blue-500 focus:ring-2 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0">
                                                <SelectValue placeholder="Select unit" />
                                              </SelectTrigger>
                                              <SelectContent>
                                                <SelectGroup>
                                                  <SelectLabel>
                                                    Units
                                                  </SelectLabel>
                                                  {data.map((item, i) => (
                                                    <SelectItem
                                                      key={i}
                                                      value={item}
                                                    >
                                                      {item}
                                                    </SelectItem>
                                                  ))}
                                                </SelectGroup>
                                              </SelectContent>
                                            </Select>
                                          </FormControl>
                                          <div className="min-h-[20px]">
                                            <FormMessage />
                                          </div>
                                        </FormItem>
                                      )}
                                    />
                                  </div>
                                )}
                              </div>
                            ))}
                          </CardContent>
                        )}
                      </Card>
                      {form.formState.errors.items && (
                        <p className=" text-sm text-red-500 font-medium">
                          {form.formState.errors.items?.root?.message}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
              {form.formState.defaultValues.purchaseType === "Full Form" && (
                <div className="flex justify-between items-center pt-4 border-t mt-6">
                  <span className="text-lg font-semibold">Total:</span>
                  <span className="text-lg font-semibold">
                    ${parseFloat(total).toFixed(2)}
                  </span>
                </div>
              )}
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
        </div>
      </DialogContent>
      <DevTool control={form.control} />
    </Dialog>
  );
}
