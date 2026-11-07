import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Settings,
  Building,
  Percent,
  Download,
  RotateCcw,
  Save,
  CheckCircle2,
  ShieldAlert
} from 'lucide-react';

export const TenantSettings = () => {
  const { currentTenant, updateSettings, data, resetToDefaults, showToast } = useApp();

  const [name, setName] = useState(currentTenant.name);
  const [owner, setOwner] = useState(currentTenant.owner);
  const [phone, setPhone] = useState(currentTenant.phone);
  const [email, setEmail] = useState(currentTenant.email);
  const [address, setAddress] = useState(currentTenant.address);
  const [gstin, setGstin] = useState(currentTenant.gstin);
  const [foodGst, setFoodGst] = useState(currentTenant.foodGst || 5);
  const [roomGst, setRoomGst] = useState(currentTenant.roomGst || 12);

  const handleSave = (e) => {
    e.preventDefault();
    updateSettings({
      name,
      owner,
      phone,
      email,
      address,
      gstin,
      foodGst: parseInt(foodGst, 10),
      roomGst: parseInt(roomGst, 10)
    });
  };

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `hospitality_pro_backup_${currentTenant.id}_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast("Database exported successfully as JSON!", "success");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
      <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
              <Settings className="w-5 h-5 text-emerald-400" />
              Tenant Business Profile & Tax Settings
            </h2>
            <p className="text-xs text-slate-400">
              Configure GSTIN, tax percentage rates and official business bill headers
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
            {currentTenant.plan} Plan
          </span>
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Business / Hotel Legal Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-bold"
                required
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Authorized Owner *</label>
              <input
                type="text"
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Contact Phone Number *</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                required
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Official Email Address *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-semibold">Official Registered Address (Printed on Receipts)</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
              required
            />
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
              <Percent className="w-4 h-4 text-emerald-400" /> GST Tax Rates
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">GSTIN Number</label>
                <input
                  type="text"
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value)}
                  placeholder="08AAAAA0000A1Z5"
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Food / Restaurant GST %</label>
                <input
                  type="number"
                  value={foodGst}
                  onChange={(e) => setFoodGst(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-emerald-400 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Hotel Room Tariff GST %</label>
                <input
                  type="number"
                  value={roomGst}
                  onChange={(e) => setRoomGst(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-indigo-400 font-mono font-bold"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile & GST Settings</span>
          </button>
        </form>

        {/* Data Tools */}
        <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <button
            onClick={handleExportJson}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold flex items-center gap-2 transition-all"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Export Data Backup (JSON)</span>
          </button>

          <button
            onClick={() => {
              if (window.confirm("Are you sure you want to reset all data back to factory defaults?")) {
                resetToDefaults();
              }
            }}
            className="px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 font-semibold flex items-center gap-1.5 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Factory Reset Database</span>
          </button>
        </div>
      </div>
    </div>
  );
};

