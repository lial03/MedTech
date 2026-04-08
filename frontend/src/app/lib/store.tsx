// Global application store using React Context - API Connected Version
import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { toast } from 'sonner';
import { api } from './api';
import { type Asset, type WorkOrder, type Technician, type InventoryItem } from './mock-data';

interface AppState {
  assets: Asset[];
  workOrders: WorkOrder[];
  inventory: InventoryItem[];
  technicians: Technician[];
  settings: {
    hospitalName: string;
    aiThreshold: number;
    aiEnabled: boolean;
    notificationsEnabled: boolean;
  };
  isAuthenticated: boolean;
  user: any | null;
  isLoading: boolean;
  notifications: Array<{
    id: string;
    type: 'critical' | 'warning' | 'info' | 'ai';
    message: string;
    timestamp: Date;
    read: boolean;
  }>;
}

interface AppActions {
  // Assets
  addAsset: (asset: Omit<Asset, 'id' | 'sensorData'>) => Promise<void>;
  deleteAsset: (id: string) => Promise<void>;
  // Work Orders
  createWorkOrder: (order: Omit<WorkOrder, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateWorkOrderStatus: (id: string, status: WorkOrder['status']) => Promise<void>;
  assignWorkOrder: (orderId: string, technicianName: string) => Promise<void>;
  completeWorkOrder: (id: string, partsUsed: any[], laborHours: number) => Promise<void>;
  // Inventory
  addInventoryItem: (item: Omit<InventoryItem, 'id'>) => Promise<void>;
  restockItem: (id: string, quantity: number) => Promise<void>;
  deleteInventoryItem: (id: string) => Promise<void>;
  // Technicians
  addTechnician: (tech: any) => Promise<void>;
  deleteTechnician: (id: string) => Promise<void>;
  // Settings & Auth
  updateSettings: (settings: Partial<AppState['settings']>) => void;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  // AI
  runDiagnostics: (assetId: string, data: number[]) => Promise<void>;
  // Notifications
  clearNotifications: () => void;
  markNotificationAsRead: (id: string) => void;
}

type AppContextType = AppState & AppActions;

const AppContext = createContext<AppContextType | null>(null);

const initialSettings = {
  hospitalName: 'MedTech Innovators Hospital',
  aiThreshold: 65,
  aiEnabled: true,
  notificationsEnabled: true,
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [settings, setSettings] = useState(initialSettings);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!localStorage.getItem('auth_token'));
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState<AppState['notifications']>([]);

  const fetchData = useCallback(async () => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    try {
      const [assetsData, workOrdersData, inventoryData, techniciansData] = await Promise.all([
        api.assets.list(),
        api.workorders.list(),
        api.inventory.list(),
        api.technicians.list(),
      ]);
      setAssets(assetsData);
      setWorkOrders(workOrdersData);
      setInventory(inventoryData);
      
      // Normalize technicians (handle comma-separated strings/arrays)
      const normalizedTechs = techniciansData.map((t: any) => ({
        ...t,
        specialization: Array.isArray(t.specialization) 
          ? t.specialization 
          : (t.specialization || '').split(',').map((s: string) => s.trim()).filter(Boolean)
      }));
      setTechnicians(normalizedTechs);
    } catch (error) {
      console.error('Failed to fetch data', error);
      toast.error('System synchronization failed. Verify backend services are online.');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const { token, user } = await api.auth.login({ email, password });
      localStorage.setItem('auth_token', token);
      setIsAuthenticated(true);
      setUser(user);
      return true;
    } catch (error) {
      toast.error('Invalid credentials');
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('auth_token');
    setIsAuthenticated(false);
    setUser(null);
    setAssets([]);
    setWorkOrders([]);
    toast.info('Session terminated');
  }, []);

  const addAsset = useCallback(async (asset: any) => {
    try {
      const newAsset = await api.assets.create(asset);
      setAssets(prev => [...prev, newAsset]);
      toast.success(`Asset "${asset.name}" registered in database`);
    } catch (error) {
      toast.error('Failed to create asset');
    }
  }, []);

  const deleteAsset = useCallback(async (id: string) => {
    try {
      await api.assets.delete(id);
      setAssets(prev => prev.filter(a => a.id !== id));
      toast.info('Asset deleted from registry');
    } catch (error) {
      toast.error('Failed to delete asset');
    }
  }, []);

  const createWorkOrder = useCallback(async (order: any) => {
    try {
      const newOrder = await api.workorders.create(order);
      setWorkOrders(prev => [newOrder, ...prev]);
      toast.success(`Work order "${order.title}" assigned`);
    } catch (error) {
      toast.error('Failed to create work order');
    }
  }, []);

  const assignWorkOrder = useCallback(async (orderId: string, technicianName: string) => {
    try {
      const updated = await api.workorders.assign(orderId, { assignedTo: technicianName });
      setWorkOrders(prev => prev.map(o => o.id === orderId ? updated : o));
      toast.success(`Task assigned to ${technicianName}`);
    } catch (error) {
      toast.error('Failed to assign work order');
    }
  }, []);

  const completeWorkOrder = useCallback(async (id: string, partsUsed: any[], laborHours: number) => {
    try {
      const updated = await api.workorders.complete(id, { partsUsed, laborHours });
      setWorkOrders(prev => prev.map(o => o.id === id ? updated : o));
      
      // Update inventory locally (server does it too but we refresh state)
      const inventoryData = await api.inventory.list();
      setInventory(inventoryData);
      
      toast.success('Work order archived successfully');
    } catch (error) {
      toast.error('Failed to complete work order');
    }
  }, []);

  const addInventoryItem = useCallback(async (item: any) => {
    try {
      const newItem = await api.inventory.create(item);
      setInventory(prev => [...prev, newItem]);
      toast.success(`Logistics: "${item.name}" registered`);
    } catch (error) {
      toast.error('Failed to add inventory item');
    }
  }, []);

  const restockItem = useCallback(async (id: string, quantity: number) => {
    try {
      const updated = await api.inventory.restock(id, quantity);
      setInventory(prev => prev.map(i => i.id === id ? updated : i));
      toast.success('Inventory stock updated');
    } catch (error) {
      toast.error('Failed to restock items');
    }
  }, []);

  const deleteInventoryItem = useCallback(async (id: string) => {
    try {
      await api.inventory.delete(id);
      setInventory(prev => prev.filter(i => i.id !== id));
      toast.info('Item removed from logistics');
    } catch (error) {
      toast.error('Failed to delete item');
    }
  }, []);

  const addTechnician = useCallback(async (tech: any) => {
    try {
      const newTech = await api.technicians.create(tech);
      setTechnicians(prev => [...prev, newTech]);
      toast.success(`Technician "${tech.name}" registered`);
    } catch (error) {
      toast.error('Failed to add technician');
    }
  }, []);

  const deleteTechnician = useCallback(async (id: string) => {
    try {
      await api.technicians.delete(id);
      setTechnicians(prev => prev.filter(t => t.id !== id));
      toast.info('Staff record removed');
    } catch (error) {
      toast.error('Failed to remove technician');
    }
  }, []);

  const runDiagnostics = useCallback(async (assetId: string, data: number[]) => {
    try {
      const result = await api.ai.predict(data);
      // Update asset health in database
      const updated = await api.assets.updateHealth(assetId, { 
        healthScore: result.healthScore,
        sensorData: data 
      });
      setAssets(prev => prev.map(a => a.id === assetId ? { ...a, healthScore: result.healthScore } : a));
      
      if (result.healthScore < settings.aiThreshold) {
        const message = `AI ALERT: Critical health drop detected for ${assetId} (${result.healthScore}%)`;
        toast.warning(message);
        setNotifications(prev => [{
          id: Math.random().toString(36).substr(2, 9),
          type: 'critical',
          message,
          timestamp: new Date(),
          read: false
        }, ...prev]);
      } else {
        toast.success(`Diagnostics complete. Health: ${result.healthScore}%`);
      }
      return result;
    } catch (error) {
      toast.error('AI Service communication error');
      throw error;
    }
  }, [settings.aiThreshold]);

  const clearNotifications = useCallback(() => setNotifications([]), []);
  const markNotificationAsRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const updateSettings = useCallback((newSettings: Partial<AppState['settings']>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  return (
    <AppContext.Provider
      value={{
        assets,
        workOrders,
        inventory,
        technicians,
        settings,
        isAuthenticated,
        user,
        isLoading,
        addAsset,
        deleteAsset,
        createWorkOrder,
        updateWorkOrderStatus: async (id, status) => { /* simplified for logic */ },
        assignWorkOrder,
        completeWorkOrder,
        addInventoryItem,
        restockItem,
        deleteInventoryItem,
        addTechnician,
        deleteTechnician,
        updateSettings,
        login,
        logout,
        runDiagnostics,
        notifications,
        clearNotifications,
        markNotificationAsRead,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
