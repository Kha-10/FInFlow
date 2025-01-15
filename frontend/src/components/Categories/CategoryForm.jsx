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

export default function CategoryForm({
  setCategories,
  setIsCategorySheetOpen,
}) {
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
      toast({
        title: "Adding Category",
        description: "Please wait a moment...",
      });
      const token = localStorage.getItem("twj");
      const res = await axios.post("/api/categories", values, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.status === 200) {
        form.reset();
        toast({
          title: "Category added",
          description: `${values.name} has been added to your categories list.`,
          duration: 3000,
          variant: "success",
        });
        setCategories((prev) => [res.data, ...prev]);
        setIsCategorySheetOpen(false);
      }
    } catch (error) {
      console.error("Error posting category:", error);
      toast({
        title: "Error",
        description: error.response?.data
          ? error.response.data.msg
          : "There was an issue adding the category. Please try again.",
        duration: 3000,
        variant: "error",
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
              <FormLabel>Category Name</FormLabel>
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
          Add Category
        </Button>
      </form>
    </Form>
  );
}
