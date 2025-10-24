import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from './ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { ScrollArea } from './ui/scroll-area';
import { mockInventory } from '../lib/mockData';
import { Package, Search, Plus, AlertTriangle, Edit, QrCode, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

const formatCurrency = (cents: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100);
};

interface InventoryFormData {
  name: string;
  part_number: string;
  category: string;
  quantity: string;
  unit_price: string;
  reorder_level: string;
  supplier: string;
  location: string;
}

export function InventoryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [reorderDialogOpen, setReorderDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<InventoryFormData>({
    name: '',
    part_number: '',
    category: '',
    quantity: '',
    unit_price: '',
    reorder_level: '',
    supplier: '',
    location: '',
  });

  const filteredInventory = mockInventory.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.part_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const lowStockItems = mockInventory.filter(item => item.quantity <= item.reorder_level);

  const handleAddItem = () => {
    setIsEditing(false);
    setFormData({
      name: '',
      part_number: '',
      category: '',
      quantity: '',
      unit_price: '',
      reorder_level: '',
      supplier: '',
      location: '',
    });
    setDialogOpen(true);
  };

  const handleSaveItem = () => {
    if (!formData.name || !formData.part_number || !formData.quantity) {
      toast.error('Please fill in required fields');
      return;
    }
    if (isEditing) {
      toast.success('Inventory item updated successfully');
    } else {
      toast.success('Inventory item created successfully');
    }
    setDialogOpen(false);
  };

  const handleViewDetails = (item: any) => {
    setSelectedItem(item);
    setSheetOpen(true);
  };

  const handleScanBarcode = () => {
    setScannerOpen(true);
    toast.info('Barcode scanner activated');
    // Simulate scanner
    setTimeout(() => {
      toast.success('Barcode scanned successfully');
      setScannerOpen(false);
    }, 2000);
  };

  const handleReorderItem = (item: any) => {
    setSelectedItem(item);
    setReorderDialogOpen(true);
  };

  const handleConfirmReorder = () => {
    toast.success(`Reorder placed for ${selectedItem?.name}`);
    setReorderDialogOpen(false);
  };

  const handleEditItem = (item: any) => {
    setIsEditing(true);
    setFormData({
      name: item.name,
      part_number: item.part_number,
      category: item.category,
      quantity: item.quantity.toString(),
      unit_price: item.unit_price.toString(),
      reorder_level: item.reorder_level.toString(),
      supplier: item.supplier || '',
      location: item.location || '',
    });
    setSheetOpen(false);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6 h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-slate-900 mb-1">Inventory</h2>
          <p className="text-slate-600">Manage parts and equipment stock</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleScanBarcode}>
            <QrCode className="h-4 w-4 mr-2" />
            Scan
          </Button>
          <Button onClick={handleAddItem}>
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search inventory by name, part number, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5 shrink-0" />
              <div className="flex-1">
                <h3 className="text-slate-900 mb-1">Low Stock Alert</h3>
                <p className="text-sm text-slate-700 mb-3">
                  {lowStockItems.length} item{lowStockItems.length !== 1 ? 's' : ''} below reorder level
                </p>
                <div className="flex flex-wrap gap-2">
                  {lowStockItems.slice(0, 3).map((item) => (
                    <Badge key={item.id} variant="outline" className="bg-white">
                      {item.name}: {item.quantity} left
                    </Badge>
                  ))}
                  {lowStockItems.length > 3 && (
                    <Badge variant="outline" className="bg-white">
                      +{lowStockItems.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Inventory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredInventory.map((item) => {
          const isLowStock = item.quantity <= item.reorder_level;
          return (
            <Card key={item.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className={`p-2 rounded-lg shrink-0 ${isLowStock ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                      <Package className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-slate-900 mb-1 truncate">{item.name}</CardTitle>
                      <p className="text-sm text-slate-600 truncate">{item.part_number}</p>
                      <Badge variant="outline" className="mt-2">
                        {item.category}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">In Stock</span>
                  <span className={`text-slate-900 ${isLowStock ? 'text-orange-600' : ''}`}>
                    {item.quantity} {item.unit}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Unit Price</span>
                  <span className="text-slate-900">{formatCurrency(item.unit_price)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Location</span>
                  <span className="text-slate-900">{item.location}</span>
                </div>
                {isLowStock && (
                  <div className="pt-3 border-t">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full text-orange-600 hover:text-orange-700"
                      onClick={() => handleReorderItem(item)}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Reorder
                    </Button>
                  </div>
                )}
                <div className={isLowStock ? '' : 'pt-3 border-t'}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => handleViewDetails(item)}
                  >
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredInventory.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Package className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-600">No inventory items found matching your search.</p>
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Item Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Inventory Item' : 'Add Inventory Item'}</DialogTitle>
            <DialogDescription>
              {isEditing ? 'Update the inventory item details' : 'Enter the details for the new inventory item'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Item Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., HVAC Filter 16x20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="part_number">Part Number *</Label>
                <Input
                  id="part_number"
                  value={formData.part_number}
                  onChange={(e) => setFormData({ ...formData, part_number: e.target.value })}
                  placeholder="e.g., HVAC-F-1620"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="filters">Filters</SelectItem>
                    <SelectItem value="motors">Motors</SelectItem>
                    <SelectItem value="compressors">Compressors</SelectItem>
                    <SelectItem value="refrigerant">Refrigerant</SelectItem>
                    <SelectItem value="tools">Tools</SelectItem>
                    <SelectItem value="parts">Parts</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g., Warehouse A-12"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity *</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="unit_price">Unit Price ($)</Label>
                <Input
                  id="unit_price"
                  type="number"
                  step="0.01"
                  value={formData.unit_price}
                  onChange={(e) => setFormData({ ...formData, unit_price: e.target.value })}
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reorder_level">Reorder Level</Label>
                <Input
                  id="reorder_level"
                  type="number"
                  value={formData.reorder_level}
                  onChange={(e) => setFormData({ ...formData, reorder_level: e.target.value })}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="supplier">Supplier</Label>
              <Input
                id="supplier"
                value={formData.supplier}
                onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                placeholder="Supplier name"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveItem}>
              {isEditing ? 'Update Item' : 'Add Item'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Item Details Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="sm:max-w-[600px] w-full">
          {selectedItem && (
            <>
              <SheetHeader>
                <SheetTitle>{selectedItem.name}</SheetTitle>
                <SheetDescription>Item details and stock information</SheetDescription>
              </SheetHeader>

              <ScrollArea className="h-[calc(100vh-200px)] mt-6">
                <div className="space-y-6 px-6">
                  <div>
                    <h3 className="text-sm text-slate-600 mb-2">Part Number</h3>
                    <p className="text-slate-900">{selectedItem.part_number}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm text-slate-600 mb-2">Category</h3>
                      <Badge variant="outline">{selectedItem.category}</Badge>
                    </div>
                    <div>
                      <h3 className="text-sm text-slate-600 mb-2">Location</h3>
                      <p className="text-slate-900">{selectedItem.location}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="pt-4">
                        <p className="text-sm text-slate-600 mb-1">In Stock</p>
                        <p className="text-slate-900">{selectedItem.quantity} {selectedItem.unit}</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-4">
                        <p className="text-sm text-slate-600 mb-1">Unit Price</p>
                        <p className="text-slate-900">{formatCurrency(selectedItem.unit_price)}</p>
                      </CardContent>
                    </Card>
                  </div>

                  <div>
                    <h3 className="text-sm text-slate-600 mb-2">Reorder Level</h3>
                    <p className="text-slate-900">{selectedItem.reorder_level} {selectedItem.unit}</p>
                  </div>

                  {selectedItem.supplier && (
                    <div>
                      <h3 className="text-sm text-slate-600 mb-2">Supplier</h3>
                      <p className="text-slate-900">{selectedItem.supplier}</p>
                    </div>
                  )}

                  <div className="pt-4 border-t space-y-2">
                    <Button className="w-full" onClick={() => handleEditItem(selectedItem)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Item
                    </Button>
                    {selectedItem.quantity <= selectedItem.reorder_level && (
                      <Button 
                        variant="outline" 
                        className="w-full text-orange-600 hover:text-orange-700"
                        onClick={() => {
                          setSheetOpen(false);
                          handleReorderItem(selectedItem);
                        }}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Reorder Item
                      </Button>
                    )}
                  </div>
                </div>
              </ScrollArea>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Reorder Dialog */}
      <Dialog open={reorderDialogOpen} onOpenChange={setReorderDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reorder Item</DialogTitle>
            <DialogDescription>
              Place a reorder for {selectedItem?.name}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4">
            <div className="bg-slate-50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Current Stock:</span>
                <span className="text-slate-900">{selectedItem?.quantity} {selectedItem?.unit}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Reorder Level:</span>
                <span className="text-slate-900">{selectedItem?.reorder_level} {selectedItem?.unit}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Suggested Quantity:</span>
                <span className="text-slate-900">{selectedItem ? (selectedItem.reorder_level * 2 - selectedItem.quantity) : 0} {selectedItem?.unit}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reorder_quantity">Order Quantity</Label>
              <Input
                id="reorder_quantity"
                type="number"
                defaultValue={selectedItem ? (selectedItem.reorder_level * 2 - selectedItem.quantity) : 0}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setReorderDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmReorder}>
              <ShoppingCart className="h-4 w-4 mr-2" />
              Place Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
