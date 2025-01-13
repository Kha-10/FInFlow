import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import CategoryForm from "./CategoryForm";
import CategoryList from "./CategoryList";
import PaginationControls from "../PaginationControls";
import axios from "@/helper/axios";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetHeader,
  SheetDescription,
} from "@/components/ui/sheet";
import { Plus, X } from "lucide-react";

export default function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [isCategorySheetOpen, setIsCategorySheetOpen] = useState(false);
  const [pagination, setPagination] = useState([]);
  const [loading, setLoading] = useState(false);

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

  const getCategories = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("twj");
      const response = await axios.get(
        `/api/categories?page=${page}&sort=${sort}&sortDirection=${sortDirection}${
          query ? `&search=${query}` : ""
        }`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        console.log(response);
        setCategories(response.data.data);
        setPagination(response.data.links);
      }
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      setLoading(false);
    }
  };

  useEffect(() => {
    getCategories();
  }, [page, query, sort, sortDirection]);

  return (
    <>
      <CategoryList
        categories={categories}
        setCategories={setCategories}
        loading={loading}
      />
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
          className="h-[500px] md:h-[400px] rounded-t-[20px] sm:rounded-t-[30px]"
        >
          <div className="h-full flex flex-col">
            <SheetHeader className="relative border-b border-border pb-4">
              <SheetTitle className="text-lg font-semibold text-foreground">
                Add New Category
              </SheetTitle>
              <SheetDescription className="hidden"></SheetDescription>
            </SheetHeader>
            <div className="flex-grow overflow-auto space-y-6 px-1 pt-6">
              <CategoryForm
                setCategories={setCategories}
                setIsCategorySheetOpen={setIsCategorySheetOpen}
              />
            </div>
          </div>
        </SheetContent>
      </Sheet>
      {!!pagination && pagination.totalPages > 1 && (
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
