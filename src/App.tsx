import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './lib/auth';
import { LoginForm } from './components/LoginForm';
import { DashboardLayout } from './components/DashboardLayout';
import { Dashboard } from './components/Dashboard';
import { TechnicianDashboard } from './components/TechnicianDashboard';
import { ReceptionistPage } from './components/ReceptionistPage';
import { ReceptionistSettings } from './components/ReceptionistSettings';
import { ForemanPage } from './components/ForemanPage';
import { ForemanSettings } from './components/ForemanSettings';
import { CompaniesPage } from './components/CompaniesPage';
import { JobsPage } from './components/JobsPage';
import { CustomersPage } from './components/CustomersPage';
import { CallsPage } from './components/CallsPage';
import { AppointmentsPage } from './components/AppointmentsPage';
import { InventoryPage } from './components/InventoryPage';
import { KnowledgeBasePage } from './components/KnowledgeBasePage';
import { SettingsPage } from './components/SettingsPage';
import { SystemAdminDashboard } from './components/SystemAdminDashboard';
import { PlatformAnalyticsPage } from './components/PlatformAnalyticsPage';
import { PlatformRevenuePage } from './components/PlatformRevenuePage';
import { SupportTicketsPage } from './components/SupportTicketsPage';
import { PlatformHealthPage } from './components/PlatformHealthPage';
import { TechnicianSupportPage } from './components/TechnicianSupportPage';
import { Toaster } from './components/ui/sonner';

function AppContent() {
  const { user, isLoading } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');

  // Update current page when user changes
  useEffect(() => {
    if (user) {
      if (user.role === 'technician') {
        setCurrentPage('tech-hub');
      } else if (user.role === 'system_admin') {
        setCurrentPage('sysadmin-dashboard');
      } else {
        setCurrentPage('dashboard');
      }
    }
  }, [user?.role]);

  // Expose navigation function globally for child components
  (window as any).navigateToPage = setCurrentPage;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentPage} />;
      case 'sysadmin-dashboard':
        return <SystemAdminDashboard onNavigate={setCurrentPage} />;
      case 'tech-hub':
        return <TechnicianDashboard />;
      case 'receptionist':
        return <ReceptionistPage />;
      case 'receptionist-settings':
        return <ReceptionistSettings />;
      case 'foreman':
        return <ForemanPage />;
      case 'foreman-settings':
        return <ForemanSettings />;
      case 'companies':
        return <CompaniesPage />;
      case 'platform-analytics':
        return <PlatformAnalyticsPage />;
      case 'platform-revenue':
        return <PlatformRevenuePage />;
      case 'support-tickets':
        return <SupportTicketsPage />;
      case 'platform-health':
        return <PlatformHealthPage />;
      case 'jobs':
        return <JobsPage />;
      case 'customers':
        return <CustomersPage />;
      case 'calls':
        return <CallsPage />;
      case 'appointments':
        return <AppointmentsPage />;
      case 'inventory':
        return <InventoryPage />;
      case 'knowledge':
        return <KnowledgeBasePage />;
      case 'tech-support':
        return <TechnicianSupportPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <Dashboard onNavigate={setCurrentPage} />;
    }
  };

  return (
    <DashboardLayout currentPage={currentPage} onNavigate={setCurrentPage}>
      {renderPage()}
    </DashboardLayout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
      <Toaster />
    </AuthProvider>
  );
}
