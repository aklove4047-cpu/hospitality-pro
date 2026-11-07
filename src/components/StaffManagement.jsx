import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Users,
  UserPlus,
  Trash2,
  Shield,
  Key,
  CheckCircle,
  X,
  ChefHat,
  Receipt,
  BedDouble,
  Briefcase
} from 'lucide-react';

export const StaffManagement = () => {
  const { data, currentTenant, showToast } = useApp();

  const [staffList, setStaffList] = useState([
    { id: 'st_1', name: 'Vikram Malhotra', role: 'owner', email: 'owner@grandimperial.com', phone: '+91 98765 43210', pin: '1234', status: 'active' },
    { id: 'st_2', name: 'Suresh Rao', role: 'manager', email: 'manager@grandimperial.com', phone: '+91 98222 11001', pin: '2024', status: 'active' },
    { id: 'st_3', name: 'Amit Verma', role: 'cashier', email: 'amit.cashier@grandimperial.com', phone: '+91 98111 22334', pin: '5566', status: 'active' },
    { id: 'st_4', name: 'Sanjeev Kapoor', role: 'kitchen', email: 'chef@grandimperial.com', phone: '+91 98333 44556', pin: '8899', status: 'active' },
    { id: 'st_5', name: 'Pooja Mehta', role: 'reception', email: 'reception@grandimperial.com', phone: '+91 98444 55667', pin: '4422', status: 'active' }
  ]);

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState('cashier');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('1234');

  const handleAddStaff = (e) => {
    e.preventDefault();
    if (!name || !email) {
      showToast("Please provide staff name and email", "error");
      return;
    }
    const newStaff = {
      id: `st_${Date.now()}`,
      name,
      role,
      email,
      phone,
      pin,
      status: 'active'
    };
    setStaffList([...staffList, newStaff]);
    setAddModalOpen(false);
    setName('');
    setEmail('');
    setPhone('');
    showToast(`Staff member ${name} onboarded!`, 'success');
  };

  const handleDeleteStaff = (id) => {
    if (window.confirm("Remove this staff member?")) {
      setStaffList(staffList.filter(s => s.id !== id));
      showToast("Staff removed", "info");
    }
  };

  const getRoleBadge = (r) => {
    switch (r) {
      case 'owner': return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-purple-500/20 text-purple-300 border border-purple-500/40">Owner</span>;
      case 'manager': return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-blue-500/20 text-blue-300 border border-blue-500/40">Manager</span>;
      case 'cashier': return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">Cashier POS</span>;
      case 'kitchen': return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-rose-500/20 text-rose-300 border border-rose-500/40">Kitchen KDS</span>;
      case 'reception': return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-sky-500/20 text-sky-300 border border-sky-500/40">Front Desk</span>;
      default: return null;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="glass-card rounded-2xl p-4 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-400" />
            Staff Roles & Access Permissions (FR-10)
          </h2>
          <p className="text-xs text-slate-400">Manage employee login PINs, role restrictions and department assignments</p>
        </div>

        <button
          onClick={() => setAddModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Employee</span>
        </button>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {staffList.map(member => (
          <div key={member.id} className="glass-card rounded-3xl p-5 border border-slate-800 space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-sm text-white">{member.name}</h3>
                  <p className="text-xs text-slate-400">{member.email}</p>
                </div>
                {getRoleBadge(member.role)}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 space-y-1.5 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Phone:</span>
                  <span className="font-mono">{member.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Quick PIN:</span>
                  <span className="font-mono text-emerald-400 font-bold">•••• ({member.pin})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Account Status:</span>
                  <span className="text-emerald-400 font-bold uppercase text-[10px]">● Active</span>
                </div>
              </div>
            </div>

            {member.role !== 'owner' && (
              <div className="pt-3 border-t border-slate-800 flex justify-end">
                <button
                  onClick={() => handleDeleteStaff(member.id)}
                  className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 font-semibold"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Remove Staff
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="glass-dropdown rounded-3xl p-6 border border-slate-700 w-full max-w-md space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-indigo-400" /> Onboard Staff Member
              </h3>
              <button onClick={() => setAddModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddStaff} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Employee Full Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Ramesh Kumar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Role / Department *</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-bold"
                >
                  <option value="manager">General Manager (Full Ops)</option>
                  <option value="cashier">Cashier (POS & Billing)</option>
                  <option value="kitchen">Master Chef (KDS Kitchen)</option>
                  <option value="reception">Front Desk Receptionist (Rooms)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Email ID *</label>
                  <input
                    type="email"
                    placeholder="staff@hotel.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+91 98765 00000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Quick Terminal Login PIN (4 Digits)</label>
                <input
                  type="text"
                  maxLength={4}
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-emerald-400 font-mono font-bold text-center tracking-widest text-sm"
                  required
                />
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-600/30"
                >
                  Save & Issue Login
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
