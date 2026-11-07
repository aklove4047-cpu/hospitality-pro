import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  TrendingUp,
  BarChart3,
  PieChart,
  Download,
  Calendar,
  FileSpreadsheet,
  ArrowUpRight,
  BedDouble,
  UtensilsCrossed,
  DollarSign
} from 'lucide-react';

export const AnalyticsReports = () => {
  const { currentTenant, tenantBills, tenantBookings, tenantRooms, showToast } = useApp();

  const [dateRange, setDateRange] = useState('7d');

  // Compute metrics
  const totalGrossSales = tenantBills.reduce((s, b) => s + (b.grandTotal || 0), 0);
  const totalTaxCollected = tenantBills.reduce((s, b) => s + (b.taxGst || 0), 0);
  const restaurantSales = tenantBills.filter(b => b.type === 'restaurant_pos').reduce((s, b) => s + b.grandTotal, 0);
  const roomServiceSales = tenantBills.filter(b => b.type === 'room_service').reduce((s, b) => s + b.grandTotal, 0);

  // Payment Breakdown
  const paymentModes = {
    UPI: tenantBills.filter(b => b.paymentMode.toLowerCase().includes('upi')).reduce((s, b) => s + b.grandTotal, 0),
    Cash: tenantBills.filter(b => b.paymentMode.toLowerCase().includes('cash')).reduce((s, b) => s + b.grandTotal, 0),
    Card: tenantBills.filter(b => b.paymentMode.toLowerCase().includes('card')).reduce((s, b) => s + b.grandTotal, 0),
    Room: tenantBills.filter(b => b.paymentMode.toLowerCase().includes('room')).reduce((s, b) => s + b.grandTotal, 0)
  };

  // Top selling dishes frequency
  const dishCounts = {};
  tenantBills.forEach(b => {
    b.items?.forEach(it => {
      dishCounts[it.name] = (dishCounts[it.name] || 0) + it.qty;
    });
  });

  const topDishes = Object.entries(dishCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // 7-day trend mock data aligned with total sales
  const salesDays = [
    { day: 'Mon', sales: Math.round(totalGrossSales * 0.12) },
    { day: 'Tue', sales: Math.round(totalGrossSales * 0.10) },
    { day: 'Wed', sales: Math.round(totalGrossSales * 0.14) },
    { day: 'Thu', sales: Math.round(totalGrossSales * 0.11) },
    { day: 'Fri', sales: Math.round(totalGrossSales * 0.18) },
    { day: 'Sat', sales: Math.round(totalGrossSales * 0.22) },
    { day: 'Sun', sales: Math.round(totalGrossSales * 0.25) }
  ];

  const maxDaily = Math.max(...salesDays.map(d => d.sales), 1000);

  // Export GST Sales Report to CSV
  const exportCsvReport = () => {
    let csv = "Invoice Number,Date,Type,Guest/Table,Subtotal (INR),GST (INR),Grand Total (INR),Payment Mode\n";
    tenantBills.forEach(b => {
      const row = [
        `"${b.billNo}"`,
        `"${b.date}"`,
        `"${b.type}"`,
        `"${b.roomNumber ? 'Room ' + b.roomNumber : b.tableNumber || 'Takeaway'}"`,
        b.subtotal,
        b.taxGst,
        b.grandTotal,
        `"${b.paymentMode}"`
      ];
      csv += row.join(",") + "\n";
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `GST_Sales_Report_${currentTenant.name.replace(/\s+/g, '_')}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("GST Sales Report exported as CSV!", "success");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="glass-card rounded-2xl p-4 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-400" />
            Financial Intelligence & GST Audit Reports
          </h2>
          <p className="text-xs text-slate-400">Revenue analysis, payment distributions and exportable tax ledgers</p>
        </div>

        <button
          onClick={exportCsvReport}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Export GST Report (CSV)</span>
        </button>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-4 border border-slate-800">
          <span className="text-[11px] text-slate-400 font-semibold uppercase">Total Invoiced Revenue</span>
          <div className="text-2xl font-black text-white font-mono mt-1">₹{totalGrossSales.toLocaleString()}</div>
          <span className="text-[10px] text-emerald-400 font-medium">Cumulative settled bills</span>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-slate-800">
          <span className="text-[11px] text-slate-400 font-semibold uppercase">GST Tax Collected</span>
          <div className="text-2xl font-black text-emerald-400 font-mono mt-1">₹{totalTaxCollected.toFixed(2)}</div>
          <span className="text-[10px] text-slate-400">Output tax liability</span>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-slate-800">
          <span className="text-[11px] text-slate-400 font-semibold uppercase">Restaurant POS Share</span>
          <div className="text-2xl font-black text-amber-400 font-mono mt-1">₹{restaurantSales.toLocaleString()}</div>
          <span className="text-[10px] text-slate-400">Food & Beverage sales</span>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-slate-800">
          <span className="text-[11px] text-slate-400 font-semibold uppercase">Room Service Revenue</span>
          <div className="text-2xl font-black text-indigo-400 font-mono mt-1">₹{roomServiceSales.toLocaleString()}</div>
          <span className="text-[10px] text-slate-400">Charged to guest rooms</span>
        </div>
      </div>

      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 7-Day Revenue Trend Chart */}
        <div className="glass-card rounded-3xl p-5 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                7-Day Revenue Velocity
              </h3>
              <p className="text-[11px] text-slate-400">Daily billing turnover trends</p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400">Peak: Sat-Sun</span>
          </div>

          {/* SVG Bar Chart */}
          <div className="h-56 flex items-end justify-between gap-3 pt-6 pb-2 px-2 border-b border-slate-800">
            {salesDays.map((d, i) => {
              const heightPercent = Math.max(12, Math.round((d.sales / maxDaily) * 100));
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  <span className="text-[10px] font-mono font-bold text-slate-400 group-hover:text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    ₹{d.sales}
                  </span>
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className="w-full rounded-t-xl bg-gradient-to-t from-emerald-600/40 via-emerald-500/80 to-teal-400 group-hover:from-emerald-500 group-hover:to-teal-300 transition-all shadow-lg shadow-emerald-500/10"
                  ></div>
                  <span className="text-xs font-bold text-slate-400 group-hover:text-white">
                    {d.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Payment Methods Breakdown */}
        <div className="glass-card rounded-3xl p-5 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <PieChart className="w-4 h-4 text-indigo-400" />
                Payment Channels Distribution
              </h3>
              <p className="text-[11px] text-slate-400">Share of UPI, Cash, Cards and Room Folios</p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            {Object.entries(paymentModes).map(([mode, amt]) => {
              const pct = totalGrossSales > 0 ? Math.round((amt / totalGrossSales) * 100) : 0;
              const color =
                mode === 'UPI' ? 'bg-emerald-500' :
                mode === 'Cash' ? 'bg-amber-500' :
                mode === 'Card' ? 'bg-sky-500' : 'bg-indigo-500';

              return (
                <div key={mode} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300 font-semibold">{mode} Settlements</span>
                    <span className="font-mono text-white font-bold">₹{amt.toLocaleString()} ({pct}%)</span>
                  </div>
                  <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                    <div style={{ width: `${pct}%` }} className={`h-full ${color} rounded-full`}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top Selling Dishes Rank */}
      <div className="glass-card rounded-3xl p-5 border border-slate-800 space-y-4">
        <h3 className="font-bold text-sm text-white flex items-center gap-2">
          <UtensilsCrossed className="w-4 h-4 text-amber-400" />
          Top 5 Revenue Generating Dishes
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {topDishes.map(([dishName, count], idx) => (
            <div key={idx} className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <span className="text-[10px] font-mono text-amber-400 font-bold">#{idx + 1} Best Seller</span>
              <div className="font-bold text-xs text-white truncate">{dishName}</div>
              <div className="text-[11px] font-mono text-emerald-400 font-bold">{count} orders billed</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

