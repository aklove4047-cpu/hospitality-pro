import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  Building2,
  Plus,
  Edit3,
  Calendar,
  CheckCircle,
  XCircle,
  TrendingUp,
  DollarSign,
  Users,
  UtensilsCrossed,
  BedDouble,
  X,
  ExternalLink
} from 'lucide-react';

export const ResellerAdmin = () => {
  const {
    data,
    createTenant,
    toggleTenantStatus,
    updateTenantPlan,
    updateTenantValidity,
    switchTenant,
    showToast
  } = useApp();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState(null);

  // Form state
  const [name, setName] = useState('');
  const [plan, setPlan] = useState('both');
  const [owner, setOwner] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [gstin, setGstin] = useState('');
  const [validUntil, setValidUntil] = useState('2027-12-31');
  const [foodGst, setFoodGst] = useState(5);
  const [roomGst, setRoomGst] = useState(12);

  const handleCreateTenant = (e) => {
    e.preventDefault();
    if (!name || !owner || !email) {
      showToast("Please provide client name, owner and email", "error");
      return;
    }

    createTenant({
      name,
      plan,
      owner,
      email,
      phone,
      address,
      gstin,
      foodGst,
      roomGst,
      validUntil
    });

    setCreateModalOpen(false);
    setName('');
    setOwner('');
    setEmail('');
    setPhone('');
    setAddress('');
    setGstin('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Reseller Hero Stats */}
      <div className="glass-card rounded-3xl p-6 border border-amber-500/30 bg-gradient-to-r from-amber-950/30 via-slate-900 to-indigo-950/40 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-xl shadow-amber-500/20">
              <ShieldCheck className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-white">{data.reseller.name}</h1>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  Super Admin Reseller
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Single master dashboard managing all tenant licenses, plans and subscription validities
              </p>
            </div>
          </div>

          <button
            onClick={() => setCreateModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Onboard New Hotel / Restaurant Client</span>
          </button>
        </div>

        {/* Reseller KPI Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-800">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Client Tenants</span>
            <div className="text-xl font-black text-white font-mono mt-0.5">{data.tenants.length} Active Accounts</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Reseller MRR Revenue</span>
            <div className="text-xl font-black text-emerald-400 font-mono mt-0.5">{data.reseller.mrr} /mo</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Active Licenses</span>
            <div className="text-xl font-black text-indigo-400 font-mono mt-0.5">
              {data.tenants.filter(t => t.status === 'active').length} Licenses
            </div>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Multi-tenant Cloud</span>
            <div className="text-xl font-black text-amber-400 font-mono mt-0.5">Cloudflare Global</div>
          </div>
        </div>
      </div>

      {/* Tenants Table */}
      <div className="glass-card rounded-3xl p-5 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <Building2 className="w-4 h-4 text-amber-400" />
            Onboarded Client Tenants ({data.tenants.length})
          </h3>
          <span className="text-xs text-slate-400">Isolated database schemas per client</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-3">Client Business</th>
                <th className="py-3 px-3">Plan Matrix</th>
                <th className="py-3 px-3">Owner Contact</th>
                <th className="py-3 px-3">GSTIN</th>
                <th className="py-3 px-3">Subscription Validity</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Instant Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {data.tenants.map(t => (
                <tr key={t.id} className="hover:bg-slate-900/50 transition-colors">
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">{t.logo}</span>
                      <div>
                        <div className="font-extrabold text-white text-xs">{t.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">ID: {t.id}</div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-3">
                    <select
                      value={t.plan}
                      onChange={(e) => updateTenantPlan(t.id, e.target.value)}
                      className="px-2 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs font-bold text-emerald-400 capitalize"
                    >
                      <option value="both">Hotel + Restaurant</option>
                      <option value="restaurant">Only Restaurant</option>
                      <option value="hotel">Only Hotel</option>
                    </select>
                  </td>

                  <td className="py-3 px-3">
                    <div className="font-semibold text-white">{t.owner}</div>
                    <div className="text-[10px] text-slate-400">{t.email}</div>
                  </td>

                  <td className="py-3 px-3 font-mono text-[11px] text-slate-300">
                    {t.gstin || 'N/A'}
                  </td>

                  <td className="py-3 px-3">
                    <input
                      type="date"
                      value={t.validUntil}
                      onChange={(e) => updateTenantValidity(t.id, e.target.value)}
                      className="px-2 py-1 rounded-lg bg-slate-900 border border-slate-700 text-[11px] font-mono text-slate-200"
                    />
                  </td>

                  <td className="py-3 px-3">
                    <button
                      onClick={() => toggleTenantStatus(t.id)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border ${
                        t.status === 'active'
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-400 border-rose-500/40 hover:bg-rose-500/30'
                      }`}
                    >
                      {t.status === 'active' ? '● Active' : '✕ Suspended'}
                    </button>
                  </td>

                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => switchTenant(t.id)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-all inline-flex items-center gap-1.5"
                    >
                      <span>Log In As Client</span>
                      <ExternalLink className="w-3 h-3 text-brand-400" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Onboard Client Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="glass-dropdown rounded-3xl p-6 border border-slate-700 w-full max-w-lg space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-amber-400" /> Onboard New Client Tenant
              </h3>
              <button onClick={() => setCreateModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTenant} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Business / Hotel / Restaurant Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Royal Orchid Grand Suites"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-bold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Assigned Plan *</label>
                  <select
                    value={plan}
                    onChange={(e) => setPlan(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-bold"
                  >
                    <option value="both">Hotel + Restaurant (Full Suite)</option>
                    <option value="restaurant">Only Restaurant</option>
                    <option value="hotel">Only Hotel</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Subscription Valid Till *</label>
                  <input
                    type="date"
                    value={validUntil}
                    onChange={(e) => setValidUntil(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Owner Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Karan Kapoor"
                    value={owner}
                    onChange={(e) => setOwner(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Owner Email *</label>
                  <input
                    type="email"
                    placeholder="owner@hotel.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">GSTIN Number</label>
                  <input
                    type="text"
                    placeholder="08AAAAA0000A1Z5"
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Business Address</label>
                <input
                  type="text"
                  placeholder="Street, City, State"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-extrabold shadow-lg shadow-amber-500/30"
                >
                  Create & Issue License
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

