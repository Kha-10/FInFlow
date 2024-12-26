import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import CategoryForm from "./CategoryForm";
import CategoryList from "./CategoryList";
import PaginationControls from "../PaginationControls";
import axios from "@/helper/axios";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetHeader,
} from "@/components/ui/sheet";
import { Plus, X } from "lucide-react";

export default function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [isCategorySheetOpen, setIsCategorySheetOpen] = useState(false);
  const [pagination, setPagination] = useState([]);

  const { toast } = useToast();

  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search);
  const page = parseInt(searchQuery.get("page"))
    ? parseInt(searchQuery.get("page"))
    : 1;
  const query = searchQuery.get("search");
  const sort = searchQuery.get("sort") ? searchQuery.get("sort") : "createdAt";
  const sortDirection = searchQuery.get("sortDirection")
    ? searchQuery.get("sortDirection")
    : "desc";

  const getItems = async () => {
    try {
      const response = await axios.get(
        `/api/categories?page=${page}&sort=${sort}&sortDirection=${sortDirection}${
          query ? `&search=${query}` : ""
        }`
      );
      if (response.status === 200) {
        // setRecipes(response.data.data);
        console.log(response);
        setCategories(response.data.data);
        setPagination(response.data.links);
      }
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }
  };

  useEffect(() => {
    getItems();
  }, [page, query, sort, sortDirection]);

  const form = useForm({
    defaultValues: {
      name: "",
      // defaultQuantity: "1",
      // defaultPrice: 0,
    },
  });

  async function onSubmit(values) {
    try {
      const res = await axios.post("/api/categories", values);
      if (res.status === 200) {
        form.reset();
        toast({
          title: "Category added",
          description: `${values.name} has been added to your categories list.`,
          duration: 3000,
        });
        setCategories((prev) => [values, ...prev]);
        setIsCategorySheetOpen(false);
      }
    } catch (error) {
      console.error("Error posting category:", error);
      toast({
        title: "Error",
        description: error.response.data
          ? error.response.data.msg
          : "There was an issue adding the category. Please try again.",
        duration: 3000,
        status: "error",
      });
    }
  }

  return (
    <>
      <CategoryList categories={categories} setCategories={setCategories} />
      <Sheet open={isCategorySheetOpen} onOpenChange={setIsCategorySheetOpen}>
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
                Add New Category
              </SheetTitle>
            </SheetHeader>
            <div className="flex-grow overflow-auto space-y-6 px-1 pt-6">
              <CategoryForm form={form} onSubmit={onSubmit} />
            </div>
          </div>
        </SheetContent>
      </Sheet>
      {!!pagination && (
        <PaginationControls
          pagination={pagination}
          currentPage={page}
          query={query}
          sort={sort}
          sortDirection={sortDirection}
        />
      )}
    </>
  );
}
