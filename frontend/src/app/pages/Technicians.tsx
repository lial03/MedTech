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
import { Users, Mail, Phone, CheckCircle2, Clock, Award, Plus, Wrench, Activity } from 'lucide-react';
import { useApp } from '../lib/store';
import { type WorkOrder } from '../lib/mock-data';

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
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'busy':
        return 'bg-amber-100 text-amber-800';
      case 'offline':
        return 'bg-slate-100 text-slate-800';
      default:
        return 'bg-slate-100 text-slate-800';
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
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Technician Management</h2>
          <p className="text-slate-500">View and manage biomedical technicians</p>
        </div>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Technician
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900">{technicians.length}</p>
            <p className="text-sm text-slate-500">Total Technicians</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900">{availableTechs.length}</p>
            <p className="text-sm text-slate-500">Available</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-8 h-8 text-amber-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900">{busyTechs.length}</p>
            <p className="text-sm text-slate-500">Busy</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Award className="w-8 h-8 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900">
              {technicians.reduce((sum, t) => sum + t.completedWorkOrders, 0)}
            </p>
            <p className="text-sm text-slate-500">Total Completed</p>
          </CardContent>
        </Card>
      </div>

      {/* Technicians Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {technicians.map((technician) => (
          <Card key={technician.id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-start gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarFallback className="text-lg bg-gradient-to-br from-blue-600 to-cyan-500 text-white font-bold">
                    {technician.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg mb-1 truncate">{technician.name}</CardTitle>
                  <Badge className={getStatusColor(technician.status)} variant="secondary">
                    {technician.status}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 flex-1">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span className="truncate">{technician.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span>{technician.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Activity className="w-4 h-4 text-slate-400" />
                  <span>{technician.activeWorkOrders} Active / {technician.completedWorkOrders} Done</span>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-slate-900 mb-2">Specializations</p>
                <div className="flex flex-wrap gap-2">
                  {technician.specialization.map((spec) => (
                    <Badge key={spec} variant="outline" className="text-xs">
                      {spec}
                    </Badge>
                  ))}
                  {technician.specialization.length === 0 && (
                    <span className="text-xs text-slate-400 italic">No specializations set</span>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Active Tasks</p>
                    <p className="text-lg font-semibold text-slate-900">
                      {technician.activeWorkOrders}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Completed</p>
                    <p className="text-lg font-semibold text-slate-900">
                      {technician.completedWorkOrders}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            <div className="p-6 pt-0 mt-auto flex gap-2">
              <Button size="sm" variant="outline" className="flex-1">
                View Profile
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="text-red-600 border-red-100 hover:bg-red-50"
                onClick={() => {
                  if (confirm(`Are you sure you want to remove ${technician.name} from the system?`)) {
                    deleteTechnician(technician.id);
                  }
                }}
              >
                Remove
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Performance Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...technicians]
              .sort((a, b) => b.completedWorkOrders - a.completedWorkOrders)
              .map((technician, index) => (
                <div key={technician.id} className="flex items-center gap-4 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                  <div className="w-8 text-center">
                    <span className={`text-lg font-bold ${index < 3 ? 'text-blue-600' : 'text-slate-400'}`}>
                      #{index + 1}
                    </span>
                  </div>
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-gradient-to-br from-blue-600 to-cyan-500 text-white font-medium">
                      {technician.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-900">{technician.name}</p>
                    <p className="text-sm text-slate-500">
                      {technician.completedWorkOrders} completed tasks
                    </p>
                  </div>
                  <div className="text-right flex items-center gap-4">
                    <div className="hidden md:block">
                      <div className="flex items-center gap-1 text-xs text-slate-500 mb-1">
                        <Wrench className="w-3 h-3" />
                        <span>Active: {technician.activeWorkOrders}</span>
                      </div>
                    </div>
                    <Badge className={getStatusColor(technician.status)} variant="secondary">
                      {technician.status}
                    </Badge>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Add Technician Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              Add New Technician
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tech-name">Full Name *</Label>
              <Input
                id="tech-name"
                placeholder="e.g. John Doe"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tech-email">Email Address *</Label>
              <Input
                id="tech-email"
                type="email"
                placeholder="e.g. john.doe@hospital.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tech-phone">Phone Number</Label>
              <Input
                id="tech-phone"
                placeholder="e.g. +254 700 000 000"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tech-specs">Specializations (comma separated)</Label>
              <Input
                id="tech-specs"
                placeholder="e.g. MRI, X-Ray, Ventilators"
                value={form.specialization}
                onChange={(e) => setForm({ ...form, specialization: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
            <Button onClick={handleAddTech} disabled={!form.name || !form.email}>
              Add Technician
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
