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
  AlertTriangle,
  LogOut,
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { ScrollArea } from './ui/scroll-area';
import { useState } from 'react';
import { useApp } from '../lib/store';
import { type Asset, type WorkOrder } from '../lib/mock-data';
import { motion } from 'motion/react';

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

  const criticalCount = assets.filter((a: Asset) => a.healthScore < settings.aiThreshold).length;

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-64 glass-panel border-r border-white/5 transition-transform duration-500 ease-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="px-6 py-8">
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center border border-primary/30 shadow-[0_0_15px_oklch(0.65_0.22_260/0.3)] transition-transform group-hover:scale-110">
                <Activity className="w-7 h-7 text-primary animate-pulse" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-bold text-lg tracking-tighter glow-text truncate uppercase">Fi-CMMS</h2>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" />
                  <span className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest leading-none">Nexus Protocol</span>
                </div>
              </div>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto px-4 space-y-2 py-4">
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
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative group ${
                    isActive
                      ? 'bg-primary/20 text-primary border border-primary/20 shadow-[0_0_15px_oklch(0.65_0.22_260/0.1)]'
                      : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-primary' : 'group-hover:text-primary transition-colors'}`} />
                  <span className="text-sm font-semibold tracking-wide">{item.name}</span>
                  {isActive && (
                    <motion.div 
                      layoutId="active-pill"
                      className="absolute left-0 w-1 h-6 bg-primary rounded-r-full"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 mt-auto">
             <div className="glass-panel p-4 rounded-2xl bg-white/5 border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                   <span className="text-[10px] font-bold text-muted-foreground uppercase">System Integrity</span>
                   <span className="text-[10px] font-mono text-green-500">OPTIMAL</span>
                </div>
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                   <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '92%' }}
                    className="h-full bg-gradient-to-r from-primary to-blue-400"
                   />
                </div>
             </div>
          </div>

          <div className="p-4 border-t border-white/5">
            <div className="flex items-center gap-3 px-3 py-2 group">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center text-white text-sm font-bold border border-white/10 shadow-lg">
                {user?.name?.[0] || 'A'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold truncate group-hover:text-primary transition-colors">
                  {user?.name || 'Admin User'}
                </div>
                <div className="text-[10px] text-muted-foreground uppercase font-mono tracking-widest leading-none mt-1">
                  {user?.role || 'Administrator'}
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all rounded-xl"
                onClick={() => {
                  if (confirm('Initiate terminal logout protocol?')) {
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
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-white/5 px-4 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-muted-foreground hover:text-primary"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-6 h-6" />
              </Button>
              <div className="hidden sm:block">
                <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground mb-0.5">
                  <span className="text-primary font-bold">NEXUS</span>
                  <span className="opacity-40">/</span>
                  <span className="uppercase">{location.pathname === '/' ? 'COMMAND' : location.pathname.split('/')[1].replace('-', ' ')}</span>
                </div>
                <div className="text-[10px] text-muted-foreground opacity-60">
                  {new Date().toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
               {criticalCount > 0 && (
                 <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-destructive/10 border border-destructive/20 text-[10px] font-bold text-destructive animate-pulse"
                 >
                    <AlertTriangle className="w-3 h-3" />
                    {criticalCount} CRITICAL ANOMALIES
                 </motion.div>
               )}

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative group hover:bg-primary/10 rounded-xl transition-all">
                    <Bell className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    {notifications.filter(n => !n.read).length > 0 && (
                      <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-destructive rounded-full border-2 border-background animate-bounce" />
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0 glass-panel border-white/5 mr-4 mt-2 shadow-2xl" align="end">
                  <div className="p-5 border-b border-white/5 flex items-center justify-between bg-white/5">
                    <h3 className="font-bold text-sm tracking-tight">System Alerts</h3>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-auto p-0 text-[10px] font-bold text-primary hover:text-blue-400 uppercase tracking-widest"
                      onClick={clearNotifications}
                    >
                      Purge Data
                    </Button>
                  </div>
                  <ScrollArea className="h-[350px]">
                    {notifications.length === 0 ? (
                      <div className="p-12 text-center">
                        <Bell className="w-10 h-10 text-white/5 mx-auto mb-3" />
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Awaiting Intel</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-white/5">
                        {notifications.map((n) => (
                          <div 
                            key={n.id} 
                            className={`p-4 hover:bg-white/5 transition-colors cursor-pointer relative group ${!n.read ? 'bg-primary/5' : ''}`}
                            onClick={() => markNotificationAsRead(n.id)}
                          >
                            <div className="flex items-start gap-4">
                              <div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 shadow-lg ${
                                n.type === 'critical' ? 'bg-destructive shadow-destructive/20 animate-pulse' :
                                n.type === 'ai' ? 'bg-blue-400 shadow-blue-400/20' : 'bg-primary shadow-primary/20'
                              }`} />
                              <div className="flex-1 min-w-0">
                                <p className={`text-xs leading-relaxed ${!n.read ? 'font-bold text-foreground' : 'text-muted-foreground'}`}>
                                  {n.message}
                                </p>
                                <p className="text-[9px] font-mono text-muted-foreground/60 mt-1 uppercase tracking-tighter">
                                  {new Date(n.timestamp).toLocaleTimeString([], { hour12: false })} · LOG_ENTRY_{n.id.slice(-4).toUpperCase()}
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
              <div className="w-px h-6 bg-white/5 mx-2" />
              <div className="flex items-center gap-3 pl-2">
                 <div className="flex flex-col items-end hidden sm:flex">
                    <span className="text-[10px] font-bold text-foreground">SITE_ADMIN</span>
                    <span className="text-[10px] font-mono text-muted-foreground uppercase opacity-60">HUB_ID: 1044-A</span>
                 </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
}
