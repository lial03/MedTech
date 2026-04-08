import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useApp } from '../../lib/store';
import { Package } from 'lucide-react';

interface AssetFormProps {
  onSuccess: () => void;
}

export function AssetForm({ onSuccess }: AssetFormProps) {
  const { addAsset } = useApp();
  const [form, setForm] = useState({
    name: '',
    type: '',
    location: '',
    manufacturer: '',
    model: '',
    serialNumber: '',
    installDate: new Date().toISOString().split('T')[0],
    lastMaintenance: new Date().toISOString().split('T')[0],
    nextMaintenance: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.type || !form.location) return;
    
    await addAsset({
      name: form.name,
      type: form.type,
      location: form.location,
      manufacturer: form.manufacturer,
      model: form.model,
      serialNumber: form.serialNumber || `SN-${Date.now()}`,
      installDate: form.installDate,
      lastMaintenance: form.lastMaintenance,
      nextMaintenance: form.nextMaintenance || new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0],
      status: 'operational',
      healthScore: 90,
    });
    
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-2">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 space-y-2">
          <Label htmlFor="asset-name">Asset Name *</Label>
          <Input
            id="asset-name"
            required
            placeholder="e.g. Ventilator - ICU Wing B"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="asset-type">Equipment Type *</Label>
          <Input
            id="asset-type"
            required
            placeholder="e.g. Ventilator"
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="asset-location">Location *</Label>
          <Input
            id="asset-location"
            required
            placeholder="e.g. ICU - Wing B, Room 104"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="asset-manufacturer">Manufacturer</Label>
          <Input
            id="asset-manufacturer"
            placeholder="e.g. Medtronic"
            value={form.manufacturer}
            onChange={(e) => setForm({ ...form, manufacturer: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="asset-model">Model</Label>
          <Input
            id="asset-model"
            placeholder="e.g. PB 980"
            value={form.model}
            onChange={(e) => setForm({ ...form, model: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="asset-install">Install Date</Label>
          <Input
            id="asset-install"
            type="date"
            value={form.installDate}
            onChange={(e) => setForm({ ...form, installDate: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="asset-last-maint">Last Maintenance</Label>
          <Input
            id="asset-last-maint"
            type="date"
            value={form.lastMaintenance}
            onChange={(e) => setForm({ ...form, lastMaintenance: e.target.value })}
          />
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
        <Button type="submit" className="w-full">
          <Package className="w-4 h-4 mr-2" />
          Register Equipment
        </Button>
      </div>
    </form>
  );
}
