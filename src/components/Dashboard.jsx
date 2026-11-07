import React from 'react';
import { useApp } from '../context/AppContext';
import {
  TrendingUp,
  BedDouble,
  UtensilsCrossed,
  ChefHat,
  AlertTriangle,
  Receipt,
  Users,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ShieldAlert
} from 'lucide-react';

export const Dashboard = () => {
  const {
    currentTenant,
    tenantTables,
    tenantRooms,
    tenantBookings,
    tenantOrders,
    tenantKots,
    tenantBills,
    tenantInventory,
    setActiveTab,
    data
  } = useApp();

  const plan = currentTenant.plan;
  const hasRestaurant = plan === 'both' || plan === 'restaurant';
  const hasHotel = plan === 'both' || plan === 'hotel';

  // Compute metrics
  const totalSales = tenantBills.reduce((sum, b) => sum + (b.grandTotal || 0), 0);
  const occupiedTables = tenantTables.filter(t => t.status === 'occupied').length;
  const occupiedRooms = tenantRooms.filter(r => r.status === 'occupied').length;
  const occupancyRate = tenantRooms.length > 0 ? Math.round((occupiedRooms / tenantRooms.length) * 100) : 0;
  const activeKots = tenantKots.filter(k => k.status !== 'completed').length;
  const lowStockItems = tenantInventory.filter(i => i.currentStock <= i.minStock);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-indigo-950/70 border border-slate-800 p-6 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">{currentTenant.logo}</span>
              <h1 className="text-2xl font-extrabold text-white tracking-tight">{currentTenant.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                {currentTenant.plan} plan
              </span>
            </div>
            <p className="text-sm text-slate-400">
              Welcome back, {currentTenant.owner}. Here is your live business overview for today.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {hasRestaurant && (
              <button
                onClick={() => setActiveTab('pos')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs shadow-lg shadow-emerald-600/30 transition-all"
              >
                <UtensilsCrossed className="w-4 h-4" />
                <span>New POS Bill</span>
              </button>
            )}
            {hasHotel && (
              <button
                onClick={() => setActiveTab('rooms')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 transition-all"
              >
                <BedDouble className="w-4 h-4" />
                <span>Guest Check-in</span>
              </button>
            )}
            {hasRestaurant && (
              <button
                onClick={() => setActiveTab('kitchen')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-white font-semibold text-xs border border-white/10 transition-all"
              >
                <ChefHat className="w-4 h-4 text-rose-400" />
                <span>Live Kitchen ({activeKots})</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="glass-card rounded-2xl p-5 border border-slate-800 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Today's Sales</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white">
            ₹{totalSales.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-slate-400 mt-2 flex items-center gap-1.5">
            <span className="text-emerald-400 font-semibold flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" /> +14.2%
            </span>
            <span>vs yesterday ({tenantBills.length} bills)</span>
          </div>
        </div>

        {/* Restaurant Tables */}
        {hasRestaurant ? (
          <div className="glass-card rounded-2xl p-5 border border-slate-800 hover:border-slate-700 transition-all">
            <div className="flex items-center justify-between text-slate-400 mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider">Active Tables</span>
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                <UtensilsCrossed className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-white">
              {occupiedTables} <span className="text-sm font-normal text-slate-400">/ {tenantTables.length} Tables</span>
            </div>
            <div className="text-xs text-slate-400 mt-2 flex items-center gap-1.5">
              <span className="text-amber-400 font-semibold">
                {Math.round((occupiedTables / (tenantTables.length || 1)) * 100)}%
              </span>
              <span>table occupancy currently dining</span>
            </div>
          </div>
        ) : (
          <div className="glass-card rounded-2xl p-5 border border-slate-800/40 opacity-50">
            <div className="flex items-center justify-between text-slate-500 mb-3">
              <span className="text-xs font-semibold">Restaurant Module</span>
              <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded">Not in Plan</span>
            </div>
            <div className="text-sm text-slate-400">Upgrade to 'both' plan to activate dining & POS.</div>
          </div>
        )}

        {/* Hotel Occupancy */}
        {hasHotel ? (
          <div className="glass-card rounded-2xl p-5 border border-slate-800 hover:border-slate-700 transition-all">
            <div className="flex items-center justify-between text-slate-400 mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider">Room Occupancy</span>
              <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400">
                <BedDouble className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-white">
              {occupancyRate}% <span className="text-sm font-normal text-slate-400">({occupiedRooms}/{tenantRooms.length} Rooms)</span>
            </div>
            <div className="text-xs text-slate-400 mt-2 flex items-center gap-1.5">
              <span className="text-sky-400 font-semibold">{tenantBookings.filter(b => b.status === 'checked_in').length} Guests</span>
              <span>checked in currently</span>
            </div>
          </div>
        ) : (
          <div className="glass-card rounded-2xl p-5 border border-slate-800/40 opacity-50">
            <div className="flex items-center justify-between text-slate-500 mb-3">
              <span className="text-xs font-semibold">Hotel Module</span>
              <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded">Not in Plan</span>
            </div>
            <div className="text-sm text-slate-400">Upgrade to 'both' plan to activate rooms & bookings.</div>
          </div>
        )}

        {/* Low Stock Alerts */}
        <div className="glass-card rounded-2xl p-5 border border-slate-800 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Stock Alerts</span>
            <div className={`p-2 rounded-xl ${lowStockItems.length > 0 ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white">
            {lowStockItems.length} <span className="text-sm font-normal text-slate-400">items below min</span>
          </div>
          <div className="text-xs text-slate-400 mt-2 flex items-center gap-1.5">
            {lowStockItems.length > 0 ? (
              <span className="text-rose-400 font-semibold cursor-pointer" onClick={() => setActiveTab('inventory')}>
                Action required &rarr;
              </span>
            ) : (
              <span className="text-emerald-400 font-semibold">All ingredients optimal</span>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid: Orders & Rooms */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Live Orders / Kitchen Tickets */}
        {hasRestaurant && (
          <div className="lg:col-span-2 glass-card rounded-3xl p-5 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-white flex items-center gap-2">
                  <ChefHat className="w-5 h-5 text-emerald-400" />
                  Live Kitchen KOT Status
                </h3>
                <p className="text-xs text-slate-400">Real-time order tickets streaming to kitchen screen</p>
              </div>
              <button
                onClick={() => setActiveTab('kitchen')}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-medium"
              >
                Open Kitchen View &rarr;
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {tenantKots.slice(0, 4).map(kot => (
                <div key={kot.id} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-emerald-400">{kot.kotNo}</span>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                      Table: {kot.tableNumber}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center justify-between">
                    <span>{kot.source}</span>
                    <span className="flex items-center gap-1 text-slate-400 font-mono">
                      <Clock className="w-3 h-3 text-amber-400" /> {kot.createdAt}
                    </span>
                  </div>
                  <div className="border-t border-slate-800/80 pt-2 space-y-1">
                    {kot.items.map((it, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs">
                        <span className="text-slate-300">
                          <strong className="text-white font-mono">{it.qty}x</strong> {it.name}
                        </span>
                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                          it.status === 'served' ? 'bg-emerald-500/20 text-emerald-400' :
                          it.status === 'ready' ? 'bg-blue-500/20 text-blue-400' :
                          it.status === 'preparing' ? 'bg-amber-500/20 text-amber-400' :
                          'bg-slate-700 text-slate-300'
                        }`}>
                          {it.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Right Column: Hotel Front Desk Glance or Low Stock */}
        <div className={`space-y-6 ${!hasRestaurant ? 'lg:col-span-3' : ''}`}>
          {hasHotel && (
            <div className="glass-card rounded-3xl p-5 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base text-white flex items-center gap-2">
                    <BedDouble className="w-5 h-5 text-indigo-400" />
                    Room Status Rack
                  </h3>
                  <p className="text-xs text-slate-400">Live hotel floor occupancy glance</p>
                </div>
                <button
                  onClick={() => setActiveTab('rooms')}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
                >
                  Manage Rooms &rarr;
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {tenantRooms.map(room => (
                  <div
                    key={room.id}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      room.status === 'occupied' ? 'bg-indigo-950/40 border-indigo-500/40 text-indigo-200' :
                      room.status === 'available' ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-200' :
                      room.status === 'cleaning' ? 'bg-amber-950/30 border-amber-500/30 text-amber-200' :
                      'bg-rose-950/30 border-rose-500/30 text-rose-200'
                    }`}
                  >
                    <div className="text-base font-extrabold font-mono">Room {room.number}</div>
                    <div className="text-[10px] text-slate-400 truncate">{room.type}</div>
                    <div className="mt-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-black/40">
                        {room.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Low Stock List */}
          <div className="glass-card rounded-3xl p-5 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                Raw Ingredients Watchlist
              </h4>
              <button
                onClick={() => setActiveTab('inventory')}
                className="text-xs text-amber-400 hover:text-amber-300 font-medium"
              >
                Restock &rarr;
              </button>
            </div>

            <div className="space-y-2">
              {tenantInventory.slice(0, 4).map(inv => (
                <div key={inv.id} className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-900/60 border border-slate-800/80">
                  <div>
                    <div className="font-medium text-white">{inv.name}</div>
                    <div className="text-[10px] text-slate-400">Min: {inv.minStock} {inv.unit}</div>
                  </div>
                  <div className="text-right">
                    <div className={`font-mono font-bold ${inv.currentStock <= inv.minStock ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {inv.currentStock} {inv.unit}
                    </div>
                    <span className="text-[9px] text-slate-500">₹{inv.costPerUnit}/{inv.unit}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
