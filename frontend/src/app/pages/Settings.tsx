import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { Slider } from '../components/ui/slider';
import {
  Settings as SettingsIcon,
  Bell,
  Shield,
  Database,
  Activity,
  Zap,
  Save,
  CheckCircle2,
  Fingerprint,
  RefreshCw,
  Brain,
  AlertTriangle,
  Users,
  Package,
  LayoutDashboard,
  Globe,
  Layers,
} from 'lucide-react';
import { toast } from 'sonner';
import { useApp } from '../lib/store';

export function Settings() {
  const { settings, updateSettings } = useApp();
  const [isSaving, setIsSaving] = useState(false);
  const [localSettings, setLocalSettings] = useState(settings);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      updateSettings(localSettings);
      setIsSaving(false);
      toast.success('Core parameters synchronized.', {
        icon: <Fingerprint className="w-4 h-4 text-primary" />,
      });
    }, 1000);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tighter glow-text bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-400 uppercase italic">
            SYSTEM_CORE_CONFIGURATION
          </h2>
          <p className="text-muted-foreground flex items-center gap-2 mt-1 uppercase tracking-widest text-[10px] font-bold opacity-60">
            <SettingsIcon className="w-4 h-4 text-primary" />
            Central Neural Hub & Security Protocols
          </p>
        </div>
        <Button onClick={handleSave} disabled={isSaving} className="hidden md:flex rounded-xl shadow-lg shadow-primary/20 bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 font-bold tracking-widest text-xs uppercase h-11 px-8">
          {isSaving ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          {isSaving ? 'SYNCING...' : 'SYNC_ALL_PARAMS'}
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* AI Configuration */}
        <Card className="glass-panel border-none relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
             <Brain className="w-16 h-16" />
          </div>
          <CardHeader>
            <CardTitle className="text-xs font-black uppercase tracking-[0.2em] italic text-primary flex items-center gap-3">
               <Zap className="w-5 h-5" />
               Neural_Predictive_Core
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                <div className="space-y-1">
                  <Label className="text-sm font-bold">Inertial_Prediction_Stream</Label>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest opacity-60">
                    Auto-generate deployment logs via Fractal Manifold
                  </p>
                </div>
                <Switch 
                  checked={localSettings.aiEnabled} 
                  onCheckedChange={(checked) => setLocalSettings({ ...localSettings, aiEnabled: checked })}
                  className="data-[state=checked]:bg-primary"
                />
              </div>

              <div className="space-y-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-bold">Fractal_Sensitivity_Threshold</Label>
                  <span className="text-xs font-mono font-black text-primary italic bg-primary/10 px-2 py-0.5 rounded-full">{localSettings.aiThreshold}%</span>
                </div>
                <Slider 
                  value={[localSettings.aiThreshold]} 
                  onValueChange={(val) => setLocalSettings({ ...localSettings, aiThreshold: val[0] })}
                  max={100} 
                  step={5} 
                  className="py-4"
                />
                <p className="text-[9px] text-muted-foreground uppercase italic opacity-40">
                  Trigger automated dispatch when integrity index deviates beyond this manifold.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-3 p-4 rounded-2xl bg-white/5 border border-white/5">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Pattern_Window</Label>
                    <div className="flex items-center gap-3">
                       <Input type="number" defaultValue="24" className="bg-transparent border-white/10 text-primary font-mono font-bold w-20 h-10" />
                       <span className="text-[10px] font-bold text-muted-foreground uppercase italic">HRS</span>
                    </div>
                 </div>
                 <div className="space-y-3 p-4 rounded-2xl bg-white/5 border border-white/5">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Signal_Refinement</Label>
                    <div className="flex items-center gap-1">
                       <div className="h-1 flex-1 bg-primary/40 rounded-full" />
                       <div className="h-1 flex-1 bg-primary/40 rounded-full" />
                       <div className="h-1 flex-1 bg-primary rounded-full" />
                       <div className="h-1 flex-1 bg-white/10 rounded-full" />
                    </div>
                 </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/5">
              <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent pointer-events-none" />
                <p className="text-[10px] font-black italic text-primary uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                  <Activity className="w-3 h-3" />
                  Box-Counting_Algorithm_Parameters
                </p>
                <div className="grid grid-cols-2 gap-y-2">
                  <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-widest opacity-60 pr-4">
                     <span>Scaling_Range</span>
                     <span className="text-foreground">2^1 → 2^6</span>
                  </div>
                  <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-widest opacity-60 pl-4 border-l border-white/5">
                     <span>Self_Similarity</span>
                     <span className="text-foreground">0.84 η</span>
                  </div>
                  <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-widest opacity-60 pr-4">
                     <span>Noise_Coefficient</span>
                     <span className="text-foreground">0.12 λ</span>
                  </div>
                  <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-widest opacity-60 pl-4 border-l border-white/5">
                     <span>Neural_Drift</span>
                     <span className="text-primary">AUTOMATED</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="glass-panel border-none relative overflow-hidden">
          <CardHeader>
            <CardTitle className="text-xs font-black uppercase tracking-[0.2em] italic text-primary flex items-center gap-3">
               <Bell className="w-5 h-5 text-blue-400" />
               Signal_Dispatch_Array
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <ToggleOption 
              label="Breach_Alert_Stream" 
              sub="Real-time biometric & node integrity push" 
              icon={AlertTriangle} 
              checked={localSettings.notificationsEnabled}
              onCheckedChange={(checked: boolean) => setLocalSettings({ ...localSettings, notificationsEnabled: checked })}
            />
            <ToggleOption label="Operative_Sync" sub="Notify personnel upon deployment orders" icon={Users} defaultChecked />
            <ToggleOption label="Logistics_Pressure" sub="Critical inventory exhaustion warnings" icon={Package} defaultChecked />
            <ToggleOption label="Neural_Reports" sub="Weekly predictive accuracy manifest" icon={LayoutDashboard} />
          </CardContent>
        </Card>

        {/* Institutional Hub */}
        <Card className="glass-panel border-none relative overflow-hidden">
          <CardHeader>
            <CardTitle className="text-xs font-black uppercase tracking-[0.2em] italic text-primary flex items-center gap-3">
               <Globe className="w-5 h-5 text-slate-400" />
               Institutional_Center_Manifold
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-40 pl-1">Facility_Alias</Label>
              <Input 
                className="bg-white/5 border-white/5 focus-visible:ring-primary/30 font-bold italic"
                value={localSettings.hospitalName} 
                onChange={(e) => setLocalSettings({ ...localSettings, hospitalName: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-40 pl-1">Admin_Neural_Link</Label>
              <Input className="bg-white/5 border-white/5 focus-visible:ring-primary/30 text-xs" type="email" defaultValue="admin@nexus.core" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-40 pl-1">Temporal_Zone</Label>
                <Input className="bg-white/5 border-white/5 focus-visible:ring-primary/30 text-xs" defaultValue="GMT-04_NEXUS" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-40 pl-1">Asset_Currency</Label>
                <Input className="bg-white/5 border-white/5 focus-visible:ring-primary/30 text-xs font-mono" defaultValue="USD_CORE" />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 mt-4">
              <div className="space-y-1">
                <Label className="text-sm font-bold">Auto_Vault_Sync</Label>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest opacity-60">
                  Nightly encrypted cloud sync [00:00]
                </p>
              </div>
              <Switch defaultChecked className="data-[state=checked]:bg-primary" />
            </div>
          </CardContent>
        </Card>

        {/* Security Bundle */}
        <div className="space-y-6">
          <Card className="glass-panel border-none border-green-500/10 hover:border-green-500/20 transition-colors">
            <CardHeader>
              <CardTitle className="text-xs font-black uppercase tracking-[0.2em] italic text-green-400 flex items-center gap-3">
                 <Shield className="w-5 h-5" />
                 Shield_Access_Protocols
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <ToggleOption label="Biometric_Auth" sub="Enforce 2FA/FaceID for operative access" icon={Fingerprint} />
              <ToggleOption label="Audit_Stream" sub="Chronological record of all core interactions" icon={Layers} defaultChecked />
            </CardContent>
          </Card>

          <Card className="glass-panel border-none border-cyan-500/10 hover:border-cyan-500/20 transition-colors">
            <CardHeader>
              <CardTitle className="text-xs font-black uppercase tracking-[0.2em] italic text-cyan-400 flex items-center gap-3">
                 <Database className="w-5 h-5" />
                 Ledger_Maintenance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 rounded-2xl bg-cyan-500/5 border border-cyan-500/10">
                <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-cyan-400 opacity-60 mb-1">State_Status</p>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_8px_oklch(0.65_0.22_150)]" />
                      <span className="text-xs font-black italic uppercase">Nominal</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-cyan-400 opacity-60 mb-1">Index_Heuristics</p>
                    <span className="text-xs font-mono font-bold">98.4%</span>
                  </div>
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-cyan-400 opacity-60 mb-1">TemporalSync_00</p>
                    <span className="text-xs font-mono opacity-80">14m_02s_ago</span>
                  </div>
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-cyan-400 opacity-60 mb-1">Redundancy</p>
                    <span className="text-[10px] font-black text-green-400/80 uppercase italic">MultiScale_Verified</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 rounded-xl border-white/5 bg-white/5 hover:bg-white/10 text-[10px] font-bold uppercase tracking-[0.15em] h-10">
                  INIT_BACKUP
                </Button>
                <Button variant="outline" className="flex-1 rounded-xl border-white/5 bg-white/5 hover:bg-white/10 text-[10px] font-bold uppercase tracking-[0.15em] h-10">
                  PROBE_LOGS
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Save Button (Mobile) */}
      <div className="flex md:hidden pt-4 pb-12">
        <Button onClick={handleSave} disabled={isSaving} className="w-full h-14 text-sm font-black uppercase tracking-widest bg-primary hover:bg-primary/90 text-white rounded-2xl shadow-xl shadow-primary/20">
          {isSaving ? <RefreshCw className="w-5 h-5 mr-3 animate-spin" /> : <Save className="w-5 h-5 mr-3" />}
          {isSaving ? 'SYNCHRONIZING...' : 'SYNC_CORE_PARAMS'}
        </Button>
      </div>
    </div>
  );
}

function ToggleOption({ label, sub, icon: Icon, checked, onCheckedChange, defaultChecked }: any) {
  return (
    <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-white/[0.03] transition-colors group">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center group-hover:border-primary/30 group-hover:bg-primary/5 transition-colors">
           <Icon className="w-5 h-5 opacity-60 group-hover:opacity-100 group-hover:text-primary transition-all" />
        </div>
        <div className="space-y-0.5">
          <Label className="text-sm font-bold tracking-tight">{label}</Label>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest opacity-40">{sub}</p>
        </div>
      </div>
      <Switch 
        checked={checked} 
        onCheckedChange={onCheckedChange}
        defaultChecked={defaultChecked}
        className="data-[state=checked]:bg-primary"
      />
    </div>
  );
}
