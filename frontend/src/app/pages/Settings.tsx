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
} from 'lucide-react';
import { toast } from 'sonner';
import { useApp } from '../lib/store';

export function Settings() {
  const { settings, updateSettings } = useApp();
  const [isSaving, setIsSaving] = useState(false);
  const [localSettings, setLocalSettings] = useState(settings);

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API call and then update global state
    setTimeout(() => {
      updateSettings(localSettings);
      setIsSaving(false);
      toast.success('System settings saved successfully!', {
        icon: <CheckCircle2 className="w-4 h-4 text-green-500" />,
      });
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">System Settings</h2>
          <p className="text-slate-500">Configure Fi-CMMS system preferences</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving} className="hidden md:flex">
          {isSaving ? <CheckCircle2 className="w-4 h-4 mr-2 animate-pulse" /> : <Save className="w-4 h-4 mr-2" />}
          {isSaving ? 'Saving...' : 'Save All Settings'}
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* AI Configuration */}
        <Card className="border-purple-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-purple-600" />
              AI Predictive Maintenance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Enable AI Predictions</Label>
                  <p className="text-sm text-slate-500">
                    Automatically generate work orders using fractal analysis
                  </p>
                </div>
                <Switch 
                  checked={localSettings.aiEnabled} 
                  onCheckedChange={(checked) => setLocalSettings({ ...localSettings, aiEnabled: checked })}
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Health Score Threshold</Label>
                  <Badge variant="outline" className="bg-purple-50">{localSettings.aiThreshold}%</Badge>
                </div>
                <Slider 
                  value={[localSettings.aiThreshold]} 
                  onValueChange={(val) => setLocalSettings({ ...localSettings, aiThreshold: val[0] })}
                  max={100} 
                  step={5} 
                />
                <p className="text-xs text-slate-500">
                  Generate work orders when asset health drops below this value
                </p>
              </div>

              <div className="space-y-3">
                <Label htmlFor="ai-window">Fractal Analysis Window (hours)</Label>
                <Input id="ai-window" type="number" defaultValue="24" className="max-w-[120px]" />
                <p className="text-xs text-slate-500">
                  Time window for sensor data aggregation and pattern matching
                </p>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="space-y-1">
                  <Label>Box-Counting Algorithm</Label>
                  <p className="text-sm text-slate-500">
                    Use high-precision fractal dimension calculation
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200">
              <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                <p className="text-sm font-medium text-purple-900 mb-1">
                  Advanced Fractal Parameters
                </p>
                <div className="text-xs text-purple-700 space-y-1">
                  <p>• Scaling range: 2^1 to 2^6</p>
                  <p>• Minimum self-similarity: 0.82</p>
                  <p>• Noise filter coefficient: 0.15</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-blue-600" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors">
              <div className="space-y-1">
                <Label>Critical Equipment Alerts</Label>
                <p className="text-sm text-slate-500">
                  Real-time push notifications for health drops
                </p>
              </div>
              <Switch 
                checked={localSettings.notificationsEnabled} 
                onCheckedChange={(checked) => setLocalSettings({ ...localSettings, notificationsEnabled: checked })}
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors">
              <div className="space-y-1">
                <Label>Work Order Assignment</Label>
                <p className="text-sm text-slate-500">
                  Notify technicians when new tasks are assigned
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors">
              <div className="space-y-1">
                <Label>Inventory Alerts</Label>
                <p className="text-sm text-slate-500">
                  Alert when stock levels hit critical minimums
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors">
              <div className="space-y-1">
                <Label>AI Performance Reports</Label>
                <p className="text-sm text-slate-500">
                  Weekly summary of predictive accuracy
                </p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* System */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="w-5 h-5 text-slate-600" />
              Institutional Hub Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="hospital-name">Facility Name</Label>
              <Input 
                id="hospital-name" 
                value={localSettings.hospitalName} 
                onChange={(e) => setLocalSettings({ ...localSettings, hospitalName: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="admin-email">System Administrator Email</Label>
              <Input id="admin-email" type="email" defaultValue="admin@medtechinnovators.com" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="timezone">Time Zone</Label>
                <Input id="timezone" defaultValue="Africa/Nairobi (EAT)" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Base Currency</Label>
                <Input id="currency" defaultValue="USD ($)" />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="space-y-1">
                <Label>Automatic Database Backups</Label>
                <p className="text-sm text-slate-500">
                  Nightly cloud sync at 00:00 EAT
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Security & Database */}
        <div className="space-y-6">
          <Card className="shadow-sm border-green-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-600" />
                Security & Access Control
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Multi-Factor Authentication</Label>
                  <p className="text-sm text-slate-500">Enforce MFA for all user accounts</p>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Audit Logs</Label>
                  <p className="text-sm text-slate-500">Record all system interactions</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-cyan-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5 text-cyan-600" />
                Database Diagnostics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                  <div>
                    <p className="text-xs text-slate-500 mb-0.5">DB Status</p>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span className="text-sm font-semibold">Healthy</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-0.5">Index Optimization</p>
                    <span className="text-sm font-semibold">98.4%</span>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-0.5">Last Sync</p>
                    <span className="text-sm font-semibold">14m ago</span>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-0.5">Data Redundancy</p>
                    <span className="text-sm font-semibold text-green-600 capitalize">Verified</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Database className="w-4 h-4 mr-2" />
                  Run Backup
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Activity className="w-4 h-4 mr-2" />
                  View Logs
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Save Button (Mobile) */}
      <div className="flex md:hidden pt-4 pb-8">
        <Button onClick={handleSave} disabled={isSaving} className="w-full h-12 text-base">
          {isSaving ? <CheckCircle2 className="w-5 h-5 mr-2 animate-pulse" /> : <Save className="w-5 h-5 mr-2" />}
          {isSaving ? 'Saving Changes...' : 'Save All Settings'}
        </Button>
      </div>
    </div>
  );
}
