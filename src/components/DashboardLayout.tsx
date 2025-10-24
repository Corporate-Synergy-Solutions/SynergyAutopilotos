import { useState, ReactNode } from 'react';
import { useAuth } from '../lib/auth';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { 
  LayoutDashboard, 
  Building2, 
  Briefcase, 
  Users, 
  Phone, 
  Calendar, 
  Package, 
  BookOpen,
  LogOut,
  Menu,
  X,
  Bot,
  Wrench,
  Settings as SettingsIcon,
  TrendingUp,
  DollarSign,
  AlertCircle,
  Activity
} from 'lucide-react';

interface DashboardLayoutProps {
  children: ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
}

const navItems = [
  // System Admin - Platform Dashboard
  { id: 'sysadmin-dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['system_admin'] },
  
  // Company Admin - Command Center
  { id: 'dashboard', label: 'Command Center', icon: LayoutDashboard, roles: ['company_admin', 'admin'] },
  
  // Technician - Tech Hub
  { id: 'tech-hub', label: 'Tech Hub', icon: Wrench, roles: ['technician', 'company_admin', 'admin'] },
  
  // AI Agents - Available to Company Admin (full access) and Technicians (usage only)
  { id: 'receptionist', label: 'AI Receptionist', icon: Phone, roles: ['company_admin', 'technician', 'admin'] },
  { id: 'foreman', label: 'AI Foreman', icon: Bot, roles: ['company_admin', 'technician', 'admin'] },
  
  // Technician Support
  { id: 'tech-support', label: 'Support Requests', icon: AlertCircle, roles: ['technician'] },
  
  // Core Management - Available to Company Admin
  { id: 'jobs', label: 'Jobs', icon: Briefcase, roles: ['company_admin', 'technician', 'admin'] },
  { id: 'customers', label: 'Customers', icon: Users, roles: ['company_admin', 'admin'] },
  { id: 'appointments', label: 'Appointments', icon: Calendar, roles: ['company_admin', 'technician', 'admin'] },
  { id: 'calls', label: 'Calls', icon: Phone, roles: ['company_admin', 'admin'] },
  { id: 'inventory', label: 'Inventory', icon: Package, roles: ['company_admin', 'technician', 'admin'] },
  { id: 'knowledge', label: 'Knowledge Base', icon: BookOpen, roles: ['company_admin', 'admin'] },
  
  // System Admin Only - Platform Management
  { id: 'companies', label: 'Companies', icon: Building2, roles: ['system_admin'] },
  { id: 'platform-analytics', label: 'Analytics', icon: TrendingUp, roles: ['system_admin'] },
  { id: 'platform-revenue', label: 'Revenue', icon: DollarSign, roles: ['system_admin'] },
  { id: 'support-tickets', label: 'Support Tickets', icon: AlertCircle, roles: ['system_admin'] },
  { id: 'platform-health', label: 'System Health', icon: Activity, roles: ['system_admin'] },
  
  // Settings - Available to all
  { id: 'settings', label: 'Settings', icon: SettingsIcon, roles: ['company_admin', 'technician', 'system_admin', 'admin'] },
];

export function DashboardLayout({ children, currentPage, onNavigate }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <h1 className="font-semibold">Autopilot OS</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-sm text-slate-600">{user?.name}</span>
              <Badge variant="secondary" className="text-xs">
                {user?.role === 'company_admin' ? 'Company Admin' : 
                 user?.role === 'technician' ? 'Technician' : 
                 user?.role === 'system_admin' ? 'System Admin' : 
                 user?.role}
              </Badge>
            </div>
            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut className="h-4 w-4 mr-2\" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`
            fixed lg:sticky top-[57px] left-0 z-30 h-[calc(100vh-57px)] w-64 bg-white border-r border-slate-200
            transform transition-transform lg:translate-x-0
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          `}
        >
          <ScrollArea className="h-full py-4">
            <nav className="space-y-1 px-2">
              {navItems
                .filter((item) => item.roles.includes(user?.role || ''))
                .map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPage === item.id;
                  return (
                    <Button
                      key={item.id}
                      variant={isActive ? 'secondary' : 'ghost'}
                      className="w-full justify-start"
                      onClick={() => {
                        onNavigate(item.id);
                        setSidebarOpen(false);
                      }}
                    >
                      <Icon className="h-4 w-4 mr-3" />
                      {item.label}
                    </Button>
                  );
                })}
            </nav>
          </ScrollArea>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/20 z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
