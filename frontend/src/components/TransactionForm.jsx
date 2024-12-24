import { useState } from "react";
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
import { Label } from "./ui/label";
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
import { DevTool } from "@hookform/devtools";

export default function TransactionForm({ onSubmit, categories }) {
  //   const [items, setItems] = useState([]);
  //   const [itemForm, setItemForm] = useState({
  //     name: "",
  //     quantity: "",
  //     price: 0,
  //   });

  const form = useForm({
    defaultValues: {
      type: "cash-out",
      category: "",
      description: "",
      amount: 0,
      date: new Date(),
      items: [],
      pricePerUnit: false,
    },
  });

  const quickAddForm = useForm({
    defaultValues: {
      type: "cash-out",
      category: "",
      description: "",
      date: new Date(),
      amount: 0,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items", // Specify the field array name
  });
  console.log(form.getValues("items"));
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

  //   const totalAmount = items.reduce((sum, item) => sum + item.price, 0);

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

  function handleQuickAddSubmit(values) {
    onSubmit({
      ...values,
      items: [
        {
          name: values.description,
          quantity: "1",
          price: values.amount,
        },
      ],
      totalAmount: values.amount,
    });
    quickAddForm.reset();
  }

  return (
    <Tabs defaultValue="full" className="w-full">
      <TabsList className="grid w-full grid-cols-2 h-10 items-center rounded-lg">
        <TabsTrigger
          value="full"
          className="h-8 px-4 text-sm font-medium transition-all data-[state=active]:text-blue-500"
        >
          Full Form
        </TabsTrigger>
        <TabsTrigger
          value="quick"
          className="h-8 px-4 text-sm font-medium transition-all data-[state=active]:text-blue-500"
        >
          Quick Add
        </TabsTrigger>
      </TabsList>
      <TabsContent value="full">
        <div className="space-y-6 px-1">
          <Form {...form}>
            <ScrollArea className="max-h-[480px] overflow-y-auto">
              <form
                id="transaction-form"
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="type"
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
                                value="cash-in"
                                className=" text-white border-gray-300 
              before:h-2 before:w-2 before:bg-white
              data-[state=checked]:border-blue-500 data-[state=checked]:bg-blue-500
              data-[state=checked]:before:bg-white mt-1"
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Cash In
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <RadioGroupItem
                                value="cash-out"
                                className=" text-white border-gray-300 
              before:h-2 before:w-2 before:bg-white
              data-[state=checked]:border-blue-500 data-[state=checked]:bg-blue-500
              data-[state=checked]:before:bg-white mt-1"
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Cash Out
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
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full bg-primary-foreground focus:ring-blue-500 focus:ring-2 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.name}>
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
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          className="w-full bg-primary-foreground focus:ring-blue-500 focus:ring-2 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0"
                          onChange={(e) => {
                            const value = parseFloat(e.target.value); // Convert to number
                            field.onChange(isNaN(value) ? "" : value); // Ensure not NaN
                          }}
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
                  <CardHeader>
                    <CardTitle>Items</CardTitle>
                  </CardHeader>
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
                                    onChange={(e) =>
                                      field.onChange(parseFloat(e.target.value))
                                    }
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
                                  onCheckedChange={field.onChange}
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
                                      onChange={(e) =>
                                        field.onChange(
                                          parseFloat(e.target.value)
                                        )
                                      }
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
                    <div className="w-full flex justify-start space-x-4">
                      <Button
                        type="button"
                        variant="outline"
                        className=""
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
                    </div>
                  </CardContent>
                </Card>
              </form>
            </ScrollArea>
            <div className="mt-4 border-t pt-4">
              <Button
                type="submit"
                form="transaction-form"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white"
              >
                Add Purchase
              </Button>
            </div>
          </Form>
          <DevTool control={form.control} />
        </div>
      </TabsContent>
      <TabsContent value="quick">
        <div className="space-y-6 px-1">
          <Form {...quickAddForm}>
            <ScrollArea className="max-h-[480px] overflow-y-auto">
              <form
                onSubmit={quickAddForm.handleSubmit(handleQuickAddSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={quickAddForm.control}
                  name="type"
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
                                value="cash-in"
                                className=" text-white border-gray-300 
              before:h-2 before:w-2 before:bg-white
              data-[state=checked]:border-blue-500 data-[state=checked]:bg-blue-500
              data-[state=checked]:before:bg-white mt-1"
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Cash In
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <RadioGroupItem
                                value="cash-out"
                                className=" text-white border-gray-300 
              before:h-2 before:w-2 before:bg-white
              data-[state=checked]:border-blue-500 data-[state=checked]:bg-blue-500
              data-[state=checked]:before:bg-white mt-1"
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Cash Out
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
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full bg-primary-foreground focus:ring-blue-500 focus:ring-2 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.name}>
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
                          placeholder="Enter description"
                          {...field}
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
              </form>
            </ScrollArea>
            <div className="mt-4 border-t pt-4">
              <Button
                type="submit"
                form="quickAdd-form"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white"
              >
                Add Purchase
              </Button>
            </div>
          </Form>
          <DevTool control={quickAddForm.control} />
        </div>
      </TabsContent>
    </Tabs>
  );
}
