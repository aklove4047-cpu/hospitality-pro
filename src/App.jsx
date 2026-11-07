import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { POSBilling } from './components/POSBilling';
import { KitchenScreen } from './components/KitchenScreen';
import { TableManagement } from './components/TableManagement';
import { CustomerQRView } from './components/CustomerQRView';
import { HotelFrontDesk } from './components/HotelFrontDesk';
import { InventoryManager } from './components/InventoryManager';
import { BillsHistory } from './components/BillsHistory';
import { ResellerAdmin } from './components/ResellerAdmin';
import { TenantSettings } from './components/TenantSettings';
import { AnalyticsReports } from './components/AnalyticsReports';
import { StaffManagement } from './components/StaffManagement';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';

const MainLayout = () => {
  const { activeTab, toast, currentRole } = useApp();

  const isCustomerQrOnly = currentRole === 'qr_customer';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-brand-500 selection:text-white">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 animate-in slide-in-from-bottom-3 duration-300">
          <div className={`px-4 py-3 rounded-2xl shadow-2xl border flex items-center gap-2.5 text-xs font-bold ${
            toast.type === 'error' ? 'bg-rose-950/90 border-rose-500 text-rose-200' :
            toast.type === 'info' ? 'bg-indigo-950/90 border-indigo-500 text-indigo-200' :
            'bg-slate-900/95 border-emerald-500/50 text-emerald-300'
          }`}>
            {toast.type === 'error' ? <AlertCircle className="w-4 h-4 text-rose-400" /> :
             toast.type === 'info' ? <Info className="w-4 h-4 text-indigo-400" /> :
             <CheckCircle className="w-4 h-4 text-emerald-400" />}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar />

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        {!isCustomerQrOnly && <Sidebar />}

        {/* Dynamic Center Stage */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'analytics' && <AnalyticsReports />}
          {activeTab === 'pos' && <POSBilling />}
          {activeTab === 'kitchen' && <KitchenScreen />}
          {activeTab === 'tables' && <TableManagement />}
          {activeTab === 'qr_order' && <CustomerQRView />}
          {activeTab === 'rooms' && <HotelFrontDesk />}
          {activeTab === 'bookings' && <HotelFrontDesk />}
          {activeTab === 'inventory' && <InventoryManager />}
          {activeTab === 'bills' && <BillsHistory />}
          {activeTab === 'staff' && <StaffManagement />}
          {activeTab === 'reseller' && <ResellerAdmin />}
          {activeTab === 'settings' && <TenantSettings />}
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
