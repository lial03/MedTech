import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Progress } from '../components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Search, Plus, AlertTriangle, Package, TrendingDown, RefreshCw, Trash2 } from 'lucide-react';
import { useApp } from '../lib/store';
import { toast } from 'sonner';

export function Inventory() {
  const { inventory, addInventoryItem, restockItem, deleteInventoryItem } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showRestockDialog, setShowRestockDialog] = useState(false);
  const [restockingItem, setRestockingItem] = useState<typeof inventory[0] | null>(null);
  const [restockQuantity, setRestockQuantity] = useState('');

  const [form, setForm] = useState({
    name: '',
    category: 'Consumables',
    quantity: '',
    minQuantity: '',
    unit: 'pieces',
    location: '',
    supplier: '',
    cost: '',
    lastRestocked: new Date().toISOString().split('T')[0],
  });

  const filteredItems = inventory.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.supplier.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const lowStockItems = filteredItems.filter((item) => item.quantity < item.minQuantity);
  const adequateStock = filteredItems.filter((item) => item.quantity >= item.minQuantity);

  const getStockLevel = (quantity: number, minQuantity: number) => {
    const percentage = (quantity / minQuantity) * 100;
    if (percentage < 50) return 'critical';
    if (percentage < 100) return 'low';
    return 'adequate';
  };

  const getStockColor = (level: string) => {
    switch (level) {
      case 'critical': return 'text-red-600';
      case 'low': return 'text-amber-600';
      case 'adequate': return 'text-green-600';
      default: return 'text-slate-600';
    }
  };

  const handleAddItem = () => {
    if (!form.name || !form.quantity || !form.minQuantity) return;
    addInventoryItem({
      name: form.name,
      category: form.category,
      quantity: parseInt(form.quantity),
      minQuantity: parseInt(form.minQuantity),
      unit: form.unit,
      location: form.location,
      supplier: form.supplier,
      cost: parseFloat(form.cost) || 0,
      lastRestocked: form.lastRestocked,
    });
    setShowAddDialog(false);
    setForm({ name: '', category: 'Consumables', quantity: '', minQuantity: '', unit: 'pieces', location: '', supplier: '', cost: '', lastRestocked: new Date().toISOString().split('T')[0] });
  };

  const handleRestock = () => {
    if (!restockingItem || !restockQuantity) return;
    restockItem(restockingItem.id, parseInt(restockQuantity));
    setShowRestockDialog(false);
    setRestockingItem(null);
    setRestockQuantity('');
  };

  const openRestockDialog = (item: typeof inventory[0]) => {
    setRestockingItem(item);
    setShowRestockDialog(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Inventory Management</h2>
          <p className="text-slate-500">Track spare parts and consumables</p>
        </div>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Inventory Item
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Package className="w-8 h-8 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900">{inventory.length}</p>
            <p className="text-sm text-slate-500">Total Items</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900">
              {inventory.filter((i) => i.quantity < i.minQuantity).length}
            </p>
            <p className="text-sm text-slate-500">Low Stock Alerts</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <TrendingDown className="w-8 h-8 text-amber-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900">
              {inventory.filter((i) => getStockLevel(i.quantity, i.minQuantity) === 'critical').length}
            </p>
            <p className="text-sm text-slate-500">Critical Level</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Package className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900">
              {inventory.filter((i) => i.quantity >= i.minQuantity).length}
            </p>
            <p className="text-sm text-slate-500">Adequate Stock</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search inventory by name, category, or supplier..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-900">
              <AlertTriangle className="w-5 h-5" />
              Low Stock Alert ({lowStockItems.length} items)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {lowStockItems.map((item) => {
                const stockLevel = getStockLevel(item.quantity, item.minQuantity);
                const percentage = (item.quantity / item.minQuantity) * 100;

                return (
                  <div
                    key={item.id}
                    className="p-4 bg-white rounded-lg border border-amber-200"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-900">{item.name}</p>
                        <p className="text-sm text-slate-500">{item.category}</p>
                      </div>
                      <Badge
                        variant={stockLevel === 'critical' ? 'destructive' : 'default'}
                      >
                        {stockLevel}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">
                          Stock: {item.quantity} / {item.minQuantity} {item.unit}
                        </span>
                        <span className={`font-medium ${getStockColor(stockLevel)}`}>
                          {Math.round(percentage)}%
                        </span>
                      </div>
                      <Progress
                        value={percentage}
                        className={stockLevel === 'critical' ? 'bg-red-100' : 'bg-amber-100'}
                      />
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>Supplier: {item.supplier}</span>
                        <span>Location: {item.location}</span>
                      </div>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <Button size="sm" className="flex-1" onClick={() => openRestockDialog(item)}>
                        <RefreshCw className="w-3 h-3 mr-1" />
                        Restock
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="flex-1 text-red-600 hover:bg-red-50"
                        onClick={() => {
                          if (confirm(`Are you sure you want to remove ${item.name}?`)) {
                            deleteInventoryItem(item.id);
                          }
                        }}
                      >
                        <Trash2 className="w-3 h-3 mr-1" />
                        Remove
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => {
                          toast.info(`Retrieving logistical history for ${item.id}...`);
                          setTimeout(() => {
                            toast.success('Log retrieved: Successfully audited 24 months of supply data.');
                          }, 1500);
                        }}
                      >
                        View History
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Inventory Items ({filteredItems.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {filteredItems.map((item) => {
              const stockLevel = getStockLevel(item.quantity, item.minQuantity);
              const percentage = (item.quantity / item.minQuantity) * 100;

              return (
                <div
                  key={item.id}
                  className="p-4 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-slate-900">{item.name}</p>
                        <Badge variant="outline">{item.category}</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-500">
                        <span>ID: {item.id}</span>
                        <span>•</span>
                        <span>Supplier: {item.supplier}</span>
                        <span>•</span>
                        <span>Cost: ${item.cost.toFixed(2)}/{item.unit}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        className={
                          stockLevel === 'critical'
                            ? 'bg-red-100 text-red-800'
                            : stockLevel === 'low'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-green-100 text-green-800'
                        }
                        variant="secondary"
                      >
                        {stockLevel}
                      </Badge>
                      <Button size="sm" variant="outline" onClick={() => openRestockDialog(item)}>
                        <RefreshCw className="w-3 h-3 mr-1" />
                        Restock
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">
                        {item.quantity} / {item.minQuantity} {item.unit}
                      </span>
                      <span className={`font-medium ${getStockColor(stockLevel)}`}>
                        {Math.round(percentage)}%
                      </span>
                    </div>
                    <Progress
                      value={Math.min(percentage, 100)}
                      className={
                        stockLevel === 'critical'
                          ? 'bg-red-100'
                          : stockLevel === 'low'
                          ? 'bg-amber-100'
                          : 'bg-green-100'
                      }
                    />
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>Location: {item.location}</span>
                      <span>
                        Last Restocked: {new Date(item.lastRestocked).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Add Inventory Item Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-blue-600" />
              Add Inventory Item
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
            <div className="space-y-2">
              <Label htmlFor="inv-name">Item Name *</Label>
              <Input
                id="inv-name"
                placeholder="e.g. HEPA Filters - Ventilator"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="inv-category">Category</Label>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                  <SelectTrigger id="inv-category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Consumables">Consumables</SelectItem>
                    <SelectItem value="Filters">Filters</SelectItem>
                    <SelectItem value="Parts">Parts</SelectItem>
                    <SelectItem value="Sensors">Sensors</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="inv-unit">Unit</Label>
                <Select value={form.unit} onValueChange={(v) => setForm({ ...form, unit: v })}>
                  <SelectTrigger id="inv-unit">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pieces">Pieces</SelectItem>
                    <SelectItem value="sets">Sets</SelectItem>
                    <SelectItem value="pairs">Pairs</SelectItem>
                    <SelectItem value="bottles">Bottles</SelectItem>
                    <SelectItem value="boxes">Boxes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="inv-qty">Current Quantity *</Label>
                <Input
                  id="inv-qty"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={form.quantity}
                  onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="inv-min-qty">Minimum Quantity *</Label>
                <Input
                  id="inv-min-qty"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={form.minQuantity}
                  onChange={(e) => setForm({ ...form, minQuantity: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="inv-supplier">Supplier</Label>
                <Input
                  id="inv-supplier"
                  placeholder="e.g. MedSupply Co."
                  value={form.supplier}
                  onChange={(e) => setForm({ ...form, supplier: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="inv-cost">Unit Cost ($)</Label>
                <Input
                  id="inv-cost"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={form.cost}
                  onChange={(e) => setForm({ ...form, cost: e.target.value })}
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="inv-location">Storage Location</Label>
                <Input
                  id="inv-location"
                  placeholder="e.g. Central Storage, Shelf A-12"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
            <Button onClick={handleAddItem} disabled={!form.name || !form.quantity || !form.minQuantity}>
              Add Item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Restock Dialog */}
      <Dialog open={showRestockDialog} onOpenChange={setShowRestockDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-blue-600" />
              Restock Item
            </DialogTitle>
          </DialogHeader>
          {restockingItem && (
            <div className="space-y-4">
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="font-medium text-slate-900">{restockingItem.name}</p>
                <p className="text-sm text-slate-500">
                  Current stock: {restockingItem.quantity} {restockingItem.unit} · Minimum: {restockingItem.minQuantity}
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="restock-qty">Quantity to Add</Label>
                <Input
                  id="restock-qty"
                  type="number"
                  min="1"
                  placeholder="Enter quantity..."
                  value={restockQuantity}
                  onChange={(e) => setRestockQuantity(e.target.value)}
                  autoFocus
                />
                {restockQuantity && (
                  <p className="text-xs text-slate-500">
                    New total: {restockingItem.quantity + parseInt(restockQuantity || '0')} {restockingItem.unit}
                  </p>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowRestockDialog(false); setRestockQuantity(''); }}>Cancel</Button>
            <Button onClick={handleRestock} disabled={!restockQuantity || parseInt(restockQuantity) <= 0}>
              Confirm Restock
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
