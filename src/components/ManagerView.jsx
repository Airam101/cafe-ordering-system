import React, { useState, useEffect } from 'react';

export default function ManagerView({
  menu,
  onAddMenuItem,
  onUpdateMenuItem,
  onDeleteMenuItem,
  inventory,
  onRestockInventory,
  staff,
  onToggleStaffShift,
  orders,
  promotions,
  onAddPromotion,
  onTogglePromotion
}) {
  const [activeTab, setActiveTab] = useState('analytics'); // 'analytics' | 'menu' | 'inventory' | 'staff' | 'promo'
  
  // Menu CRUD Form States
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('espresso');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemCalories, setNewItemCalories] = useState('');
  const [newItemImage, setNewItemImage] = useState('☕');
  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemTags, setNewItemTags] = useState('Classic');

  // Edit Menu Item State
  const [editingItem, setEditingItem] = useState(null);
  const [editPrice, setEditPrice] = useState('');
  const [editDesc, setEditDesc] = useState('');

  // Promo Coupon State
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDiscount, setNewCouponDiscount] = useState('15');
  const [newCouponDesc, setNewCouponDesc] = useState('');

  // Flash Sale Timer State (simulates a live countdown)
  const [flashSeconds, setFlashSeconds] = useState(842); // ~14 mins
  useEffect(() => {
    const interval = setInterval(() => {
      setFlashSeconds(prev => (prev > 0 ? prev - 1 : 1200));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatFlashTime = (totalSecs) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculations for analytics
  const totalSales = orders.reduce((sum, o) => {
    const orderTotal = Math.max(0, o.subtotal - o.discountAmount + o.tax);
    return sum + orderTotal;
  }, 0);

  const totalTips = orders.reduce((sum, o) => {
    // Standard tip estimation of 15% if no order specific tip is recorded, or direct calculations
    const orderSub = o.subtotal - o.discountAmount;
    return sum + (orderSub * 0.15);
  }, 0);

  // Tip pool calculation divided evenly among currently active staff members
  const activeStaff = staff.filter(s => s.activeShift);
  const tipPoolPerStaff = activeStaff.length > 0 ? (totalTips / activeStaff.length) : 0;

  // Best seller counts
  const itemCounts = {};
  orders.forEach(o => {
    o.items.forEach(item => {
      itemCounts[item.name] = (itemCounts[item.name] || 0) + item.qty;
    });
  });
  const bestSellers = Object.entries(itemCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  // Menu Add Item Submit
  const handleAddItemSubmit = (e) => {
    e.preventDefault();
    if (!newItemName || !newItemPrice || !newItemCalories) return;

    const parsedPrice = parseFloat(newItemPrice);
    const parsedCalories = parseInt(newItemCalories);

    const createdItem = {
      id: Date.now(),
      name: newItemName,
      category: newItemCategory,
      price: isNaN(parsedPrice) ? 4.99 : parsedPrice,
      calories: isNaN(parsedCalories) ? 100 : parsedCalories,
      image: newItemImage,
      desc: newItemDesc || 'Freshly made delicious cafe craft.',
      tags: newItemTags.split(',').map(t => t.trim()),
      inStock: true
    };

    onAddMenuItem(createdItem);
    
    // Clear fields
    setNewItemName('');
    setNewItemPrice('');
    setNewItemCalories('');
    setNewItemDesc('');
    setIsAddingItem(false);
  };

  // Edit item price & description submit
  const handleEditItemSubmit = (e) => {
    e.preventDefault();
    if (!editingItem) return;
    
    const parsedPrice = parseFloat(editPrice);
    
    onUpdateMenuItem(editingItem.id, {
      price: isNaN(parsedPrice) ? editingItem.price : parsedPrice,
      desc: editDesc || editingItem.desc
    });

    setEditingItem(null);
  };

  // Coupon Add Submit
  const handleAddCouponSubmit = (e) => {
    e.preventDefault();
    if (!newCouponCode) return;

    const parsedDisc = parseInt(newCouponDiscount);
    const createdCoupon = {
      code: newCouponCode.toUpperCase(),
      discountPct: isNaN(parsedDisc) ? 15 : parsedDisc,
      description: newCouponDesc || `${newCouponDiscount}% off order!`,
      active: true
    };

    onAddPromotion(createdCoupon);
    setNewCouponCode('');
    setNewCouponDesc('');
  };

  return (
    <div className="container-max" style={{ padding: '30px 0 60px' }}>
      
      {/* Tab Selectors Row */}
      <div className="glass-panel" style={{
        borderRadius: '16px',
        padding: '16px 20px',
        marginBottom: '26px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', gap: '4px' }}>
          {[
            ['analytics', '📊 Dashboard & Reports'],
            ['menu', '📋 Menu CRUD Editor'],
            ['inventory', '📦 Ingredient Inventory'],
            ['staff', '👥 Roster & Tip Pool'],
            ['promo', '📣 Coupons & Campaigns']
          ].map(([id, label]) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              style={{
                padding: '10px 16px',
                border: 'none',
                borderRadius: '8px',
                background: activeTab === id ? '#C8956C' : 'transparent',
                color: activeTab === id ? '#0f0905' : '#D0B890',
                cursor: 'pointer',
                fontSize: '12.5px',
                fontWeight: '600',
                fontFamily: 'var(--font-sans)',
                transition: 'all 0.15s'
              }}
            >
              {label}
            </button>
          ))}
        </div>

        <div style={{
          fontSize: '12px',
          color: '#8A7060',
          fontFamily: 'var(--font-sans)'
        }}>
          ☕ OS MANAGER: <b>Elena R. (Elena R.)</b>
        </div>
      </div>

      {/* ── SUB TAB 1: DASHBOARD & REPORTS ── */}
      {activeTab === 'analytics' && (
        <div>
          {/* Key metrics grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '24px' }}>
            {[
              ['💰 Gross Sales', `$${totalSales.toFixed(2)}`, '#6B8E6B'],
              ['🎟️ Total Orders Placed', `${orders.length} tickets`, '#4A7EA5'],
              ['🥛 Low Stock Alerts', `${Object.values(inventory).filter(i => i.qty <= i.threshold).length} items`, '#A84E32'],
              ['👛 Tip Pool Collected', `$${totalTips.toFixed(2)}`, '#8B6E9E']
            ].map(([label, val, color]) => (
              <div key={label} className="glass-panel" style={{ padding: '20px', borderRadius: '12px', borderLeft: `4px solid ${color}` }}>
                <span style={{ fontSize: '12px', color: '#8A7060', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</span>
                <span style={{ fontSize: '24px', color: '#F5ECD7', fontWeight: 'bold', display: 'block', marginTop: '6px', fontFamily: 'var(--font-sans)' }}>{val}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'start' }}>
            
            {/* SVG SALES CHART */}
            <div className="glass-panel" style={{ padding: '24px', borderRadius: '14px' }}>
              <h3 style={{ fontSize: '18px', color: '#F0E0C8', marginBottom: '16px', fontFamily: 'var(--font-serif)' }}>☕ Peak Hourly Sales (SVG Render)</h3>
              <div style={{ position: 'relative', height: '200px', margin: '20px 0 10px' }}>
                {/* SVG Visual bar chart */}
                <svg viewBox="0 0 400 180" style={{ width: '100%', height: '100%' }}>
                  {/* Grid Lines */}
                  <line x1="30" y1="20" x2="380" y2="20" stroke="rgba(255,255,255,0.05)" />
                  <line x1="30" y1="70" x2="380" y2="70" stroke="rgba(255,255,255,0.05)" />
                  <line x1="30" y1="120" x2="380" y2="120" stroke="rgba(255,255,255,0.05)" />
                  <line x1="30" y1="150" x2="380" y2="150" stroke="rgba(200, 149, 108, 0.2)" strokeWidth="2" />
                  
                  {/* Bars (Peak Hours: 7am, 9am, 11am, 1pm, 3pm, 5pm) */}
                  {[
                    ['7am', 110, '#C8956C'],
                    ['9am', 160, '#C8956C'],
                    ['11am', 140, '#C8956C'],
                    ['1pm', 90, '#C8956C'],
                    ['3pm', 120, '#C8956C'],
                    ['5pm', 70, '#C8956C']
                  ].map(([label, height, color], idx) => {
                    const x = 50 + (idx * 55);
                    const y = 150 - height * 0.75;
                    return (
                      <g key={label}>
                        <rect 
                          x={x} 
                          y={y} 
                          width="24" 
                          height={height * 0.75} 
                          fill={color} 
                          opacity="0.85" 
                          rx="4"
                          style={{ transition: 'all 0.5s ease' }} 
                        />
                        {/* Values on top of bars */}
                        <text x={x + 12} y={y - 6} fill="#F5ECD7" fontSize="8" textAnchor="middle" fontFamily="var(--font-sans)">${height}</text>
                        {/* X Labels */}
                        <text x={x + 12} y="166" fill="#8A7060" fontSize="9" textAnchor="middle" fontFamily="var(--font-sans)">{label}</text>
                      </g>
                    );
                  })}
                </svg>
              </div>
              <p style={{ fontSize: '11px', color: '#8A7060', textAlign: 'center', margin: 0 }}>Hourly customer transaction spikes based on active guest checkout logs.</p>
            </div>

            {/* BEST SELLERS & STAFF EFFICIENCY */}
            <div className="glass-panel" style={{ padding: '24px', borderRadius: '14px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h3 style={{ fontSize: '18px', color: '#F0E0C8', marginBottom: '14px', fontFamily: 'var(--font-serif)' }}>⭐ Top Selling Items</h3>
                {bestSellers.length === 0 ? (
                  <p style={{ fontSize: '12.5px', color: '#8A7060', fontStyle: 'italic' }}>No sales completed yet.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {bestSellers.map(([name, qty]) => (
                      <div key={name}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', marginBottom: '4px' }}>
                          <span style={{ color: '#D0B890' }}>{name}</span>
                          <span style={{ color: '#C8956C', fontWeight: 'bold' }}>{qty} sold</span>
                        </div>
                        {/* Custom Bar progress bar */}
                        <div style={{ height: '5px', background: 'rgba(255,255,255,0.05)', borderRadius: '99px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', background: '#C8956C', width: `${Math.min(100, (qty / 10) * 100)}%`, borderRadius: '99px' }} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h3 style={{ fontSize: '16px', color: '#F0E0C8', marginBottom: '10px', fontFamily: 'var(--font-serif)' }}>☕ Staff Leaderboard & Tip share</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {staff.map(member => (
                    <div key={member.id} style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', padding: '8px 12px', borderRadius: '8px' }}>
                      <span style={{ fontSize: '20px', marginRight: '10px' }}>{member.avatar}</span>
                      <div style={{ flex: 1 }}>
                        <span style={{ fontSize: '13px', color: '#F5ECD7', fontWeight: '600', display: 'block' }}>{member.name}</span>
                        <span style={{ fontSize: '10px', color: member.activeShift ? '#6B8E6B' : '#8A7060' }}>
                          {member.activeShift ? '🟢 On-Shift Clocked In' : '⚪ Clocked Out'}
                        </span>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '11px', color: '#8A7060', display: 'block' }}>Roster Share</span>
                        <span style={{ fontSize: '13px', color: '#C8956C', fontWeight: 'bold' }}>
                          {member.activeShift ? `$${tipPoolPerStaff.toFixed(2)}` : '$0.00'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ── SUB TAB 2: MENU CRUD EDITOR ── */}
      {activeTab === 'menu' && (
        <div className="glass-panel" style={{ padding: '24px', borderRadius: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(200, 149, 108, 0.15)', paddingBottom: '16px', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '20px', color: '#F5ECD7', fontFamily: 'var(--font-serif)', margin: 0 }}>Roster Menu CRUD Controls</h3>
            <button 
              onClick={() => setIsAddingItem(!isAddingItem)} 
              className="btn-primary" 
              style={{ padding: '8px 16px', borderRadius: '8px', fontSize: '12px' }}
            >
              {isAddingItem ? 'Close Form ✕' : '+ Add New Item'}
            </button>
          </div>

          {/* ADD ITEM FORM */}
          {isAddingItem && (
            <form onSubmit={handleAddItemSubmit} style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(200, 149, 108, 0.25)',
              padding: '20px',
              borderRadius: '10px',
              marginBottom: '24px',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px'
            }}>
              <div>
                <label style={{ fontSize: '11px', color: '#C8956C', display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>ITEM NAME</label>
                <input type="text" placeholder="e.g. Lavender Matcha" value={newItemName} onChange={e => setNewItemName(e.target.value)} required style={{ width: '100%', padding: '8px', borderRadius: '6px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', outline: 'none' }} />
              </div>
              <div>
                <label style={{ fontSize: '11px', color: '#C8956C', display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>CATEGORY</label>
                <select value={newItemCategory} onChange={e => setNewItemCategory(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', outline: 'none' }}>
                  <option value="espresso">Espresso Bar</option>
                  <option value="cold">Cold Bar</option>
                  <option value="pastry">Artisanal Pastries</option>
                  <option value="seasonal">Seasonal Specials</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '11px', color: '#C8956C', display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>PRICE ($)</label>
                <input type="number" step="0.01" placeholder="e.g. 5.95" value={newItemPrice} onChange={e => setNewItemPrice(e.target.value)} required style={{ width: '100%', padding: '8px', borderRadius: '6px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', outline: 'none' }} />
              </div>
              <div>
                <label style={{ fontSize: '11px', color: '#C8956C', display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>CALORIES</label>
                <input type="number" placeholder="e.g. 150" value={newItemCalories} onChange={e => setNewItemCalories(e.target.value)} required style={{ width: '100%', padding: '8px', borderRadius: '6px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', outline: 'none' }} />
              </div>
              <div>
                <label style={{ fontSize: '11px', color: '#C8956C', display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>REPRESENTATIVE EMOJI</label>
                <select value={newItemImage} onChange={e => setNewItemImage(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', outline: 'none' }}>
                  <option value="☕">☕ Coffee Cup</option>
                  <option value="🥤">🥤 Iced Tumbler</option>
                  <option value="🥐">🥐 Croissant</option>
                  <option value="🧁">🧁 Muffin/Cupcake</option>
                  <option value="🍪">🍪 Cookie</option>
                  <option value="✨">✨ Sparkles</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '11px', color: '#C8956C', display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>ITEM TAGS (comma-separated)</label>
                <input type="text" placeholder="e.g. Best Seller, Vegan" value={newItemTags} onChange={e => setNewItemTags(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', outline: 'none' }} />
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ fontSize: '11px', color: '#C8956C', display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>ITEM DESCRIPTION</label>
                <textarea rows="2" placeholder="Describe the beverage ingredients..." value={newItemDesc} onChange={e => setNewItemDesc(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', outline: 'none', fontFamily: 'var(--font-sans)' }} />
              </div>
              <div style={{ gridColumn: 'span 2', textAlign: 'right' }}>
                <button type="submit" className="btn-primary" style={{ padding: '8px 20px', borderRadius: '8px' }}>Create and Add Menu Item</button>
              </div>
            </form>
          )}

          {/* EDIT ITEM MODAL overlay */}
          {editingItem && (
            <div style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
              zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
            }}>
              <form onSubmit={handleEditItemSubmit} className="glass-panel" style={{
                borderRadius: '16px', padding: '24px', width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '16px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ fontSize: '18px', color: '#F0E0C8', fontFamily: 'var(--font-serif)' }}>Edit: {editingItem.name}</h4>
                  <button type="button" onClick={() => setEditingItem(null)} style={{ background: 'transparent', border: 'none', color: '#8A7060', fontSize: '20px', cursor: 'pointer' }}>×</button>
                </div>
                <div>
                  <label style={{ fontSize: '11px', color: '#C8956C', display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>RE-SET PRICE ($)</label>
                  <input type="number" step="0.01" value={editPrice} onChange={e => setEditPrice(e.target.value)} required style={{ width: '100%', padding: '8px', borderRadius: '6px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff' }} />
                </div>
                <div>
                  <label style={{ fontSize: '11px', color: '#C8956C', display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>RE-WRITE DESCRIPTION</label>
                  <textarea rows="3" value={editDesc} onChange={e => setEditDesc(e.target.value)} required style={{ width: '100%', padding: '8px', borderRadius: '6px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', fontFamily: 'var(--font-sans)' }} />
                </div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button type="button" onClick={() => setEditingItem(null)} className="btn-secondary" style={{ flex: 1, padding: '8px', borderRadius: '6px' }}>Cancel</button>
                  <button type="submit" className="btn-primary" style={{ flex: 1, padding: '8px', borderRadius: '6px' }}>Save Changes</button>
                </div>
              </form>
            </div>
          )}

          {/* Menu Items Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(200, 149, 108, 0.15)', color: '#8A7060' }}>
                  <th style={{ padding: '12px 6px' }}>Emoji</th>
                  <th style={{ padding: '12px 6px' }}>Item Name</th>
                  <th style={{ padding: '12px 6px' }}>Category</th>
                  <th style={{ padding: '12px 6px' }}>Price</th>
                  <th style={{ padding: '12px 6px' }}>Calories</th>
                  <th style={{ padding: '12px 6px' }}>Availability Stock</th>
                  <th style={{ padding: '12px 6px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {menu.map(item => (
                  <tr key={item.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', color: '#D0B890' }}>
                    <td style={{ padding: '12px 6px', fontSize: '20px' }}>{item.image}</td>
                    <td style={{ padding: '12px 6px', fontWeight: 'bold', color: '#F5ECD7' }}>{item.name}</td>
                    <td style={{ padding: '12px 6px', textTransform: 'capitalize' }}>{item.category}</td>
                    <td style={{ padding: '12px 6px', color: '#C8956C', fontWeight: 'bold' }}>${item.price.toFixed(2)}</td>
                    <td style={{ padding: '12px 6px' }}>{item.calories} kcal</td>
                    <td style={{ padding: '12px 6px' }}>
                      <button
                        onClick={() => onUpdateMenuItem(item.id, { inStock: !item.inStock })}
                        style={{
                          border: 'none',
                          padding: '4px 10px',
                          borderRadius: '12px',
                          fontSize: '10px',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          background: item.inStock ? 'rgba(107,142,107,0.15)' : 'rgba(168,78,50,0.15)',
                          color: item.inStock ? '#6B8E6B' : '#A84E32'
                        }}
                      >
                        {item.inStock ? '🟢 IN STOCK' : '🔴 OUT OF STOCK'}
                      </button>
                    </td>
                    <td style={{ padding: '12px 6px', textAlign: 'right' }}>
                      <button 
                        onClick={() => { setEditingItem(item); setEditPrice(item.price); setEditDesc(item.desc); }} 
                        style={{ background: 'transparent', border: 'none', color: '#C8956C', cursor: 'pointer', marginRight: '10px', fontSize: '12px' }}
                      >Edit</button>
                      <button 
                        onClick={() => onDeleteMenuItem(item.id)} 
                        style={{ background: 'transparent', border: 'none', color: '#A84E32', cursor: 'pointer', fontSize: '12px' }}
                      >Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── SUB TAB 3: INGREDIENT INVENTORY ── */}
      {activeTab === 'inventory' && (
        <div className="glass-panel" style={{ padding: '24px', borderRadius: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(200, 149, 108, 0.15)', paddingBottom: '16px', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '20px', color: '#F5ECD7', fontFamily: 'var(--font-serif)', margin: 0 }}>Real-Time Ingredient Stock Ledger</h3>
              <p style={{ fontSize: '12px', color: '#8A7060', margin: '2px 0 0' }}>Ingredients automatically decrement when guest checkouts are processed.</p>
            </div>
            <button 
              onClick={onRestockInventory} 
              className="btn-primary" 
              style={{ padding: '8px 16px', borderRadius: '8px', fontSize: '12px' }}
            >
              🔄 Restock All Ingredients
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {Object.entries(inventory).map(([key, item]) => {
              const isLow = item.qty <= item.threshold;
              return (
                <div key={key} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: isLow ? 'rgba(168, 78, 50, 0.05)' : 'rgba(255,255,255,0.01)',
                  border: isLow ? '1px solid rgba(168, 78, 50, 0.3)' : '1px solid rgba(255,255,255,0.04)',
                  padding: '14px 20px',
                  borderRadius: '10px',
                  transition: 'all 0.3s'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <span style={{ fontSize: '24px' }}>
                      {isLow ? '⚠️' : '📦'}
                    </span>
                    <div>
                      <span style={{ fontSize: '14.5px', color: '#F5ECD7', fontWeight: 'bold' }}>{item.name}</span>
                      <div style={{ display: 'flex', gap: '10px', marginTop: '3px' }}>
                        <span style={{ fontSize: '11px', color: '#8A7060' }}>Key identifier: <code>{key}</code></span>
                        <span style={{ fontSize: '11px', color: '#C8956C' }}>Alert Threshold: {item.threshold}{item.unit}</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '11px', color: '#8A7060', display: 'block', textTransform: 'uppercase' }}>Current Level</span>
                      <span style={{ fontSize: '18px', color: isLow ? '#A84E32' : '#6B8E6B', fontWeight: 'bold', fontFamily: 'var(--font-sans)' }}>
                        {item.qty} {item.unit}
                      </span>
                    </div>

                    {isLow && (
                      <div style={{
                        fontSize: '10px',
                        color: '#A84E32',
                        background: 'rgba(168,78,50,0.15)',
                        border: '1px solid rgba(168,78,50,0.3)',
                        borderRadius: '4px',
                        padding: '4px 8px',
                        fontWeight: 'bold',
                        letterSpacing: '0.5px'
                      }}>
                        ⚠️ LOW INGREDIENT ALERT
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── SUB TAB 4: ROSTER & TIP POOL ── */}
      {activeTab === 'staff' && (
        <div className="glass-panel" style={{ padding: '24px', borderRadius: '14px' }}>
          <div style={{ borderBottom: '1px solid rgba(200, 149, 108, 0.15)', paddingBottom: '16px', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '20px', color: '#F5ECD7', fontFamily: 'var(--font-serif)', margin: 0 }}>Staff Roster Shift Logs & Tip Pool Console</h3>
            <p style={{ fontSize: '12px', color: '#8A7060', margin: '2px 0 0' }}>Tip pool divide collected gratuities evenly among clocked-in baristas.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {staff.map(member => (
              <div 
                key={member.id} 
                className="glass-panel" 
                style={{
                  padding: '20px',
                  borderRadius: '12px',
                  border: member.activeShift ? '1px solid rgba(107, 142, 107, 0.3)' : '1px solid rgba(255,255,255,0.06)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '16px' }}>
                  <span style={{ fontSize: '32px' }}>{member.avatar}</span>
                  <div>
                    <h4 style={{ fontSize: '16px', color: '#F5ECD7', fontWeight: 'bold' }}>{member.name}</h4>
                    <span style={{ fontSize: '11px', color: '#C8956C', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{member.role}</span>
                    {member.activeShift && (
                      <span style={{ fontSize: '10px', color: '#8A7060', display: 'block', marginTop: '4px' }}>Clocked in since: <b>{member.clockInTime}</b></span>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '14px' }}>
                  <div>
                    <span style={{ fontSize: '11px', color: '#8A7060', display: 'block' }}>Tip earnings share</span>
                    <span style={{ fontSize: '16px', color: member.activeShift ? '#6B8E6B' : '#8A7060', fontWeight: 'bold' }}>
                      {member.activeShift ? `$${tipPoolPerStaff.toFixed(2)}` : '$0.00'}
                    </span>
                  </div>

                  <button
                    onClick={() => onToggleStaffShift(member.id)}
                    style={{
                      border: 'none',
                      padding: '8px 14px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      background: member.activeShift ? 'rgba(168,78,50,0.15)' : '#6B8E6B',
                      color: member.activeShift ? '#A84E32' : '#fff'
                    }}
                  >
                    {member.activeShift ? '📴 Clock Out' : '🔛 Clock In'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── SUB TAB 5: COUPONS & CAMPAIGNS ── */}
      {activeTab === 'promo' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px', alignItems: 'start' }}>
          
          {/* Active Campaigns list */}
          <div className="glass-panel" style={{ padding: '24px', borderRadius: '14px' }}>
            <h3 style={{ fontSize: '18px', color: '#F5ECD7', borderBottom: '1px solid rgba(200, 149, 108, 0.15)', paddingBottom: '12px', marginBottom: '16px', fontFamily: 'var(--font-serif)' }}>Active Marketing Coupon Ledger</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {promotions.map(promo => (
                <div key={promo.code} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'rgba(255,255,255,0.01)',
                  border: promo.active ? '1px solid rgba(107, 142, 107, 0.3)' : '1px solid rgba(255,255,255,0.04)',
                  padding: '14px 20px',
                  borderRadius: '10px'
                }}>
                  <div>
                    <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#C8956C', background: 'rgba(200,149,108,0.1)', padding: '2px 8px', borderRadius: '4px', border: '1px solid rgba(200,149,108,0.3)', marginRight: '10px' }}>
                      {promo.code}
                    </span>
                    <span style={{ fontSize: '13px', color: '#D0B890', fontWeight: 'bold' }}>{promo.discountPct}% Discount</span>
                    <p style={{ fontSize: '11px', color: '#8A7060', margin: '4px 0 0' }}>{promo.description}</p>
                  </div>

                  <button
                    onClick={() => onTogglePromotion(promo.code)}
                    style={{
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      background: promo.active ? 'rgba(107,142,107,0.15)' : 'rgba(255,255,255,0.04)',
                      color: promo.active ? '#6B8E6B' : '#8A7060'
                    }}
                  >
                    {promo.active ? '🟢 ACTIVE' : '⚪ EXPIRED'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Promo configuration sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* Countdown deal banner */}
            <div className="glass-panel" style={{
              borderRadius: '12px',
              padding: '20px',
              border: '1px solid rgba(168, 78, 50, 0.4)',
              background: 'linear-gradient(135deg, rgba(168,78,50,0.12), transparent)'
            }}>
              <span style={{ fontSize: '11px', color: '#A84E32', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase' }}>🔥 AUTUMN FLASH DEAL SPECIAL</span>
              <h4 style={{ fontSize: '18px', color: '#F5ECD7', margin: '6px 0', fontFamily: 'var(--font-serif)' }}>Pumpkin Foam Latte Bundle</h4>
              <p style={{ fontSize: '12px', color: '#A89070', lineHeight: 1.4, margin: '0 0 14px' }}>Buy any seasonal Spiced Cold Brew + Pastry for automatically 15% off at cart stage checkout.</p>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between', borderTop: '1px dashed rgba(168,78,50,0.3)', paddingTop: '10px' }}>
                <span style={{ fontSize: '11.5px', color: '#8A7060' }}>Active Countdown:</span>
                <span style={{ fontSize: '16px', color: '#A84E32', fontWeight: 'bold', fontFamily: 'var(--font-sans)' }}>{formatFlashTime(flashSeconds)}</span>
              </div>
            </div>

            {/* Create new coupon form */}
            <form onSubmit={handleAddCouponSubmit} className="glass-panel" style={{ borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase', color: '#C8956C', fontWeight: 'bold' }}>Create New Promo Code</div>
              
              <div>
                <label style={{ fontSize: '10px', color: '#8A7060', display: 'block', marginBottom: '4px' }}>CODE NAME</label>
                <input type="text" placeholder="e.g. SPRING30" value={newCouponCode} onChange={e => setNewCouponCode(e.target.value)} required style={{ width: '100%', padding: '6px 10px', borderRadius: '4px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', textTransform: 'uppercase' }} />
              </div>

              <div>
                <label style={{ fontSize: '10px', color: '#8A7060', display: 'block', marginBottom: '4px' }}>DISCOUNT PERCENTAGE</label>
                <select value={newCouponDiscount} onChange={e => setNewCouponDiscount(e.target.value)} style={{ width: '100%', padding: '6px 10px', borderRadius: '4px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff' }}>
                  <option value="5">5% off</option>
                  <option value="10">10% off</option>
                  <option value="15">15% off</option>
                  <option value="20">20% off</option>
                  <option value="25">25% off</option>
                  <option value="30">30% off</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '10px', color: '#8A7060', display: 'block', marginBottom: '4px' }}>DESCRIPTION BANNER</label>
                <input type="text" placeholder="e.g. Save 15% off cold coffees" value={newCouponDesc} onChange={e => setNewCouponDesc(e.target.value)} style={{ width: '100%', padding: '6px 10px', borderRadius: '4px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff' }} />
              </div>

              <button type="submit" className="btn-primary" style={{ padding: '8px', borderRadius: '6px', fontSize: '11px', marginTop: '4px' }}>Create Promo Code</button>
            </form>

          </div>

        </div>
      )}

    </div>
  );
}
