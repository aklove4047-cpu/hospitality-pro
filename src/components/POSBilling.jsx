import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import QRCode from 'qrcode';
import {
  Search,
  Plus,
  Minus,
  Trash2,
  ChefHat,
  Receipt,
  CreditCard,
  Banknote,
  QrCode as QrIcon,
  BedDouble,
  Check,
  Percent,
  X,
  Printer,
  Sparkles
} from 'lucide-react';

export const POSBilling = () => {
  const {
    currentTenant,
    tenantCategories,
    tenantMenuItems,
    tenantTables,
    tenantBookings,
    placeOrder,
    settleBill,
    showToast
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all' | 'veg' | 'non-veg'
  const [selectedTableId, setSelectedTableId] = useState(tenantTables[0]?.id || 'tbl_1');
  const [orderType, setOrderType] = useState('dine_in'); // 'dine_in' | 'takeaway'
  const [cart, setCart] = useState([]);
  const [discountPercent, setDiscountPercent] = useState(0);

  // Settlement modal state
  const [settleModalOpen, setSettleModalOpen] = useState(false);
  const [paymentMode, setPaymentMode] = useState('cash'); // 'cash' | 'upi' | 'card' | 'charged_to_room'
  const [selectedBookingId, setSelectedBookingId] = useState('');
  const [upiQrDataUrl, setUpiQrDataUrl] = useState('');
  const [cashTendered, setCashTendered] = useState('');
  const [lastGeneratedBill, setLastGeneratedBill] = useState(null);

  // Active in-house guests for "Charge to Room"
  const inHouseGuests = tenantBookings.filter(b => b.status === 'checked_in');

  // Filter menu items
  const filteredItems = tenantMenuItems.filter(item => {
    const matchesCat = selectedCategory === 'all' || item.categoryId === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || item.type === filterType;
    return matchesCat && matchesSearch && matchesType;
  });

  // Cart operations
  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...item, qty: 1, notes: '' }];
    });
  };

  const updateQty = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const nextQty = item.qty + delta;
        return nextQty > 0 ? { ...item, qty: nextQty } : null;
      }
      return item;
    }).filter(Boolean));
  };

  const updateItemNotes = (id, notes) => {
    setCart(prev => prev.map(item => item.id === id ? { ...item, notes } : item));
  };

  const clearCart = () => setCart([]);

  // Financial calculations
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const gstRate = currentTenant.foodGst || 5;
  const taxGst = parseFloat(((taxableAmount * gstRate) / 100).toFixed(2));
  const grandTotal = Math.round(taxableAmount + taxGst);

  // Generate UPI QR whenever modal opens and mode is UPI
  useEffect(() => {
    if (settleModalOpen && paymentMode === 'upi' && grandTotal > 0) {
      const upiUrl = `upi://pay?pa=hospitalitypro@upi&pn=${encodeURIComponent(currentTenant.name)}&am=${grandTotal}&cu=INR&tn=POS%20Bill`;
      QRCode.toDataURL(upiUrl, { margin: 1, width: 220 })
        .then(url => setUpiQrDataUrl(url))
        .catch(err => console.error(err));
    }
  }, [settleModalOpen, paymentMode, grandTotal, currentTenant.name]);

  // Action 1: Send to Kitchen (KOT)
  const handleSendToKitchen = () => {
    if (cart.length === 0) {
      showToast("Please add items to cart first", "error");
      return;
    }

    placeOrder({
      tableId: orderType === 'dine_in' ? selectedTableId : null,
      items: cart,
      type: orderType,
      isQrOrder: false
    });

    // Leave cart or clear? Clear cart after sending KOT
    clearCart();
  };

  // Action 2: Settle and finalize bill
  const handleFinalizeBill = () => {
    if (cart.length === 0) {
      showToast("Cart is empty", "error");
      return;
    }

    if (paymentMode === 'charged_to_room' && !selectedBookingId) {
      showToast("Please select the in-house guest room", "error");
      return;
    }

    const bill = settleBill({
      orderId: null,
      tableId: orderType === 'dine_in' ? selectedTableId : null,
      items: cart,
      subtotal,
      discount: discountAmount,
      taxGst,
      grandTotal,
      paymentMode,
      guestBookingId: paymentMode === 'charged_to_room' ? selectedBookingId : null
    });

    setLastGeneratedBill(bill);
    setSettleModalOpen(false);
    clearCart();
  };

  const selectedTable = tenantTables.find(t => t.id === selectedTableId);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-300">
      {/* Left 8 Cols: Menu Catalog & Categories */}
      <div className="lg:col-span-7 xl:col-span-8 space-y-4">
        {/* Table Selector & Search Header */}
        <div className="glass-card rounded-2xl p-4 border border-slate-800 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Dine-in vs Takeaway Toggle */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800">
              <button
                onClick={() => setOrderType('dine_in')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  orderType === 'dine_in' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                🍽️ Dine-In Table
              </button>
              <button
                onClick={() => setOrderType('takeaway')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  orderType === 'takeaway' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                🥡 Takeaway / Counter
              </button>
            </div>

            {/* Table Dropdown if dine-in */}
            {orderType === 'dine_in' && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-medium">Table:</span>
                <select
                  value={selectedTableId}
                  onChange={(e) => setSelectedTableId(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-bold focus:outline-none focus:border-brand-500"
                >
                  {tenantTables.map(tbl => (
                    <option key={tbl.id} value={tbl.id}>
                      {tbl.number} ({tbl.section}) — {tbl.status === 'occupied' ? '🔴 Busy' : '🟢 Free'}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Search & Veg/Non-Veg Filter */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search dishes by name or ingredients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-brand-500 transition-colors"
              />
            </div>

            <div className="flex items-center gap-1.5 w-full sm:w-auto">
              <button
                onClick={() => setFilterType('all')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border ${filterType === 'all' ? 'bg-slate-700 text-white border-slate-600' : 'bg-slate-900 text-slate-400 border-slate-800'}`}
              >
                All
              </button>
              <button
                onClick={() => setFilterType('veg')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1 ${filterType === 'veg' ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/50' : 'bg-slate-900 text-slate-400 border-slate-800'}`}
              >
                <span className="h-2 w-2 rounded-full bg-emerald-500"></span> Veg
              </button>
              <button
                onClick={() => setFilterType('non-veg')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1 ${filterType === 'non-veg' ? 'bg-rose-950/80 text-rose-400 border-rose-500/50' : 'bg-slate-900 text-slate-400 border-slate-800'}`}
              >
                <span className="h-2 w-2 rounded-full bg-rose-500"></span> Non-Veg
              </button>
            </div>
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === 'all'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              All Items
            </button>
            {tenantCategories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  selectedCategory === cat.id
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow'
                    : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3.5 max-h-[600px] overflow-y-auto pr-1">
          {filteredItems.map(dish => {
            const inCart = cart.find(c => c.id === dish.id);
            return (
              <div
                key={dish.id}
                className="glass-card rounded-2xl p-3.5 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className={`h-2.5 w-2.5 rounded-full ring-2 ring-white/10 ${dish.type === 'veg' ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                      <h4 className="font-bold text-xs text-white group-hover:text-brand-300 transition-colors">
                        {dish.name}
                      </h4>
                    </div>
                    {dish.isPopular && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                        Popular
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    {dish.description}
                  </p>
                </div>

                <div className="mt-3.5 pt-2.5 border-t border-slate-800 flex items-center justify-between">
                  <div className="text-sm font-extrabold font-mono text-emerald-400">
                    ₹{dish.price}
                  </div>

                  {inCart ? (
                    <div className="flex items-center gap-2 bg-slate-900 rounded-lg p-0.5 border border-slate-700">
                      <button
                        onClick={() => updateQty(dish.id, -1)}
                        className="p-1 rounded hover:bg-slate-800 text-slate-300"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold font-mono px-1 text-white">{inCart.qty}</span>
                      <button
                        onClick={() => updateQty(dish.id, 1)}
                        className="p-1 rounded hover:bg-slate-800 text-emerald-400"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => addToCart(dish)}
                      className="flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30 text-xs font-semibold transition-all"
                    >
                      <Plus className="w-3 h-3" /> Add
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right 4-5 Cols: Current Order Cart & Settlement */}
      <div className="lg:col-span-5 xl:col-span-4 space-y-4">
        <div className="glass-card rounded-3xl p-5 border border-slate-800 flex flex-col h-full min-h-[580px] justify-between">
          <div>
            {/* Cart Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-emerald-400" />
                  Active POS Order
                </h3>
                <span className="text-xs text-slate-400">
                  {orderType === 'dine_in' ? `Table: ${selectedTable?.number || 'T-01'}` : 'Counter / Takeaway'}
                </span>
              </div>
              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" /> Clear
                </button>
              )}
            </div>

            {/* Cart Items List */}
            <div className="py-3 space-y-2.5 max-h-[280px] overflow-y-auto">
              {cart.length === 0 ? (
                <div className="py-12 text-center text-slate-500 space-y-2">
                  <div className="text-3xl">🛒</div>
                  <p className="text-xs">No items added to current order.</p>
                  <p className="text-[11px] text-slate-600">Tap items on the left to add.</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800/80 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-white flex-1 truncate pr-2">{item.name}</span>
                      <span className="font-mono font-bold text-emerald-400">₹{item.price * item.qty}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 bg-slate-800 rounded-lg p-0.5 border border-slate-700">
                        <button
                          onClick={() => updateQty(item.id, -1)}
                          className="p-0.5 rounded hover:bg-slate-700 text-slate-300"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-mono font-bold px-1.5 text-white">{item.qty}</span>
                        <button
                          onClick={() => updateQty(item.id, 1)}
                          className="p-0.5 rounded hover:bg-slate-700 text-emerald-400"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <input
                        type="text"
                        placeholder="Add chef notes (e.g. less salt)..."
                        value={item.notes || ''}
                        onChange={(e) => updateItemNotes(item.id, e.target.value)}
                        className="text-[10px] px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300 w-36 focus:outline-none focus:border-brand-500"
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Financial Totals */}
          <div className="border-t border-slate-800 pt-3 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Subtotal</span>
              <span className="font-mono text-white">₹{subtotal.toFixed(2)}</span>
            </div>

            {/* Discount selector */}
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Percent className="w-3 h-3 text-amber-400" /> Discount
              </span>
              <div className="flex items-center gap-1">
                {[0, 5, 10, 15].map(disc => (
                  <button
                    key={disc}
                    onClick={() => setDiscountPercent(disc)}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-semibold border ${
                      discountPercent === disc ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    {disc}%
                  </button>
                ))}
                {discountAmount > 0 && (
                  <span className="font-mono text-amber-400 ml-1">-₹{discountAmount}</span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>GST ({gstRate}%)</span>
              <span className="font-mono text-white">₹{taxGst.toFixed(2)}</span>
            </div>

            <div className="flex items-center justify-between text-base font-extrabold text-white pt-2 border-t border-slate-800">
              <span>Grand Total</span>
              <span className="font-mono text-emerald-400">₹{grandTotal.toFixed(2)}</span>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={handleSendToKitchen}
                disabled={cart.length === 0}
                className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-amber-300 font-bold text-xs border border-amber-500/30 transition-all shadow"
              >
                <ChefHat className="w-4 h-4 text-amber-400" />
                <span>Send KOT</span>
              </button>

              <button
                onClick={() => setSettleModalOpen(true)}
                disabled={cart.length === 0}
                className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-40 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all"
              >
                <Receipt className="w-4 h-4" />
                <span>Settle & Bill</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Settle Bill Modal */}
      {settleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-dropdown rounded-3xl p-6 border border-slate-700 w-full max-w-lg space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-emerald-400" /> Settle POS Bill
                </h3>
                <p className="text-xs text-slate-400">Total Payable: <strong className="text-emerald-400 font-mono text-sm">₹{grandTotal}</strong></p>
              </div>
              <button
                onClick={() => setSettleModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Payment Method Tabs */}
            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={() => setPaymentMode('cash')}
                className={`p-2.5 rounded-xl text-center border text-xs font-bold transition-all ${
                  paymentMode === 'cash' ? 'bg-emerald-600/30 border-emerald-500 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                <Banknote className="w-4 h-4 mx-auto mb-1" />
                <span>Cash</span>
              </button>

              <button
                onClick={() => setPaymentMode('upi')}
                className={`p-2.5 rounded-xl text-center border text-xs font-bold transition-all ${
                  paymentMode === 'upi' ? 'bg-emerald-600/30 border-emerald-500 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                <QrIcon className="w-4 h-4 mx-auto mb-1" />
                <span>UPI QR</span>
              </button>

              <button
                onClick={() => setPaymentMode('card')}
                className={`p-2.5 rounded-xl text-center border text-xs font-bold transition-all ${
                  paymentMode === 'card' ? 'bg-emerald-600/30 border-emerald-500 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                <CreditCard className="w-4 h-4 mx-auto mb-1" />
                <span>Card</span>
              </button>

              <button
                onClick={() => setPaymentMode('charged_to_room')}
                disabled={currentTenant.plan !== 'both'}
                className={`p-2.5 rounded-xl text-center border text-xs font-bold transition-all ${
                  paymentMode === 'charged_to_room'
                    ? 'bg-indigo-600/30 border-indigo-500 text-indigo-300'
                    : currentTenant.plan === 'both' ? 'bg-slate-900 border-slate-800 text-slate-400' : 'opacity-40 cursor-not-allowed bg-slate-950 border-slate-900 text-slate-600'
                }`}
              >
                <BedDouble className="w-4 h-4 mx-auto mb-1" />
                <span>To Room</span>
              </button>
            </div>

            {/* Payment Details Body */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              {paymentMode === 'cash' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Cash Tendered by Guest:</span>
                    <input
                      type="number"
                      placeholder="e.g. 1000"
                      value={cashTendered}
                      onChange={(e) => setCashTendered(e.target.value)}
                      className="w-32 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono text-sm text-right focus:outline-none focus:border-brand-500"
                    />
                  </div>
                  {cashTendered && parseFloat(cashTendered) >= grandTotal && (
                    <div className="flex items-center justify-between text-xs font-bold text-emerald-400 bg-emerald-500/10 p-2 rounded-lg">
                      <span>Change to Return:</span>
                      <span className="font-mono text-sm">₹{(parseFloat(cashTendered) - grandTotal).toFixed(2)}</span>
                    </div>
                  )}
                </div>
              )}

              {paymentMode === 'upi' && (
                <div className="text-center space-y-2">
                  <p className="text-xs text-slate-300">Scan UPI QR to pay ₹{grandTotal}</p>
                  {upiQrDataUrl && (
                    <div className="inline-block p-2 bg-white rounded-xl shadow-lg">
                      <img src={upiQrDataUrl} alt="UPI QR" className="w-40 h-40 mx-auto" />
                    </div>
                  )}
                  <p className="text-[10px] text-slate-400">Supports GPay, PhonePe, Paytm, BHIM</p>
                </div>
              )}

              {paymentMode === 'card' && (
                <div className="space-y-2 text-xs text-slate-300">
                  <p>Swipe or tap customer card on EDC terminal.</p>
                  <input
                    type="text"
                    placeholder="Terminal Auth / RRN Code (optional)"
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs"
                  />
                </div>
              )}

              {paymentMode === 'charged_to_room' && (
                <div className="space-y-3">
                  <div className="text-xs text-slate-300">
                    Select Checked-in Guest Room:
                  </div>
                  {inHouseGuests.length === 0 ? (
                    <div className="text-xs text-amber-400 bg-amber-500/10 p-3 rounded-xl border border-amber-500/30">
                      No guests currently checked in! Check-in a guest at Front Desk first.
                    </div>
                  ) : (
                    <select
                      value={selectedBookingId}
                      onChange={(e) => setSelectedBookingId(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:border-brand-500"
                    >
                      <option value="">-- Choose In-House Room --</option>
                      {inHouseGuests.map(b => (
                        <option key={b.id} value={b.id}>
                          Room {b.roomNumber} — {b.guestName} ({b.phone})
                        </option>
                      ))}
                    </select>
                  )}
                  <p className="text-[11px] text-slate-400">
                    Charges will be posted to the room folio and settled during room checkout.
                  </p>
                </div>
              )}
            </div>

            {/* Recipe deduction note */}
            <div className="flex items-center gap-2 text-[11px] text-emerald-400 bg-emerald-500/10 px-3 py-2 rounded-xl border border-emerald-500/20">
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>Smart Recipe Engine: Raw stock will be deducted automatically on billing.</span>
            </div>

            {/* Confirm Settle */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSettleModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleFinalizeBill}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>Confirm & Print Bill</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Generated Bill Print Preview Modal */}
      {lastGeneratedBill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="glass-dropdown rounded-3xl p-6 border border-slate-700 w-full max-w-md space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="text-xs font-bold text-emerald-400">Bill Settled Successfully</div>
              <button onClick={() => setLastGeneratedBill(null)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Printable Thermal Receipt Container */}
            <div id="print-area" className="p-4 bg-white text-slate-900 rounded-xl font-mono text-xs space-y-3 shadow-inner">
              <div className="text-center border-b border-dashed border-slate-400 pb-2">
                <h2 className="font-extrabold text-sm">{currentTenant.name}</h2>
                <p className="text-[10px] text-slate-600">{currentTenant.address}</p>
                <p className="text-[10px] text-slate-600">GSTIN: {currentTenant.gstin}</p>
                <p className="text-[10px] text-slate-600">Ph: {currentTenant.phone}</p>
              </div>

              <div className="flex justify-between text-[11px]">
                <span>Bill: <strong>{lastGeneratedBill.billNo}</strong></span>
                <span>{lastGeneratedBill.date}</span>
              </div>
              <div className="text-[11px]">
                Table/Source: <strong>{lastGeneratedBill.tableNumber}</strong>
              </div>

              <table className="w-full text-left text-[11px] border-t border-b border-dashed border-slate-400 py-1 my-1">
                <thead>
                  <tr className="border-b border-slate-300">
                    <th className="py-1">Item</th>
                    <th className="text-center">Qty</th>
                    <th className="text-right">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {lastGeneratedBill.items.map((it, i) => (
                    <tr key={i}>
                      <td className="py-0.5">{it.name}</td>
                      <td className="text-center">{it.qty}</td>
                      <td className="text-right">₹{it.price * it.qty}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="space-y-1 text-right text-[11px]">
                <div>Subtotal: ₹{lastGeneratedBill.subtotal}</div>
                {lastGeneratedBill.discount > 0 && <div>Discount: -₹{lastGeneratedBill.discount}</div>}
                <div>GST ({currentTenant.foodGst}%): ₹{lastGeneratedBill.taxGst}</div>
                <div className="text-sm font-extrabold border-t border-slate-400 pt-1">
                  Grand Total: ₹{lastGeneratedBill.grandTotal}
                </div>
                <div className="text-[10px] text-slate-600 uppercase">
                  Paid Via: {lastGeneratedBill.paymentMode}
                </div>
              </div>

              <div className="text-center text-[10px] text-slate-500 border-t border-dashed border-slate-400 pt-2">
                *** Thank You! Visit Again ***
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" /> Print Thermal Receipt
              </button>
              <button
                onClick={() => setLastGeneratedBill(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

