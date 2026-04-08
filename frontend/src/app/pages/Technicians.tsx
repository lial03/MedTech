import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../components/ui/dialog';
import { Users, Mail, Phone, CheckCircle2, Clock, Award, Plus, Wrench, Activity, Fingerprint, Trash2, TrendingUp } from 'lucide-react';
import { useApp } from '../lib/store';
import { type WorkOrder } from '../lib/mock-data';
import { motion } from 'motion/react';
import { toast } from 'sonner';

export function Technicians() {
  const { technicians, workOrders, addTechnician, deleteTechnician } = useApp();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    specialization: '',
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'busy': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'offline': return 'bg-white/5 text-muted-foreground border-white/10';
      default: return 'bg-white/5 text-muted-foreground border-white/10';
    }
  };

  const availableTechs = technicians.filter((t) => t.status === 'available');
  const busyTechs = technicians.filter((t) => t.status === 'busy');

  const handleAddTech = () => {
    if (!form.name || !form.email) return;
    addTechnician({
      name: form.name,
      email: form.email,
      phone: form.phone,
      specialization: form.specialization.split(',').map(s => s.trim()).filter(s => s !== ''),
      status: 'available',
    });
    setShowAddDialog(false);
    setForm({ name: '', email: '', phone: '', specialization: '' });
    toast.success("New operative synced to personnel core.");
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tighter glow-text bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-400 uppercase">
            PERSONNEL_COMMAND
          </h2>
          <p className="text-muted-foreground flex items-center gap-2 mt-1">
            <Users className="w-4 h-4 text-primary" />
            Bio-Medical Operatives & Deployment Registry
          </p>
        </div>
        <Button onClick={() => setShowAddDialog(true)} className="rounded-xl shadow-lg shadow-primary/20">
          <Plus className="w-4 h-4 mr-2" />
          SYNC_NEW_OPERATIVE
        </Button>
      </div>

      {/* Stats Cluster */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatTile icon={Users} label="Total Assets" value={technicians.length} color="primary" />
        <StatTile icon={CheckCircle2} label="Ready_Status" value={availableTechs.length} color="success" />
        <StatTile icon={Clock} label="Operational" value={busyTechs.length} color="warning" />
        <StatTile icon={Award} label="Total Deployments" value={technicians.reduce((sum, t) => sum + t.completedWorkOrders, 0)} color="primary" />
      </div>

      {/* Technicians Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {technicians.map((technician) => (
          <motion.div
            layout
            key={technician.id}
            className="nexus-node p-6 flex flex-col group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
               <Fingerprint className="w-12 h-12" />
            </div>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="relative">
                <Avatar className="w-16 h-16 border-2 border-primary/20 p-1 bg-black/20">
                  <AvatarFallback className="text-lg bg-gradient-to-br from-primary to-blue-700 text-white font-black italic">
                    {technician.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-black ${
                  technician.status === 'available' ? 'bg-green-500 shadow-[0_0_8px_oklch(0.65_0.22_150)]' : 
                  technician.status === 'busy' ? 'bg-amber-500' : 'bg-muted-foreground'
                }`} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-bold tracking-tight truncate group-hover:text-primary transition-colors">{technician.name}</h3>
                <Badge variant="outline" className={`text-[10px] uppercase italic font-black tracking-widest mt-1 ${getStatusColor(technician.status)}`}>
                  {technician.status}
                </Badge>
              </div>
            </div>

            <div className="space-y-4 flex-1">
              <div className="space-y-2 p-3 rounded-xl bg-white/5 border border-white/5 shadow-inner">
                <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-mono">
                  <Mail className="w-3 h-3 text-primary" />
                  <span className="truncate opacity-70">{technician.email}</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-mono">
                  <Phone className="w-3 h-3 text-primary" />
                  <span className="opacity-70">{technician.phone}</span>
                </div>
              </div>

              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3 opacity-60">Field_Expertise</p>
                <div className="flex flex-wrap gap-2">
                  {technician.specialization.map((spec) => (
                    <Badge key={spec} variant="outline" className="text-[9px] bg-primary/5 border-primary/20 text-blue-100 font-mono tracking-tighter">
                      {spec}
                    </Badge>
                  ))}
                  {technician.specialization.length === 0 && (
                    <span className="text-[10px] text-muted-foreground italic opacity-40 uppercase">NO_SPEC_DATA</span>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-white/5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="nexus-node p-2 bg-transparent border-none">
                    <p className="text-[9px] text-muted-foreground uppercase opacity-60 mb-1">Active_LOAD</p>
                    <p className="text-xl font-mono font-black italic text-primary">
                      {technician.activeWorkOrders}
                    </p>
                  </div>
                  <div className="nexus-node p-2 bg-transparent border-none">
                    <p className="text-[9px] text-muted-foreground uppercase opacity-60 mb-1">COMPLETED</p>
                    <p className="text-xl font-mono font-black italic text-foreground">
                      {technician.completedWorkOrders}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <Button size="sm" variant="outline" className="flex-1 rounded-xl border-white/10 hover:bg-white/5 text-[10px] font-bold uppercase tracking-widest h-10">
                PROV_PROFILE
              </Button>
              <Button 
                size="icon" 
                variant="ghost" 
                className="w-10 h-10 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                onClick={() => {
                  if (confirm(`INITIATE_DECOMMISSION: ${technician.name}?`)) {
                    deleteTechnician(technician.id);
                  }
                }}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Performance Overview Overhaul */}
      <h3 className="text-xl font-bold tracking-tighter uppercase italic text-primary mt-12 mb-6">OPERATIVE_PERFORMANCE_LEDGER</h3>
      <Card className="glass-panel border-none overflow-hidden">
        <CardContent className="p-0">
          <div className="divide-y divide-white/5">
            {[...technicians]
              .sort((a, b) => b.completedWorkOrders - a.completedWorkOrders)
              .map((technician, index) => (
                <div key={technician.id} className="flex items-center gap-4 p-4 hover:bg-white/[0.02] transition-colors relative group">
                  <div className="w-12 text-center relative">
                    <span className={`text-2xl font-black italic font-mono ${index < 3 ? 'text-primary drop-shadow-[0_0_10px_rgba(139,92,246,0.5)]' : 'text-muted-foreground/30'}`}>
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <Avatar className="w-12 h-12 border border-white/10">
                    <AvatarFallback className="bg-gradient-to-br from-primary/40 to-black text-white font-bold italic">
                      {technician.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-lg tracking-tight group-hover:text-primary transition-colors">{technician.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                       <p className="text-xs text-muted-foreground font-mono opacity-60">
                         {technician.completedWorkOrders} SUCCESSFUL_DEPLOYMENTS
                       </p>
                       <div className="h-1 w-24 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: `${(technician.completedWorkOrders / 100) * 100}%` }} />
                       </div>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-6">
                    <div className="hidden md:flex items-center gap-4">
                      <div className="flex flex-col items-end">
                        <p className="text-[9px] font-bold text-muted-foreground uppercase opacity-40">Efficiency</p>
                        <p className="text-sm font-mono font-bold text-primary">94.2%</p>
                      </div>
                    </div>
                    <Badge variant="outline" className={`text-[10px] uppercase font-bold tracking-widest ${getStatusColor(technician.status)}`}>
                      {technician.status}
                    </Badge>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Add Technician Dialog Polish */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-xl glass-panel border-white/5 bg-black/80">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-2xl font-black italic tracking-tighter text-primary uppercase">
              <Plus className="w-6 h-6" />
              Operative_Registration
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-2">
                <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1">Personnel_Name</Label>
                <Input
                  className="bg-white/5 border-white/5 focus-visible:ring-primary/30"
                  placeholder="e.g. CDR. SHEPARD"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1">Comm_Address</Label>
                <Input
                  type="email"
                  className="bg-white/5 border-white/5 focus-visible:ring-primary/30 text-xs"
                  placeholder="name@nexus.core"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1">Signal_Link</Label>
                <Input
                  className="bg-white/5 border-white/5 focus-visible:ring-primary/30 text-xs"
                  placeholder="+X XXX XXX XXX"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1">Neural_Expertise (CSV)</Label>
                <Input
                  className="bg-white/5 border-white/5 focus-visible:ring-primary/30 text-xs"
                  placeholder="MRI, X-RAY, DEFIB_CORE"
                  value={form.specialization}
                  onChange={(e) => setForm({ ...form, specialization: e.target.value })}
                />
              </div>
            </div>
          </div>
          <DialogFooter className="mt-8">
            <Button variant="ghost" onClick={() => setShowAddDialog(false)}>Cancel</Button>
            <Button onClick={handleAddTech} className="bg-primary hover:bg-primary/90 text-white rounded-xl shadow-lg shadow-primary/20 font-bold px-8">
              COMMISSION_TICKET
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
