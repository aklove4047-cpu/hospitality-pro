import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Receipt,
  Search,
  Printer,
  Calendar,
  X,
  CreditCard,
  Banknote,
  QrCode
} from 'lucide-react';

export const BillsHistory = () => {
  const { currentTenant, tenantBills } = useApp();
  const [search, setSearch] = useState('');
  const [selectedBillForPrint, setSelectedBillForPrint] = useState(null);

  const filteredBills = tenantBills.filter(b => {
    const q = search.toLowerCase();
    return b.billNo.toLowerCase().includes(q) ||
           (b.tableNumber && b.tableNumber.toLowerCase().includes(q)) ||
           (b.guestName && b.guestName.toLowerCase().includes(q)) ||
           b.paymentMode.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="glass-card rounded-2xl p-4 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
            <Receipt className="w-5 h-5 text-emerald-400" />
            Tax Invoices & Billing Archives
          </h2>
          <p className="text-xs text-slate-400">All settled GST bills with complete audit trail</p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by invoice # or guest..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Bills Table */}
      <div className="glass-card rounded-3xl p-5 border border-slate-800 overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
            <tr>
              <th className="py-3 px-3">Invoice #</th>
              <th className="py-3 px-3">Date / Time</th>
              <th className="py-3 px-3">Type & Source</th>
              <th className="py-3 px-3">Guest / Table</th>
              <th className="py-3 px-3">Subtotal</th>
              <th className="py-3 px-3">GST Tax</th>
              <th className="py-3 px-3">Grand Total</th>
              <th className="py-3 px-3">Payment</th>
              <th className="py-3 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {filteredBills.map(bill => (
              <tr key={bill.id} className="hover:bg-slate-900/50 transition-colors">
                <td className="py-3 px-3 font-mono font-bold text-white">{bill.billNo}</td>
                <td className="py-3 px-3 font-mono text-[11px] text-slate-400">{bill.date}</td>
                <td className="py-3 px-3">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    bill.type === 'room_service' ? 'bg-indigo-500/20 text-indigo-300' : 'bg-emerald-500/20 text-emerald-300'
                  }`}>
                    {bill.type.replace('_', ' ')}
                  </span>
                </td>
                <td className="py-3 px-3">
                  <div className="font-semibold text-white">{bill.guestName || 'Walk-in'}</div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    {bill.roomNumber ? `Room ${bill.roomNumber}` : `Table ${bill.tableNumber}`}
                  </div>
                </td>
                <td className="py-3 px-3 font-mono">₹{bill.subtotal}</td>
                <td className="py-3 px-3 font-mono text-slate-400">₹{bill.taxGst}</td>
                <td className="py-3 px-3 font-mono font-bold text-emerald-400">₹{bill.grandTotal}</td>
                <td className="py-3 px-3 uppercase text-[10px] font-bold tracking-wider text-slate-300">
                  {bill.paymentMode.replace('_', ' ')}
                </td>
                <td className="py-3 px-3 text-right">
                  <button
                    onClick={() => setSelectedBillForPrint(bill)}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold inline-flex items-center gap-1"
                  >
                    <Printer className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Print</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bill Print Modal */}
      {selectedBillForPrint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="glass-dropdown rounded-3xl p-6 border border-slate-700 w-full max-w-md space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-white">Invoice Preview</span>
              <button onClick={() => setSelectedBillForPrint(null)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div id="print-area" className="p-4 bg-white text-slate-900 rounded-xl font-mono text-xs space-y-3 shadow-inner">
              <div className="text-center border-b border-dashed border-slate-400 pb-2">
                <h2 className="font-extrabold text-sm">{currentTenant.name}</h2>
                <p className="text-[10px] text-slate-600">{currentTenant.address}</p>
                <p className="text-[10px] text-slate-600">GSTIN: {currentTenant.gstin}</p>
                <p className="text-[10px] text-slate-600">Ph: {currentTenant.phone}</p>
              </div>

              <div className="flex justify-between text-[11px]">
                <span>Bill: <strong>{selectedBillForPrint.billNo}</strong></span>
                <span>{selectedBillForPrint.date}</span>
              </div>
              <div className="text-[11px]">
                {selectedBillForPrint.roomNumber ? `Room: ${selectedBillForPrint.roomNumber}` : `Table: ${selectedBillForPrint.tableNumber}`}
                {selectedBillForPrint.guestName && ` — ${selectedBillForPrint.guestName}`}
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
                  {selectedBillForPrint.items?.map((it, i) => (
                    <tr key={i}>
                      <td className="py-0.5">{it.name}</td>
                      <td className="text-center">{it.qty}</td>
                      <td className="text-right">₹{it.price * it.qty}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="space-y-1 text-right text-[11px]">
                <div>Subtotal: ₹{selectedBillForPrint.subtotal}</div>
                {selectedBillForPrint.discount > 0 && <div>Discount: -₹{selectedBillForPrint.discount}</div>}
                <div>GST Tax: ₹{selectedBillForPrint.taxGst}</div>
                <div className="text-sm font-extrabold border-t border-slate-400 pt-1">
                  Grand Total: ₹{selectedBillForPrint.grandTotal}
                </div>
                <div className="text-[10px] text-slate-600 uppercase">
                  Paid Via: {selectedBillForPrint.paymentMode}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" /> Print Thermal Invoice
              </button>
              <button
                onClick={() => setSelectedBillForPrint(null)}
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
