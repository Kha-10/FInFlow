import { useState } from "react";
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
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Pencil, Trash } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import axios from "@/helper/axios"

export default function ItemList({
  items,
  setItems
}) {
  const [editingItem, setEditingItem] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { toast } = useToast();

  const editForm = useForm({
    defaultValues: editingItem || {
      name: "",
      // defaultQuantity: "1",
      // defaultPrice: 0,
    },
  });

  async function onEdit(values) {
    try {
      const res = await axios.patch(`/api/items/${editingItem._id}`, values);
      if (res.status === 200) {
        toast({
          title: "Item updated",
          description: "The item has been updated successfully.",
          duration: 3000,
        });
        setItems((prevItems) =>
          prevItems.map((item) =>
            item._id === editingItem._id ? { ...item, ...values } : item
          )
        );
        editForm.reset();
        setIsDialogOpen(false);
      }
    } catch (error) {
      console.error("Error updating item:", error);
      toast({
        title: "Error",
        description: error.response.data
          ? error.response.data.msg
          : "There was an issue updating the item. Please try again.",
        status: "error",
      });
    }
  }

  async function onDeleteItem(id) {
    try {
      const res = await axios.delete(`/api/items/${id}`);
      if (res.status === 200) {
        toast({
          title: "Item deleted",
          description: "The item has been deleted successfully.",
          duration: 3000,
        });
        setItems((prevItems) => prevItems.filter((item) => item._id !== id));
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      toast({
        title: "Error",
        description: error.response.data
          ? error.response.data.msg
          : "There was an issue deleting the item. Please try again.",
        status: "error",
      });
    }
  }

  return (
    <div className="space-y-6 pt-3">
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">Item List</h3>
          <ScrollArea className="">
            <Table>
              <TableCaption>A list of your recent items.</TableCaption>
              <TableHeader>
                <TableRow className="grid grid-cols-2">
                  <TableHead>Name</TableHead>
                  {/* <TableHead>Default Quantity</TableHead>
                  <TableHead>Default Price</TableHead> */}
                  <TableHead className="">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item._id} className="grid grid-cols-2">
                    <TableCell className="truncate">{item.name}</TableCell>
                    {/* <TableCell>{item.defaultQuantity}</TableCell>
                    <TableCell>${item.defaultPrice.toFixed(2)}</TableCell> */}
                    <TableCell className="">
                      <Dialog
                        open={isDialogOpen}
                        onOpenChange={setIsDialogOpen}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setEditingItem(item);
                              editForm.setValue("name", item.name);
                              setIsDialogOpen(true);
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="w-[310px] sm:w-[400px] md:w-full rounded-lg sm:rounded-lg">
                          <DialogHeader>
                            <DialogTitle>Edit Item</DialogTitle>
                          </DialogHeader>
                          <Form {...editForm}>
                            <form
                              onSubmit={editForm.handleSubmit(onEdit)}
                              className="space-y-4"
                            >
                              <FormField
                                control={editForm.control}
                                name="name"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Item Name</FormLabel>
                                    <FormControl>
                                      <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              {/* <FormField
                                control={editForm.control}
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
                                control={editForm.control}
                                name="defaultPrice"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Default Price</FormLabel>
                                    <FormControl>
                                      <Input
                                        type="number"
                                        step="0.01"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              /> */}
                              <Button className=" bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md">Update Item</Button>
                            </form>
                          </Form>
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDeleteItem(item._id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}