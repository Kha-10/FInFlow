import React from "react";
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
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import axios from "@/helper/axios";

const ItemForm = ({ setItems, setIsItemSheetOpen }) => {
  const { toast } = useToast();
  const form = useForm({
    defaultValues: {
      name: "",
      // defaultQuantity: "1",
      // defaultPrice: 0,
    },
  });

  async function onSubmit(values) {
    try {
      const token = localStorage.getItem("twj");
      const res = await axios.post("/api/items", values, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.status === 200) {
        form.reset();
        toast({
          title: "Item added",
          description: `${values.name} has been added to your items list.`,
          duration: 3000,
        });
        setItems((prev) => [res.data, ...prev]);
        setIsItemSheetOpen(false);
      }
    } catch (error) {
      console.error("Error posting item:", error);
      toast({
        title: "Error",
        description: error.response?.data
          ? error.response.data.msg
          : "There was an issue adding the item. Please try again.",
        duration: 3000,
        status: "error",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          id="item-form"
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Item Name</FormLabel>
              <FormControl>
                <Input
                  autoComplete="off"
                  className="w-full bg-primary-foreground focus:ring-blue-500 focus:ring-2 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0"
                  {...field}
                  {...form.register("name", {
                    required: {
                      value: true,
                      message: "Item name is required",
                    },
                  })}
                  placeholder="Enter item name"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* <FormField
                control={form.control}
                name="defaultQuantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Default Quantity</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="defaultPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Default Price</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
        <Button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md"
        >
          Add Item
        </Button>
      </form>
    </Form>
  );
};

export default ItemForm;
