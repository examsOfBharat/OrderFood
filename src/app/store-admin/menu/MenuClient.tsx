// @ts-nocheck
"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { PlusCircle, Trash2, Edit } from "lucide-react";
import { 
  createCategory, 
  deleteCategory, 
  createMenuItem, 
  toggleMenuItemAvailability, 
  deleteMenuItem,
  seedSampleMenu
} from "../actions";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function MenuClient({ initialCategories, initialItems }: { initialCategories: any[], initialItems: any[] }) {
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);

  // Category State
  const [catName, setCatName] = useState("");
  const [catDesc, setCatDesc] = useState("");

  // Item State
  const [itemCategoryId, setItemCategoryId] = useState("");
  const [itemName, setItemName] = useState("");
  const [itemDesc, setItemDesc] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [itemIsVeg, setItemIsVeg] = useState(true);

  async function handleCreateCategory(e: React.FormEvent) {
    e.preventDefault();
    await createCategory(catName, catDesc);
    setIsCategoryModalOpen(false);
    setCatName("");
    setCatDesc("");
  }

  async function handleCreateItem(e: React.FormEvent) {
    e.preventDefault();
    await createMenuItem({
      categoryId: itemCategoryId,
      name: itemName,
      description: itemDesc,
      price: Number(itemPrice),
      isVeg: itemIsVeg,
      isAvailable: true,
    });
    setIsItemModalOpen(false);
    setItemName("");
    setItemDesc("");
    setItemPrice("");
  }

  return (
    <Tabs defaultValue="items" className="w-full">
      <div className="flex items-center justify-between">
        <TabsList>
          <TabsTrigger value="items">Menu Items</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>
        {initialCategories.length === 0 && initialItems.length === 0 && (
          <Button variant="outline" onClick={async () => await seedSampleMenu()}>
            Load Sample Menu
          </Button>
        )}
      </div>

      <TabsContent value="items" className="space-y-4">
        <div className="flex justify-end gap-2">
          <Dialog open={isItemModalOpen} onOpenChange={setIsItemModalOpen}>
            <DialogTrigger render={<Button />}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Item
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Menu Item</DialogTitle>
              </DialogHeader>
              {initialCategories.length === 0 ? (
                <div className="py-6 text-center space-y-4">
                  <p className="text-muted-foreground">You must create a Category first before adding an item.</p>
                  <Button onClick={() => setIsItemModalOpen(false)}>Close & Go to Categories Tab</Button>
                </div>
              ) : (
              <form onSubmit={handleCreateItem} className="space-y-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={itemCategoryId} onValueChange={setItemCategoryId} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category">
                        {itemCategoryId ? initialCategories.find(c => c._id === itemCategoryId)?.name : "Select a category"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {initialCategories.map(cat => (
                        <SelectItem key={cat._id} value={cat._id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input value={itemName} onChange={e => setItemName(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea value={itemDesc} onChange={e => setItemDesc(e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Price (₹)</Label>
                    <Input type="number" value={itemPrice} onChange={e => setItemPrice(e.target.value)} required min="0" />
                  </div>
                  <div className="flex items-center space-x-2 mt-8">
                    <Switch checked={itemIsVeg} onCheckedChange={setItemIsVeg} />
                    <Label>{itemIsVeg ? "Vegetarian" : "Non-Vegetarian"}</Label>
                  </div>
                </div>
                <Button type="submit" className="w-full">Save Item</Button>
              </form>
              )}
            </DialogContent>
          </Dialog>
        </div>

        <div className="rounded-md border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>In Stock</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {initialItems.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No menu items found. Add some!</TableCell>
                </TableRow>
              )}
              {initialItems.map((item) => (
                <TableRow key={item._id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.category?.name}</TableCell>
                  <TableCell>₹{item.price}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${item.isVeg ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {item.isVeg ? 'Veg' : 'Non-Veg'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Switch 
                      checked={item.isAvailable} 
                      onCheckedChange={(checked) => toggleMenuItemAvailability(item._id, checked)}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => deleteMenuItem(item._id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </TabsContent>

      <TabsContent value="categories" className="space-y-4">
        <div className="flex justify-end">
          <Dialog open={isCategoryModalOpen} onOpenChange={setIsCategoryModalOpen}>
            <DialogTrigger render={<Button />}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Category
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Category</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateCategory} className="space-y-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input value={catName} onChange={e => setCatName(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea value={catDesc} onChange={e => setCatDesc(e.target.value)} />
                </div>
                <Button type="submit" className="w-full">Save Category</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="rounded-md border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {initialCategories.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">No categories found. Add some!</TableCell>
                </TableRow>
              )}
              {initialCategories.map((cat) => (
                <TableRow key={cat._id}>
                  <TableCell className="font-medium">{cat.name}</TableCell>
                  <TableCell>{cat.description}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => deleteCategory(cat._id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </TabsContent>
    </Tabs>
  );
}
