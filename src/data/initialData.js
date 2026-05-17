export const initialCategories = [
  { id: "espresso", name: "Espresso Bar", icon: "☕" },
  { id: "cold", name: "Cold Bar", icon: "🥤" },
  { id: "pastry", name: "Artisanal Pastries", icon: "🥐" },
  { id: "seasonal", name: "Seasonal Specials", icon: "✨" }
];

export const initialProducts = [
  {
    id: 1,
    name: "Flat White",
    category: "espresso",
    price: 5.50,
    calories: 120,
    image: "☕",
    desc: "Rich, full-bodied espresso with microfoam, perfectly balanced and smooth.",
    tags: ["Classic", "High Margin"],
    inStock: true,
    ingredients: [
      { name: "espresso_beans", amount: 15 }, // grams
      { name: "whole_milk", amount: 180 },    // ml
      { name: "paper_cups", amount: 1 }       // unit
    ]
  },
  {
    id: 2,
    name: "Golden Oat Latte",
    category: "espresso",
    price: 6.25,
    calories: 160,
    image: "🌾",
    desc: "Signature espresso with creamy oat milk and a touch of organic honey syrup.",
    tags: ["Best Seller", "Vegan Option"],
    inStock: true,
    ingredients: [
      { name: "espresso_beans", amount: 15 },
      { name: "oat_milk", amount: 200 },
      { name: "honey_syrup", amount: 15 },
      { name: "paper_cups", amount: 1 }
    ]
  },
  {
    id: 3,
    name: "Cortado",
    category: "espresso",
    price: 4.75,
    calories: 80,
    image: "🥛",
    desc: "Equal parts espresso and warm microfoam milk. Short, strong, and velvety.",
    tags: ["Barista Favorite"],
    inStock: true,
    ingredients: [
      { name: "espresso_beans", amount: 15 },
      { name: "whole_milk", amount: 60 },
      { name: "paper_cups", amount: 1 }
    ]
  },
  {
    id: 4,
    name: "Signature Cold Brew",
    category: "cold",
    price: 5.75,
    calories: 5,
    image: "🧊",
    desc: "Slow-steeped for 20 hours in cold water. Naturally sweet, low acidity, incredibly smooth.",
    tags: ["Top Rating", "Low Calorie"],
    inStock: true,
    ingredients: [
      { name: "espresso_beans", amount: 25 },
      { name: "paper_cups", amount: 1 }
    ]
  },
  {
    id: 5,
    name: "Salted Caramel Cold Foam",
    category: "cold",
    price: 6.50,
    calories: 220,
    image: "🍦",
    desc: "Our signature cold brew topped with a thick layer of house-made salted caramel cold foam.",
    tags: ["Must Try", "Trending"],
    inStock: true,
    ingredients: [
      { name: "espresso_beans", amount: 20 },
      { name: "whole_milk", amount: 100 },
      { name: "caramel_syrup", amount: 20 },
      { name: "paper_cups", amount: 1 }
    ]
  },
  {
    id: 6,
    name: "Almond Croissant",
    category: "pastry",
    price: 4.50,
    calories: 380,
    image: "🥐",
    desc: "Flaky, buttery twice-baked croissant filled with rich almond cream and topped with sliced almonds.",
    tags: ["Chef Special", "High Margin"],
    inStock: true,
    ingredients: [
      { name: "croissants", amount: 1 }
    ]
  },
  {
    id: 7,
    name: "Pistachio Rose Cruffin",
    category: "pastry",
    price: 5.25,
    calories: 420,
    image: "🧁",
    desc: "A croissant-muffin hybrid, filled with house-made pistachio pastry cream and scented with rosewater.",
    tags: ["Seasonal", "Limited Run"],
    inStock: true,
    ingredients: [
      { name: "cruffins", amount: 1 }
    ]
  },
  {
    id: 8,
    name: "Spiced Maple Cold Brew",
    category: "seasonal",
    price: 6.75,
    calories: 180,
    image: "🍁",
    desc: "20-hour cold brew infused with organic Canadian maple syrup, cinnamon, and topped with oat cold foam.",
    tags: ["Autumn Special"],
    inStock: true,
    ingredients: [
      { name: "espresso_beans", amount: 20 },
      { name: "oat_milk", amount: 100 },
      { name: "maple_syrup", amount: 20 },
      { name: "paper_cups", amount: 1 }
    ]
  }
];

export const initialInventory = {
  espresso_beans: { name: "Espresso Beans", qty: 2500, unit: "g", threshold: 500 }, // grams
  whole_milk: { name: "Whole Milk", qty: 10000, unit: "ml", threshold: 2000 },    // ml
  oat_milk: { name: "Oat Milk", qty: 8000, unit: "ml", threshold: 1500 },        // ml
  honey_syrup: { name: "Honey Syrup", qty: 1000, unit: "ml", threshold: 200 },     // ml
  caramel_syrup: { name: "Caramel Syrup", qty: 1000, unit: "ml", threshold: 200 }, // ml
  maple_syrup: { name: "Maple Syrup", qty: 1000, unit: "ml", threshold: 200 },     // ml
  paper_cups: { name: "Eco Paper Cups", qty: 200, unit: "pcs", threshold: 50 },
  croissants: { name: "Butter Croissants", qty: 15, unit: "pcs", threshold: 5 },
  cruffins: { name: "Pistachio Cruffins", qty: 10, unit: "pcs", threshold: 3 }
};

export const initialStaff = [
  { id: "sarah", name: "Sarah K.", role: "Barista", avatar: "👩‍🍳", activeShift: true, clockInTime: "07:30 AM" },
  { id: "alex", name: "Alex M.", role: "Barista", avatar: "🧑‍🍳", activeShift: false, clockInTime: null },
  { id: "jordan", name: "Jordan P.", role: "Shift Lead", avatar: "🧑‍💼", activeShift: true, clockInTime: "06:45 AM" },
  { id: "manager", name: "Elena R.", role: "Manager", avatar: "👩‍💼", activeShift: true, clockInTime: "08:00 AM" }
];

export const initialPromotions = [
  { code: "BREW20", discountPct: 20, description: "Get 20% off all beverages!", active: true },
  { code: "FREESHOT", discountPct: 10, description: "Get 10% off custom orders!", active: true },
  { code: "PASTRY15", discountPct: 15, description: "Take 15% off standard baked goods!", active: false }
];
