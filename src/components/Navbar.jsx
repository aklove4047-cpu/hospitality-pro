import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Building2,
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  ChevronDown,
  ShieldCheck,
  UtensilsCrossed,
  BedDouble,
  SlidersHorizontal,
  ExternalLink
} from 'lucide-react';

export const Navbar = () => {
  const {
    data,
    currentTenant,
    currentTenantId,
    currentRole,
    soundEnabled,
    setSoundEnabled,
    switchTenant,
    switchRole,
    resetToDefaults,
    setActiveTab
  } = useApp();

  const [tenantDropdownOpen, setTenantDropdownOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const roles = [
    { id: 'superadmin', label: 'Super Admin (Reseller)', badge: 'Reseller', color: 'from-amber-500 to-orange-600', icon: '👑' },
    { id: 'owner', label: 'Business Owner', badge: 'All Modules', color: 'from-purple-500 to-indigo-600', icon: '💼' },
    { id: 'manager', label: 'General Manager', badge: 'Operations', color: 'from-blue-500 to-cyan-600', icon: '📋' },
    { id: 'cashier', label: 'Cashier / POS', badge: 'Billing Only', color: 'from-emerald-500 to-teal-600', icon: '💳' },
    { id: 'kitchen', label: 'Kitchen Master', badge: 'KOT Display', color: 'from-rose-500 to-red-600', icon: '🍳' },
    { id: 'reception', label: 'Front Desk / Reception', badge: 'Rooms Only', color: 'from-sky-500 to-blue-600', icon: '🛎️' },
    { id: 'qr_customer', label: 'Customer Table QR', badge: 'Self Order', color: 'from-violet-500 to-fuchsia-600', icon: '📱' }
  ];

  const currentRoleObj = roles.find(r => r.id === currentRole) || roles[1];

  const getPlanBadge = (plan) => {
    switch (plan) {
      case 'both':
        return <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1"><BedDouble className="w-3 h-3" /><UtensilsCrossed className="w-3 h-3" /> Hotel + Restaurant</span>;
      case 'restaurant':
        return <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1"><UtensilsCrossed className="w-3 h-3" /> Only Restaurant</span>;
      case 'hotel':
        return <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center gap-1"><BedDouble className="w-3 h-3" /> Only Hotel</span>;
      default:
        return null;
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      {/* Reseller Banner / Client Switcher Strip */}
      <div className="px-4 py-2 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border-b border-white/5 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-slate-300 font-medium">Reseller Cloud Engine:</span>
          <span className="text-emerald-400 font-semibold">{data.reseller.name}</span>
          <span className="hidden md:inline text-slate-600">|</span>
          <span className="hidden md:inline">Client Plan: <strong className="text-white capitalize">{currentTenant.plan}</strong></span>
          <span className="hidden md:inline text-slate-600">|</span>
          <span className="hidden md:inline">Valid Till: <strong className="text-slate-300">{currentTenant.validUntil}</strong></span>
        </div>

        <div className="flex items-center gap-3">
          {/* Quick role switcher dropdown */}
          <div className="relative">
            <button
              onClick={() => { setRoleDropdownOpen(!roleDropdownOpen); setTenantDropdownOpen(false); }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-slate-700/80 text-white font-medium border border-white/10 transition-all text-xs"
            >
              <span>{currentRoleObj.icon}</span>
              <span className="hidden sm:inline font-semibold">{currentRoleObj.label}</span>
              <span className="sm:hidden font-semibold">{currentRoleObj.badge}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {roleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 glass-dropdown rounded-xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
                  Switch Active Role Persona
                </div>
                {roles.map(r => (
                  <button
                    key={r.id}
                    onClick={() => {
                      switchRole(r.id);
                      setRoleDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-left transition-all ${
                      currentRole === r.id
                        ? 'bg-gradient-to-r from-brand-600/30 to-brand-500/20 text-brand-300 border border-brand-500/30 font-semibold'
                        : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">{r.icon}</span>
                      <div>
                        <div className="text-xs leading-none">{r.label}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{r.badge}</div>
                      </div>
                    </div>
                    {currentRole === r.id && (
                      <span className="h-1.5 w-1.5 rounded-full bg-brand-400"></span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            title={soundEnabled ? "Mute audio cues" : "Enable audio cues"}
            className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          {/* Demo reset */}
          <button
            onClick={() => {
              if (window.confirm("Reset all data to default demo state?")) {
                resetToDefaults();
              }
            }}
            title="Reset to fresh demo data"
            className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-amber-400 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden lg:inline">Reset Demo</span>
          </button>
        </div>
      </div>

      {/* Main Navbar Bar */}
      <div className="px-4 py-2.5 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-400 via-teal-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 ring-1 ring-white/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                HospitalityPro
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold tracking-widest bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                PRO 2.0
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Multi-tenant Hotel & Restaurant Operating System
            </p>
          </div>
        </div>

        {/* Tenant selector dropdown */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => { setTenantDropdownOpen(!tenantDropdownOpen); setRoleDropdownOpen(false); }}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700/80 hover:border-slate-600 text-left transition-all shadow-sm"
            >
              <span className="text-xl">{currentTenant.logo}</span>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span className="max-w-[130px] sm:max-w-[200px] truncate">{currentTenant.name}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  {getPlanBadge(currentTenant.plan)}
                </div>
              </div>
            </button>

            {tenantDropdownOpen && (
              <div className="absolute right-0 mt-2 w-80 glass-dropdown rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 border border-slate-700/70">
                <div className="px-3 py-2 border-b border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Select Client Tenant
                  </span>
                  <button
                    onClick={() => {
                      switchRole('superadmin');
                      setActiveTab('reseller');
                      setTenantDropdownOpen(false);
                    }}
                    className="text-xs text-brand-400 hover:text-brand-300 font-medium flex items-center gap-1"
                  >
                    + Add New Client
                  </button>
                </div>
                <div className="py-1 max-h-72 overflow-y-auto space-y-1">
                  {data.tenants.map(t => (
                    <button
                      key={t.id}
                      onClick={() => {
                        switchTenant(t.id);
                        setTenantDropdownOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-all ${
                        currentTenantId === t.id
                          ? 'bg-slate-800/90 border border-brand-500/40 text-white'
                          : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                      }`}
                    >
                      <span className="text-2xl">{t.logo}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold truncate text-white">{t.name}</div>
                        <div className="flex items-center gap-2 mt-1">
                          {getPlanBadge(t.plan)}
                          <span className={`text-[10px] font-medium px-1.5 rounded ${t.status === 'active' ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'}`}>
                            {t.status}
                          </span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

