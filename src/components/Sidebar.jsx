import React from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  UtensilsCrossed,
  ChefHat,
  Grid,
  QrCode,
  BedDouble,
  CalendarCheck,
  PackageCheck,
  Receipt,
  Settings,
  ShieldCheck,
  Lock,
  Smartphone
} from 'lucide-react';

export const Sidebar = () => {
  const { currentTenant, currentRole, activeTab, setActiveTab } = useApp();

  const isSuperAdmin = currentRole === 'superadmin';
  const plan = currentTenant.plan; // 'restaurant' | 'hotel' | 'both'

  // Helper check for module permission
  const canAccessRestaurant = isSuperAdmin || plan === 'both' || plan === 'restaurant';
  const canAccessHotel = isSuperAdmin || plan === 'both' || plan === 'hotel';

  // Navigation Items
  const navSections = [
    {
      title: "Core",
      items: [
        { id: 'dashboard', label: 'Executive Hub', icon: LayoutDashboard, roles: ['superadmin', 'owner', 'manager'] }
      ]
    },
    {
      title: "Restaurant Operations",
      items: [
        { id: 'pos', label: 'Live POS Terminal', icon: UtensilsCrossed, roles: ['superadmin', 'owner', 'manager', 'cashier'], locked: !canAccessRestaurant },
        { id: 'kitchen', label: 'Kitchen KOT Display', icon: ChefHat, roles: ['superadmin', 'owner', 'manager', 'cashier', 'kitchen'], locked: !canAccessRestaurant },
        { id: 'tables', label: 'Tables & QR Codes', icon: Grid, roles: ['superadmin', 'owner', 'manager', 'cashier'], locked: !canAccessRestaurant },
        { id: 'qr_order', label: 'Customer QR Menu', icon: Smartphone, roles: ['superadmin', 'owner', 'manager', 'cashier', 'kitchen', 'reception', 'qr_customer'], locked: !canAccessRestaurant }
      ]
    },
    {
      title: "Hotel Front Desk",
      items: [
        { id: 'rooms', label: 'Room Rack & Check-in', icon: BedDouble, roles: ['superadmin', 'owner', 'manager', 'reception'], locked: !canAccessHotel },
        { id: 'bookings', label: 'Guest Folios & Stays', icon: CalendarCheck, roles: ['superadmin', 'owner', 'manager', 'reception'], locked: !canAccessHotel }
      ]
    },
    {
      title: "Back Office & Inventory",
      items: [
        { id: 'inventory', label: 'Stock & Recipes', icon: PackageCheck, roles: ['superadmin', 'owner', 'manager'] },
        { id: 'bills', label: 'Tax Bills & History', icon: Receipt, roles: ['superadmin', 'owner', 'manager', 'cashier', 'reception'] }
      ]
    },
    {
      title: "Administration",
      items: [
        { id: 'reseller', label: 'Reseller Portal', icon: ShieldCheck, roles: ['superadmin'] },
        { id: 'settings', label: 'Tenant Settings & GST', icon: Settings, roles: ['superadmin', 'owner'] }
      ]
    }
  ];

  return (
    <aside className="w-64 glass-panel border-r border-slate-800/80 min-h-[calc(100vh-65px)] flex flex-col justify-between py-4 px-3">
      <div className="space-y-6">
        {navSections.map((sec, idx) => {
          // Filter items by role
          const visibleItems = sec.items.filter(item => isSuperAdmin || item.roles.includes(currentRole));
          if (visibleItems.length === 0) return null;

          return (
            <div key={idx} className="space-y-1">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-1">
                {sec.title}
              </div>
              <div className="space-y-0.5">
                {visibleItems.map(item => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  const isLocked = item.locked;

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        if (!isLocked) {
                          setActiveTab(item.id);
                        }
                      }}
                      disabled={isLocked}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/25 ring-1 ring-white/20'
                          : isLocked
                          ? 'text-slate-600 cursor-not-allowed opacity-50 bg-slate-900/30'
                          : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-white' : isLocked ? 'text-slate-600' : 'text-slate-400'}`} />
                        <span>{item.label}</span>
                      </div>
                      {isLocked && (
                        <span title={`Not included in ${plan} plan`} className="flex items-center gap-1 text-[10px] text-amber-500/80 bg-amber-500/10 px-1.5 py-0.5 rounded">
                          <Lock className="w-3 h-3" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Plan Info Card at bottom */}
      <div className="p-3 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950/40 border border-slate-800/80">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-sm">{currentTenant.logo}</span>
          <div className="text-xs font-bold text-white truncate">{currentTenant.name}</div>
        </div>
        <div className="text-[11px] text-slate-400 mb-2">
          Plan: <span className="text-emerald-400 font-semibold uppercase">{currentTenant.plan}</span>
        </div>
        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 w-3/4 rounded-full"></div>
        </div>
        <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1.5">
          <span>Subscription Active</span>
          <span className="text-slate-300 font-medium">{currentTenant.validUntil}</span>
        </div>
      </div>
    </aside>
  );
};
