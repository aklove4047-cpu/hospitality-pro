import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import QRCode from 'qrcode';
import {
  Grid,
  Plus,
  QrCode as QrIcon,
  Printer,
  X,
  ExternalLink,
  Users,
  UtensilsCrossed,
  CheckCircle2
} from 'lucide-react';

export const TableManagement = () => {
  const {
    currentTenant,
    tenantTables,
    setActiveTableForQr,
    setActiveTab,
    showToast
  } = useApp();

  const [selectedTableForQr, setSelectedTableForQr] = useState(null);
  const [qrModalDataUrl, setQrModalDataUrl] = useState('');
  const [filterSection, setFilterSection] = useState('all');

  const sections = ['all', ...Array.from(new Set(tenantTables.map(t => t.section)))];

  const filteredTables = tenantTables.filter(t => {
    if (filterSection === 'all') return true;
    return t.section === filterSection;
  });

  // Generate QR image when table modal opened
  const handleOpenQrModal = (table) => {
    setSelectedTableForQr(table);
    const simulatedQrUrl = `${window.location.origin}?tenant=${currentTenant.id}&table=${table.id}&qrCode=${table.qrCode}`;
    QRCode.toDataURL(simulatedQrUrl, { margin: 2, width: 280, color: { dark: '#0b0f19', light: '#ffffff' } })
      .then(url => setQrModalDataUrl(url))
      .catch(err => console.error(err));
  };

  const handleTestCustomerQr = (table) => {
    setActiveTableForQr(table.id);
    setActiveTab('qr_order');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header bar */}
      <div className="glass-card rounded-2xl p-4 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
            <Grid className="w-5 h-5 text-emerald-400" />
            Dining Tables & Smart QR Management
          </h2>
          <p className="text-xs text-slate-400">Manage floor layout, occupancy and printable QR table tents</p>
        </div>

        {/* Section Filter */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs">
          {sections.map(sec => (
            <button
              key={sec}
              onClick={() => setFilterSection(sec)}
              className={`px-3 py-1.5 rounded-lg capitalize font-semibold transition-all ${
                filterSection === sec ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {sec}
            </button>
          ))}
        </div>
      </div>

      {/* Tables Floor Plan Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredTables.map(table => {
          const isOccupied = table.status === 'occupied';

          return (
            <div
              key={table.id}
              className={`glass-card rounded-3xl p-5 border transition-all flex flex-col justify-between ${
                isOccupied ? 'border-amber-500/40 bg-amber-950/20' : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-2xl font-black text-white">{table.number}</span>
                    <p className="text-xs text-slate-400 font-medium">{table.section}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${
                    isOccupied ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                  }`}>
                    {isOccupied ? '● Occupied' : '○ Vacant'}
                  </span>
                </div>

                <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span>Capacity: <strong className="text-white font-mono">{table.capacity} guests</strong></span>
                </div>
                <div className="mt-1 text-[11px] font-mono text-slate-400 truncate">
                  QR Token: {table.qrCode}
                </div>
              </div>

              {/* Table Quick Actions */}
              <div className="mt-5 pt-3 border-t border-slate-800 grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleOpenQrModal(table)}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 border border-white/10 transition-all"
                >
                  <QrIcon className="w-3.5 h-3.5 text-emerald-400" /> Print QR
                </button>

                <button
                  onClick={() => handleTestCustomerQr(table)}
                  className="px-2.5 py-1.5 rounded-xl bg-indigo-600/30 hover:bg-indigo-600 text-indigo-300 hover:text-white font-semibold text-xs flex items-center justify-center gap-1.5 border border-indigo-500/30 transition-all"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Test Menu
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Printable QR Table Tent Modal */}
      {selectedTableForQr && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="glass-dropdown rounded-3xl p-6 border border-slate-700 w-full max-w-sm space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <QrIcon className="w-4 h-4 text-emerald-400" /> Table QR Code Tent
              </h3>
              <button
                onClick={() => setSelectedTableForQr(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Printable QR Stand Card */}
            <div id="print-area" className="p-6 bg-white text-slate-950 rounded-2xl text-center space-y-3 shadow-2xl border-4 border-slate-900">
              <div className="text-2xl">{currentTenant.logo}</div>
              <h3 className="font-extrabold text-base tracking-tight">{currentTenant.name}</h3>
              <div className="inline-block px-3 py-1 rounded-full bg-slate-950 text-white font-mono font-black text-sm">
                TABLE {selectedTableForQr.number}
              </div>

              {qrModalDataUrl && (
                <div className="p-3 bg-white inline-block rounded-xl border-2 border-slate-200 shadow-sm">
                  <img src={qrModalDataUrl} alt="Table QR" className="w-48 h-48 mx-auto" />
                </div>
              )}

              <p className="text-xs font-bold text-slate-800">
                Scan with any Smartphone Camera to Browse Menu & Order Instantly!
              </p>
              <div className="text-[10px] text-slate-500 font-mono">
                No App Download Required • Direct to Kitchen
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" /> Print QR Stand
              </button>
              <button
                onClick={() => setSelectedTableForQr(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
