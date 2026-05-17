import React, { useState } from "react";
import OrderReceipt from "./OrderReceipt";

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

export default function BlueprintView({ onSwitchToDemo }) {
  const [activeModule, setActiveModule] = useState(null);
  const [activePhase, setActivePhase] = useState(null);

  return (
    <div style={{
      background: "#1A1208",
      minHeight: "100vh",
      color: "#F5ECD7",
      padding: "0 0 60px",
    }}>
      {/* ── HERO ── */}
      <div style={{
        background: "linear-gradient(135deg, #2A1A08 0%, #1A1208 40%, #0D0A05 100%)",
        borderBottom: "1px solid #3A2A18",
        padding: "60px 24px 50px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(ellipse at 30% 50%, rgba(200,149,108,0.08) 0%, transparent 60%), radial-gradient(ellipse at 70% 30%, rgba(107,142,107,0.06) 0%, transparent 50%)",
          pointerEvents: "none",
        }} />
        <div className="title-badge" style={{ marginBottom: "20px" }}>Implementation Blueprint</div>
        <h1 style={{
          fontSize: "clamp(32px, 5vw, 54px)",
          fontWeight: "300",
          letterSpacing: "-0.5px",
          color: "#F5ECD7",
          margin: "0 0 12px",
          lineHeight: 1.15,
        }}>Modern Cafe Ordering System</h1>
        <p style={{
          color: "#A89070",
          fontSize: "17px",
          maxWidth: "600px",
          margin: "0 auto 24px",
          lineHeight: 1.6,
          fontStyle: "italic",
        }}>13 integrated modules · 5 implementation phases · built for scale</p>
        
        {/* Proactive CTA to launch Interactive System Simulation */}
        <button 
          onClick={onSwitchToDemo} 
          className="btn-primary" 
          style={{
            padding: "12px 28px",
            borderRadius: "99px",
            fontSize: "14px",
            marginTop: "10px"
          }}
        >
          ⚡ Launch Interactive Live Demo
        </button>

        {/* Stats bar */}
        <div style={{
          display: "flex", justifyContent: "center", gap: "40px",
          marginTop: "45px", flexWrap: "wrap",
        }}>
          {[["13", "Modules"], ["5", "Phases"], ["17+", "Weeks"], ["99.9%", "Uptime Target"]].map(([n, l]) => (
            <div key={l} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "28px", fontWeight: "300", color: "#C8956C", letterSpacing: "-1px", fontFamily: "var(--font-sans)" }}>{n}</div>
              <div style={{ fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", color: "#7A6050", marginTop: "2px" }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── MODULES GRID ── */}
      <div style={{ padding: "50px 24px 30px", maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{
          display: "flex", alignItems: "center", gap: "16px", marginBottom: "35px",
        }}>
          <div style={{ flex: 1, height: "1px", background: "rgba(200,149,108,0.2)" }} />
          <h2 style={{ fontSize: "12px", letterSpacing: "4px", textTransform: "uppercase", color: "#8A6A4A", margin: 0, whiteSpace: "nowrap" }}>System Modules</h2>
          <div style={{ flex: 1, height: "1px", background: "rgba(200,149,108,0.2)" }} />
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))",
          gap: "18px",
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
                borderRadius: "14px",
                padding: "24px",
                cursor: "pointer",
                transition: "all 0.25s ease",
                position: "relative",
                overflow: "hidden",
                boxShadow: activeModule === mod.id ? `0 10px 30px ${mod.color}15` : 'none'
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
                  width: "44px", height: "44px",
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
                    marginBottom: "4px", fontFamily: "var(--font-sans)",
                    fontWeight: '600'
                  }}>{mod.tag}</div>
                  <div style={{ fontSize: "17px", fontWeight: "400", color: "#F0E0C8", lineHeight: 1.2, fontFamily: "var(--font-serif)" }}>{mod.title}</div>
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
                        <span style={{ fontSize: "13px", color: "#D0B890", lineHeight: 1.5, fontFamily: "var(--font-sans)" }}>{f}</span>
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
      <div style={{ padding: "20px 24px 50px", maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "35px" }}>
          <div style={{ flex: 1, height: "1px", background: "rgba(200,149,108,0.2)" }} />
          <h2 style={{ fontSize: "12px", letterSpacing: "4px", textTransform: "uppercase", color: "#8A6A4A", margin: 0, whiteSpace: "nowrap" }}>Implementation Phases</h2>
          <div style={{ flex: 1, height: "1px", background: "rgba(200,149,108,0.2)" }} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))", gap: "14px" }}>
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
                borderRadius: "14px",
                padding: "20px 18px",
                cursor: "pointer",
                transition: "all 0.2s",
                boxShadow: activePhase === i ? "0 5px 15px rgba(200,149,108,0.05)" : "none"
              }}
            >
              <div style={{
                fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase",
                color: "#C8956C", marginBottom: "4px", fontFamily: "var(--font-sans)",
                fontWeight: '600'
              }}>{p.week}</div>
              <div style={{ fontSize: "15px", fontWeight: "600", color: "#F0E0C8", marginBottom: "12px", fontFamily: "var(--font-serif)" }}>
                Phase {i + 1}: {p.label}
              </div>
              {activePhase === i && (
                <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
                  {p.items.map((item, j) => (
                    <div key={j} style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                      <div style={{ color: "#C8956C", fontSize: "12px", marginTop: "1px", flexShrink: 0, fontFamily: "sans-serif" }}>✓</div>
                      <span style={{ fontSize: "12px", color: "#C0A080", lineHeight: 1.4, fontFamily: "var(--font-sans)" }}>{item}</span>
                    </div>
                  ))}
                </div>
              )}
              {activePhase !== i && (
                <div style={{ fontSize: "12px", color: "#7A6050", fontFamily: "var(--font-sans)" }}>{p.items.length} deliverables →</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── ORDER RECEIPT SECTION ── */}
      <OrderReceipt />

      {/* ── KPI STRIP ── */}
      <div style={{
        background: "rgba(200,149,108,0.04)",
        borderTop: "1px solid rgba(200,149,108,0.12)",
        borderBottom: "1px solid rgba(200,149,108,0.12)",
        padding: "40px 24px",
        marginTop: "40px"
      }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", color: "#8A6A4A", textAlign: "center", marginBottom: "26px", fontFamily: "var(--font-sans)", fontWeight: '600' }}>Success Targets</div>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "14px" }}>
            {[
              ["≥ 98%", "Order Accuracy"],
              ["< 4 min", "Avg Order Time"],
              ["≥ 60%", "Digital Adoption"],
              ["≥ 40%", "Monthly Return Rate"],
              ["+15%", "Avg Order Value"],
              ["≥ 99.9%", "System Uptime"],
            ].map(([v, l]) => (
              <div key={l} style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(200,149,108,0.15)",
                borderRadius: "10px",
                padding: "16px 20px",
                textAlign: "center",
                minWidth: "140px",
                flex: "1 1 140px"
              }}>
                <div style={{ fontSize: "24px", color: "#C8956C", fontWeight: "300", letterSpacing: "-0.5px", fontFamily: "var(--font-sans)" }}>{v}</div>
                <div style={{ fontSize: "10px", color: "#7A6050", letterSpacing: "1px", marginTop: "4px", fontFamily: "var(--font-sans)", textTransform: "uppercase", fontWeight: '600' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <div style={{ textAlign: "center", padding: "40px 24px 10px", color: "#5A4A38", fontSize: "12px", fontFamily: "var(--font-sans)", letterSpacing: "1px" }}>
        ☕ Click any module or phase card to expand details
      </div>
    </div>
  );
}
