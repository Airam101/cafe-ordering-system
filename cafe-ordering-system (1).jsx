import { useState } from "react";

const modules = [
  {
    id: 1,
    icon: "🌐",
    tag: "FRONT-END",
    title: "Digital Touchpoints",
    color: "#C8956C",
    accent: "#F5DEB3",
    desc: "Guests access the menu through branded mobile apps, a responsive web PWA, QR codes at every table, and self-service kiosk terminals near the entrance.",
    features: [
      "Branded iOS & Android apps",
      "Responsive Web PWA (works on any browser)",
      "Table QR codes with smart routing",
      "Self-service kiosk terminals",
      "Multi-language & accessibility support",
    ],
  },
  {
    id: 2,
    icon: "📋",
    tag: "MENU",
    title: "Menu Management",
    color: "#6B8E6B",
    accent: "#C8E6C9",
    desc: "Real-time stock sync auto-hides out-of-stock items. Time-based menus, allergen tags, calorie counts, and high-margin item spotlights keep your menu smart and profitable.",
    features: [
      "Live inventory → auto-hide sold-out items",
      "Time-based menus (Breakfast / All-Day)",
      "Allergen & dietary labels (Vegan, GF)",
      "High-margin upsell badges",
      "Seasonal menu scheduling",
    ],
  },
  {
    id: 3,
    icon: "⚙️",
    tag: "MODIFIERS",
    title: "Forced Modifier Engine",
    color: "#8B6E9E",
    accent: "#E1D5F0",
    desc: "Built-in menu logic walks guests through every required choice — milk type, roast, syrup pumps, size — before allowing checkout. No more wrong orders.",
    features: [
      "Milk substitutes (oat, almond, soy, coconut)",
      "Roast selection (light / medium / dark / decaf)",
      "Syrup pump counts (1–5)",
      "Temperature & size selectors",
      "Calorie impact shown per modifier",
    ],
  },
  {
    id: 4,
    icon: "🖥️",
    tag: "KDS",
    title: "Kitchen Display System",
    color: "#C0763A",
    accent: "#FFE0C0",
    desc: "Paper tickets are gone. Color-coded digital cards route orders to the right station — espresso bar, cold bar, food prep — with countdown timers and SLA alerts.",
    features: [
      "Color-coded: New / In Progress / Ready",
      "Multi-station routing & bump workflow",
      "Countdown timers per order item",
      "Priority queue (pre-order vs walk-in)",
      "SLA breach alerts for delayed orders",
    ],
  },
  {
    id: 5,
    icon: "💳",
    tag: "PAYMENTS",
    title: "Omnichannel Payments",
    color: "#4A7EA5",
    accent: "#BDD9F2",
    desc: "Every payment method guests expect — cards, Apple Pay, Google Pay, QR wallets, gift cards, and split payments — all inside a PCI-DSS compliant, tip-enabled checkout.",
    features: [
      "Apple Pay / Google Pay / Samsung Pay",
      "Credit & debit cards (Visa, MC, Amex)",
      "Gift cards & stored loyalty wallet",
      "Split payment between guests",
      "Smart tipping prompts + digital receipts",
    ],
  },
  {
    id: 6,
    icon: "🎁",
    tag: "LOYALTY",
    title: "Loyalty & Rewards",
    color: "#B5723A",
    accent: "#F9E4CC",
    desc: "Points per purchase, tiered tiers, birthday perks, referral bonuses, and punch-card milestones keep regulars coming back and spending more.",
    features: [
      "Points system (1 pt per $1 spent)",
      "Tiers: Regular → Silver → Gold → Platinum",
      "Birthday & referral rewards",
      "Free drink milestones",
      "Push alerts for expiring points",
    ],
  },
  {
    id: 7,
    icon: "📊",
    tag: "ANALYTICS",
    title: "Analytics & Reporting",
    color: "#5A7A6A",
    accent: "#C8E6D5",
    desc: "Hourly sales, best-sellers by time of day, customer return rates, staff performance, and inventory forecasts — all in one dashboard, exportable to CSV or PDF.",
    features: [
      "Hourly / daily / monthly sales reports",
      "Best-seller heatmap by time of day",
      "Average order value trends",
      "Staff performance leaderboards",
      "Inventory depletion forecasts",
    ],
  },
  {
    id: 8,
    icon: "📦",
    tag: "INVENTORY",
    title: "Inventory Management",
    color: "#7A6A4A",
    accent: "#EDE0C8",
    desc: "Track every liter of milk and gram of coffee in real time. Low-stock SMS alerts, auto-purchase orders, and recipe-level deductions keep you from ever running dry.",
    features: [
      "Real-time ingredient tracking",
      "Low-stock alerts to manager's phone",
      "Auto purchase order generation",
      "Recipe → inventory deduction logic",
      "Waste & shrinkage logging",
    ],
  },
  {
    id: 9,
    icon: "👥",
    tag: "STAFF",
    title: "Staff & Shift Management",
    color: "#6A7A9A",
    accent: "#D0D8F0",
    desc: "Digital clock-in/out, shift calendars, role-based permissions, tip pooling, and task assignment — everything a manager needs to run a tight, happy team.",
    features: [
      "Role-based access (Barista / Lead / Manager)",
      "Digital clock-in / clock-out",
      "Shift scheduling calendar",
      "Tip pooling calculator",
      "Task assignment & tracking",
    ],
  },
  {
    id: 10,
    icon: "📣",
    tag: "MARKETING",
    title: "Promotions Engine",
    color: "#9E5A6E",
    accent: "#F0C8D5",
    desc: "Flash deals with countdown timers, Happy Hour auto-pricing, bundle discounts, coupon codes, and email/SMS campaign integrations to drive traffic on slow days.",
    features: [
      "Discount codes & coupon management",
      "Flash deals with live countdown",
      "Happy Hour automatic pricing rules",
      "Bundle deals (Coffee + Pastry = % off)",
      "Email/SMS campaign integration",
    ],
  },
  {
    id: 11,
    icon: "🔔",
    tag: "NOTIFICATIONS",
    title: "Order Status & Alerts",
    color: "#5A8A7A",
    accent: "#C0E0D8",
    desc: "Guests track their order in real time: Received → Preparing → Ready → Collected. SMS and push alerts, estimated wait times, and in-store pickup number boards.",
    features: [
      "Live status: Received → Ready → Collected",
      "SMS & push notification delivery",
      "Estimated wait time display",
      "In-store pickup number boards",
      "Missed pickup reminders",
    ],
  },
  {
    id: 12,
    icon: "🔒",
    tag: "SECURITY",
    title: "Security & Compliance",
    color: "#6A5A7A",
    accent: "#D8D0E8",
    desc: "Role-based access control, end-to-end encryption, 2FA for admins, GDPR compliance, full audit trails, and automated daily backups protect your data and guests.",
    features: [
      "Role-based access control (RBAC)",
      "End-to-end payment encryption",
      "2FA for admin accounts",
      "GDPR & local data privacy compliance",
      "Automated backups & audit trails",
    ],
  },
];

const phases = [
  { week: "Wks 1–4", label: "Foundation", items: ["Architecture & DB schema", "Auth system", "Admin scaffold", "Menu backend"] },
  { week: "Wks 5–8", label: "Core Ordering", items: ["Menu front-end + modifiers", "Cart & checkout", "Payment integration", "KDS display"] },
  { week: "Wks 9–12", label: "Operations", items: ["Inventory sync", "Staff management", "Order notifications", "QR code system"] },
  { week: "Wks 13–16", label: "Growth", items: ["Loyalty program", "Promotions engine", "Advanced analytics", "Mobile app launch"] },
  { week: "Wk 17+", label: "Launch & Scale", items: ["Pilot location rollout", "Staff training", "Guest feedback loop", "Full deployment"] },
];

// ── RECEIPT DATA ──
const receiptItems = [
  { id: 1, name: "Flat White", size: "M", mods: ["Oat milk", "Medium roast", "1 vanilla pump"], qty: 1, price: 5.50 },
  { id: 2, name: "Cold Brew", size: "L", mods: ["No sugar", "Extra ice"], qty: 1, price: 6.00 },
  { id: 3, name: "Almond Croissant", size: null, mods: ["Warmed"], qty: 2, price: 4.25 },
];

function OrderReceipt() {
  const [tipPct, setTipPct] = useState(15);
  const [customTip, setCustomTip] = useState("");
  const [payMethod, setPayMethod] = useState("card");
  const [printed, setPrinted] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const subtotal = receiptItems.reduce((s, i) => s + i.price * i.qty, 0);
  const tax = subtotal * 0.08;
  const tipAmount = customTip !== "" ? parseFloat(customTip) || 0 : subtotal * (tipPct / 100);
  const total = subtotal + tax + tipAmount;

  const orderId = "ORD-2026-04871";
  const orderTime = "10:32 AM, May 17 2026";
  const barista = "Sarah K.";
  const table = "Table 07";

  const payIcons = { card: "💳", apple: "", google: "G", cash: "💵", wallet: "👛" };
  const payLabels = { card: "Visa •••• 4821", apple: "Apple Pay", google: "Google Pay", cash: "Cash", wallet: "Loyalty Wallet" };

  return (
    <div style={{ padding: "20px 30px 50px", maxWidth: "1100px", margin: "0 auto" }}>
      {/* Section Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "30px" }}>
        <div style={{ flex: 1, height: "1px", background: "rgba(200,149,108,0.2)" }} />
        <h2 style={{ fontSize: "12px", letterSpacing: "4px", textTransform: "uppercase", color: "#8A6A4A", margin: 0, whiteSpace: "nowrap", fontFamily: "sans-serif" }}>Order Receipt</h2>
        <div style={{ flex: 1, height: "1px", background: "rgba(200,149,108,0.2)" }} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", alignItems: "start" }}>

        {/* LEFT — Receipt Slip */}
        <div style={{
          background: "#FAF6EE",
          borderRadius: "14px",
          overflow: "hidden",
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
          color: "#1A1208",
          fontFamily: "sans-serif",
        }}>
          {/* Receipt top notch */}
          <div style={{ background: "#C8956C", padding: "22px 24px 18px", textAlign: "center" }}>
            <div style={{ fontSize: "22px", marginBottom: "4px" }}>☕</div>
            <div style={{ fontSize: "18px", fontWeight: "700", color: "#fff", letterSpacing: "1px" }}>BREW & CO.</div>
            <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.75)", letterSpacing: "1px", marginTop: "2px" }}>123 Espresso Lane, Downtown</div>
          </div>

          {/* Zigzag tear */}
          <div style={{
            height: "10px",
            background: "repeating-linear-gradient(90deg, #FAF6EE 0px, #FAF6EE 10px, #C8956C 10px, #C8956C 11px)",
            opacity: 0.3,
          }} />

          <div style={{ padding: "20px 24px" }}>
            {/* Order meta */}
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
              <span style={{ fontSize: "11px", color: "#8A7060", letterSpacing: "1px", textTransform: "uppercase" }}>Order</span>
              <span style={{ fontSize: "12px", fontWeight: "700", color: "#3A2A18", letterSpacing: "1px" }}>{orderId}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
              <span style={{ fontSize: "11px", color: "#8A7060" }}>Time</span>
              <span style={{ fontSize: "11px", color: "#3A2A18" }}>{orderTime}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
              <span style={{ fontSize: "11px", color: "#8A7060" }}>Barista</span>
              <span style={{ fontSize: "11px", color: "#3A2A18" }}>{barista}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
              <span style={{ fontSize: "11px", color: "#8A7060" }}>Location</span>
              <span style={{ fontSize: "11px", color: "#3A2A18" }}>{table}</span>
            </div>

            {/* Divider */}
            <div style={{ borderTop: "1px dashed #D0B890", marginBottom: "16px" }} />

            {/* Items */}
            {receiptItems.map((item) => (
              <div key={item.id} style={{ marginBottom: "14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <span style={{ fontSize: "14px", fontWeight: "600", color: "#1A1208" }}>
                      {item.qty > 1 && <span style={{ color: "#C8956C", marginRight: "5px" }}>{item.qty}×</span>}
                      {item.name}
                    </span>
                    {item.size && (
                      <span style={{ fontSize: "11px", color: "#9A8070", marginLeft: "6px" }}>({item.size})</span>
                    )}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginTop: "5px" }}>
                      {item.mods.map((m, mi) => (
                        <span key={mi} style={{
                          fontSize: "10px", background: "#EDE0C8",
                          color: "#7A5A3A", padding: "2px 7px", borderRadius: "99px",
                          letterSpacing: "0.3px",
                        }}>{m}</span>
                      ))}
                    </div>
                  </div>
                  <span style={{ fontSize: "14px", fontWeight: "600", color: "#1A1208", whiteSpace: "nowrap", marginLeft: "12px" }}>
                    ${(item.price * item.qty).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}

            {/* Divider */}
            <div style={{ borderTop: "1px dashed #D0B890", margin: "14px 0" }} />

            {/* Totals */}
            {[["Subtotal", subtotal], ["Tax (8%)", tax]].map(([label, val]) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                <span style={{ fontSize: "12px", color: "#7A6050" }}>{label}</span>
                <span style={{ fontSize: "12px", color: "#5A4A38" }}>${val.toFixed(2)}</span>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
              <span style={{ fontSize: "12px", color: "#7A6050" }}>Tip ({tipPct}%)</span>
              <span style={{ fontSize: "12px", color: "#5A4A38" }}>${tipAmount.toFixed(2)}</span>
            </div>

            <div style={{ borderTop: "2px solid #C8956C", margin: "10px 0 14px" }} />

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "16px", fontWeight: "700", color: "#1A1208" }}>TOTAL</span>
              <span style={{ fontSize: "22px", fontWeight: "700", color: "#C8956C" }}>${total.toFixed(2)}</span>
            </div>

            {/* Payment method */}
            <div style={{
              marginTop: "14px", background: "#EDE0C8",
              borderRadius: "8px", padding: "10px 14px",
              display: "flex", alignItems: "center", gap: "10px",
            }}>
              <span style={{ fontSize: "16px" }}>{payIcons[payMethod]}</span>
              <div>
                <div style={{ fontSize: "10px", color: "#8A7060", letterSpacing: "1px", textTransform: "uppercase" }}>Paid via</div>
                <div style={{ fontSize: "13px", fontWeight: "600", color: "#3A2A18" }}>{payLabels[payMethod]}</div>
              </div>
              <div style={{ marginLeft: "auto" }}>
                <span style={{
                  fontSize: "10px", background: "#6B8E6B", color: "#fff",
                  padding: "3px 8px", borderRadius: "99px", letterSpacing: "1px", textTransform: "uppercase",
                }}>Paid ✓</span>
              </div>
            </div>

            {/* Loyalty points earned */}
            <div style={{
              marginTop: "10px", background: "rgba(200,149,108,0.12)",
              border: "1px dashed #C8956C", borderRadius: "8px",
              padding: "10px 14px", display: "flex", alignItems: "center", gap: "10px",
            }}>
              <span style={{ fontSize: "18px" }}>🎁</span>
              <div>
                <div style={{ fontSize: "11px", color: "#8A7060" }}>Loyalty Points Earned</div>
                <div style={{ fontSize: "13px", fontWeight: "700", color: "#C8956C" }}>+{Math.floor(total)} pts · Total: 1,284 pts</div>
              </div>
            </div>

            {/* Barcode */}
            <div style={{ textAlign: "center", marginTop: "18px" }}>
              <div style={{
                display: "inline-flex", gap: "2px", alignItems: "flex-end", marginBottom: "4px",
              }}>
                {[3,5,2,7,4,6,3,8,2,5,4,7,3,6,5,2,4,7,3,5,6,2,4,8,3].map((h, i) => (
                  <div key={i} style={{ width: "2px", height: `${h * 4}px`, background: "#3A2A18", borderRadius: "1px" }} />
                ))}
              </div>
              <div style={{ fontSize: "10px", color: "#9A8070", letterSpacing: "3px" }}>2026-04871-0517</div>
            </div>

            <div style={{ textAlign: "center", marginTop: "14px", fontSize: "11px", color: "#9A8070", fontStyle: "italic" }}>
              Thank you for visiting Brew & Co.!<br />
              <span style={{ color: "#C8956C" }}>★★★★★</span> Rate your experience
            </div>
          </div>
        </div>

        {/* RIGHT — Controls Panel */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

          {/* Tip selector */}
          <div style={{
            background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "12px", padding: "20px",
          }}>
            <div style={{ fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", color: "#8A6A4A", marginBottom: "14px", fontFamily: "sans-serif" }}>Select Tip</div>
            <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
              {[10, 15, 20, 25].map((pct) => (
                <button key={pct} onClick={() => { setTipPct(pct); setCustomTip(""); }} style={{
                  flex: 1, padding: "10px 0", borderRadius: "8px", border: "none", cursor: "pointer",
                  background: tipPct === pct && customTip === "" ? "#C8956C" : "rgba(255,255,255,0.07)",
                  color: tipPct === pct && customTip === "" ? "#fff" : "#A89070",
                  fontSize: "14px", fontWeight: "600", transition: "all 0.15s",
                }}>{pct}%</button>
              ))}
            </div>
            <input
              type="number"
              placeholder="Custom tip ($)"
              value={customTip}
              onChange={e => { setCustomTip(e.target.value); setTipPct(0); }}
              style={{
                width: "100%", padding: "10px 14px", borderRadius: "8px",
                background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)",
                color: "#F0E0C8", fontSize: "13px", outline: "none",
                fontFamily: "sans-serif", boxSizing: "border-box",
              }}
            />
          </div>

          {/* Payment method */}
          <div style={{
            background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "12px", padding: "20px",
          }}>
            <div style={{ fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", color: "#8A6A4A", marginBottom: "14px", fontFamily: "sans-serif" }}>Payment Method</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {[["card","💳","Visa •••• 4821"], ["apple","","Apple Pay"], ["google","G","Google Pay"], ["cash","💵","Cash"], ["wallet","👛","Loyalty Wallet"]].map(([id, icon, label]) => (
                <div key={id} onClick={() => setPayMethod(id)} style={{
                  display: "flex", alignItems: "center", gap: "12px",
                  padding: "10px 14px", borderRadius: "8px", cursor: "pointer",
                  background: payMethod === id ? "rgba(200,149,108,0.15)" : "rgba(255,255,255,0.04)",
                  border: payMethod === id ? "1px solid rgba(200,149,108,0.4)" : "1px solid rgba(255,255,255,0.07)",
                  transition: "all 0.15s",
                }}>
                  <span style={{ fontSize: "18px", width: "24px", textAlign: "center" }}>{icon}</span>
                  <span style={{ fontSize: "13px", color: payMethod === id ? "#F0E0C8" : "#8A7060", fontFamily: "sans-serif" }}>{label}</span>
                  {payMethod === id && <span style={{ marginLeft: "auto", color: "#C8956C", fontSize: "16px" }}>●</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Order summary card */}
          <div style={{
            background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "12px", padding: "20px",
          }}>
            <div style={{ fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", color: "#8A6A4A", marginBottom: "14px", fontFamily: "sans-serif" }}>Summary</div>
            {[["Subtotal", `$${subtotal.toFixed(2)}`], ["Tax (8%)", `$${tax.toFixed(2)}`], ["Tip", `$${tipAmount.toFixed(2)}`]].map(([l,v]) => (
              <div key={l} style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ fontSize: "13px", color: "#8A7060", fontFamily: "sans-serif" }}>{l}</span>
                <span style={{ fontSize: "13px", color: "#C0A880", fontFamily: "sans-serif" }}>{v}</span>
              </div>
            ))}
            <div style={{ borderTop: "1px solid rgba(200,149,108,0.2)", paddingTop: "10px", marginTop: "4px", display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: "15px", fontWeight: "700", color: "#F0E0C8", fontFamily: "sans-serif" }}>Total</span>
              <span style={{ fontSize: "20px", fontWeight: "700", color: "#C8956C", fontFamily: "sans-serif" }}>${total.toFixed(2)}</span>
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", gap: "10px" }}>
            <button onClick={() => { setPrinted(true); setTimeout(() => setPrinted(false), 2500); }} style={{
              flex: 1, padding: "13px", borderRadius: "10px", border: "1px solid rgba(200,149,108,0.3)",
              background: "rgba(200,149,108,0.1)", color: "#C8956C", fontSize: "13px",
              fontWeight: "600", cursor: "pointer", transition: "all 0.2s", fontFamily: "sans-serif",
            }}>
              {printed ? "✓ Printing…" : "🖨️ Print Receipt"}
            </button>
            <button onClick={() => { setEmailSent(true); setTimeout(() => setEmailSent(false), 2500); }} style={{
              flex: 1, padding: "13px", borderRadius: "10px", border: "none",
              background: emailSent ? "#6B8E6B" : "#C8956C", color: "#fff", fontSize: "13px",
              fontWeight: "600", cursor: "pointer", transition: "all 0.2s", fontFamily: "sans-serif",
            }}>
              {emailSent ? "✓ Sent!" : "📧 Email Receipt"}
            </button>
          </div>

          {/* Receipt features list */}
          <div style={{
            background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: "12px", padding: "18px",
          }}>
            <div style={{ fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", color: "#8A6A4A", marginBottom: "12px", fontFamily: "sans-serif" }}>Receipt Features</div>
            {[
              ["🖨️", "Thermal print & digital delivery"],
              ["📧", "Email / SMS receipt options"],
              ["📱", "QR code for order history"],
              ["🎁", "Loyalty points auto-credited"],
              ["↩️", "One-tap reorder from receipt"],
              ["⭐", "In-receipt rating & feedback"],
            ].map(([icon, label]) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "9px" }}>
                <span style={{ fontSize: "15px", width: "22px" }}>{icon}</span>
                <span style={{ fontSize: "12px", color: "#A89070", fontFamily: "sans-serif" }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

  return (
    <div style={{
      fontFamily: "'Georgia', 'Times New Roman', serif",
      background: "#1A1208",
      minHeight: "100vh",
      color: "#F5ECD7",
      padding: "0",
    }}>
      {/* ── HERO ── */}
      <div style={{
        background: "linear-gradient(135deg, #2A1A08 0%, #1A1208 40%, #0D0A05 100%)",
        borderBottom: "1px solid #3A2A18",
        padding: "60px 40px 50px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(ellipse at 30% 50%, rgba(200,149,108,0.08) 0%, transparent 60%), radial-gradient(ellipse at 70% 30%, rgba(107,142,107,0.06) 0%, transparent 50%)",
          pointerEvents: "none",
        }} />
        <div style={{
          display: "inline-block",
          background: "rgba(200,149,108,0.15)",
          border: "1px solid rgba(200,149,108,0.3)",
          borderRadius: "4px",
          padding: "4px 14px",
          fontSize: "11px",
          letterSpacing: "3px",
          textTransform: "uppercase",
          color: "#C8956C",
          marginBottom: "20px",
        }}>Implementation Blueprint</div>
        <h1 style={{
          fontSize: "clamp(28px, 5vw, 52px)",
          fontWeight: "400",
          letterSpacing: "-0.5px",
          color: "#F5ECD7",
          margin: "0 0 12px",
          lineHeight: 1.15,
        }}>Modern Cafe Ordering System</h1>
        <p style={{
          color: "#A89070",
          fontSize: "17px",
          maxWidth: "560px",
          margin: "0 auto",
          lineHeight: 1.6,
          fontStyle: "italic",
        }}>13 integrated modules · 5 implementation phases · built for scale</p>

        {/* Stats bar */}
        <div style={{
          display: "flex", justifyContent: "center", gap: "40px",
          marginTop: "40px", flexWrap: "wrap",
        }}>
          {[["13", "Modules"], ["5", "Phases"], ["17+", "Weeks"], ["99.9%", "Uptime Target"]].map(([n, l]) => (
            <div key={l} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "28px", fontWeight: "300", color: "#C8956C", letterSpacing: "-1px" }}>{n}</div>
              <div style={{ fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", color: "#7A6050", marginTop: "2px" }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── MODULES GRID ── */}
      <div style={{ padding: "50px 30px 30px", maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{
          display: "flex", alignItems: "center", gap: "16px", marginBottom: "30px",
        }}>
          <div style={{ flex: 1, height: "1px", background: "rgba(200,149,108,0.2)" }} />
          <h2 style={{ fontSize: "12px", letterSpacing: "4px", textTransform: "uppercase", color: "#8A6A4A", margin: 0, whiteSpace: "nowrap" }}>System Modules</h2>
          <div style={{ flex: 1, height: "1px", background: "rgba(200,149,108,0.2)" }} />
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))",
          gap: "16px",
        }}>
          {modules.map((mod) => (
            <div
              key={mod.id}
              onClick={() => setActiveModule(activeModule === mod.id ? null : mod.id)}
              style={{
                background: activeModule === mod.id
                  ? `linear-gradient(135deg, ${mod.color}22, ${mod.color}11)`
                  : "rgba(255,255,255,0.03)",
                border: activeModule === mod.id
                  ? `1px solid ${mod.color}55`
                  : "1px solid rgba(255,255,255,0.07)",
                borderRadius: "12px",
                padding: "22px",
                cursor: "pointer",
                transition: "all 0.25s ease",
                position: "relative",
                overflow: "hidden",
              }}
              onMouseEnter={e => {
                if (activeModule !== mod.id) {
                  e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                  e.currentTarget.style.border = `1px solid ${mod.color}33`;
                }
              }}
              onMouseLeave={e => {
                if (activeModule !== mod.id) {
                  e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                  e.currentTarget.style.border = "1px solid rgba(255,255,255,0.07)";
                }
              }}
            >
              {activeModule === mod.id && (
                <div style={{
                  position: "absolute", top: 0, right: 0,
                  width: "80px", height: "80px",
                  background: `radial-gradient(circle at top right, ${mod.color}20, transparent)`,
                  pointerEvents: "none",
                }} />
              )}
              <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
                <div style={{
                  width: "42px", height: "42px",
                  background: `${mod.color}20`,
                  border: `1px solid ${mod.color}40`,
                  borderRadius: "10px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "20px", flexShrink: 0,
                }}>
                  {mod.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: "10px", letterSpacing: "2.5px",
                    textTransform: "uppercase", color: mod.color,
                    marginBottom: "4px", fontFamily: "sans-serif",
                  }}>{mod.tag}</div>
                  <div style={{ fontSize: "16px", fontWeight: "600", color: "#F0E0C8", lineHeight: 1.2 }}>{mod.title}</div>
                </div>
                <div style={{
                  color: activeModule === mod.id ? mod.color : "#4A3A28",
                  fontSize: "18px", transition: "transform 0.2s",
                  transform: activeModule === mod.id ? "rotate(180deg)" : "rotate(0deg)",
                  lineHeight: 1,
                }}>⌄</div>
              </div>

              {activeModule === mod.id && (
                <div style={{ marginTop: "18px" }}>
                  <p style={{ color: "#C0A880", fontSize: "14px", lineHeight: 1.65, margin: "0 0 14px", fontStyle: "italic" }}>
                    {mod.desc}
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {mod.features.map((f, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                        <div style={{
                          width: "6px", height: "6px",
                          background: mod.color,
                          borderRadius: "50%",
                          marginTop: "6px", flexShrink: 0,
                        }} />
                        <span style={{ fontSize: "13px", color: "#D0B890", lineHeight: 1.5, fontFamily: "sans-serif" }}>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── PHASES ── */}
      <div style={{ padding: "20px 30px 50px", maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "30px" }}>
          <div style={{ flex: 1, height: "1px", background: "rgba(200,149,108,0.2)" }} />
          <h2 style={{ fontSize: "12px", letterSpacing: "4px", textTransform: "uppercase", color: "#8A6A4A", margin: 0, whiteSpace: "nowrap" }}>Implementation Phases</h2>
          <div style={{ flex: 1, height: "1px", background: "rgba(200,149,108,0.2)" }} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))", gap: "12px" }}>
          {phases.map((p, i) => (
            <div
              key={i}
              onClick={() => setActivePhase(activePhase === i ? null : i)}
              style={{
                background: activePhase === i
                  ? "linear-gradient(135deg, rgba(200,149,108,0.18), rgba(200,149,108,0.08))"
                  : "rgba(255,255,255,0.03)",
                border: activePhase === i
                  ? "1px solid rgba(200,149,108,0.45)"
                  : "1px solid rgba(255,255,255,0.07)",
                borderRadius: "12px",
                padding: "20px 18px",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              <div style={{
                fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase",
                color: "#C8956C", marginBottom: "4px", fontFamily: "sans-serif",
              }}>{p.week}</div>
              <div style={{ fontSize: "15px", fontWeight: "600", color: "#F0E0C8", marginBottom: "12px" }}>
                Phase {i + 1}: {p.label}
              </div>
              {activePhase === i && (
                <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
                  {p.items.map((item, j) => (
                    <div key={j} style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                      <div style={{ color: "#C8956C", fontSize: "12px", marginTop: "1px", flexShrink: 0, fontFamily: "sans-serif" }}>✓</div>
                      <span style={{ fontSize: "12px", color: "#C0A080", lineHeight: 1.4, fontFamily: "sans-serif" }}>{item}</span>
                    </div>
                  ))}
                </div>
              )}
              {activePhase !== i && (
                <div style={{ fontSize: "12px", color: "#5A4A38", fontFamily: "sans-serif" }}>{p.items.length} deliverables →</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── ORDER RECEIPT ── */}
      <OrderReceipt />

      {/* ── KPI STRIP ── */}
      <div style={{
        background: "rgba(200,149,108,0.06)",
        borderTop: "1px solid rgba(200,149,108,0.15)",
        borderBottom: "1px solid rgba(200,149,108,0.15)",
        padding: "30px 30px",
      }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", color: "#8A6A4A", textAlign: "center", marginBottom: "22px", fontFamily: "sans-serif" }}>Success Targets</div>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "12px" }}>
            {[
              ["≥ 98%", "Order Accuracy"],
              ["< 4 min", "Avg Order Time"],
              ["≥ 60%", "Digital Adoption"],
              ["≥ 40%", "Monthly Return Rate"],
              ["+15%", "Avg Order Value"],
              ["≥ 99.9%", "System Uptime"],
            ].map(([v, l]) => (
              <div key={l} style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(200,149,108,0.2)",
                borderRadius: "8px",
                padding: "14px 22px",
                textAlign: "center",
                minWidth: "130px",
              }}>
                <div style={{ fontSize: "22px", color: "#C8956C", fontWeight: "300", letterSpacing: "-0.5px" }}>{v}</div>
                <div style={{ fontSize: "11px", color: "#7A6050", letterSpacing: "1px", marginTop: "4px", fontFamily: "sans-serif", textTransform: "uppercase" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <div style={{ textAlign: "center", padding: "30px", color: "#4A3A28", fontSize: "12px", fontFamily: "sans-serif", letterSpacing: "1px" }}>
        ☕ Click any module or phase card to expand details
      </div>
    </div>
  );
}
