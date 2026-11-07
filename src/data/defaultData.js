export const INITIAL_DATA = {
  reseller: {
    name: "HospitalityPro Cloud Reseller",
    email: "reseller@hospitalitypro.io",
    currency: "₹",
    mrr: "₹1,45,000",
    totalClients: 18,
    activeLicenses: 16
  },
  tenants: [
    {
      id: "tenant_grand",
      name: "Grand Imperial Hotel & Fine Dine",
      slug: "grand-imperial",
      plan: "both", // 'both' | 'restaurant' | 'hotel'
      owner: "Vikram Malhotra",
      email: "owner@grandimperial.com",
      phone: "+91 98765 43210",
      address: "14 Heritage Boulevard, Civil Lines, Jaipur",
      gstin: "08AAAAA0000A1Z5",
      foodGst: 5,
      roomGst: 12,
      validUntil: "2027-12-31",
      status: "active", // 'active' | 'suspended' | 'expired'
      logo: "👑",
      createdAt: "2026-01-15"
    },
    {
      id: "tenant_spice",
      name: "The Spice Garden Restaurant",
      slug: "spice-garden",
      plan: "restaurant",
      owner: "Ananya Sharma",
      email: "owner@spicegarden.com",
      phone: "+91 98111 22334",
      address: "42 Indiranagar 100ft Road, Bengaluru",
      gstin: "29BBBBB1111B2Z6",
      foodGst: 5,
      roomGst: 0,
      validUntil: "2027-08-30",
      status: "active",
      logo: "🌶️",
      createdAt: "2026-02-10"
    },
    {
      id: "tenant_zenith",
      name: "Zenith Luxury Suites & Spa",
      slug: "zenith-suites",
      plan: "hotel",
      owner: "Rajesh Singhania",
      email: "owner@zenithsuites.com",
      phone: "+91 99222 33445",
      address: "88 Ridge View Heights, Shimla",
      gstin: "02CCCCC2222C3Z7",
      foodGst: 0,
      roomGst: 18,
      validUntil: "2027-11-20",
      status: "active",
      logo: "🏨",
      createdAt: "2026-03-01"
    }
  ],
  users: [
    { id: "u_super", username: "superadmin", role: "superadmin", name: "System Admin (Reseller)", tenantId: null },
    { id: "u1", username: "vikram", role: "owner", name: "Vikram Malhotra", tenantId: "tenant_grand" },
    { id: "u2", username: "manager1", role: "manager", name: "Suresh Rao (Manager)", tenantId: "tenant_grand" },
    { id: "u3", username: "cashier1", role: "cashier", name: "Amit Verma (Cashier)", tenantId: "tenant_grand" },
    { id: "u4", username: "chef1", role: "kitchen", name: "Master Chef Sanjeev", tenantId: "tenant_grand" },
    { id: "u5", username: "reception1", role: "reception", name: "Pooja Mehta (Front Desk)", tenantId: "tenant_grand" }
  ],
  categories: [
    { id: "cat_starters", name: "Starters & Appetizers", icon: "🥟", tenantId: "tenant_grand" },
    { id: "cat_main", name: "Main Course", icon: "🍛", tenantId: "tenant_grand" },
    { id: "cat_breads", name: "Breads & Rice", icon: "🫓", tenantId: "tenant_grand" },
    { id: "cat_beverages", name: "Mocktails & Beverages", icon: "🍹", tenantId: "tenant_grand" },
    { id: "cat_desserts", name: "Desserts & Sweets", icon: "🍨", tenantId: "tenant_grand" }
  ],
  menuItems: [
    {
      id: "m_1",
      name: "Paneer Tikka Angara",
      categoryId: "cat_starters",
      price: 320,
      type: "veg",
      description: "Char-grilled cottage cheese marinated in hung curd and smoked spices",
      isPopular: true,
      recipe: [
        { ingredientId: "inv_paneer", qty: 0.25 }, // 250g
        { ingredientId: "inv_curd", qty: 0.1 },
        { ingredientId: "inv_spices", qty: 0.03 }
      ],
      tenantId: "tenant_grand"
    },
    {
      id: "m_2",
      name: "Murgh Malai Kebab",
      categoryId: "cat_starters",
      price: 420,
      type: "non-veg",
      description: "Creamy boneless chicken tikka flavored with cardamom and cheese",
      isPopular: true,
      recipe: [
        { ingredientId: "inv_chicken", qty: 0.3 },
        { ingredientId: "inv_cream", qty: 0.08 },
        { ingredientId: "inv_cheese", qty: 0.05 }
      ],
      tenantId: "tenant_grand"
    },
    {
      id: "m_3",
      name: "Crispy Corn & Waterchestnut",
      categoryId: "cat_starters",
      price: 280,
      type: "veg",
      description: "Tossed in spicy oriental salt, pepper and fresh spring onions",
      isPopular: false,
      recipe: [
        { ingredientId: "inv_corn", qty: 0.2 },
        { ingredientId: "inv_oil", qty: 0.05 }
      ],
      tenantId: "tenant_grand"
    },
    {
      id: "m_4",
      name: "Dal Makhani Grand Heritage",
      categoryId: "cat_main",
      price: 360,
      type: "veg",
      description: "Slow-cooked black lentils simmered overnight with white butter and fresh cream",
      isPopular: true,
      recipe: [
        { ingredientId: "inv_dal", qty: 0.2 },
        { ingredientId: "inv_butter", qty: 0.08 },
        { ingredientId: "inv_cream", qty: 0.06 }
      ],
      tenantId: "tenant_grand"
    },
    {
      id: "m_5",
      name: "Butter Chicken Delhi Style",
      categoryId: "cat_main",
      price: 460,
      type: "non-veg",
      description: "Tandoori chicken pieces cooked in rich velvety satin tomato gravy",
      isPopular: true,
      recipe: [
        { ingredientId: "inv_chicken", qty: 0.35 },
        { ingredientId: "inv_butter", qty: 0.1 },
        { ingredientId: "inv_cream", qty: 0.08 }
      ],
      tenantId: "tenant_grand"
    },
    {
      id: "m_6",
      name: "Dum Handi Veg Biryani",
      categoryId: "cat_breads",
      price: 340,
      type: "veg",
      description: "Fragrant basmati rice layered with garden vegetables and saffron milk",
      isPopular: false,
      recipe: [
        { ingredientId: "inv_rice", qty: 0.25 },
        { ingredientId: "inv_paneer", qty: 0.1 },
        { ingredientId: "inv_spices", qty: 0.04 }
      ],
      tenantId: "tenant_grand"
    },
    {
      id: "m_7",
      name: "Butter Garlic Naan",
      categoryId: "cat_breads",
      price: 85,
      type: "veg",
      description: "Refined flour bread baked in tandoor glazed with garlic and butter",
      isPopular: true,
      recipe: [
        { ingredientId: "inv_flour", qty: 0.12 },
        { ingredientId: "inv_butter", qty: 0.03 }
      ],
      tenantId: "tenant_grand"
    },
    {
      id: "m_8",
      name: "Fresh Virgin Mojito",
      categoryId: "cat_beverages",
      price: 190,
      type: "veg",
      description: "Muddled fresh mint leaves, Persian lime, cane sugar and sparkling soda",
      isPopular: true,
      recipe: [
        { ingredientId: "inv_mint", qty: 0.02 },
        { ingredientId: "inv_lemon", qty: 0.05 },
        { ingredientId: "inv_soda", qty: 1 }
      ],
      tenantId: "tenant_grand"
    },
    {
      id: "m_9",
      name: "Royal Kesari Kulfi Falooda",
      categoryId: "cat_desserts",
      price: 240,
      type: "veg",
      description: "Artisan pistachio kulfi served with rose falooda and sabja seeds",
      isPopular: true,
      recipe: [
        { ingredientId: "inv_milk", qty: 0.3 },
        { ingredientId: "inv_spices", qty: 0.02 }
      ],
      tenantId: "tenant_grand"
    }
  ],
  tables: [
    { id: "tbl_1", number: "T-01", section: "Main Hall", capacity: 4, status: "occupied", qrCode: "QR-GIP-T01-789X", currentOrderId: "ord_101", tenantId: "tenant_grand" },
    { id: "tbl_2", number: "T-02", section: "Main Hall", capacity: 2, status: "available", qrCode: "QR-GIP-T02-452A", currentOrderId: null, tenantId: "tenant_grand" },
    { id: "tbl_3", number: "T-03", section: "Terrace Garden", capacity: 6, status: "occupied", qrCode: "QR-GIP-T03-918B", currentOrderId: "ord_102", tenantId: "tenant_grand" },
    { id: "tbl_4", number: "T-04", section: "Terrace Garden", capacity: 4, status: "available", qrCode: "QR-GIP-T04-203C", currentOrderId: null, tenantId: "tenant_grand" },
    { id: "tbl_5", number: "T-05", section: "Family Lounge", capacity: 8, status: "available", qrCode: "QR-GIP-T05-881D", currentOrderId: null, tenantId: "tenant_grand" },
    { id: "tbl_6", number: "T-06", section: "VIP Cabana", capacity: 6, status: "occupied", qrCode: "QR-GIP-T06-614E", currentOrderId: "ord_103", tenantId: "tenant_grand" }
  ],
  rooms: [
    { id: "rm_101", number: "101", type: "Deluxe King", floor: "1st Floor", rate: 3500, status: "occupied", maxGuests: 2, amenities: ["AC", "Wi-Fi", "King Bed", "Smart TV", "Mini Fridge"], tenantId: "tenant_grand" },
    { id: "rm_102", number: "102", type: "Deluxe Twin", floor: "1st Floor", rate: 3200, status: "available", maxGuests: 2, amenities: ["AC", "Wi-Fi", "Twin Beds", "Smart TV"], tenantId: "tenant_grand" },
    { id: "rm_201", number: "201", type: "Executive Suite", floor: "2nd Floor", rate: 5500, status: "occupied", maxGuests: 3, amenities: ["AC", "Wi-Fi", "Jacuzzi", "Living Room", "Balcony"], tenantId: "tenant_grand" },
    { id: "rm_202", number: "202", type: "Executive Suite", floor: "2nd Floor", rate: 5500, status: "cleaning", maxGuests: 3, amenities: ["AC", "Wi-Fi", "Jacuzzi", "Living Room", "Balcony"], tenantId: "tenant_grand" },
    { id: "rm_301", number: "301", type: "Presidential Villa", floor: "3rd Floor", rate: 9500, status: "available", maxGuests: 4, amenities: ["Private Pool", "Butler Service", "Terrace", "Luxury Lounge"], tenantId: "tenant_grand" },
    { id: "rm_302", number: "302", type: "Deluxe King", floor: "3rd Floor", rate: 3500, status: "maintenance", maxGuests: 2, amenities: ["AC", "Wi-Fi", "King Bed"], tenantId: "tenant_grand" }
  ],
  bookings: [
    {
      id: "bk_201",
      bookingNo: "HP-BK-9801",
      roomId: "rm_101",
      roomNumber: "101",
      guestName: "Aditya Roy Kapur",
      phone: "+91 98200 12345",
      email: "aditya.roy@example.com",
      idProof: "Aadhaar: 4892 1192 4810",
      checkInDate: "2026-11-06",
      checkOutDate: "2026-11-09",
      adults: 2,
      children: 0,
      nightlyRate: 3500,
      totalNights: 3,
      advancePaid: 3500,
      status: "checked_in", // 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled'
      roomServiceBills: ["bill_rs_1"],
      tenantId: "tenant_grand"
    },
    {
      id: "bk_202",
      bookingNo: "HP-BK-9802",
      roomId: "rm_201",
      roomNumber: "201",
      guestName: "Meenakshi Sundaram",
      phone: "+91 97400 54321",
      email: "meenakshi@example.com",
      idProof: "Passport: Z5891042",
      checkInDate: "2026-11-05",
      checkOutDate: "2026-11-08",
      adults: 2,
      children: 1,
      nightlyRate: 5500,
      totalNights: 3,
      advancePaid: 5000,
      status: "checked_in",
      roomServiceBills: [],
      tenantId: "tenant_grand"
    }
  ],
  inventory: [
    { id: "inv_paneer", name: "Malai Paneer Fresh", category: "Dairy", currentStock: 8.5, minStock: 3.0, unit: "kg", costPerUnit: 340, tenantId: "tenant_grand" },
    { id: "inv_chicken", name: "Boneless Farm Chicken", category: "Poultry", currentStock: 12.0, minStock: 5.0, unit: "kg", costPerUnit: 280, tenantId: "tenant_grand" },
    { id: "inv_dal", name: "Urad Dal Black (Makhani)", category: "Grains", currentStock: 15.0, minStock: 6.0, unit: "kg", costPerUnit: 140, tenantId: "tenant_grand" },
    { id: "inv_butter", name: "Amul Table Butter Salted", category: "Dairy", currentStock: 4.2, minStock: 4.0, unit: "kg", costPerUnit: 480, tenantId: "tenant_grand" },
    { id: "inv_cream", name: "Rich Fresh Dairy Cream", category: "Dairy", currentStock: 2.1, minStock: 3.0, unit: "L", costPerUnit: 210, tenantId: "tenant_grand" },
    { id: "inv_flour", name: "Tandoori Wheat Maida", category: "Grains", currentStock: 35.0, minStock: 10.0, unit: "kg", costPerUnit: 45, tenantId: "tenant_grand" },
    { id: "inv_rice", name: "Aged Basmati Extra Long", category: "Grains", currentStock: 22.0, minStock: 8.0, unit: "kg", costPerUnit: 115, tenantId: "tenant_grand" },
    { id: "inv_corn", name: "American Sweet Corn", category: "Vegetables", currentStock: 6.0, minStock: 2.0, unit: "kg", costPerUnit: 90, tenantId: "tenant_grand" },
    { id: "inv_milk", name: "Full Cream Cow Milk", category: "Dairy", currentStock: 18.0, minStock: 5.0, unit: "L", costPerUnit: 65, tenantId: "tenant_grand" },
    { id: "inv_curd", name: "Hung Curd / Yoghurt", category: "Dairy", currentStock: 7.0, minStock: 2.5, unit: "kg", costPerUnit: 80, tenantId: "tenant_grand" },
    { id: "inv_spices", name: "Heritage Garam Masala Blend", category: "Spices", currentStock: 3.8, minStock: 1.0, unit: "kg", costPerUnit: 650, tenantId: "tenant_grand" },
    { id: "inv_oil", name: "Refined Sunflower Oil", category: "Cooking Oil", currentStock: 20.0, minStock: 8.0, unit: "L", costPerUnit: 140, tenantId: "tenant_grand" },
    { id: "inv_soda", name: "Sparkling Club Soda (Bottles)", category: "Beverages", currentStock: 48, minStock: 24, unit: "pcs", costPerUnit: 20, tenantId: "tenant_grand" }
  ],
  orders: [
    {
      id: "ord_101",
      orderNo: "ORD-101",
      tableId: "tbl_1",
      tableNumber: "T-01",
      type: "dine_in",
      guestType: "table",
      items: [
        { id: "oi_1", menuItemId: "m_1", name: "Paneer Tikka Angara", qty: 2, price: 320, status: "ready", kotId: "kot_101" },
        { id: "oi_2", menuItemId: "m_4", name: "Dal Makhani Grand Heritage", qty: 1, price: 360, status: "preparing", kotId: "kot_101" },
        { id: "oi_3", menuItemId: "m_7", name: "Butter Garlic Naan", qty: 3, price: 85, status: "preparing", kotId: "kot_101" }
      ],
      status: "active", // 'active' | 'billed' | 'cancelled'
      createdAt: "14:15",
      isQrOrder: false,
      tenantId: "tenant_grand"
    },
    {
      id: "ord_102",
      orderNo: "ORD-102",
      tableId: "tbl_3",
      tableNumber: "T-03",
      type: "dine_in",
      guestType: "table",
      items: [
        { id: "oi_4", menuItemId: "m_2", name: "Murgh Malai Kebab", qty: 1, price: 420, status: "ready", kotId: "kot_102" },
        { id: "oi_5", menuItemId: "m_8", name: "Fresh Virgin Mojito", qty: 2, price: 190, status: "served", kotId: "kot_102" }
      ],
      status: "active",
      createdAt: "14:28",
      isQrOrder: true,
      customerName: "Rahul Sharma (QR Order)",
      tenantId: "tenant_grand"
    },
    {
      id: "ord_103",
      orderNo: "ORD-103",
      tableId: "tbl_6",
      tableNumber: "T-06",
      type: "dine_in",
      guestType: "table",
      items: [
        { id: "oi_6", menuItemId: "m_5", name: "Butter Chicken Delhi Style", qty: 1, price: 460, status: "new", kotId: "kot_103" },
        { id: "oi_7", menuItemId: "m_6", name: "Dum Handi Veg Biryani", qty: 1, price: 340, status: "new", kotId: "kot_103" }
      ],
      status: "active",
      createdAt: "14:40",
      isQrOrder: false,
      tenantId: "tenant_grand"
    }
  ],
  kots: [
    {
      id: "kot_101",
      kotNo: "KOT #101",
      orderId: "ord_101",
      tableNumber: "T-01",
      source: "POS Terminal (Amit V.)",
      createdAt: "14:15",
      elapsedMinutes: 28,
      items: [
        { name: "Paneer Tikka Angara", qty: 2, status: "ready", notes: "Extra mint chutney" },
        { name: "Dal Makhani Grand Heritage", qty: 1, status: "preparing", notes: "" },
        { name: "Butter Garlic Naan", qty: 3, status: "preparing", notes: "Crispy" }
      ],
      status: "in_progress",
      tenantId: "tenant_grand"
    },
    {
      id: "kot_102",
      kotNo: "KOT #102",
      orderId: "ord_102",
      tableNumber: "T-03",
      source: "📱 Customer QR Order",
      createdAt: "14:28",
      elapsedMinutes: 15,
      items: [
        { name: "Murgh Malai Kebab", qty: 1, status: "ready", notes: "Mild spice" },
        { name: "Fresh Virgin Mojito", qty: 2, status: "served", notes: "Less ice" }
      ],
      status: "in_progress",
      tenantId: "tenant_grand"
    },
    {
      id: "kot_103",
      kotNo: "KOT #103",
      orderId: "ord_103",
      tableNumber: "T-06",
      source: "POS Terminal (Amit V.)",
      createdAt: "14:40",
      elapsedMinutes: 3,
      items: [
        { name: "Butter Chicken Delhi Style", qty: 1, status: "new", notes: "Rich butter" },
        { name: "Dum Handi Veg Biryani", qty: 1, status: "new", notes: "With raita" }
      ],
      status: "new",
      tenantId: "tenant_grand"
    }
  ],
  bills: [
    {
      id: "bill_rs_1",
      billNo: "HP-INV-10088",
      type: "room_service",
      roomId: "rm_101",
      roomNumber: "101",
      guestName: "Aditya Roy Kapur",
      bookingId: "bk_201",
      subtotal: 1255,
      discount: 0,
      taxGst: 62.75, // 5% food GST
      grandTotal: 1317.75,
      paymentMode: "charged_to_room",
      settledAtCheckout: false,
      date: "2026-11-06 21:30",
      tenantId: "tenant_grand",
      items: [
        { name: "Butter Chicken Delhi Style", qty: 1, price: 460 },
        { name: "Butter Garlic Naan", qty: 3, price: 85 },
        { name: "Royal Kesari Kulfi Falooda", qty: 2, price: 240 }
      ]
    },
    {
      id: "bill_pos_1",
      billNo: "HP-INV-10087",
      type: "restaurant_pos",
      tableNumber: "T-02",
      subtotal: 960,
      discount: 50,
      taxGst: 45.5,
      grandTotal: 955.5,
      paymentMode: "UPI",
      date: "2026-11-07 13:10",
      tenantId: "tenant_grand",
      items: [
        { name: "Paneer Tikka Angara", qty: 2, price: 320 },
        { name: "Dum Handi Veg Biryani", qty: 1, price: 340 }
      ]
    }
  ]
};

