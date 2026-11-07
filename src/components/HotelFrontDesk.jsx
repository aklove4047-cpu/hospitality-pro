import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  BedDouble,
  UserCheck,
  CalendarCheck,
  Plus,
  X,
  CreditCard,
  Receipt,
  AlertCircle,
  Clock,
  Printer,
  Sparkles,
  Phone,
  Mail,
  ShieldAlert
} from 'lucide-react';

export const HotelFrontDesk = () => {
  const {
    currentTenant,
    tenantRooms,
    tenantBookings,
    tenantBills,
    tenantOrders,
    checkInGuest,
    checkOutGuest,
    updateRoomStatus,
    showToast
  } = useApp();

  const [activeTabSub, setActiveTabSub] = useState('rack'); // 'rack' | 'bookings'
  const [checkInModalOpen, setCheckInModalOpen] = useState(false);
  const [selectedRoomForCheckIn, setSelectedRoomForCheckIn] = useState(null);
  const [selectedBookingForFolio, setSelectedBookingForFolio] = useState(null);

  // Check-in form state
  const [formRoomId, setFormRoomId] = useState('');
  const [formGuestName, setFormGuestName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formIdProof, setFormIdProof] = useState('');
  const [formCheckInDate, setFormCheckInDate] = useState(new Date().toISOString().split('T')[0]);
  const [formCheckOutDate, setFormCheckOutDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  });
  const [formAdults, setFormAdults] = useState(2);
  const [formChildren, setFormChildren] = useState(0);
  const [formAdvance, setFormAdvance] = useState(2000);

  const openCheckInForRoom = (room) => {
    if (room.status === 'occupied') {
      const activeBooking = tenantBookings.find(b => b.roomId === room.id && b.status === 'checked_in');
      if (activeBooking) {
        setSelectedBookingForFolio(activeBooking);
      }
      return;
    }
    setSelectedRoomForCheckIn(room);
    setFormRoomId(room.id);
    setCheckInModalOpen(true);
  };

  const handleCheckInSubmit = (e) => {
    e.preventDefault();
    if (!formGuestName || !formPhone || !formRoomId) {
      showToast("Please fill all required guest details", "error");
      return;
    }

    const success = checkInGuest({
      roomId: formRoomId,
      guestName: formGuestName,
      phone: formPhone,
      email: formEmail,
      idProof: formIdProof,
      checkInDate: formCheckInDate,
      checkOutDate: formCheckOutDate,
      adults: formAdults,
      children: formChildren,
      advancePaid: formAdvance
    });

    if (success) {
      setCheckInModalOpen(false);
      setFormGuestName('');
      setFormPhone('');
      setFormIdProof('');
    }
  };

  // Folio calculations for selected guest
  const getFolioDetails = (booking) => {
    if (!booking) return null;
    const room = tenantRooms.find(r => r.id === booking.roomId);
    const roomRate = booking.nightlyRate || (room ? room.rate : 3000);
    const nights = booking.totalNights || 1;
    const roomCharges = roomRate * nights;
    const roomGstRate = currentTenant.roomGst || 12;
    const roomGst = parseFloat(((roomCharges * roomGstRate) / 100).toFixed(2));

    // Linked room service restaurant bills
    const linkedBills = tenantBills.filter(b => b.bookingId === booking.id);
    const restaurantCharges = linkedBills.reduce((s, b) => s + (b.grandTotal || 0), 0);

    const grossTotal = roomCharges + roomGst + restaurantCharges;
    const advance = booking.advancePaid || 0;
    const netBalanceDue = Math.max(0, grossTotal - advance);

    // Check for pending active unbilled restaurant orders
    const pendingOrders = tenantOrders.filter(o => 
      o.status === 'active' && o.tableNumber === `Room ${booking.roomNumber}`
    );

    return {
      room,
      roomRate,
      nights,
      roomCharges,
      roomGstRate,
      roomGst,
      linkedBills,
      restaurantCharges,
      grossTotal,
      advance,
      netBalanceDue,
      pendingOrders
    };
  };

  const folio = selectedBookingForFolio ? getFolioDetails(selectedBookingForFolio) : null;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="glass-card rounded-2xl p-4 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
            <BedDouble className="w-5 h-5 text-indigo-400" />
            Hotel Front Desk & Room Rack
          </h2>
          <p className="text-xs text-slate-400">Guest check-in, room statuses and consolidated folio checkout</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold">
            <button
              onClick={() => setActiveTabSub('rack')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTabSub === 'rack' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              🏢 Room Rack
            </button>
            <button
              onClick={() => setActiveTabSub('bookings')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTabSub === 'bookings' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              📋 All Bookings ({tenantBookings.length})
            </button>
          </div>

          <button
            onClick={() => {
              setSelectedRoomForCheckIn(null);
              setCheckInModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Fast Check-in</span>
          </button>
        </div>
      </div>

      {/* Main Room Rack Matrix */}
      {activeTabSub === 'rack' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5">
          {tenantRooms.map(room => {
            const isOccupied = room.status === 'occupied';
            const isCleaning = room.status === 'cleaning';
            const isMaintenance = room.status === 'maintenance';
            const activeBooking = tenantBookings.find(b => b.roomId === room.id && b.status === 'checked_in');

            return (
              <div
                key={room.id}
                className={`glass-card rounded-3xl p-5 border transition-all flex flex-col justify-between ${
                  isOccupied ? 'border-indigo-500/50 bg-gradient-to-br from-indigo-950/30 to-slate-900/90' :
                  isCleaning ? 'border-amber-500/50 bg-gradient-to-br from-amber-950/20 to-slate-900/90' :
                  isMaintenance ? 'border-rose-500/50 bg-gradient-to-br from-rose-950/20 to-slate-900/90' :
                  'border-emerald-500/40 bg-gradient-to-br from-emerald-950/20 to-slate-900/90 hover:border-emerald-500/60'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-mono text-3xl font-black text-white">Room {room.number}</span>
                      <p className="text-xs font-semibold text-slate-300 mt-0.5">{room.type}</p>
                      <span className="text-[10px] text-slate-400">{room.floor}</span>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${
                      isOccupied ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40' :
                      isCleaning ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' :
                      isMaintenance ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' :
                      'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    }`}>
                      {room.status}
                    </span>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Tariff Rate:</span>
                      <span className="font-mono font-bold text-white">₹{room.rate} / night</span>
                    </div>

                    {isOccupied && activeBooking ? (
                      <div className="p-3 rounded-2xl bg-slate-950/80 border border-indigo-500/30 space-y-1.5">
                        <div className="font-bold text-indigo-300 flex items-center justify-between">
                          <span>{activeBooking.guestName}</span>
                          <span className="text-[10px] font-mono text-slate-400">{activeBooking.bookingNo}</span>
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1">
                          <Phone className="w-3 h-3 text-slate-500" /> {activeBooking.phone}
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
                          <span>Stay: {activeBooking.checkInDate} &rarr; {activeBooking.checkOutDate}</span>
                          <span className="font-mono text-emerald-400 font-bold">{activeBooking.totalNights}N</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {room.amenities.map((am, i) => (
                          <span key={i} className="text-[9px] bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-slate-400">
                            {am}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Action Strip */}
                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center gap-2">
                  {isOccupied ? (
                    <button
                      onClick={() => setSelectedBookingForFolio(activeBooking)}
                      className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-600/20"
                    >
                      <Receipt className="w-3.5 h-3.5" /> View Folio & Checkout
                    </button>
                  ) : isCleaning ? (
                    <button
                      onClick={() => updateRoomStatus(room.id, 'available')}
                      className="w-full py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center justify-center gap-1.5"
                    >
                      <span>Mark Cleaned & Ready &rarr;</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => openCheckInForRoom(room)}
                      className="w-full py-2 rounded-xl bg-emerald-600/30 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/40 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                    >
                      <UserCheck className="w-3.5 h-3.5" /> Check-in Guest
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Bookings History View */
        <div className="glass-card rounded-3xl p-5 border border-slate-800 overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-3">Booking #</th>
                <th className="py-3 px-3">Guest Name</th>
                <th className="py-3 px-3">Room</th>
                <th className="py-3 px-3">Dates</th>
                <th className="py-3 px-3">Rate</th>
                <th className="py-3 px-3">Advance</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {tenantBookings.map(b => (
                <tr key={b.id} className="hover:bg-slate-900/50 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-indigo-400">{b.bookingNo}</td>
                  <td className="py-3 px-3 font-semibold text-white">
                    <div>{b.guestName}</div>
                    <div className="text-[10px] text-slate-400">{b.phone}</div>
                  </td>
                  <td className="py-3 px-3 font-mono font-bold">Room {b.roomNumber}</td>
                  <td className="py-3 px-3 font-mono text-[11px]">
                    {b.checkInDate} to {b.checkOutDate} ({b.totalNights}N)
                  </td>
                  <td className="py-3 px-3 font-mono">₹{b.nightlyRate}/N</td>
                  <td className="py-3 px-3 font-mono text-emerald-400">₹{b.advancePaid}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      b.status === 'checked_in' ? 'bg-indigo-500/20 text-indigo-300' :
                      b.status === 'checked_out' ? 'bg-slate-800 text-slate-400' :
                      'bg-emerald-500/20 text-emerald-300'
                    }`}>
                      {b.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => setSelectedBookingForFolio(b)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs"
                    >
                      Folio
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Guest Fast Check-in Modal */}
      {checkInModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="glass-dropdown rounded-3xl p-6 border border-slate-700 w-full max-w-lg space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-indigo-400" />
                Guest Registration & Check-in
              </h3>
              <button onClick={() => setCheckInModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCheckInSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Select Room *</label>
                <select
                  value={formRoomId}
                  onChange={(e) => setFormRoomId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-bold"
                  required
                >
                  <option value="">-- Choose Available Room --</option>
                  {tenantRooms.filter(r => r.status === 'available' || r.id === formRoomId).map(r => (
                    <option key={r.id} value={r.id}>
                      Room {r.number} — {r.type} (₹{r.rate}/night)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Guest Full Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Rahul Sharma"
                    value={formGuestName}
                    onChange={(e) => setFormGuestName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-semibold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Email ID</label>
                  <input
                    type="email"
                    placeholder="guest@example.com"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">ID Proof (Aadhaar / Passport)</label>
                  <input
                    type="text"
                    placeholder="e.g. Aadhaar 1234 5678"
                    value={formIdProof}
                    onChange={(e) => setFormIdProof(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Check-in Date *</label>
                  <input
                    type="date"
                    value={formCheckInDate}
                    onChange={(e) => setFormCheckInDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Check-out Date *</label>
                  <input
                    type="date"
                    value={formCheckOutDate}
                    onChange={(e) => setFormCheckOutDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Adults</label>
                  <input
                    type="number"
                    min="1"
                    max="6"
                    value={formAdults}
                    onChange={(e) => setFormAdults(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Children</label>
                  <input
                    type="number"
                    min="0"
                    max="4"
                    value={formChildren}
                    onChange={(e) => setFormChildren(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Advance Paid (₹)</label>
                  <input
                    type="number"
                    value={formAdvance}
                    onChange={(e) => setFormAdvance(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-emerald-400 font-mono font-bold"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setCheckInModalOpen(false)}
                  className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold shadow-lg shadow-indigo-600/30"
                >
                  Confirm & Check In
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Guest Folio & Consolidated Checkout Modal */}
      {selectedBookingForFolio && folio && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="glass-dropdown rounded-3xl p-6 border border-slate-700 w-full max-w-lg space-y-4 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-indigo-400" />
                  Guest Folio & Consolidated Checkout
                </h3>
                <span className="text-xs text-slate-400">
                  {selectedBookingForFolio.bookingNo} — Room {selectedBookingForFolio.roomNumber}
                </span>
              </div>
              <button onClick={() => setSelectedBookingForFolio(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Warning if unbilled restaurant orders exist */}
            {folio.pendingOrders.length > 0 && (
              <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/40 text-xs text-rose-300 space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-rose-400">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  Checkout Blocked by System Policy
                </div>
                <p>
                  This room has <strong>{folio.pendingOrders.length} active unbilled food orders</strong> in the restaurant! Settle them in the POS terminal first before checking out.
                </p>
              </div>
            )}

            {/* Folio Breakdown */}
            <div id="print-area" className="p-5 bg-white text-slate-900 rounded-2xl space-y-4 font-mono text-xs shadow-xl">
              <div className="text-center border-b border-slate-300 pb-2">
                <h2 className="font-extrabold text-sm text-slate-950">{currentTenant.name}</h2>
                <p className="text-[10px] text-slate-600">{currentTenant.address}</p>
                <p className="text-[10px] text-slate-600">GSTIN: {currentTenant.gstin}</p>
                <div className="text-xs font-bold mt-1 uppercase tracking-wider text-indigo-900">
                  CONSOLIDATED GUEST TAX FOLIO
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] pb-2 border-b border-dashed border-slate-400">
                <div>Guest: <strong>{selectedBookingForFolio.guestName}</strong></div>
                <div>Room: <strong>{selectedBookingForFolio.roomNumber}</strong></div>
                <div>Check-in: {selectedBookingForFolio.checkInDate}</div>
                <div>Check-out: {selectedBookingForFolio.checkOutDate}</div>
                <div>Phone: {selectedBookingForFolio.phone}</div>
                <div>Duration: {folio.nights} Night(s)</div>
              </div>

              {/* Room Tariff */}
              <div className="space-y-1.5 text-[11px]">
                <div className="font-bold text-slate-950 uppercase">1. Accommodation Charges</div>
                <div className="flex justify-between pl-2">
                  <span>Room Tariff ({folio.nights}N × ₹{folio.roomRate}):</span>
                  <span className="font-bold">₹{folio.roomCharges}</span>
                </div>
                <div className="flex justify-between pl-2 text-slate-600">
                  <span>Room GST ({folio.roomGstRate}%):</span>
                  <span>₹{folio.roomGst}</span>
                </div>
              </div>

              {/* Restaurant Charges */}
              <div className="space-y-1.5 text-[11px] pt-1">
                <div className="font-bold text-slate-950 uppercase">2. Restaurant & Room Service Charges</div>
                {folio.linkedBills.length === 0 ? (
                  <div className="pl-2 text-slate-500 italic">No room service bills charged to room</div>
                ) : (
                  folio.linkedBills.map((b, i) => (
                    <div key={i} className="flex justify-between pl-2 text-slate-700">
                      <span>{b.billNo} ({b.date}):</span>
                      <span className="font-bold">₹{b.grandTotal}</span>
                    </div>
                  ))
                )}
              </div>

              {/* Summary Calculation */}
              <div className="pt-2 border-t-2 border-slate-900 space-y-1 text-right text-[11px]">
                <div className="flex justify-between">
                  <span>Gross Total Folio:</span>
                  <span className="font-bold">₹{folio.grossTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-emerald-700">
                  <span>Less: Advance Deposit Paid:</span>
                  <span>-₹{folio.advance.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-slate-950 border-t border-slate-400 pt-1">
                  <span>Net Payable at Checkout:</span>
                  <span>₹{folio.netBalanceDue.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => window.print()}
                className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5"
              >
                <Printer className="w-4 h-4" /> Print Folio
              </button>

              {selectedBookingForFolio.status === 'checked_in' && (
                <button
                  onClick={() => {
                    const success = checkOutGuest(selectedBookingForFolio.id);
                    if (success) setSelectedBookingForFolio(null);
                  }}
                  disabled={folio.pendingOrders.length > 0}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-40 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Settle Balance & Check Out Guest</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
