import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ItemForm from "./ItemForm";
import ItemList from "./ItemList";
import axios from "@/helper/axios";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetHeader
} from "@/components/ui/sheet";
import { Plus,X} from "lucide-react";

const ItemManagement = () => {
  const [items, setItems] = useState([]);
  const [isItemSheetOpen, setIsItemSheetOpen] = useState(false);

  const { toast } = useToast();

  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search);
  const page = parseInt(searchQuery.get("page"))
    ? parseInt(searchQuery.get("page"))
    : 1;

  useEffect(() => {
    const getItems = async () => {
      try {
        const response = await axios.get(`/api/items?page=${page}`);
        if (response.status === 200) {
          // setRecipes(response.data.data);
          // setPagination(response.data.pagination);
          console.log(response);
          setItems(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching items:", error);
      } finally {
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      }
    };
    getItems();
  }, [page]);

  const form = useForm({
    defaultValues: {
      name: "",
      // defaultQuantity: "1",
      // defaultPrice: 0,
    },
  });

  async function onSubmit(values) {
    // onAddItem(values);
    console.log("kk");
    try {
      const res = await axios.post("/api/items", values);
      if (res.status === 200) {
        form.reset();
        toast({
          title: "Item added",
          description: `${values.name} has been added to your items list.`,
          duration: 3000,
        });
        setItems((prev) => [values, ...prev]);
        setIsItemSheetOpen(false);
      }
    } catch (error) {
      console.error("Error posting item:", error);
      toast({
        title: "Error",
        description: error.response.data
          ? error.response.data.msg
          : "There was an issue adding the item. Please try again.",
        duration: 3000,
        status: "error",
      });
    }
  }

  return (
    <>
      <ItemList items={items} setItems={setItems} />
      <Sheet open={isItemSheetOpen} onOpenChange={setIsItemSheetOpen}>
        <SheetTrigger asChild>
          <Button
            className="fixed bottom-20 md:bottom-4 right-4 h-14 w-14 rounded-full shadow-lg bg-blue-500 hover:bg-blue-600 text-white transition duration-300 ease-in-out transform hover:scale-105"
            size="icon"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="bottom"
          className="h-[400px] rounded-t-[20px] sm:rounded-t-[30px]"
        >
          <div className="h-full flex flex-col">
            <SheetHeader className="relative border-b border-border pb-4">
              <SheetTitle className="text-lg font-semibold text-foreground">
                Add New Item
              </SheetTitle>
            </SheetHeader>
            <div className="flex-grow overflow-auto space-y-6 px-1 pt-6">
              <ItemForm form={form} onSubmit={onSubmit} />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default ItemManagement;