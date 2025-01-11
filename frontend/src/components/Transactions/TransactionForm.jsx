import { useState, useEffect, useRef, useCallback } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, CalendarIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { ScrollArea } from "../ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import axios from "@/helper/axios";
import { DevTool } from "@hookform/devtools";

export default function TransactionForm({
  setIsSheetOpen,
  setPurchases,
  categories,
  itemlist,
}) {
  const [activeTab, setActiveTab] = useState("Quick Add");
  const [isFocused, setIsFocused] = useState(false);
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

  const { toast } = useToast();

  const form = useForm({
    defaultValues: {
      transactionType: "outcome",
      category: null,
      description: "",
      date: new Date(),
      items: [],
      total: 0,
    },
  });

  const quickAddForm = useForm({
    defaultValues: {
      transactionType: "outcome",
      category: null,
      description: "",
      date: new Date(),
      amount: 0,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
    rules: {
      required: "At least one item is required",
    },
  });

  const items = form.watch("items");
  const totalAmount = items.reduce(
    (sum, item) => sum + parseFloat(item.price),
    0
  );

  useEffect(() => {
    if (totalAmount > 0) {
      form.setValue("total", totalAmount.toFixed(2));
    }
  }, [totalAmount]);

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

  async function onSubmit(values) {
    const updatedValues = {
      ...values,
      date: values.date || new Date(),
      purchaseType: activeTab,
    };
    if (activeTab === "Full Form" && fields.length === 0) {
      form.setError("items", {
        type: "custom",
        message: "At least one item is required",
      });
      return false;
    }
    try {
      const token = localStorage.getItem("twj");
      const res = await axios.post("/api/purchases", updatedValues, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.status === 200) {
        form.reset();
        toast({
          title: "Purchase added",
          description: `${values.description} has been added to your purchase list.`,
          duration: 3000,
        });
        setPurchases((prev) => [res.data, ...prev]);
        setIsSheetOpen(false);
      }
    } catch (error) {
      console.error("Error posting purchase:", error);
      toast({
        title: "Error",
        description: error.response.data
          ? error.response.data.msg
          : "There was an issue adding the purchase. Please try again.",
        duration: 3000,
        status: "error",
      });
    }
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2 h-10 items-center rounded-lg">
        <TabsTrigger
          value="Quick Add"
          className="h-8 px-4 text-sm font-medium transition-all data-[state=active]:text-blue-500"
        >
          Quick Add
        </TabsTrigger>
        <TabsTrigger
          value="Full Form"
          className="h-8 px-4 text-sm font-medium transition-all data-[state=active]:text-blue-500"
        >
          Full Form
        </TabsTrigger>
      </TabsList>
      <TabsContent value="Full Form">
        <Form {...form}>
          <form
            id="transaction-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col max-h-[560px]"
          >
            <div className="flex-grow overflow-y-auto pr-4 -mr-4 h-full">
              <div className="space-y-6 py-4 px-1">
                <FormField
                  control={form.control}
                  name="transactionType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Transaction Type</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex space-x-4"
                        >
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <RadioGroupItem
                                value="income"
                                className=" text-white border-gray-300 
              before:h-2 before:w-2 before:bg-white
              data-[state=checked]:border-blue-500 data-[state=checked]:bg-blue-500
              data-[state=checked]:before:bg-white mt-1"
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Income
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <RadioGroupItem
                                value="outcome"
                                className=" text-white border-gray-300 
              before:h-2 before:w-2 before:bg-white
              data-[state=checked]:border-blue-500 data-[state=checked]:bg-blue-500
              data-[state=checked]:before:bg-white mt-1"
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Outcome
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  rules={{ required: "Please select a category" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value || ""}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full bg-primary-foreground focus:ring-blue-500 focus:ring-2 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category._id} value={category._id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter description"
                          {...form.register("description", {
                            required: {
                              value: true,
                              message: "Description is required",
                            },
                          })}
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
                      <FormControl>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-[240px] pl-3 bg-primary-foreground focus:ring-blue-500 focus:ring-2 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                              classNames={{
                                day_selected:
                                  "bg-blue-500 text-white hover:bg-blue-600 hover:text-white focus:bg-blue-600",
                                day_today: "bg-accent text-accent-foreground",
                              }}
                            />
                          </PopoverContent>
                        </Popover>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="space-y-2">
                  <Card>
                    <CardHeader className="w-full flex flex-row items-center justify-between">
                      <CardTitle className="text-base">Items</CardTitle>
                      <Button
                        type="button"
                        variant="outline"
                        className="border border-blue-500 text-blue-500"
                        onClick={() => {
                          append({
                            name: "",
                            price: 0,
                            pricePerUnit: false,
                          });
                        }}
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
                                  <FormItem className="relative w-full">
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
                                          form.setValue("items", updatedItems);
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
                                  rules={{ required: "Please select a unit" }}
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
                                              <SelectLabel>Units</SelectLabel>
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
              </div>
            </div>
            {activeTab == "Full Form" && (
              <div className="flex justify-between items-center pt-4 border-t mt-6">
                <span className="text-lg font-semibold">Total:</span>
                <span className="text-lg font-semibold">
                  ${parseFloat(totalAmount).toFixed(2)}
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
        <DevTool control={form.control} />
      </TabsContent>
      <TabsContent value="Quick Add">
        <Form {...quickAddForm}>
          <form
            onSubmit={quickAddForm.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <div className="flex-grow overflow-y-auto pr-4 -mr-4 h-full">
              <div className="space-y-6 py-4 px-1">
                <FormField
                  control={quickAddForm.control}
                  name="transactionType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Transaction Type</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex space-x-4"
                        >
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <RadioGroupItem
                                value="income"
                                className=" text-white border-gray-300 
              before:h-2 before:w-2 before:bg-white
              data-[state=checked]:border-blue-500 data-[state=checked]:bg-blue-500
              data-[state=checked]:before:bg-white mt-1"
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Income
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <RadioGroupItem
                                value="outcome"
                                className=" text-white border-gray-300 
              before:h-2 before:w-2 before:bg-white
              data-[state=checked]:border-blue-500 data-[state=checked]:bg-blue-500
              data-[state=checked]:before:bg-white mt-1"
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Outcome
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={quickAddForm.control}
                  name="category"
                  rules={{ required: "Please select a category" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value || ""}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full bg-primary-foreground focus:ring-blue-500 focus:ring-2 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories?.map((category) => (
                            <SelectItem key={category._id} value={category._id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={quickAddForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input
                          autoComplete="off"
                          placeholder="Enter description"
                          {...field}
                          {...quickAddForm.register("description", {
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
                  control={quickAddForm.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date</FormLabel>
                      <FormControl>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-[240px] pl-3 bg-primary-foreground focus:ring-blue-500 focus:ring-2 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              // disabled={(date) =>
                              //   date > new Date() || date < new Date("1900-01-01")
                              // }
                              initialFocus
                              classNames={{
                                day_selected:
                                  "bg-blue-500 text-white hover:bg-blue-600 hover:text-white focus:bg-blue-600",
                                day_today: "bg-accent text-accent-foreground",
                              }}
                            />
                          </PopoverContent>
                        </Popover>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={quickAddForm.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <Input
                          className="w-full bg-primary-foreground focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0"
                          type="number"
                          placeholder="0"
                          min="0"
                          step="0.01"
                          {...field}
                          {...quickAddForm.register("amount", {
                            required: {
                              value: true,
                              message: "Amount is required",
                            },
                          })}
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(
                              value === "" ? "" : parseFloat(value)
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
        <DevTool control={quickAddForm.control} />
      </TabsContent>
    </Tabs>
  );
}
