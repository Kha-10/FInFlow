import { useState, useEffect } from "react";
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
import { X, Plus, Trash2, CalendarIcon } from "lucide-react";
import { Label } from "../ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import axios from "@/helper/axios";
import { DevTool } from "@hookform/devtools";

export default function TransactionForm({
  setIsSheetOpen,
  setPurchases,
  categories,
}) {
  const [activeTab, setActiveTab] = useState("Quick Add");
  const { toast } = useToast();

  const form = useForm({
    defaultValues: {
      transactionType: "outcome",
      category: null,
      description: "",
      amount: 0,
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
    name: "items", // Specify the field array name
  });
  //   const addItem = () => {
  //     setItems([...items, { ...itemForm }]);
  //     setItemForm({ name: "", quantity: "", price: 0 });
  //   };

  const addItem = () => {
    append({ name: "", quantity: "", price: 0 }); // Add a new empty item
  };

  //   const removeItem = (index) => {
  //     setItems(items.filter((_, i) => i !== index));
  //   };

  const items = form.watch("items");
  const totalAmount = items.reduce((sum, item) => sum + item.price, 0);

  useEffect(() => {
    if (totalAmount > 0) {
      form.setValue("total", totalAmount);
    }
  }, [totalAmount]);

  function handleSubmit(values) {
    onSubmit({ ...values });
    form.reset();
  }

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
    try {
      const res = await axios.post("/api/purchases", updatedValues);
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
                          <div className="w-full flex justify-start space-x-4">
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
                                      {...field}
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
                                  <FormItem className="w-full">
                                    <FormLabel>Unit value</FormLabel>
                                    <FormControl>
                                      <Input
                                        className="w-full bg-primary-foreground focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0"
                                        type="number"
                                        placeholder="0"
                                        min="0"
                                        step="0.01"
                                        {...field}
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
                              <FormField
                                control={form.control}
                                name={`items.${index}.unit`}
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
                                              <SelectItem key={i} value={item}>
                                                {item}
                                              </SelectItem>
                                            ))}
                                          </SelectGroup>
                                        </SelectContent>
                                      </Select>
                                    </FormControl>
                                    <FormMessage />
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
              </div>
            </div>
            {activeTab == "Full Form" && (
              <div className="flex justify-between items-center pt-4 border-t mt-6">
                <span className="text-lg font-semibold">Total:</span>
                <span className="text-lg font-semibold">${totalAmount}</span>
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
                        {/* <Input
                          type="number"
                          step="0.01"
                          {...field}
                          className="w-full bg-primary-foreground focus:ring-blue-500 focus:ring-2 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0"
                        /> */}
                        <Input
                          className="w-full bg-primary-foreground focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0"
                          type="number"
                          placeholder="0"
                          min="0"
                          step="0.01"
                          {...field}
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
