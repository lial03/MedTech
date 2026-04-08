import { Outlet, Link, useLocation } from 'react-router';
import {
  LayoutDashboard,
  Package,
  ClipboardList,
  Users,
  BarChart3,
  Settings,
  Menu,
  Bell,
  Archive,
  Activity,
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { ScrollArea } from './ui/scroll-area';
import { useState } from 'react';
import { useApp } from '../lib/store';
import { type Asset, type WorkOrder } from '../lib/mock-data';
import { LogOut } from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Assets', href: '/assets', icon: Package },
  { name: 'Work Orders', href: '/work-orders', icon: ClipboardList },
  { name: 'Inventory', href: '/inventory', icon: Archive },
  { name: 'Technicians', href: '/technicians', icon: Users },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Root() {
  const { settings, assets, workOrders, logout, user, notifications, clearNotifications, markNotificationAsRead } = useApp();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const alertCount = assets.filter((a: Asset) => a.healthScore < settings.aiThreshold).length + 
                     workOrders.filter((w: WorkOrder) => w.status === 'open' && w.priority === 'critical').length;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-64 bg-white border-r border-slate-200 transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-200">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="font-semibold text-slate-900 truncate max-w-[150px]">{settings.hospitalName}</div>
              <div className="text-xs text-slate-500">Fi-CMMS Control Hub</div>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(item.href);

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-slate-200">
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="w-9 h-9 bg-gradient-to-br from-purple-600 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                AD
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-slate-900 truncate">
                  {user?.name || 'Admin User'}
                </div>
                <div className="text-xs text-slate-500">{user?.role || 'Administrator'}</div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-slate-400 hover:text-red-600"
                onClick={() => {
                  if (confirm('Sign out of the maintenance hub?')) {
                    logout();
                  }
                }}
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200">
          <div className="flex items-center justify-between px-4 py-3 lg:px-6">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-lg font-semibold text-slate-900">
                  {navigation.find(
                    (item) =>
                      item.href === location.pathname ||
                      (item.href !== '/' && location.pathname.startsWith(item.href))
                  )?.name || 'Dashboard'}
                </h1>
                <p className="text-xs text-slate-500">
                  {new Date().toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="w-5 h-5 text-slate-600" />
                    {notifications.filter(n => !n.read).length > 0 && (
                      <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 bg-red-500 text-[10px] animate-pulse">
                        {notifications.filter(n => !n.read).length}
                      </Badge>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0 mr-4" align="end">
                  <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="font-semibold text-slate-900">Notifications</h3>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-auto p-0 text-xs text-blue-600 hover:text-blue-700"
                      onClick={clearNotifications}
                    >
                      Clear all
                    </Button>
                  </div>
                  <ScrollArea className="h-[350px]">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center">
                        <Bell className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                        <p className="text-sm text-slate-500">No new alerts</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-slate-50">
                        {notifications.map((n) => (
                          <div 
                            key={n.id} 
                            className={`p-4 hover:bg-slate-50 transition-colors cursor-pointer ${!n.read ? 'bg-blue-50/30' : ''}`}
                            onClick={() => markNotificationAsRead(n.id)}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${
                                n.type === 'critical' ? 'bg-red-500' :
                                n.type === 'ai' ? 'bg-purple-500' : 'bg-blue-500'
                              }`} />
                              <div className="flex-1 min-w-0">
                                <p className={`text-sm ${!n.read ? 'font-semibold text-slate-900' : 'text-slate-600'}`}>
                                  {n.message}
                                </p>
                                <p className="text-[10px] text-slate-400 mt-1">
                                  {new Date(n.timestamp).toLocaleTimeString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
