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
import {
  Search,
  Package,
  MapPin,
  Calendar,
  Activity,
  Zap,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Box,
  RefreshCw,
  Trash2,
  Cpu,
  ClipboardList
} from 'lucide-react';
import { useApp } from '../lib/store';
import { type Asset } from '../lib/mock-data';
import { toast } from 'sonner';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { WorkOrderForm } from '../components/forms/WorkOrderForm';
import { motion } from 'motion/react';

export function Assets() {
  const { assets, settings, addAsset, deleteAsset, runDiagnostics } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(assets[0] || null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [isDiagnosing, setIsDiagnosing] = useState<string | null>(null);
  const [diagResult, setDiagResult] = useState<any | null>(null);
  const [showReport, setShowReport] = useState(false);
  const [showEscalateModal, setShowEscalateModal] = useState(false);

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

  const filteredAssets = assets.filter((asset) => {
    const matchesSearch =
      asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterStatus === 'all' ||
      asset.status === filterStatus ||
      (filterStatus === 'critical' && asset.healthScore < 70);

    return matchesSearch && matchesFilter;
  });

  const sensorChartData = selectedAsset?.sensorData.slice(-30).map((value, index) => ({
    time: index,
    value: Math.round(value),
  })) ?? [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'maintenance': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'critical': return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'offline': return 'bg-white/5 text-muted-foreground border-white/10';
      default: return 'bg-white/5 text-muted-foreground border-white/10';
    }
  };

  const getHealthColor = (score: number) => {
    if (score >= 85) return 'text-green-500';
    if (score >= 70) return 'text-amber-500';
    return 'text-destructive';
  };

  const handleAddAsset = () => {
    if (!form.name || !form.type || !form.location) return;
    addAsset({
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
    setShowAddDialog(false);
    setForm({
      name: '', type: '', location: '', manufacturer: '', model: '',
      serialNumber: '', installDate: new Date().toISOString().split('T')[0],
      lastMaintenance: new Date().toISOString().split('T')[0], nextMaintenance: '',
    });
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tighter glow-text bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-400">
            ASSET_REPOSITORY
          </h2>
          <p className="text-muted-foreground flex items-center gap-2 mt-1">
            <Package className="w-4 h-4 text-primary" />
            CentralIZED Equipment Monitoring & Registry
          </p>
        </div>
        <Button onClick={() => setShowAddDialog(true)} className="rounded-xl shadow-lg shadow-primary/20">
          <Plus className="w-4 h-4 mr-2" />
          REGister_NEW_ASSET
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="glass-panel border-none">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Query asset registry..."
                className="pl-9 bg-black/20 border-white/5 focus-visible:ring-primary/30"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {['all', 'operational', 'critical', 'offline'].map((status) => (
                <Button
                  key={status}
                  variant={filterStatus === status ? 'default' : 'outline'}
                  size="sm"
                  className="rounded-lg text-[10px] font-bold uppercase tracking-widest h-9"
                  onClick={() => setFilterStatus(status)}
                >
                  {status}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Assets List */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between px-2 mb-2">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Active nodes</span>
            <Badge variant="outline" className="text-[10px] border-primary/20">{filteredAssets.length}</Badge>
          </div>
          <div className="max-h-[700px] overflow-y-auto pr-2 space-y-3 custom-scrollbar">
            {filteredAssets.length === 0 ? (
              <p className="text-sm text-muted-foreground py-12 text-center opacity-40">No matching assets in local registry.</p>
            ) : (
              filteredAssets.map((asset) => (
                <motion.div
                  key={asset.id}
                  layoutId={asset.id}
                  onClick={() => setSelectedAsset(asset)}
                  className={`nexus-node p-4 cursor-pointer group relative overflow-hidden ${
                    selectedAsset?.id === asset.id
                      ? 'border-primary/50 bg-primary/10'
                      : 'border-white/5 hover:border-primary/30'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <p className={`font-bold truncate text-sm transition-colors ${selectedAsset?.id === asset.id ? 'text-primary' : 'text-foreground'}`}>
                        {asset.name}
                      </p>
                      <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-tighter">{asset.type}</p>
                    </div>
                    <Badge variant="outline" className={`text-[9px] uppercase ${getStatusColor(asset.status)}`}>
                      {asset.status}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[9px] text-muted-foreground uppercase">H_STABILITY</span>
                        <span className={`text-[10px] font-mono font-bold ${getHealthColor(asset.healthScore)}`}>{asset.healthScore}%</span>
                      </div>
                      <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-1000 ${
                            asset.healthScore < 70 ? 'bg-destructive shadow-[0_0_8px_oklch(0.55_0.22_25)]' : 'bg-primary shadow-[0_0_8px_oklch(0.65_0.22_260)]'
                          }`}
                          style={{ width: `${asset.healthScore}%` }}
                        />
                      </div>
                    </div>
                    
                    {asset.healthScore < settings.aiThreshold && (
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20"
                          disabled={isDiagnosing === asset.id}
                          onClick={async (e: React.MouseEvent) => {
                            e.stopPropagation();
                            setIsDiagnosing(asset.id);
                            toast.info(`Initializing fractal scan on ${asset.id}...`);
                            try {
                              await new Promise(r => setTimeout(r, 2500));
                              const result = await Promise.race([
                                runDiagnostics(asset.id, asset.sensorData),
                                new Promise((_, reject) => setTimeout(() => reject(new Error('TIMEOUT')), 10000))
                              ]) as any;
                              setDiagResult({ ...result, assetName: asset.name, assetId: asset.id });
                              setShowReport(true);
                            } catch (err: any) {
                              toast.error('AI Analysis failed. Check kernel logs.');
                            } finally {
                              setIsDiagnosing(null);
                            }
                          }}
                        >
                          <Zap className={`w-4 h-4 ${isDiagnosing === asset.id ? 'animate-pulse' : 'animate-pulse'}`} />
                        </Button>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Asset Details */}
        {selectedAsset && (
          <div className="lg:col-span-8 space-y-6">
            <Card className="glass-panel border-none overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Box className="w-32 h-32" />
              </div>
              <CardContent className="p-8 space-y-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                       <Badge variant="outline" className="text-[10px] font-mono border-primary/20 text-primary">NODE_ID: {selectedAsset.id}</Badge>
                       <Badge variant="outline" className={`text-[10px] uppercase ${getStatusColor(selectedAsset.status)}`}>{selectedAsset.status}</Badge>
                    </div>
                    <h2 className="text-4xl font-bold tracking-tighter">{selectedAsset.name}</h2>
                    <p className="text-muted-foreground font-mono text-sm mt-1 uppercase tracking-widest">{selectedAsset.manufacturer} // {selectedAsset.model}</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="rounded-xl border-white/5 hover:bg-white/5">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Sync_Readings
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="rounded-xl border-destructive/20 text-destructive hover:bg-destructive/10"
                      onClick={() => {
                        if (confirm('Initiate decommissioning protocol?')) {
                          deleteAsset(selectedAsset.id);
                          setSelectedAsset(null);
                        }
                      }}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      TERMINATE
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="nexus-node p-4">
                    <p className="text-[10px] text-muted-foreground uppercase mb-1">Health_Index</p>
                    <p className={`text-2xl font-bold font-mono ${getHealthColor(selectedAsset.healthScore)}`}>{selectedAsset.healthScore}%</p>
                  </div>
                  <div className="nexus-node p-4">
                    <p className="text-[10px] text-muted-foreground uppercase mb-1">Signal_Stability</p>
                    <p className="text-2xl font-bold font-mono text-primary">1.642</p>
                  </div>
                  <div className="nexus-node p-4 col-span-2">
                    <p className="text-[10px] text-muted-foreground uppercase mb-1">Last_Maintenance</p>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <p className="text-sm font-bold uppercase">{new Date(selectedAsset.lastMaintenance).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                {/* Sensor Chart Overhaul */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold flex items-center gap-2 uppercase tracking-widest">
                      <Activity className="w-4 h-4 text-primary" />
                      Neural Signal Trace
                    </h4>
                    <div className="flex items-center gap-4 text-[10px] font-mono opacity-60">
                      <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-primary" /> NOMINAL</span>
                      <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-destructive" /> ANOMALY</span>
                    </div>
                  </div>
                  <div className="h-72 bg-black/30 rounded-2xl p-6 border border-white/5">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={sensorChartData}>
                        <defs>
                          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                        <XAxis
                          dataKey="time"
                          stroke="#ffffff30"
                          fontSize={10}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis stroke="#ffffff30" fontSize={10} tickLine={false} axisLine={false} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'rgba(5, 5, 20, 0.95)',
                            border: '1px solid rgba(139, 92, 246, 0.3)',
                            borderRadius: '12px',
                            backdropBlur: '12px'
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke="var(--primary)"
                          strokeWidth={3}
                          dot={false}
                          animationDuration={2000}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-white/5">
                  <div className="space-y-4">
                    <h5 className="text-[10px] font-bold text-muted-foreground uppercase">Tech_Specifications</h5>
                    <div className="grid grid-cols-2 gap-4">
                       <div>
                         <p className="text-[10px] text-muted-foreground mb-0.5 uppercase">Model</p>
                         <p className="text-xs font-bold">{selectedAsset.model}</p>
                       </div>
                       <div>
                         <p className="text-[10px] text-muted-foreground mb-0.5 uppercase">Manufacturer</p>
                         <p className="text-xs font-bold">{selectedAsset.manufacturer}</p>
                       </div>
                       <div>
                         <p className="text-[10px] text-muted-foreground mb-0.5 uppercase">Installed</p>
                         <p className="text-xs font-bold">{new Date(selectedAsset.installDate).toLocaleDateString()}</p>
                       </div>
                       <div>
                         <p className="text-[10px] text-muted-foreground mb-0.5 uppercase">Wing_Loc</p>
                         <p className="text-xs font-bold text-primary">{selectedAsset.location}</p>
                       </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h5 className="text-[10px] font-bold text-muted-foreground uppercase">Service_Window</h5>
                    <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10">
                       <div className="flex items-center justify-between mb-4">
                          <span className="text-[10px] font-bold text-primary italic uppercase">Predictive_Window</span>
                          <span className="text-[10px] font-bold text-primary underline underline-offset-4">SCHEDULE NOW</span>
                       </div>
                       <div className="space-y-2">
                          <div className="flex justify-between text-[11px]">
                             <span className="text-muted-foreground">Next Scheduled Maintenance</span>
                             <span className="font-bold">{new Date(selectedAsset.nextMaintenance).toLocaleDateString()}</span>
                          </div>
                          <Progress value={45} className="h-1 bg-white/5" />
                          <p className="text-[10px] text-muted-foreground/60 italic leading-snug">
                            Current operational cycle: 844hrs. Next calibration cycle recommended in 42 days based on acoustic resonance patterns.
                          </p>
                       </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Re-use existing Diagnostic Report UI but with Quantum styling */}
      <Dialog open={showReport} onOpenChange={setShowReport}>
        <DialogContent className="max-w-2xl glass-panel border-primary/20 bg-black/90 text-foreground overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-blue-400 to-primary animate-pulse" />
          <DialogHeader className="pt-4">
            <DialogTitle className="flex items-center gap-3 text-primary text-xl tracking-tighter uppercase font-black italic">
              <Zap className="w-6 h-6 animate-pulse" />
              Sentinel_Oracle Oracle_Result
            </DialogTitle>
          </DialogHeader>
          
          {diagResult && (
            <div className="space-y-8 py-6">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <Label className="text-muted-foreground text-[10px] uppercase font-bold tracking-widest">Identified_Equipment</Label>
                    <div className="text-2xl font-black italic tracking-tighter mt-1">{diagResult.assetName}</div>
                    <div className="text-[10px] font-mono text-primary/60 mt-0.5">UID: {diagResult.assetId}</div>
                  </div>
                  
                  <div className="p-5 rounded-2xl bg-white/5 border border-white/10 shadow-inner">
                    <Label className="text-muted-foreground text-[10px] uppercase font-bold tracking-widest block mb-1">Fractal_Complexity</Label>
                    <div className="text-5xl font-black font-mono text-blue-400 drop-shadow-[0_0_10px_rgba(96,165,250,0.5)] leading-tight">{diagResult.fractalDimension}</div>
                    <p className="text-[9px] text-muted-foreground mt-3 font-mono opacity-60">
                      Signal variance computed across the temporal manifold. High divergence suggests material fatigue.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center p-8 rounded-3xl bg-gradient-to-br from-primary/10 to-blue-900/10 border border-primary/20 shadow-2xl relative group">
                   <div className="absolute inset-0 bg-primary/5 rounded-3xl group-hover:bg-primary/10 transition-colors" />
                   <div className="relative w-40 h-40 flex items-center justify-center mb-6">
                     <svg className="w-full h-full transform -rotate-90">
                       <circle cx="80" cy="80" r="74" stroke="rgba(255,255,255,0.05)" strokeWidth="8" fill="transparent" />
                       <circle
                         cx="80"
                         cy="80"
                         r="74"
                         stroke="currentColor"
                         strokeWidth="8"
                         fill="transparent"
                         strokeDasharray={465}
                         strokeDashoffset={465 - (465 * diagResult.healthScore) / 100}
                         className={`transition-all duration-2000 ease-out ${diagResult.healthScore < 65 ? 'text-destructive drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'text-primary drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]'}`}
                       />
                     </svg>
                     <div className="absolute inset-0 flex flex-col items-center justify-center">
                       <span className="text-5xl font-black tracking-tighter italic">{diagResult.healthScore}%</span>
                       <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Core_Pulse</span>
                     </div>
                   </div>
                   <Badge className={`text-[10px] font-black italic rounded-lg px-4 py-1 tracking-widest ${diagResult.healthScore < 65 ? 'bg-destructive/10 text-destructive border-destructive/20' : 'bg-primary/10 text-primary border-primary/20'}`}>
                     {diagResult.status?.toUpperCase() || (diagResult.healthScore < 65 ? 'CRITICAL_NODE' : 'OPTIMAL_STATE')}
                   </Badge>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-primary/10 border border-primary/20 relative group overflow-hidden">
                <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
                   <Cpu className="w-24 h-24" />
                </div>
                <h4 className="flex items-center gap-2 text-[10px] font-black text-primary mb-3 uppercase tracking-[0.2em] italic">
                   Oracle_Verdict
                </h4>
                <p className="text-sm font-medium leading-relaxed italic text-blue-100/90">
                  {diagResult.healthScore < 65 
                    ? "Severe non-linear signal variance detected. Statistical markers indicate impending actuator failure. Immediate maintenance escalation required to prevent system downtime."
                    : diagResult.healthScore < 85 
                    ? "Moderate signal complexity discovered. Equipment is stable but showing early baseline drift. Schedule preventive inspection within 14 cycles."
                    : "Signal stability verified. Fractal analysis confirms optimal mechanical resonance. No intervention required at this interval."}
                </p>
              </div>

              <DialogFooter className="gap-3">
                <Button variant="ghost" className="text-muted-foreground hover:text-foreground text-[10px] font-bold uppercase tracking-widest" onClick={() => setShowReport(false)}>
                  Close_Terminal
                </Button>
                {diagResult.healthScore < 65 && (
                  <Button 
                    className="bg-destructive hover:bg-destructive/90 text-white border-none rounded-xl px-6 py-6 font-black italic tracking-tighter text-lg shadow-[0_0_20px_rgba(239,68,68,0.3)]"
                    onClick={() => {
                      setShowReport(false);
                      setShowEscalateModal(true);
                    }}
                  >
                    <AlertTriangle className="w-5 h-5 mr-3" />
                    ESCALATE_TICKET
                  </Button>
                )}
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Escalation Modal Polish */}
      <Dialog open={showEscalateModal} onOpenChange={setShowEscalateModal}>
        <DialogContent className="max-w-xl glass-panel border-primary/20">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-xl tracking-tighter font-black italic text-destructive uppercase">
              <ClipboardList className="w-6 h-6" />
              AI_CRITICAL_ESCALATION
            </DialogTitle>
          </DialogHeader>
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-2xl">
            <p className="text-xs text-destructive font-bold uppercase tracking-widest">
              CAUTION_IMPENDING_FAILURE
            </p>
            <p className="text-sm text-white/80 leading-relaxed mt-2">
              System escalating failure prediction for <strong className="text-white">{diagResult?.assetName}</strong>. 
              The Gemini Engine has predicted an impending failure event with <span className="text-destructive font-black underline underline-offset-4">{100 - (diagResult?.healthScore || 0)}% certainty</span>.
            </p>
          </div>
          <WorkOrderForm onSuccess={() => {
            setShowEscalateModal(false);
            toast.success("Critical work order successfully escalated via Protocol Sentinel.");
          }} />
        </DialogContent>
      </Dialog>

      {/* Fullscreen Scan Animation */}
      {isDiagnosing && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-2xl flex items-center justify-center flex-col">
          <div className="relative w-80 h-80">
            <div className="absolute inset-0 border-2 border-primary/10 rounded-full animate-ping [animation-duration:3s]" />
            <div className="absolute inset-8 border-2 border-primary/20 rounded-full animate-pulse" />
            <div className="absolute inset-16 border-2 border-primary/5 rounded-full" />
            
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-primary/10 to-transparent rounded-full animate-spin [animation-duration:1.5s]" />
            
            <div className="absolute inset-0 flex items-center justify-center flex-col p-8 text-center">
              <div className="w-20 h-20 bg-primary/20 rounded-3xl flex items-center justify-center mb-6 border border-primary/30 shadow-[0_0_30px_rgba(139,92,246,0.3)]">
                <Zap className="w-10 h-10 text-primary animate-pulse" />
              </div>
              <div className="text-primary font-black italic text-xl tracking-[0.2em] animate-pulse">PROTOCOL_SENTINEL</div>
              <div className="text-[10px] text-muted-foreground font-mono mt-4 uppercase tracking-[0.4em] opacity-60">DECOMPOSING_LOCAL_SIGNAL</div>
              
              <div className="flex gap-1 mt-8">
                 {[...Array(5)].map((_, i) => (
                    <motion.div 
                      key={i}
                      animate={{ height: [4, 16, 4] }}
                      transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }}
                      className="w-1 bg-primary/40 rounded-full"
                    />
                 ))}
              </div>
            </div>
          </div>
          
          <div className="mt-12 text-[10px] font-mono text-primary/40 uppercase tracking-[0.5em] animate-pulse">
            Awaiting_Kernel_Response_...
          </div>
        </div>
      )}

      {/* Register Dialog Polish */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-xl glass-panel border-white/5 bg-black/80">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-2xl font-black italic tracking-tighter text-primary uppercase">
              <Plus className="w-6 h-6" />
              Node_Registry_Portal
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-2">
                <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1">Asset_Identifier</Label>
                <Input
                  className="bg-white/5 border-white/5 focus-visible:ring-primary/30"
                  placeholder="e.g. MRI_CORE_04"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1">Registry_Class</Label>
                <Input
                  className="bg-white/5 border-white/5 focus-visible:ring-primary/30 text-xs"
                  placeholder="e.g. Imaging"
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1">Site_Coordinates</Label>
                <Input
                  className="bg-white/5 border-white/5 focus-visible:ring-primary/30 text-xs"
                  placeholder="e.g. Sector G-04"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                />
              </div>
            </div>
          </div>
          <DialogFooter className="mt-8">
            <Button variant="ghost" onClick={() => setShowAddDialog(false)}>Cancel</Button>
            <Button onClick={handleAddAsset} className="bg-primary hover:bg-primary/90 text-white rounded-xl shadow-[0_0_15px_rgba(139,92,246,0.2)] font-bold px-8">
              INITIALIZE_ASSET
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
