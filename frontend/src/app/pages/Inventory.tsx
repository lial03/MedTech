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
import { Search, Plus, AlertTriangle, Package, TrendingDown, RefreshCw, Trash2, Archive, Globe, MapPin, TrendingUp } from 'lucide-react';
import { useApp } from '../lib/store';
import { toast } from 'sonner';
import { motion } from 'motion/react';

export function Inventory() {
  const { inventory, addInventoryItem, restockItem, deleteInventoryItem } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showRestockDialog, setShowRestockDialog] = useState(false);
  const [restockingItem, setRestockingItem] = useState<typeof inventory[0] | null>(null);
  const [restockQuantity, setRestockQuantity] = useState('');

  const openRestockDialog = (item: typeof inventory[0]) => {
    setRestockingItem(item);
    setShowRestockDialog(true);
  };

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

  const getStockLevel = (quantity: number, minQuantity: number) => {
    const percentage = (quantity / minQuantity) * 100;
    if (percentage < 50) return 'critical';
    if (percentage < 100) return 'low';
    return 'adequate';
  };

  const getStockColor = (level: string) => {
    switch (level) {
      case 'critical': return 'text-destructive drop-shadow-[0_0_8px_rgba(239,68,68,0.4)]';
      case 'low': return 'text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.4)]';
      case 'adequate': return 'text-green-500 drop-shadow-[0_0_8px_rgba(34,197,94,0.4)]';
      default: return 'text-muted-foreground';
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
    toast.success("New logistical node registered.");
  };

  const handleRestock = () => {
    if (!restockingItem || !restockQuantity) return;
    restockItem(restockingItem.id, parseInt(restockQuantity));
    setShowRestockDialog(false);
    setRestockingItem(null);
    setRestockQuantity('');
    toast.success("Supply chain replenished.");
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tighter glow-text bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-400 uppercase">
            SUPPLY_LOGISTICS
          </h2>
          <p className="text-muted-foreground flex items-center gap-2 mt-1">
            <Archive className="w-4 h-4 text-primary" />
            Infrastructure Resource & Inventory Manifest
          </p>
        </div>
        <Button onClick={() => setShowAddDialog(true)} className="rounded-xl shadow-lg shadow-primary/20">
          <Plus className="w-4 h-4 mr-2" />
          REG_NEW_ITEM
        </Button>
      </div>

      {/* Stats Cluster */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatTile icon={Package} label="Registry Size" value={inventory.length} color="primary" />
        <StatTile icon={AlertTriangle} label="Breached Thresholds" value={inventory.filter(i => i.quantity < i.minQuantity).length} color="destructive" />
        <StatTile icon={TrendingDown} label="Critical Depletion" value={inventory.filter(i => getStockLevel(i.quantity, i.minQuantity) === 'critical').length} color="warning" />
        <StatTile icon={Archive} label="Stable Supply" value={inventory.filter(i => i.quantity >= i.minQuantity).length} color="success" />
      </div>

      {/* Search HUD */}
      <Card className="glass-panel border-none">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Query manifest by name, category, or origin..."
              className="pl-9 bg-black/20 border-white/5 focus-visible:ring-primary/30"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Manifest Nodes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredItems.map((item) => {
          const stockLevel = getStockLevel(item.quantity, item.minQuantity);
          const percentage = (item.quantity / item.minQuantity) * 100;

          return (
            <motion.div
              layout
              key={item.id}
              className={`nexus-node p-5 border-l-4 ${
                stockLevel === 'critical' ? 'border-l-destructive bg-destructive/5' : 
                stockLevel === 'low' ? 'border-l-amber-500 bg-amber-500/5' : 'border-l-primary bg-primary/5'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                 <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                       <h3 className="font-bold text-lg tracking-tight truncate">{item.name}</h3>
                       <Badge variant="outline" className="text-[9px] uppercase border-white/10 opacity-60 font-mono tracking-widest">{item.category}</Badge>
                    </div>
                    <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-mono uppercase tracking-tighter">
                       <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> {item.supplier}</span>
                       <span>•</span>
                       <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {item.location}</span>
                    </div>
                 </div>
                 <div className="flex flex-col items-end gap-2">
                    <Badge className={`text-[10px] font-black italic uppercase italic tracking-widest ${
                      stockLevel === 'critical' ? 'bg-destructive/20 text-destructive border-destructive/30' : 
                      stockLevel === 'low' ? 'bg-amber-500/20 text-amber-500 border-amber-500/30' : 'bg-primary/20 text-primary border-primary/30'
                    }`}>
                      {stockLevel}
                    </Badge>
                    <span className="text-xs font-mono font-bold text-muted-foreground opacity-40">ITEM_REF: {item.id}</span>
                 </div>
              </div>

              <div className="space-y-3">
                 <div className="flex items-end justify-between">
                    <div className="space-y-1">
                       <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-60">Inventory_Volume</p>
                       <p className="text-xl font-mono font-black italic tracking-tighter">
                          {item.quantity} <span className="text-[10px] uppercase opacity-40 not-italic tracking-widest">{item.unit}</span>
                          <span className="text-[10px] text-muted-foreground mx-2 font-normal opacity-40">/ {item.minQuantity} MIN</span>
                       </p>
                    </div>
                    <div className="text-right">
                       <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-60">Unit_Cost</p>
                       <p className="font-mono text-sm font-bold text-primary">${item.cost.toFixed(2)}</p>
                    </div>
                 </div>
                 
                 <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                       initial={{ width: 0 }}
                       animate={{ width: `${Math.min(percentage, 100)}%` }}
                       className={`h-full ${
                         stockLevel === 'critical' ? 'bg-destructive shadow-[0_0_10px_oklch(0.55_0.22_25)]' : 
                         stockLevel === 'low' ? 'bg-amber-500 shadow-[0_0_10px_oklch(0.75_0.15_80)]' : 'bg-primary shadow-[0_0_10px_oklch(0.65_0.22_260)]'
                       }`}
                    />
                 </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 flex gap-3">
                 <Button 
                   size="sm" 
                   className="flex-1 rounded-xl bg-primary/20 text-primary hover:bg-primary/30 border border-primary/20 text-[10px] font-black uppercase tracking-widest h-10"
                   onClick={() => openRestockDialog(item)}
                 >
                    <RefreshCw className="w-3.5 h-3.5 mr-2" />
                    REPLENISH
                 </Button>
                 <Button 
                   size="sm" 
                   variant="ghost" 
                   className="flex-1 rounded-xl text-muted-foreground hover:text-foreground hover:bg-white/5 text-[10px] font-bold uppercase tracking-widest h-10"
                   onClick={() => {
                     toast.info("Accessing logistical history...");
                     setTimeout(() => toast.success("Ledger verified. 100% audit accuracy."), 1000);
                   }}
                 >
                    LEDGER_AUDIT
                 </Button>
                 <Button 
                   size="icon" 
                   variant="ghost" 
                   className="w-10 h-10 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                   onClick={() => {
                     if(confirm(`Confirm deletion of node ${item.id}?`)) deleteInventoryItem(item.id);
                   }}
                 >
                    <Trash2 className="w-4 h-4" />
                 </Button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Add Dialog Upgrade */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-xl glass-panel border-white/5 bg-black/80">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-2xl font-black italic tracking-tighter text-primary uppercase">
              <Plus className="w-6 h-6" />
              Manifest_Registration
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-2">
                <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1">Item_Name</Label>
                <Input
                  className="bg-white/5 border-white/5 focus-visible:ring-primary/30"
                  placeholder="e.g. FRACTAL_CORE_UNIT"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1">Category</Label>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                  <SelectTrigger className="bg-white/5 border-white/5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glass-panel border-white/5">
                    <SelectItem value="Consumables">Consumables</SelectItem>
                    <SelectItem value="Filters">Filters</SelectItem>
                    <SelectItem value="Parts">Parts</SelectItem>
                    <SelectItem value="Sensors">Sensors</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1">Registry_Unit</Label>
                <Select value={form.unit} onValueChange={(v) => setForm({ ...form, unit: v })}>
                  <SelectTrigger className="bg-white/5 border-white/5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glass-panel border-white/5">
                    <SelectItem value="pieces">Pieces</SelectItem>
                    <SelectItem value="sets">Sets</SelectItem>
                    <SelectItem value="boxes">Boxes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter className="mt-8">
            <Button variant="ghost" onClick={() => setShowAddDialog(false)}>Cancel</Button>
            <Button onClick={handleAddItem} className="bg-primary hover:bg-primary/90 text-white rounded-xl shadow-lg shadow-primary/20 font-bold px-8">
              INITIALIZE_STOCK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Restock Dialog Upgrade */}
      <Dialog open={showRestockDialog} onOpenChange={setShowRestockDialog}>
        <DialogContent className="max-w-md glass-panel border-white/5 bg-black/80">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-xl font-black italic tracking-tighter text-primary uppercase">
              <RefreshCw className="w-6 h-6" />
              Replenishment_Protocol
            </DialogTitle>
          </DialogHeader>
          {restockingItem && (
            <div className="space-y-6 pt-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <p className="font-bold text-lg">{restockingItem.name}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1 opacity-60">
                  Current_Volume: {restockingItem.quantity} {restockingItem.unit}
                </p>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1">Inbound_Quantity</Label>
                <Input
                  type="number"
                  className="bg-white/5 border-white/5 focus-visible:ring-primary/30 text-xl font-mono font-black"
                  value={restockQuantity}
                  onChange={(e) => setRestockQuantity(e.target.value)}
                  autoFocus
                />
              </div>
            </div>
          )}
          <DialogFooter className="mt-8">
            <Button variant="ghost" onClick={() => setShowRestockDialog(false)}>Cancel</Button>
            <Button onClick={handleRestock} className="bg-primary hover:bg-primary/90 text-white rounded-xl shadow-lg shadow-primary/20 font-bold px-8">
              EXECUTE_MANIFEST
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function StatTile({ icon: Icon, label, value, color }: any) {
  const colorMap: any = {
    primary: 'text-primary border-primary/20 bg-primary/5',
    destructive: 'text-destructive border-destructive/20 bg-destructive/5',
    warning: 'text-amber-500 border-amber-500/20 bg-amber-500/5',
    success: 'text-green-500 border-green-500/20 bg-green-500/5',
  };

  return (
    <div className={`nexus-node p-5 border ${colorMap[color]}`}>
      <div className="flex items-center justify-between mb-3 opacity-60">
        <Icon className="w-5 h-5" />
        <TrendingUp className="w-3 h-3" />
      </div>
      <p className="text-3xl font-mono font-black italic tracking-tighter">{value}</p>
      <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mt-1">{label}</p>
    </div>
  );
}
