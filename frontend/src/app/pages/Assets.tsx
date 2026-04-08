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
} from 'lucide-react';
import { useApp } from '../lib/store';
import { type Asset } from '../lib/mock-data';
import { toast } from 'sonner';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { WorkOrderForm } from '../components/forms/WorkOrderForm';
import { ClipboardList } from 'lucide-react';

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
      case 'operational': return 'bg-green-100 text-green-800';
      case 'maintenance': return 'bg-blue-100 text-blue-800';
      case 'critical': return 'bg-red-100 text-red-800';
      case 'offline': return 'bg-slate-100 text-slate-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-amber-600';
    return 'text-red-600';
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Asset Management</h2>
          <p className="text-slate-500">Monitor and manage hospital equipment assets</p>
        </div>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Register New Asset
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search assets by name, type, or location..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {['all', 'operational', 'maintenance', 'critical', 'offline'].map((status) => (
                <Button
                  key={status}
                  variant={filterStatus === status ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus(status)}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Assets List */}
        <div className="lg:col-span-1 space-y-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Assets ({filteredAssets.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="max-h-[600px] overflow-y-auto space-y-2">
              {filteredAssets.length === 0 ? (
                <p className="text-sm text-slate-400 py-4 text-center">No assets found.</p>
              ) : (
                filteredAssets.map((asset) => (
                  <div
                    key={asset.id}
                    onClick={() => setSelectedAsset(asset)}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedAsset?.id === asset.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-900 truncate text-sm">
                          {asset.name}
                        </p>
                        <p className="text-xs text-slate-500 truncate">{asset.type}</p>
                      </div>
                      <Badge className={getStatusColor(asset.status)} variant="secondary">
                        {asset.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className={`flex items-center gap-1 text-xs font-medium ${getHealthScoreColor(
                          asset.healthScore
                        )}`}
                      >
                        <Activity className="w-3 h-3" />
                        {asset.healthScore}%
                      </div>
                      {asset.healthScore < settings.aiThreshold && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="ml-auto"
                          disabled={isDiagnosing === asset.id}
                          onClick={async (e: React.MouseEvent) => {
                            e.stopPropagation();
                            setIsDiagnosing(asset.id);
                            toast.info(`Initializing fractal scan on ${asset.id}...`);
                            try {
                              // 1. Initial scanning period for "WOW" effect
                              await new Promise(r => setTimeout(r, 2500));
                              
                              // 2. Race the diagnostic call against a 10s timeout to prevent hanging
                              const result = await Promise.race([
                                runDiagnostics(asset.id, asset.sensorData),
                                new Promise((_, reject) => setTimeout(() => reject(new Error('TIMEOUT')), 10000))
                              ]) as any;

                              setDiagResult({ ...result, assetName: asset.name, assetId: asset.id });
                              setShowReport(true);
                            } catch (err: any) {
                              if (err.message === 'TIMEOUT') {
                                toast.error('Diagnostic Engine Timeout: Check network connectivity.');
                              } else {
                                toast.error('AI Analysis failed. Please retry.');
                              }
                            } finally {
                              setIsDiagnosing(null);
                            }
                          }}
                        >
                          <Zap className={`w-4 h-4 mr-2 text-purple-600 ${isDiagnosing === asset.id ? 'animate-pulse' : ''}`} />
                          {isDiagnosing === asset.id ? 'Scanning...' : 'Run Diagnostics'}
                        </Button>
                      )}
                      {selectedAsset?.id === asset.id && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-600 border-red-100 hover:bg-red-50 hover:text-red-700"
                          onClick={(e: React.MouseEvent) => {
                            e.stopPropagation();
                            if (confirm('Are you sure you want to decommission this asset? This cannot be undone.')) {
                              deleteAsset(asset.id);
                              setSelectedAsset(assets.find(a => a.id !== asset.id) || null);
                            }
                          }}
                        >
                          <AlertTriangle className="w-4 h-4 mr-2" />
                          Decommission
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Asset Details */}
        {selectedAsset && (
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{selectedAsset.name}</CardTitle>
                    <p className="text-sm text-slate-500 mt-1">{selectedAsset.id}</p>
                  </div>
                  <Badge className={getStatusColor(selectedAsset.status)} variant="secondary">
                    {selectedAsset.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Health Score */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900">Fractal Health Score</span>
                      {selectedAsset.healthScore < settings.aiThreshold && (
                        <Badge variant="destructive" className="flex items-center gap-1">
                          <Zap className="w-3 h-3" />
                          AI Alert Active
                        </Badge>
                      )}
                    </div>
                    <span className={`text-2xl font-bold ${getHealthScoreColor(selectedAsset.healthScore)}`}>
                      {selectedAsset.healthScore}%
                    </span>
                  </div>
                  <Progress
                    value={selectedAsset.healthScore}
                    className={
                      selectedAsset.healthScore >= 85
                        ? 'bg-green-100'
                        : selectedAsset.healthScore >= settings.aiThreshold
                        ? 'bg-amber-100'
                        : 'bg-red-100'
                    }
                  />
                  <p className="text-xs text-slate-500 mt-2">
                    {selectedAsset.healthScore < 70
                      ? 'Equipment degradation detected through fractal analysis. Maintenance recommended.'
                      : selectedAsset.healthScore < 85
                      ? 'Equipment showing minor irregularities. Monitor closely.'
                      : 'Equipment operating within normal parameters.'}
                  </p>
                </div>

                {/* Sensor Data Chart */}
                <div>
                  <h4 className="font-semibold text-slate-900 mb-3">Real-Time Sensor Data</h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={sensorChartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis
                          dataKey="time"
                          stroke="#64748b"
                          fontSize={12}
                          tickLine={false}
                        />
                        <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke={
                            selectedAsset.healthScore >= 85
                              ? '#10b981'
                              : selectedAsset.healthScore >= 70
                              ? '#f59e0b'
                              : '#ef4444'
                          }
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Asset Information Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <div className="text-xs text-slate-500 mb-1">Type</div>
                      <div className="text-sm font-medium text-slate-900">{selectedAsset.type}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 mb-1">Manufacturer</div>
                      <div className="text-sm font-medium text-slate-900">
                        {selectedAsset.manufacturer}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 mb-1">Model</div>
                      <div className="text-sm font-medium text-slate-900">{selectedAsset.model}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 mb-1">Serial Number</div>
                      <div className="text-sm font-medium text-slate-900">
                        {selectedAsset.serialNumber}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center gap-1 text-xs text-slate-500 mb-1">
                        <MapPin className="w-3 h-3" />
                        Location
                      </div>
                      <div className="text-sm font-medium text-slate-900">
                        {selectedAsset.location}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-1 text-xs text-slate-500 mb-1">
                        <Calendar className="w-3 h-3" />
                        Install Date
                      </div>
                      <div className="text-sm font-medium text-slate-900">
                        {new Date(selectedAsset.installDate).toLocaleDateString()}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-1 text-xs text-slate-500 mb-1">
                        <Calendar className="w-3 h-3" />
                        Last Maintenance
                      </div>
                      <div className="text-sm font-medium text-slate-900">
                        {new Date(selectedAsset.lastMaintenance).toLocaleDateString()}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-1 text-xs text-slate-500 mb-1">
                        <Calendar className="w-3 h-3" />
                        Next Scheduled
                      </div>
                      <div className="text-sm font-medium text-slate-900">
                        {new Date(selectedAsset.nextMaintenance).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Diagnostic Report Dialog */}
      <Dialog open={showReport} onOpenChange={setShowReport}>
        <DialogContent className="max-w-2xl bg-slate-950 text-slate-50 border-slate-800">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-blue-400">
              <Zap className="w-6 h-6" />
              AI Fractal Diagnostic Report
            </DialogTitle>
          </DialogHeader>
          
          {diagResult && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div>
                    <Label className="text-slate-400 text-xs uppercase tracking-wider">Target Equipment</Label>
                    <div className="text-lg font-bold">{diagResult.assetName}</div>
                    <div className="text-xs text-slate-500">{diagResult.assetId}</div>
                  </div>
                  
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                    <Label className="text-slate-400 text-xs uppercase tracking-wider block mb-2">Fractal Complexity Score</Label>
                    <div className="text-4xl font-mono font-bold text-blue-400">{diagResult.fractalDimension}</div>
                    <p className="text-[10px] text-slate-500 mt-2">
                      Computed via Box-Counting algorithm across {assets.find(a => a.id === diagResult.assetId)?.sensorData.length} data points.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center p-6 rounded-xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 relative overflow-hidden">
                   {/* Radial Health Indicator */}
                   <div className="relative w-32 h-32 flex items-center justify-center mb-4">
                     <svg className="w-full h-full transform -rotate-90">
                       <circle
                         cx="64"
                         cy="64"
                         r="58"
                         stroke="currentColor"
                         strokeWidth="8"
                         fill="transparent"
                         className="text-slate-800"
                       />
                       <circle
                         cx="64"
                         cy="64"
                         r="58"
                         stroke="currentColor"
                         strokeWidth="8"
                         fill="transparent"
                         strokeDasharray={364.4}
                         strokeDashoffset={364.4 - (364.4 * diagResult.healthScore) / 100}
                         className={diagResult.healthScore < 65 ? 'text-red-500' : 'text-green-500'}
                       />
                     </svg>
                     <div className="absolute inset-0 flex flex-col items-center justify-center">
                       <span className="text-3xl font-bold">{diagResult.healthScore}%</span>
                       <span className="text-[10px] uppercase opacity-60">Health</span>
                     </div>
                   </div>
                   <Badge className={diagResult.healthScore < 65 ? 'bg-red-500/20 text-red-500 border-red-500/50' : 'bg-green-500/20 text-green-500 border-green-500/50'}>
                     {diagResult.status?.toUpperCase() || (diagResult.healthScore < 65 ? 'CRITICAL' : 'OPTIMAL')}
                   </Badge>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-blue-500/5 border border-blue-500/20">
                <h4 className="flex items-center gap-2 text-sm font-semibold text-blue-300 mb-2">
                  <Activity className="w-4 h-4" />
                  AI Clinical Verdict
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {diagResult.healthScore < 65 
                    ? "Severe non-linear signal variance detected. Statistical markers indicate impending actuator failure. Immediate maintenance escalation required to prevent system downtime."
                    : diagResult.healthScore < 85 
                    ? "Moderate signal complexity discovered. Equipment is stable but showing early baseline drift. Schedule preventive inspection within 14 cycles."
                    : "Signal stability verified. Fractal analysis confirms optimal mechanical resonance. No intervention required at this interval."}
                </p>
              </div>

              <DialogFooter className="gap-2 sm:gap-0">
                <Button variant="ghost" className="text-slate-400 hover:text-white" onClick={() => setShowReport(false)}>
                  Archive Results
                </Button>
                {diagResult.healthScore < 65 && (
                  <Button 
                    className="bg-red-600 hover:bg-red-700 text-white border-none shadow-lg shadow-red-900/20"
                    onClick={() => {
                      setShowReport(false);
                      setShowEscalateModal(true);
                    }}
                  >
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Escalate to Urgent Work Order
                  </Button>
                )}
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Escalation Work Order Modal */}
      <Dialog open={showEscalateModal} onOpenChange={setShowEscalateModal}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-red-600" />
              AI Critical Escalation Ticket
            </DialogTitle>
          </DialogHeader>
          <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-lg">
            <p className="text-xs text-red-800 font-medium">
              You are escalating a failure prediction for <strong>{diagResult?.assetName}</strong>. 
              The AI Engine has predicted an impending failure with {100 - (diagResult?.healthScore || 0)}% certainty.
            </p>
          </div>
          <WorkOrderForm onSuccess={() => {
            setShowEscalateModal(false);
            toast.success("Critical work order successfully escalated.");
          }} />
        </DialogContent>
      </Dialog>

      {/* Fullscreen Scan Animation */}
      {isDiagnosing && (
        <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center flex-col">
          <div className="relative w-64 h-64">
            {/* The Radar Circles */}
            <div className="absolute inset-0 border-2 border-blue-500/20 rounded-full animate-ping" />
            <div className="absolute inset-4 border-2 border-blue-400/30 rounded-full animate-pulse" />
            <div className="absolute inset-12 border border-blue-300/40 rounded-full" />
            
            {/* The Scanning Beam */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-blue-500/20 to-transparent rounded-full animate-spin [animation-duration:2s]" />
            
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <Zap className="w-12 h-12 text-blue-400 animate-pulse mb-4" />
              <div className="text-blue-100 font-mono text-sm tracking-widest animate-pulse">ANALYZING SIGNAL...</div>
              <div className="text-[10px] text-blue-400/60 font-mono mt-1">FRACTAL DECOMPOSITION IN PROGRESS</div>
            </div>
          </div>
          
          <div className="mt-8 grid grid-cols-4 gap-2 w-full max-w-sm px-4">
             {[...Array(4)].map((_, i) => (
                <div key={i} className="h-1 bg-blue-900 rounded-full overflow-hidden">
                   <div 
                     className="h-full bg-blue-400 animate-[loading_2s_ease-in-out_infinite]" 
                     style={{ animationDelay: `${i * 0.2}s` }} 
                   />
                </div>
             ))}
          </div>
          
          {/* Inject Dynamic styles for the scan */}
          <style>{`
            @keyframes loading {
              0% { width: 0%; transform: translateX(-100%); }
              50% { width: 100%; transform: translateX(0%); }
              100% { width: 0%; transform: translateX(100%); }
            }
          `}</style>
        </div>
      )}

      {/* Add Asset Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="w-5 h-5 text-blue-600" />
              Register New Asset
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-2">
                <Label htmlFor="asset-name">Asset Name *</Label>
                <Input
                  id="asset-name"
                  placeholder="e.g. Ventilator - ICU Wing B"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="asset-type">Equipment Type *</Label>
                <Input
                  id="asset-type"
                  placeholder="e.g. Ventilator"
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="asset-location">Location *</Label>
                <Input
                  id="asset-location"
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
                <Label htmlFor="asset-serial">Serial Number</Label>
                <Input
                  id="asset-serial"
                  placeholder="Auto-generated if blank"
                  value={form.serialNumber}
                  onChange={(e) => setForm({ ...form, serialNumber: e.target.value })}
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
              <div className="col-span-2 space-y-2">
                <Label htmlFor="asset-next-maint">Next Maintenance Date</Label>
                <Input
                  id="asset-next-maint"
                  type="date"
                  value={form.nextMaintenance}
                  onChange={(e) => setForm({ ...form, nextMaintenance: e.target.value })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
            <Button onClick={handleAddAsset} disabled={!form.name || !form.type || !form.location}>
              Register Asset
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
