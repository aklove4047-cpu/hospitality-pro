import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  ChefHat,
  Clock,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  RefreshCw,
  Flame,
  Check,
  Bell
} from 'lucide-react';

export const KitchenScreen = () => {
  const { tenantKots, updateKotItemStatus, showToast } = useApp();
  const [filter, setFilter] = useState('active'); // 'active' | 'all' | 'qr'
  const [refreshCountdown, setRefreshCountdown] = useState(8);

  // 8-second auto refresh simulation as specified in PRD
  useEffect(() => {
    const timer = setInterval(() => {
      setRefreshCountdown(prev => {
        if (prev <= 1) return 8;
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const filteredKots = tenantKots.filter(kot => {
    if (filter === 'active') return kot.status !== 'completed';
    if (filter === 'qr') return kot.source.includes('QR');
    return true;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return 'bg-rose-500/20 text-rose-400 border-rose-500/40';
      case 'preparing': return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      case 'ready': return 'bg-blue-500/20 text-blue-400 border-blue-500/40';
      case 'served': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
      default: return 'bg-slate-800 text-slate-300';
    }
  };

  const advanceStatus = (kotId, itemIndex, currentStatus) => {
    let nextStatus = 'new';
    if (currentStatus === 'new') nextStatus = 'preparing';
    else if (currentStatus === 'preparing') nextStatus = 'ready';
    else if (currentStatus === 'ready') nextStatus = 'served';
    else nextStatus = 'served';

    updateKotItemStatus(kotId, itemIndex, nextStatus);
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Header Bar */}
      <div className="glass-card rounded-2xl p-4 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-rose-500 to-amber-600 shadow-lg shadow-rose-500/20">
            <ChefHat className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
              Kitchen Display System (KDS)
              <span className="px-2 py-0.5 rounded-full text-xs bg-rose-500/20 text-rose-400 border border-rose-500/40 font-mono animate-pulse-subtle">
                LIVE
              </span>
            </h2>
            <p className="text-xs text-slate-400">Order stream auto-syncing every 8s</p>
          </div>
        </div>

        {/* Filter Pills & Countdown */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            <button
              onClick={() => setFilter('active')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                filter === 'active' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              🔥 Active Tickets
            </button>
            <button
              onClick={() => setFilter('qr')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1 ${
                filter === 'qr' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" /> QR Orders Only
            </button>
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                filter === 'all' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              All
            </button>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400 font-mono">
            <RefreshCw className="w-3.5 h-3.5 text-emerald-400 animate-spin" style={{ animationDuration: '3s' }} />
            <span>{refreshCountdown}s</span>
          </div>
        </div>
      </div>

      {/* Tickets Grid */}
      {filteredKots.length === 0 ? (
        <div className="glass-card rounded-3xl p-16 text-center border border-slate-800 space-y-3">
          <div className="text-5xl">🍳</div>
          <h3 className="text-base font-bold text-white">Kitchen All Caught Up!</h3>
          <p className="text-xs text-slate-400">No active orders in the cooking queue right now.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredKots.map(kot => {
            const isCompleted = kot.status === 'completed';
            const isQr = kot.source.includes('QR');

            return (
              <div
                key={kot.id}
                className={`rounded-3xl border flex flex-col justify-between overflow-hidden shadow-xl transition-all ${
                  isCompleted ? 'bg-slate-900/50 border-slate-800 opacity-60' :
                  isQr ? 'glass-card border-violet-500/40 bg-gradient-to-b from-violet-950/20 to-slate-900/90' :
                  'glass-card border-slate-700 bg-slate-900/90'
                }`}
              >
                {/* Ticket Top Strip */}
                <div className={`p-4 border-b ${isQr ? 'border-violet-500/30 bg-violet-950/40' : 'border-slate-800 bg-slate-800/40'}`}>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm font-extrabold text-white tracking-wide">
                      {kot.kotNo}
                    </span>
                    <span className="px-2.5 py-1 rounded-xl text-xs font-black bg-white text-slate-950 font-mono shadow">
                      {kot.tableNumber}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs mt-2">
                    <span className={`flex items-center gap-1 font-semibold ${isQr ? 'text-violet-300' : 'text-slate-400'}`}>
                      {isQr ? <Smartphone className="w-3.5 h-3.5" /> : <ChefHat className="w-3.5 h-3.5" />}
                      {kot.source}
                    </span>
                    <span className="flex items-center gap-1 text-slate-400 font-mono text-[11px]">
                      <Clock className="w-3 h-3 text-amber-400" /> {kot.createdAt}
                    </span>
                  </div>
                </div>

                {/* Ticket Item Rows */}
                <div className="p-4 space-y-3 flex-1 overflow-y-auto max-h-[300px]">
                  {kot.items.map((it, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="text-xs">
                          <span className="font-extrabold font-mono text-white text-sm mr-1.5">
                            {it.qty}x
                          </span>
                          <span className="font-bold text-slate-100">{it.name}</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(it.status)}`}>
                          {it.status}
                        </span>
                      </div>

                      {it.notes && (
                        <div className="text-[10px] font-medium text-amber-400/90 italic bg-amber-500/10 px-2 py-0.5 rounded">
                          &ldquo;{it.notes}&rdquo;
                        </div>
                      )}

                      {/* Status advancement button */}
                      {it.status !== 'served' && (
                        <button
                          onClick={() => advanceStatus(kot.id, idx, it.status)}
                          className="w-full mt-1 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 flex items-center justify-center gap-1 transition-all"
                        >
                          {it.status === 'new' && <span>Start Cooking &rarr; 👨‍🍳</span>}
                          {it.status === 'preparing' && <span>Mark Ready &rarr; 🛎️</span>}
                          {it.status === 'ready' && <span>Mark Served &rarr; ✅</span>}
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Ticket Footer Status */}
                <div className="p-3 bg-slate-950/80 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span>Overall Status:</span>
                  <span className={`font-bold uppercase tracking-wider text-[11px] ${isCompleted ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {kot.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

