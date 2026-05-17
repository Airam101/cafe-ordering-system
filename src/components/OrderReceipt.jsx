import React, { useState } from "react";

const seedReceiptItems = [
  { id: 1, name: "Flat White", size: "M", mods: ["Oat milk", "Medium roast", "1 vanilla pump"], qty: 1, price: 5.50 },
  { id: 2, name: "Cold Brew", size: "L", mods: ["No sugar", "Extra ice"], qty: 1, price: 6.00 },
  { id: 3, name: "Almond Croissant", size: null, mods: ["Warmed"], qty: 2, price: 4.25 },
];

export default function OrderReceipt({ order, onCompleteClose }) {
  const [tipPct, setTipPct] = useState(15);
  const [customTip, setCustomTip] = useState("");
  const [payMethod, setPayMethod] = useState("card");
  const [printed, setPrinted] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  // If dynamic order is passed, use it, otherwise fall back to seed data
  const items = order ? order.items : seedReceiptItems;
  const orderId = order ? order.id : "ORD-2026-04871";
  const orderTime = order ? order.time : "10:32 AM, May 17 2026";
  const barista = order ? order.barista : "Sarah K.";
  const table = order ? (order.table || "Table 07") : "Table 07";
  const appliedDiscount = order ? order.discountAmount : 0;

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const tax = subtotal * 0.08;
  const tipAmount = customTip !== "" ? parseFloat(customTip) || 0 : (subtotal - appliedDiscount) * (tipPct / 100);
  const total = Math.max(0, subtotal - appliedDiscount + tax + tipAmount);

  const payIcons = { card: "💳", apple: "🍎", google: "G", cash: "💵", wallet: "👛" };
  const payLabels = { card: "Visa •••• 4821", apple: "Apple Pay", google: "Google Pay", cash: "Cash", wallet: "Loyalty Wallet" };

  const handlePrint = () => {
    setPrinted(true);
    setTimeout(() => {
      setPrinted(false);
    }, 2500);
  };

  const handleEmail = () => {
    setEmailSent(true);
    setTimeout(() => {
      setEmailSent(false);
    }, 2500);
  };

  return (
    <div style={{ padding: "20px 0 50px", maxWidth: "1100px", margin: "0 auto" }}>
      {/* Section Header */}
      {!order && (
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "30px" }}>
          <div style={{ flex: 1, height: "1px", background: "rgba(200,149,108,0.2)" }} />
          <h2 style={{ fontSize: "12px", letterSpacing: "4px", textTransform: "uppercase", color: "#8A6A4A", margin: 0, whiteSpace: "nowrap", fontFamily: "var(--font-sans)", fontWeight: '600' }}>Sample Interactive Receipt</h2>
          <div style={{ flex: 1, height: "1px", background: "rgba(200,149,108,0.2)" }} />
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "30px", alignItems: "start" }}>

        {/* LEFT — Receipt Slip */}
        <div style={{
          background: "#FAF6EE",
          borderRadius: "14px",
          overflow: "hidden",
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
          color: "#1A1208",
          fontFamily: "var(--font-sans)",
        }}>
          {/* Receipt top notch */}
          <div style={{ background: "#C8956C", padding: "24px 24px 18px", textAlign: "center" }}>
            <div style={{ fontSize: "28px", marginBottom: "6px" }}>☕</div>
            <div style={{ fontSize: "20px", fontWeight: "700", color: "#fff", letterSpacing: "1.5px", fontFamily: "var(--font-serif)" }}>BREW & CO.</div>
            <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.75)", letterSpacing: "1px", marginTop: "4px" }}>123 Espresso Lane, Downtown</div>
          </div>

          {/* Zigzag tear visual */}
          <div style={{
            height: "8px",
            background: "repeating-linear-gradient(90deg, transparent, transparent 4px, #C8956C 4px, #C8956C 8px)",
            opacity: 0.15,
            borderBottom: "1px dashed rgba(0,0,0,0.1)"
          }} />

          <div style={{ padding: "24px" }}>
            {/* Order meta */}
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
              <span style={{ fontSize: "11px", color: "#8A7060", letterSpacing: "1px", textTransform: "uppercase", fontWeight: '600' }}>Order</span>
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {items.map((item, idx) => (
                <div key={idx}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: "14px", fontWeight: "600", color: "#1A1208" }}>
                        {item.qty > 1 && <span style={{ color: "#C8956C", marginRight: "5px" }}>{item.qty}×</span>}
                        {item.name}
                      </span>
                      {item.size && (
                        <span style={{ fontSize: "11px", color: "#9A8070", marginLeft: "6px" }}>({item.size})</span>
                      )}
                      
                      {item.mods && item.mods.length > 0 && (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginTop: "5px" }}>
                          {item.mods.map((m, mi) => (
                            <span key={mi} style={{
                              fontSize: "9px",
                              background: "#EDE0C8",
                              color: "#7A5A3A",
                              padding: "2px 7px",
                              borderRadius: "99px",
                              letterSpacing: "0.2px",
                              fontWeight: '600'
                            }}>{m}</span>
                          ))}
                        </div>
                      )}
                    </div>
                    <span style={{ fontSize: "14px", fontWeight: "600", color: "#1A1208", whiteSpace: "nowrap", marginLeft: "12px" }}>
                      ${((item.price) * item.qty).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div style={{ borderTop: "1px dashed #D0B890", margin: "16px 0" }} />

            {/* Totals */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: "12px", color: "#7A6050" }}>Subtotal</span>
                <span style={{ fontSize: "12px", color: "#5A4A38" }}>${subtotal.toFixed(2)}</span>
              </div>
              
              {appliedDiscount > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "12px", color: "#A84E32" }}>Discount code applied</span>
                  <span style={{ fontSize: "12px", color: "#A84E32" }}>-${appliedDiscount.toFixed(2)}</span>
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: "12px", color: "#7A6050" }}>Tax (8%)</span>
                <span style={{ fontSize: "12px", color: "#5A4A38" }}>${tax.toFixed(2)}</span>
              </div>
              
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: "12px", color: "#7A6050" }}>Tip ({tipPct > 0 ? `${tipPct}%` : 'Custom'})</span>
                <span style={{ fontSize: "12px", color: "#5A4A38" }}>${tipAmount.toFixed(2)}</span>
              </div>
            </div>

            <div style={{ borderTop: "2px solid #C8956C", margin: "12px 0" }} />

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "16px", fontWeight: "700", color: "#1A1208", letterSpacing: '0.5px' }}>TOTAL PAID</span>
              <span style={{ fontSize: "24px", fontWeight: "700", color: "#C8956C" }}>${total.toFixed(2)}</span>
            </div>

            {/* Payment method */}
            <div style={{
              marginTop: "16px", background: "#EDE0C8",
              borderRadius: "8px", padding: "10px 14px",
              display: "flex", alignItems: "center", gap: "10px",
            }}>
              <span style={{ fontSize: "16px" }}>{payIcons[payMethod] || "💳"}</span>
              <div>
                <div style={{ fontSize: "10px", color: "#8A7060", letterSpacing: "1px", textTransform: "uppercase", fontWeight: '600' }}>Paid via</div>
                <div style={{ fontSize: "13px", fontWeight: "600", color: "#3A2A18" }}>{payLabels[payMethod]}</div>
              </div>
              <div style={{ marginLeft: "auto" }}>
                <span style={{
                  fontSize: "10px", background: "#6B8E6B", color: "#fff",
                  padding: "3px 8px", borderRadius: "99px", letterSpacing: "1px", textTransform: "uppercase",
                  fontWeight: '600'
                }}>SUCCESS ✓</span>
              </div>
            </div>

            {/* Loyalty points earned */}
            <div style={{
              marginTop: "10px", background: "rgba(200,149,108,0.1)",
              border: "1px dashed #C8956C", borderRadius: "8px",
              padding: "10px 14px", display: "flex", alignItems: "center", gap: "10px",
            }}>
              <span style={{ fontSize: "18px" }}>🎁</span>
              <div>
                <div style={{ fontSize: "11px", color: "#8A7060" }}>Loyalty Points Earned</div>
                <div style={{ fontSize: "13px", fontWeight: "700", color: "#C8956C" }}>+{Math.floor(total)} pts · Balance: 1,324 pts</div>
              </div>
            </div>

            {/* Barcode */}
            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <div style={{
                display: "inline-flex", gap: "2.2px", alignItems: "flex-end", marginBottom: "4px",
              }}>
                {[3,5,2,7,4,6,3,8,2,5,4,7,3,6,5,2,4,7,3,5,6,2,4,8,3,4,2,6].map((h, i) => (
                  <div key={i} style={{ width: "2px", height: `${h * 4.2}px`, background: "#3A2A18", borderRadius: "1px" }} />
                ))}
              </div>
              <div style={{ fontSize: "9px", color: "#9A8070", letterSpacing: "3px" }}>2026-ORD-4871-OS</div>
            </div>

            <div style={{ textAlign: "center", marginTop: "16px", fontSize: "11px", color: "#9A8070", fontStyle: "italic" }}>
              Thank you for visiting Brew & Co.!<br />
              <span style={{ color: "#C8956C" }}>★★★★★</span> Rate your experience in our PWA
            </div>
          </div>
        </div>

        {/* RIGHT — Controls Panel */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

          {/* Tip selector */}
          <div className="glass-panel" style={{
            borderRadius: "12px", padding: "20px",
          }}>
            <div style={{ fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", color: "#C8956C", marginBottom: "14px", fontFamily: "var(--font-sans)", fontWeight: '600' }}>Select Tip Amount</div>
            <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
              {[10, 15, 20, 25].map((pct) => (
                <button key={pct} onClick={() => { setTipPct(pct); setCustomTip(""); }} style={{
                  flex: 1, padding: "10px 0", borderRadius: "8px", border: "none", cursor: "pointer",
                  background: tipPct === pct && customTip === "" ? "#C8956C" : "rgba(255,255,255,0.06)",
                  color: tipPct === pct && customTip === "" ? "#0f0905" : "#D0B890",
                  fontSize: "13px", fontWeight: "600", transition: "all 0.15s",
                  fontFamily: 'var(--font-sans)'
                }}>{pct}%</button>
              ))}
            </div>
            <input
              type="number"
              placeholder="Or enter custom tip ($)"
              value={customTip}
              onChange={e => { setCustomTip(e.target.value); setTipPct(0); }}
              style={{
                width: "100%", padding: "10px 14px", borderRadius: "8px",
                background: "rgba(255,255,255,0.05)", border: "1px solid rgba(200,149,108,0.2)",
                color: "#F5ECD7", fontSize: "13px", outline: "none",
                fontFamily: "var(--font-sans)", boxSizing: "border-box",
              }}
            />
          </div>

          {/* Payment method */}
          <div className="glass-panel" style={{
            borderRadius: "12px", padding: "20px",
          }}>
            <div style={{ fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", color: "#C8956C", marginBottom: "14px", fontFamily: "var(--font-sans)", fontWeight: '600' }}>Payment Method</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {[
                ["card","💳","Visa •••• 4821"], 
                ["apple","🍎","Apple Pay"], 
                ["google","G","Google Pay"], 
                ["cash","💵","Cash / Split"], 
                ["wallet","👛","Stored Loyalty Wallet"]
              ].map(([id, icon, label]) => (
                <div key={id} onClick={() => setPayMethod(id)} style={{
                  display: "flex", alignItems: "center", gap: "12px",
                  padding: "10px 14px", borderRadius: "8px", cursor: "pointer",
                  background: payMethod === id ? "rgba(200,149,108,0.15)" : "rgba(255,255,255,0.02)",
                  border: payMethod === id ? "1px solid rgba(200,149,108,0.4)" : "1px solid rgba(255,255,255,0.05)",
                  transition: "all 0.15s",
                }}>
                  <span style={{ fontSize: "16px", width: "24px", textAlign: "center" }}>{icon}</span>
                  <span style={{ fontSize: "13px", color: payMethod === id ? "#F5ECD7" : "#8A7060", fontFamily: "var(--font-sans)", fontWeight: payMethod === id ? '600' : '400' }}>{label}</span>
                  {payMethod === id && <span style={{ marginLeft: "auto", color: "#C8956C", fontSize: "14px" }}>●</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", gap: "10px" }}>
            <button onClick={handlePrint} className="btn-secondary" style={{
              flex: 1, padding: "13px", borderRadius: "10px", fontSize: "13px",
            }}>
              {printed ? "🖨️ Printing…" : "🖨️ Print Receipt"}
            </button>
            <button onClick={handleEmail} className="btn-primary" style={{
              flex: 1, padding: "13px", borderRadius: "10px", fontSize: "13px",
              background: emailSent ? "#6B8E6B" : "#C8956C",
              color: emailSent ? '#fff' : 'var(--bg-espresso)'
            }}>
              {emailSent ? "✓ Sent to Email!" : "📧 Email Receipt"}
            </button>
          </div>

          {order && onCompleteClose && (
            <button 
              onClick={onCompleteClose} 
              className="btn-primary" 
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                background: 'transparent',
                border: '1px solid #C8956C',
                color: '#C8956C',
                fontSize: '13px',
                fontWeight: '600',
                marginTop: '10px'
              }}
            >
              Close Receipt & Track Order Status
            </button>
          )}

          {/* Receipt features list */}
          <div className="glass-panel" style={{
            borderRadius: "12px", padding: "18px",
          }}>
            <div style={{ fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", color: "#8A6A4A", marginBottom: "12px", fontFamily: "var(--font-sans)", fontWeight: '600' }}>Receipt Specifications</div>
            {[
              ["🖨️", "Eco-friendly thermal printing integration"],
              ["📧", "Instant digital delivery (SMS / Email)"],
              ["📱", "Dynamic status tracking via QR code link"],
              ["🎁", "Loyalty point auto-crediting ledger"],
              ["⭐", "In-receipt guest satisfaction review system"],
            ].map(([icon, label]) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "9px" }}>
                <span style={{ fontSize: "15px", width: "22px" }}>{icon}</span>
                <span style={{ fontSize: "12.5px", color: "#A89070", fontFamily: "var(--font-sans)" }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
