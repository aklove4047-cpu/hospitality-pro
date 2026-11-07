import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  BedDouble,
  UtensilsCrossed,
  Calendar,
  Clock,
  Phone,
  Mail,
  MapPin,
  Sparkles,
  Star,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Wifi,
  Coffee,
  Tv,
  Car,
  Wine,
  UserCheck,
  X,
  ArrowRight
} from 'lucide-react';

export const PublicWebsite = ({ onOpenAdmin }) => {
  const { currentTenant, tenantRooms, tenantMenuItems, tenantCategories, checkInGuest, showToast } = useApp();

  // Booking modal state
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [tableModalOpen, setTableModalOpen] = useState(false);

  // Room Booking Form
  const [guestName, setGuestName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [checkInDate, setCheckInDate] = useState(new Date().toISOString().split('T')[0]);
  const [checkOutDate, setCheckOutDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  });
  const [adults, setAdults] = useState(2);

  // Table Reservation Form
  const [tableName, setTableName] = useState('');
  const [tablePhone, setTablePhone] = useState('');
  const [tableDate, setTableDate] = useState(new Date().toISOString().split('T')[0]);
  const [tableTime, setTableTime] = useState('20:00');
  const [tableGuests, setTableGuests] = useState(2);

  const handleRoomBookSubmit = (e) => {
    e.preventDefault();
    if (!guestName || !phone || !selectedRoom) {
      showToast("Please fill all required booking details", "error");
      return;
    }

    const success = checkInGuest({
      roomId: selectedRoom.id,
      guestName,
      phone,
      email,
      idProof: "Online Web Booking",
      checkInDate,
      checkOutDate,
      adults,
      children: 0,
      advancePaid: selectedRoom.rate
    });

    if (success) {
      setBookingModalOpen(false);
      showToast(`🎉 Room booked successfully for ${guestName}! Synced to Hotel Admin.`, 'success');
      setGuestName('');
      setPhone('');
      setEmail('');
    }
  };

  const handleTableReserveSubmit = (e) => {
    e.preventDefault();
    setTableModalOpen(false);
    showToast(`Table reserved for ${tableName} on ${tableDate} at ${tableTime}! Admin notified.`, 'success');
    setTableName('');
    setTablePhone('');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-brand-500 selection:text-white">
      {/* Top Header / Navigation */}
      <nav className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{currentTenant.logo}</span>
          <div>
            <div className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              {currentTenant.name}
            </div>
            <div className="text-[11px] text-emerald-400 font-medium flex items-center gap-1.5">
              <Star className="w-3 h-3 fill-emerald-400" />
              <span>Luxury Hospitality & Fine Dining</span>
            </div>
          </div>
        </div>

        {/* Links & Admin Portal Switcher */}
        <div className="flex items-center gap-3 sm:gap-6">
          <a href="#rooms" className="text-xs font-semibold text-slate-300 hover:text-white hidden md:inline">
            Rooms & Suites
          </a>
          <a href="#dining" className="text-xs font-semibold text-slate-300 hover:text-white hidden md:inline">
            Restaurant & Bar
          </a>
          <a href="#amenities" className="text-xs font-semibold text-slate-300 hover:text-white hidden lg:inline">
            Amenities
          </a>
          <a href="#contact" className="text-xs font-semibold text-slate-300 hover:text-white hidden sm:inline">
            Contact
          </a>

          {/* Glowing Admin Panel Portal Button */}
          <button
            onClick={onOpenAdmin}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/30 ring-1 ring-white/20 transition-all hover:scale-105"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-200" />
            <span>Admin Portal</span>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-24 px-4 sm:px-8 text-center bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none"></div>

        <div className="max-w-4xl mx-auto space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Welcome to World-Class Hospitality
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight">
            Experience Unmatched Luxury & Artisan Cuisine
          </h1>

          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Welcome to {currentTenant.name}. Immerse yourself in exquisite designer suites, five-star guest service, and chef-curated culinary dining.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a
              href="#rooms"
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-xl shadow-emerald-600/30 flex items-center gap-2 transition-all"
            >
              <BedDouble className="w-4 h-4" />
              <span>Book Your Stay</span>
            </a>

            <button
              onClick={() => setTableModalOpen(true)}
              className="px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm border border-slate-700 flex items-center gap-2 transition-all"
            >
              <UtensilsCrossed className="w-4 h-4 text-amber-400" />
              <span>Reserve a Dining Table</span>
            </button>
          </div>
        </div>

        {/* Floating Fast Booking Engine Bar */}
        <div className="max-w-4xl mx-auto mt-12 p-4 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl grid grid-cols-1 sm:grid-cols-4 gap-3 text-left">
          <div className="p-2">
            <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Check-in Date</label>
            <input
              type="date"
              value={checkInDate}
              onChange={(e) => setCheckInDate(e.target.value)}
              className="w-full bg-transparent text-white font-mono text-xs font-bold focus:outline-none mt-1"
            />
          </div>

          <div className="p-2 sm:border-l border-slate-800">
            <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Check-out Date</label>
            <input
              type="date"
              value={checkOutDate}
              onChange={(e) => setCheckOutDate(e.target.value)}
              className="w-full bg-transparent text-white font-mono text-xs font-bold focus:outline-none mt-1"
            />
          </div>

          <div className="p-2 sm:border-l border-slate-800">
            <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Guests</label>
            <select
              value={adults}
              onChange={(e) => setAdults(e.target.value)}
              className="w-full bg-slate-900 text-white text-xs font-bold focus:outline-none mt-1"
            >
              <option value="1">1 Adult</option>
              <option value="2">2 Adults</option>
              <option value="3">3 Adults</option>
              <option value="4">4+ Family</option>
            </select>
          </div>

          <div className="flex items-center">
            <a
              href="#rooms"
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs text-center flex items-center justify-center gap-1.5 transition-all"
            >
              <span>Check Availability</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </section>

      {/* Luxury Rooms Showcase */}
      <section id="rooms" className="py-16 px-4 sm:px-8 max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Accommodations</span>
          <h2 className="text-3xl font-extrabold text-white">Handcrafted Rooms & Suites</h2>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Engineered for restorative sleep, luxury bath amenities and panoramic natural views.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tenantRooms.map(room => (
            <div
              key={room.id}
              className="rounded-3xl bg-slate-900/80 border border-slate-800 overflow-hidden hover:border-slate-700 transition-all flex flex-col justify-between group shadow-xl"
            >
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-mono font-bold text-emerald-400">Room #{room.number}</span>
                    <h3 className="text-xl font-bold text-white group-hover:text-emerald-300 transition-colors">
                      {room.type}
                    </h3>
                    <span className="text-xs text-slate-400">{room.floor}</span>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                    room.status === 'available' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}>
                    {room.status === 'available' ? 'Available Now' : 'Reserved'}
                  </span>
                </div>

                {/* Amenities pills */}
                <div className="flex flex-wrap gap-1.5">
                  {room.amenities.map((am, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
                      {am}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-6 pt-0 flex items-center justify-between border-t border-slate-800/80 mt-4">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase">Per Night</span>
                  <div className="text-xl font-extrabold font-mono text-white">₹{room.rate}</div>
                </div>

                <button
                  onClick={() => {
                    setSelectedRoom(room);
                    setBookingModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition-all"
                >
                  Book Room &rarr;
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Restaurant Dining Menu Showcase */}
      <section id="dining" className="py-16 px-4 sm:px-8 bg-slate-900/40 border-t border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">Culinary Excellence</span>
              <h2 className="text-3xl font-extrabold text-white">Artisan Restaurant & Bar</h2>
              <p className="text-xs text-slate-400 max-w-md mt-1">
                Authentic flavors crafted with fresh farm produce, exotic spices, and culinary mastery.
              </p>
            </div>

            <button
              onClick={() => setTableModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/20 self-start md:self-auto transition-all"
            >
              🍽️ Book Dining Table
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tenantMenuItems.slice(0, 6).map(dish => (
              <div key={dish.id} className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${dish.type === 'veg' ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                    <h4 className="font-bold text-sm text-white">{dish.name}</h4>
                  </div>
                  <span className="font-mono text-emerald-400 font-extrabold text-sm">₹{dish.price}</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">{dish.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Amenities Section */}
      <section id="amenities" className="py-16 px-4 sm:px-8 max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Resort Comforts</span>
          <h2 className="text-3xl font-extrabold text-white">World-Class Guest Facilities</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
          {[
            { icon: Wifi, title: "High-Speed Wi-Fi", desc: "Uninterrupted connectivity" },
            { icon: Coffee, title: "Artisan Breakfast", desc: "Fresh organic buffet" },
            { icon: Tv, title: "Smart Entertainment", desc: "OTT & Satellite channels" },
            { icon: Car, title: "Valet Parking", desc: "Complimentary on-site" },
            { icon: Wine, title: "Sky Bar & Lounge", desc: "Craft cocktails" },
            { icon: ShieldCheck, title: "24/7 Security", desc: "Keycard & CCTV safe" }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-2">
                <div className="p-3 rounded-xl bg-slate-800/80 inline-block text-emerald-400">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="font-bold text-xs text-white">{item.title}</div>
                <div className="text-[10px] text-slate-400">{item.desc}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer & Contact */}
      <footer id="contact" className="border-t border-slate-800 bg-slate-950 py-12 px-4 sm:px-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{currentTenant.logo}</span>
              <span className="font-black text-white text-base">{currentTenant.name}</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-400">
              Premier hotel rooms, banquet events and fine dining restaurant suites.
            </p>
          </div>

          <div className="space-y-2">
            <div className="font-bold text-white uppercase text-[11px]">Direct Contact</div>
            <div className="flex items-center gap-2 text-slate-300">
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>{currentTenant.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Mail className="w-3.5 h-3.5 text-emerald-400" />
              <span>{currentTenant.email}</span>
            </div>
            <div className="flex items-start gap-2 text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span>{currentTenant.address}</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="font-bold text-white uppercase text-[11px]">Tax & GST Compliance</div>
            <div>GSTIN: <strong className="font-mono text-slate-200">{currentTenant.gstin}</strong></div>
            <div>Food GST: <strong className="font-mono text-slate-200">{currentTenant.foodGst}%</strong></div>
            <div>Room GST: <strong className="font-mono text-slate-200">{currentTenant.roomGst}%</strong></div>
          </div>

          <div className="space-y-3">
            <div className="font-bold text-white uppercase text-[11px]">Staff & Management</div>
            <button
              onClick={onOpenAdmin}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs border border-slate-700 flex items-center justify-center gap-2 shadow"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Enter Operations Admin Portal</span>
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]">
          <span>© 2026 {currentTenant.name}. All Rights Reserved.</span>
          <span>Powered by HospitalityPro Cloud OS</span>
        </div>
      </footer>

      {/* Online Room Booking Modal */}
      {bookingModalOpen && selectedRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="glass-dropdown rounded-3xl p-6 border border-slate-700 w-full max-w-md space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white">Book {selectedRoom.type}</h3>
                <span className="text-xs text-emerald-400 font-mono">Room #{selectedRoom.number} — ₹{selectedRoom.rate}/night</span>
              </div>
              <button onClick={() => setBookingModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRoomBookSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Your Full Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Aditya Sharma"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-semibold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Email ID</label>
                  <input
                    type="email"
                    placeholder="guest@mail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Check-in</label>
                  <input
                    type="date"
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Check-out</label>
                  <input
                    type="date"
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="flex justify-between text-slate-300">
                  <span>Room Tariff:</span>
                  <span className="font-mono">₹{selectedRoom.rate}</span>
                </div>
                <div className="flex justify-between font-bold text-emerald-400">
                  <span>Estimated Total (inc. GST):</span>
                  <span className="font-mono">₹{(selectedRoom.rate * 1.12).toFixed(2)}</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30"
              >
                Confirm Online Reservation
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Table Reservation Modal */}
      {tableModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="glass-dropdown rounded-3xl p-6 border border-slate-700 w-full max-w-md space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <UtensilsCrossed className="w-5 h-5 text-amber-400" /> Reserve a Dining Table
              </h3>
              <button onClick={() => setTableModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleTableReserveSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Your Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Priya Sharma"
                  value={tableName}
                  onChange={(e) => setTableName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={tablePhone}
                  onChange={(e) => setTablePhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">Date</label>
                  <input
                    type="date"
                    value={tableDate}
                    onChange={(e) => setTableDate(e.target.value)}
                    className="w-full px-2 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Time</label>
                  <input
                    type="time"
                    value={tableTime}
                    onChange={(e) => setTableTime(e.target.value)}
                    className="w-full px-2 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Guests</label>
                  <input
                    type="number"
                    min="1"
                    max="12"
                    value={tableGuests}
                    onChange={(e) => setTableGuests(e.target.value)}
                    className="w-full px-2 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/30"
              >
                Confirm Table Reservation
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
