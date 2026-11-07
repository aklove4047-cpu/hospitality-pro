import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_DATA } from '../data/defaultData';

const AppContext = createContext(null);

// Audio synthesizers using Web Audio API for zero-dependency sounds
const playChimeSound = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.45);
  } catch (e) {
    // Audio context may require user interaction
  }
};

const playCashSound = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();
    osc1.type = 'triangle';
    osc2.type = 'sine';
    osc1.frequency.setValueAtTime(987.77, ctx.currentTime); // B5
    osc2.frequency.setValueAtTime(1318.51, ctx.currentTime + 0.08); // E6
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);
    osc1.start();
    osc2.start(ctx.currentTime + 0.08);
    osc1.stop(ctx.currentTime + 0.5);
    osc2.stop(ctx.currentTime + 0.5);
  } catch (e) {}
};

export const AppProvider = ({ children }) => {
  // Load from localStorage or initial
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem('hospitality_pro_db_v2');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_DATA;
  });

  const [currentTenantId, setCurrentTenantId] = useState('tenant_grand');
  const [currentRole, setCurrentRole] = useState('owner'); // 'superadmin' | 'owner' | 'manager' | 'cashier' | 'kitchen' | 'reception' | 'qr_customer'
  const [activeTab, setActiveTab] = useState('dashboard');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [toast, setToast] = useState(null);
  const [activeTableForQr, setActiveTableForQr] = useState('tbl_1');

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('hospitality_pro_db_v2', JSON.stringify(data));
    } catch (e) {}
  }, [data]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => setToast(null), 3800);
  };

  // Helper getters
  const currentTenant = data.tenants.find(t => t.id === currentTenantId) || data.tenants[0];

  // Filter tenant-specific collections
  const tenantCategories = data.categories.filter(c => c.tenantId === currentTenantId);
  const tenantMenuItems = data.menuItems.filter(m => m.tenantId === currentTenantId);
  const tenantTables = data.tables.filter(t => t.tenantId === currentTenantId);
  const tenantRooms = data.rooms.filter(r => r.tenantId === currentTenantId);
  const tenantBookings = data.bookings.filter(b => b.tenantId === currentTenantId);
  const tenantInventory = data.inventory.filter(i => i.tenantId === currentTenantId);
  const tenantOrders = data.orders.filter(o => o.tenantId === currentTenantId);
  const tenantKots = data.kots.filter(k => k.tenantId === currentTenantId);
  const tenantBills = data.bills.filter(b => b.tenantId === currentTenantId);

  // Business Actions
  const switchTenant = (tenantId) => {
    setCurrentTenantId(tenantId);
    showToast(`Switched active client account`, 'info');
  };

  const switchRole = (role) => {
    setCurrentRole(role);
    if (role === 'superadmin') {
      setActiveTab('reseller');
    } else if (role === 'kitchen') {
      setActiveTab('kitchen');
    } else if (role === 'cashier') {
      setActiveTab('pos');
    } else if (role === 'reception') {
      setActiveTab('rooms');
    } else if (role === 'qr_customer') {
      setActiveTab('qr_order');
    } else {
      setActiveTab('dashboard');
    }
  };

  // 1. Place Food Order / KOT (From POS or QR)
  const placeOrder = ({ tableId, items, type = 'dine_in', customerName = '', isQrOrder = false, notes = '' }) => {
    const table = tenantTables.find(t => t.id === tableId);
    const tableNum = table ? table.number : (type === 'takeaway' ? 'Takeaway' : 'Room Service');

    const newOrderId = `ord_${Date.now()}`;
    const newKotId = `kot_${Date.now()}`;
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newOrder = {
      id: newOrderId,
      orderNo: `ORD-${Math.floor(100 + Math.random() * 900)}`,
      tableId,
      tableNumber: tableNum,
      type,
      items: items.map((it, idx) => ({
        id: `oi_${Date.now()}_${idx}`,
        menuItemId: it.id,
        name: it.name,
        qty: it.qty,
        price: it.price,
        status: 'new',
        kotId: newKotId
      })),
      status: 'active',
      createdAt: nowTime,
      isQrOrder,
      customerName,
      tenantId: currentTenantId
    };

    const newKot = {
      id: newKotId,
      kotNo: `KOT #${Math.floor(100 + Math.random() * 900)}`,
      orderId: newOrderId,
      tableNumber: tableNum,
      source: isQrOrder ? '📱 Customer QR Order' : 'POS Cashier Terminal',
      createdAt: nowTime,
      elapsedMinutes: 0,
      items: items.map(it => ({
        name: it.name,
        qty: it.qty,
        status: 'new',
        notes: it.notes || notes || ''
      })),
      status: 'new',
      tenantId: currentTenantId
    };

    setData(prev => {
      // update table status if tableId
      const updatedTables = prev.tables.map(tbl => {
        if (tbl.id === tableId) {
          return { ...tbl, status: 'occupied', currentOrderId: newOrderId };
        }
        return tbl;
      });

      return {
        ...prev,
        tables: updatedTables,
        orders: [newOrder, ...prev.orders],
        kots: [newKot, ...prev.kots]
      };
    });

    if (soundEnabled) playChimeSound();
    showToast(`KOT generated for ${tableNum} & sent to Kitchen!`, 'success');
    return newOrderId;
  };

  // 2. Kitchen: update KOT item status (new -> preparing -> ready -> served)
  const updateKotItemStatus = (kotId, itemIndex, newStatus) => {
    setData(prev => {
      const updatedKots = prev.kots.map(kot => {
        if (kot.id === kotId) {
          const updatedItems = [...kot.items];
          if (updatedItems[itemIndex]) {
            updatedItems[itemIndex] = { ...updatedItems[itemIndex], status: newStatus };
          }
          // if all served, kot is completed
          const allServed = updatedItems.every(i => i.status === 'served');
          return {
            ...kot,
            items: updatedItems,
            status: allServed ? 'completed' : 'in_progress'
          };
        }
        return kot;
      });

      return { ...prev, kots: updatedKots };
    });
  };

  // 3. Deduct inventory based on recipes
  const deductRecipeIngredients = (items) => {
    setData(prev => {
      let currentInv = [...prev.inventory];

      items.forEach(orderItem => {
        const dish = prev.menuItems.find(m => m.id === orderItem.menuItemId || m.name === orderItem.name);
        if (dish && dish.recipe && Array.isArray(dish.recipe)) {
          dish.recipe.forEach(rec => {
            const deductQty = rec.qty * orderItem.qty;
            currentInv = currentInv.map(invItem => {
              if (invItem.id === rec.ingredientId && invItem.tenantId === currentTenantId) {
                const newStock = Math.max(0, parseFloat((invItem.currentStock - deductQty).toFixed(3)));
                return { ...invItem, currentStock: newStock };
              }
              return invItem;
            });
          });
        }
      });

      return { ...prev, inventory: currentInv };
    });
  };

  // 4. Settle / Generate POS Bill (with Recipe auto-deduction)
  const settleBill = ({
    orderId,
    tableId,
    items,
    subtotal,
    discount = 0,
    taxGst,
    grandTotal,
    paymentMode, // 'cash' | 'upi' | 'card' | 'charged_to_room'
    guestBookingId = null
  }) => {
    const table = tenantTables.find(t => t.id === tableId);
    const tableNumber = table ? table.number : 'Counter/Takeaway';
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);

    let attachedBooking = null;
    if (guestBookingId) {
      attachedBooking = tenantBookings.find(b => b.id === guestBookingId);
    }

    const newBill = {
      id: `bill_${Date.now()}`,
      billNo: `HP-INV-${Math.floor(10000 + Math.random() * 90000)}`,
      type: guestBookingId ? 'room_service' : 'restaurant_pos',
      tableNumber,
      roomId: attachedBooking ? attachedBooking.roomId : null,
      roomNumber: attachedBooking ? attachedBooking.roomNumber : null,
      guestName: attachedBooking ? attachedBooking.guestName : 'Walk-in Guest',
      bookingId: guestBookingId,
      subtotal,
      discount,
      taxGst,
      grandTotal,
      paymentMode,
      settledAtCheckout: paymentMode !== 'charged_to_room',
      date: nowStr,
      tenantId: currentTenantId,
      items: items.map(it => ({
        name: it.name,
        qty: it.qty,
        price: it.price
      }))
    };

    // Deduct raw ingredients
    deductRecipeIngredients(items);

    setData(prev => {
      // 1. Mark order as billed
      const updatedOrders = prev.orders.map(o => {
        if (o.id === orderId) {
          return { ...o, status: 'billed' };
        }
        return o;
      });

      // 2. Free up the table
      const updatedTables = prev.tables.map(tbl => {
        if (tbl.id === tableId) {
          return { ...tbl, status: 'available', currentOrderId: null };
        }
        return tbl;
      });

      // 3. If charged to room, append bill id to booking
      const updatedBookings = prev.bookings.map(b => {
        if (b.id === guestBookingId) {
          return {
            ...b,
            roomServiceBills: [...(b.roomServiceBills || []), newBill.id]
          };
        }
        return b;
      });

      return {
        ...prev,
        orders: updatedOrders,
        tables: updatedTables,
        bookings: updatedBookings,
        bills: [newBill, ...prev.bills]
      };
    });

    if (soundEnabled) playCashSound();
    showToast(`Bill ${newBill.billNo} generated & inventory deducted!`, 'success');
    return newBill;
  };

  // 5. Hotel Check-In with double booking collision prevention
  const checkInGuest = ({
    roomId,
    guestName,
    phone,
    email,
    idProof,
    checkInDate,
    checkOutDate,
    adults = 1,
    children = 0,
    advancePaid = 0
  }) => {
    // Check overlap
    const existing = tenantBookings.find(b => 
      b.roomId === roomId &&
      b.status === 'checked_in' &&
      b.tenantId === currentTenantId
    );

    if (existing) {
      showToast(`Room is currently occupied by ${existing.guestName}! Check-out first.`, 'error');
      return false;
    }

    const room = tenantRooms.find(r => r.id === roomId);
    if (!room) return false;

    // Calculate nights
    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);
    const diffTime = Math.abs(end - start);
    const nights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    const newBooking = {
      id: `bk_${Date.now()}`,
      bookingNo: `HP-BK-${Math.floor(1000 + Math.random() * 9000)}`,
      roomId,
      roomNumber: room.number,
      guestName,
      phone,
      email,
      idProof,
      checkInDate,
      checkOutDate,
      adults: parseInt(adults, 10),
      children: parseInt(children, 10),
      nightlyRate: room.rate,
      totalNights: nights,
      advancePaid: parseFloat(advancePaid) || 0,
      status: 'checked_in',
      roomServiceBills: [],
      tenantId: currentTenantId
    };

    setData(prev => {
      const updatedRooms = prev.rooms.map(r => {
        if (r.id === roomId) {
          return { ...r, status: 'occupied' };
        }
        return r;
      });
      return {
        ...prev,
        rooms: updatedRooms,
        bookings: [newBooking, ...prev.bookings]
      };
    });

    if (soundEnabled) playCashSound();
    showToast(`Guest ${guestName} checked in to Room ${room.number}!`, 'success');
    return true;
  };

  // 6. Hotel Check-out with Folio Calculation & Unbilled Order Blocking
  const checkOutGuest = (bookingId) => {
    const booking = tenantBookings.find(b => b.id === bookingId);
    if (!booking) return false;

    // PRD Rule: Checkout is blocked while restaurant orders linked to the guest are unbilled
    const pendingOrders = tenantOrders.filter(o => 
      o.status === 'active' &&
      o.tableNumber === `Room ${booking.roomNumber}`
    );

    if (pendingOrders.length > 0) {
      showToast(`Checkout blocked! Room ${booking.roomNumber} has ${pendingOrders.length} unbilled restaurant orders!`, 'error');
      return false;
    }

    setData(prev => {
      const updatedRooms = prev.rooms.map(r => {
        if (r.id === booking.roomId) {
          return { ...r, status: 'cleaning' }; // marked cleaning on checkout
        }
        return r;
      });

      const updatedBookings = prev.bookings.map(b => {
        if (b.id === bookingId) {
          return { ...b, status: 'checked_out' };
        }
        return b;
      });

      // Mark all room service bills as settled
      const updatedBills = prev.bills.map(bil => {
        if (bil.bookingId === bookingId) {
          return { ...bil, settledAtCheckout: true };
        }
        return bil;
      });

      return {
        ...prev,
        rooms: updatedRooms,
        bookings: updatedBookings,
        bills: updatedBills
      };
    });

    if (soundEnabled) playCashSound();
    showToast(`Room ${booking.roomNumber} checked out successfully. Marked for cleaning.`, 'success');
    return true;
  };

  // 7. Update Room Status
  const updateRoomStatus = (roomId, newStatus) => {
    setData(prev => ({
      ...prev,
      rooms: prev.rooms.map(r => r.id === roomId ? { ...r, status: newStatus } : r)
    }));
    showToast(`Room status updated to ${newStatus}`, 'info');
  };

  // 8. Inventory Stock adjustment
  const updateStock = (ingredientId, deltaQty) => {
    setData(prev => ({
      ...prev,
      inventory: prev.inventory.map(inv => {
        if (inv.id === ingredientId && inv.tenantId === currentTenantId) {
          const updated = Math.max(0, parseFloat((inv.currentStock + deltaQty).toFixed(3)));
          return { ...inv, currentStock: updated };
        }
        return inv;
      })
    }));
    showToast(`Stock updated`, 'success');
  };

  // 9. Add new inventory item
  const addInventoryItem = (item) => {
    const newItem = {
      id: `inv_${Date.now()}`,
      tenantId: currentTenantId,
      ...item
    };
    setData(prev => ({
      ...prev,
      inventory: [...prev.inventory, newItem]
    }));
    showToast(`Added ${item.name} to inventory`, 'success');
  };

  // 10. Reseller: Create Client / Tenant
  const createTenant = ({ name, plan, owner, email, phone, address, gstin, foodGst = 5, roomGst = 12, validUntil }) => {
    const newTenantId = `tenant_${Date.now()}`;
    const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const newTenant = {
      id: newTenantId,
      name,
      slug,
      plan,
      owner,
      email,
      phone,
      address,
      gstin,
      foodGst: parseInt(foodGst, 10),
      roomGst: parseInt(roomGst, 10),
      validUntil,
      status: 'active',
      logo: plan === 'restaurant' ? '🍽️' : (plan === 'hotel' ? '🏨' : '👑'),
      createdAt: new Date().toISOString().split('T')[0]
    };

    // Seed basic default categories & tables for the new client
    const defaultCats = [
      { id: `cat_${Date.now()}_1`, name: "Main Specialties", icon: "🍽️", tenantId: newTenantId },
      { id: `cat_${Date.now()}_2`, name: "Beverages", icon: "🍹", tenantId: newTenantId }
    ];

    const defaultTbls = [
      { id: `tbl_${Date.now()}_1`, number: "T-01", section: "Main Floor", capacity: 4, status: "available", qrCode: `QR-${newTenantId}-T1`, currentOrderId: null, tenantId: newTenantId },
      { id: `tbl_${Date.now()}_2`, number: "T-02", section: "Main Floor", capacity: 2, status: "available", qrCode: `QR-${newTenantId}-T2`, currentOrderId: null, tenantId: newTenantId }
    ];

    const defaultRms = [
      { id: `rm_${Date.now()}_1`, number: "101", type: "Standard AC", floor: "1st Floor", rate: 2500, status: "available", maxGuests: 2, amenities: ["AC", "Wi-Fi"], tenantId: newTenantId },
      { id: `rm_${Date.now()}_2`, number: "102", type: "Deluxe Suite", floor: "1st Floor", rate: 4500, status: "available", maxGuests: 3, amenities: ["AC", "Wi-Fi", "Balcony"], tenantId: newTenantId }
    ];

    setData(prev => ({
      ...prev,
      tenants: [...prev.tenants, newTenant],
      categories: [...prev.categories, ...defaultCats],
      tables: [...prev.tables, ...defaultTbls],
      rooms: [...prev.rooms, ...defaultRms]
    }));

    showToast(`New client ${name} created with plan [${plan.toUpperCase()}]!`, 'success');
  };

  // 11. Reseller: Toggle Tenant status or Plan
  const toggleTenantStatus = (tenantId) => {
    setData(prev => ({
      ...prev,
      tenants: prev.tenants.map(t => {
        if (t.id === tenantId) {
          const next = t.status === 'active' ? 'suspended' : 'active';
          return { ...t, status: next };
        }
        return t;
      })
    }));
    showToast(`Tenant status updated`, 'info');
  };

  const updateTenantPlan = (tenantId, newPlan) => {
    setData(prev => ({
      ...prev,
      tenants: prev.tenants.map(t => t.id === tenantId ? { ...t, plan: newPlan } : t)
    }));
    showToast(`Client plan updated to ${newPlan.toUpperCase()}!`, 'success');
  };

  const updateTenantValidity = (tenantId, validUntil) => {
    setData(prev => ({
      ...prev,
      tenants: prev.tenants.map(t => t.id === tenantId ? { ...t, validUntil } : t)
    }));
    showToast(`Subscription validity extended to ${validUntil}!`, 'success');
  };

  // 12. Settings updater
  const updateSettings = (updatedFields) => {
    setData(prev => ({
      ...prev,
      tenants: prev.tenants.map(t => t.id === currentTenantId ? { ...t, ...updatedFields } : t)
    }));
    showToast(`Business profile & GST settings updated!`, 'success');
  };

  // Reset to default sample data
  const resetToDefaults = () => {
    setData(INITIAL_DATA);
    setCurrentTenantId('tenant_grand');
    setCurrentRole('owner');
    setActiveTab('dashboard');
    showToast(`Database reset to pristine demo state`, 'info');
  };

  return (
    <AppContext.Provider
      value={{
        data,
        currentTenant,
        currentTenantId,
        currentRole,
        activeTab,
        soundEnabled,
        setSoundEnabled,
        setActiveTab,
        activeTableForQr,
        setActiveTableForQr,
        toast,
        showToast,
        switchTenant,
        switchRole,
        // Collections
        tenantCategories,
        tenantMenuItems,
        tenantTables,
        tenantRooms,
        tenantBookings,
        tenantInventory,
        tenantOrders,
        tenantKots,
        tenantBills,
        // Actions
        placeOrder,
        updateKotItemStatus,
        settleBill,
        checkInGuest,
        checkOutGuest,
        updateRoomStatus,
        updateStock,
        addInventoryItem,
        createTenant,
        toggleTenantStatus,
        updateTenantPlan,
        updateTenantValidity,
        updateSettings,
        resetToDefaults
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);

