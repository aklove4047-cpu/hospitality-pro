import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Smartphone,
  Search,
  Plus,
  Minus,
  ShoppingBag,
  ChefHat,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const CustomerQRView = () => {
  const {
    currentTenant,
    tenantCategories,
    tenantMenuItems,
    tenantTables,
    tenantKots,
    activeTableForQr,
    setActiveTableForQr,
    placeOrder,
    showToast
  } = useApp();

  const activeTable = tenantTables.find(t => t.id === activeTableForQr) || tenantTables[0];
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [orderPlacedKot, setOrderPlacedKot] = useState(null);

  // Filter items
  const filteredItems = tenantMenuItems.filter(item => {
    const matchesCat = selectedCategory === 'all' || item.categoryId === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const addToCart = (dish) => {
    setCart(prev => {
      const exists = prev.find(i => i.id === dish.id);
      if (exists) {
        return prev.map(i => i.id === dish.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...dish, qty: 1 }];
    });
  };

  const updateQty = (id, delta) => {
    setCart(prev => prev.map(i => {
      if (i.id === id) {
        const n = i.qty + delta;
        return n > 0 ? { ...i, qty: n } : null;
      }
      return i;
    }).filter(Boolean));
  };

  const subtotal = cart.reduce((s, i) => s + (i.price * i.qty), 0);
  const gst = Math.round((subtotal * (currentTenant.foodGst || 5)) / 100);
  const grandTotal = subtotal + gst;

  // Submit order direct to kitchen
  const handlePlaceQrOrder = (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      showToast("Please select items first", "error");
      return;
    }

    const orderId = placeOrder({
      tableId: activeTable.id,
      items: cart,
      type: 'dine_in',
      customerName: customerName || 'Dine-in Guest',
      isQrOrder: true
    });

    setOrderPlacedKot({
      orderId,
      tableNumber: activeTable.number,
      items: cart,
      grandTotal,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    setCart([]);
  };

  // Find live tracking for this table's KOTs
  const liveTableKots = tenantKots.filter(k => k.tableNumber === activeTable?.number);

  return (
    <div className="max-w-md mx-auto space-y-4 animate-in fade-in duration-300">
      {/* Device Frame Top Info */}
      <div className="glass-card rounded-3xl p-4 border border-violet-500/40 bg-gradient-to-b from-violet-950/40 to-slate-900/90 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">{currentTenant.logo}</span>
            <div>
              <h2 className="text-sm font-extrabold text-white">{currentTenant.name}</h2>
              <div className="flex items-center gap-2 text-xs text-violet-300">
                <span className="font-bold">Dining at Table {activeTable?.number}</span>
                <span>•</span>
                <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/20 px-2 py-0.5 rounded-full">
                  Live Self-Order
                </span>
              </div>
            </div>
          </div>

          {/* Quick Table Switcher for testing */}
          <select
            value={activeTableForQr}
            onChange={(e) => {
              setActiveTableForQr(e.target.value);
              setOrderPlacedKot(null);
            }}
            className="px-2 py-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 text-[11px] font-bold"
            title="Switch Simulated Table"
          >
            {tenantTables.map(t => (
              <option key={t.id} value={t.id}>Test {t.number}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Live Order Tracker if an order was placed */}
      {liveTableKots.length > 0 && (
        <div className="glass-card rounded-3xl p-4 border border-emerald-500/40 bg-emerald-950/20 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
              <ChefHat className="w-4 h-4" /> Live Kitchen Cooking Tracker
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              Table {activeTable?.number}
            </span>
          </div>

          <div className="space-y-2">
            {liveTableKots[0].items.map((it, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-white font-medium">
                  <strong className="font-mono text-emerald-400">{it.qty}x</strong> {it.name}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  it.status === 'served' ? 'bg-emerald-500/20 text-emerald-300' :
                  it.status === 'ready' ? 'bg-blue-500/20 text-blue-300' :
                  it.status === 'preparing' ? 'bg-amber-500/20 text-amber-300 animate-pulse' :
                  'bg-slate-800 text-slate-300'
                }`}>
                  {it.status}
                </span>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-slate-400 text-center">
            Your chef will serve hot food straight to your table once ready!
          </p>
        </div>
      )}

      {/* Search & Category Pills */}
      <div className="glass-card rounded-2xl p-3 border border-slate-800 space-y-2.5">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search our delicious menu..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1 rounded-xl whitespace-nowrap font-semibold ${
              selectedCategory === 'all' ? 'bg-violet-600 text-white' : 'bg-slate-900 text-slate-400 border border-slate-800'
            }`}
          >
            All
          </button>
          {tenantCategories.map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1 rounded-xl whitespace-nowrap font-semibold flex items-center gap-1 ${
                selectedCategory === c.id ? 'bg-violet-600 text-white' : 'bg-slate-900 text-slate-400 border border-slate-800'
              }`}
            >
              <span>{c.icon}</span>
              <span>{c.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Menu Catalog */}
      <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
        {filteredItems.map(dish => {
          const inCart = cart.find(c => c.id === dish.id);

          return (
            <div key={dish.id} className="glass-card rounded-2xl p-3 border border-slate-800 flex items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className={`h-2 w-2 rounded-full ${dish.type === 'veg' ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                  <h4 className="font-bold text-xs text-white truncate">{dish.name}</h4>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-1">{dish.description}</p>
                <div className="font-mono font-extrabold text-emerald-400 text-xs mt-1">
                  ₹{dish.price}
                </div>
              </div>

              {inCart ? (
                <div className="flex items-center gap-1.5 bg-slate-900 rounded-lg p-0.5 border border-slate-700">
                  <button onClick={() => updateQty(dish.id, -1)} className="p-1 text-slate-300">
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-xs font-mono font-bold px-1 text-white">{inCart.qty}</span>
                  <button onClick={() => updateQty(dish.id, 1)} className="p-1 text-emerald-400">
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => addToCart(dish)}
                  className="px-3 py-1 rounded-xl bg-violet-600/30 hover:bg-violet-600 text-violet-200 hover:text-white border border-violet-500/40 text-xs font-bold transition-all"
                >
                  + Add
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Cart Summary & Order Placement */}
      {cart.length > 0 && (
        <form onSubmit={handlePlaceQrOrder} className="glass-card rounded-3xl p-4 border border-violet-500/40 bg-slate-900/90 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <ShoppingBag className="w-4 h-4 text-violet-400" />
              Your Table Order ({cart.reduce((s, i) => s + i.qty, 0)} items)
            </span>
            <span className="text-xs font-mono font-bold text-emerald-400">
              ₹{grandTotal} (inc. GST)
            </span>
          </div>

          <div className="space-y-1.5">
            <input
              type="text"
              placeholder="Your Name (optional)"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-violet-600/30 flex items-center justify-center gap-2 transition-all"
          >
            <ChefHat className="w-4 h-4" />
            <span>Place Order Directly to Kitchen</span>
          </button>
        </form>
      )}
    </div>
  );
};
