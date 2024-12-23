import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil, Trash } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function CategoryForm({
  categories,
  onSubmit,
  onUpdate,
  onDelete,
}) {
  const [categoryName, setCategoryName] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (categoryName.trim()) {
      onSubmit(categoryName.trim());
      setCategoryName("");
    }
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    if (editingCategory && editingCategory.name.trim()) {
      onUpdate(editingCategory.id, editingCategory.name.trim());
      setEditingCategory(null);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="categoryName">Category Name</Label>
          <Input
            id="categoryName"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="Enter category name"
          />
        </div>
        <Button
          type="submit"
          className="text-center bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
        >
          Add Category
        </Button>
      </form>

      <div>
        <h2 className="mb-4 text-xl font-semibold">Existing Categories</h2>
        <ul className="space-y-2">
          {categories.map((category) => (
            <li
              key={category.id}
              className="flex items-center justify-between rounded-md border p-2"
            >
              <span>{category.name}</span>
              <div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditingCategory(category)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Category</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleUpdate} className="space-y-4">
                      <div>
                        <Label htmlFor="editCategoryName">Category Name</Label>
                        <Input
                          id="editCategoryName"
                          value={editingCategory?.name || ""}
                          onChange={(e) =>
                            setEditingCategory((prev) =>
                              prev ? { ...prev, name: e.target.value } : null
                            )
                          }
                          placeholder="Enter category name"
                        />
                      </div>
                      <Button type="submit">Update Category</Button>
                    </form>
                  </DialogContent>
                </Dialog>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(category.id)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}