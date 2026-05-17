import React, { useState } from 'react';
import OrderReceipt from './OrderReceipt';

export default function GuestView({ menu, categories, onSubmitOrder, activeOrders, promotions }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Custom Modifiers Modal State
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [size, setSize] = useState('M'); // S / M / L
  const [roast, setRoast] = useState('Medium');
  const [milk, setMilk] = useState('Whole Milk');
  const [temperature, setTemperature] = useState('Hot');
  const [syrup, setSyrup] = useState('None');
  const [syrupPumps, setSyrupPumps] = useState(2);
  const [addOns, setAddOns] = useState({ extraShot: false, whip: false, coldFoam: false });
  
  // Cart State
  const [cart, setCart] = useState([]);
  const [promoCode, setPromoCode] = useState('');
  const [discountPct, setDiscountPct] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');

  // Checkout and Completed States
  const [checkoutStep, setCheckoutStep] = useState('menu'); // 'menu' | 'receipt' | 'tracking'
  const [placedOrder, setPlacedOrder] = useState(null);

  // Filter products based on category & search
  const filteredProducts = menu.filter(product => {
    const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Dynamic Price & Calorie calculation in Modal
  const getModalAdjustments = () => {
    if (!selectedProduct) return { price: 0, calories: 0 };
    let finalPrice = selectedProduct.price;
    let finalCalories = selectedProduct.calories;

    // Size Adjustments
    if (size === 'S') { finalPrice -= 0.50; finalCalories -= 20; }
    if (size === 'L') { finalPrice += 0.60; finalCalories += 30; }
    if (size === 'XL') { finalPrice += 1.20; finalCalories += 50; }

    // Milk Adjustments
    if (milk === 'Oat Milk') { finalPrice += 0.75; finalCalories += 40; }
    if (milk === 'Almond Milk') { finalPrice += 0.75; finalCalories += 20; }
    if (milk === 'Soy Milk') { finalPrice += 0.50; finalCalories += 30; }
    if (milk === 'Coconut Milk') { finalPrice += 0.60; finalCalories += 25; }

    // Temperature Adjustments
    if (temperature === 'Blended') { finalPrice += 0.40; finalCalories += 60; }

    // Addons
    if (addOns.extraShot) { finalPrice += 1.00; finalCalories += 5; }
    if (addOns.whip) { finalPrice += 0.50; finalCalories += 80; }
    if (addOns.coldFoam) { finalPrice += 0.80; finalCalories += 70; }

    // Syrups
    if (syrup !== 'None') {
      finalPrice += 0.30;
      finalCalories += (syrupPumps * 20);
    }

    return { 
      price: Math.max(1.0, finalPrice), 
      calories: Math.max(0, finalCalories) 
    };
  };

  const modalState = getModalAdjustments();

  // Reset modifiers
  const resetModifiers = () => {
    setSize('M');
    setRoast('Medium');
    setMilk('Whole Milk');
    setTemperature('Hot');
    setSyrup('None');
    setSyrupPumps(2);
    setAddOns({ extraShot: false, whip: false, coldFoam: false });
  };

  const handleOpenProduct = (product) => {
    if (!product.inStock) return;
    setSelectedProduct(product);
    resetModifiers();
  };

  const handleAddToCart = () => {
    const mods = [];
    mods.push(`Size ${size}`);
    
    // Roast and Milk modifiers are only relevant for beverages
    if (selectedProduct.category !== 'pastry') {
      mods.push(`${roast} Roast`);
      mods.push(milk);
      mods.push(temperature);
      if (syrup !== 'None') mods.push(`${syrupPumps} pumps ${syrup}`);
      if (addOns.extraShot) mods.push("Extra Shot");
      if (addOns.whip) mods.push("Whipped Cream");
      if (addOns.coldFoam) mods.push("Cold Foam");
    } else {
      if (addOns.whip) mods.push("Add Whipped Cream");
    }

    const cartItem = {
      id: Date.now(),
      productId: selectedProduct.id,
      name: selectedProduct.name,
      price: modalState.price,
      qty: 1,
      size: selectedProduct.category === 'pastry' ? null : size,
      mods: mods,
      image: selectedProduct.image
    };

    setCart([...cart, cartItem]);
    setSelectedProduct(null);
  };

  const handleRemoveFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const handleQtyChange = (id, delta) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        return { ...item, qty: Math.max(1, item.qty + delta) };
      }
      return item;
    }));
  };

  const handleApplyPromo = () => {
    setPromoError('');
    setPromoSuccess('');
    const promo = promotions.find(p => p.code.toUpperCase() === promoCode.toUpperCase());
    
    if (!promo) {
      setPromoError('Invalid coupon code!');
      setDiscountPct(0);
    } else if (!promo.active) {
      setPromoError('This coupon code is expired.');
      setDiscountPct(0);
    } else {
      setDiscountPct(promo.discountPct);
      setPromoSuccess(`Promo applied: ${promo.discountPct}% OFF!`);
    }
  };

  const handleCheckoutSubmit = () => {
    const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const discountAmount = subtotal * (discountPct / 100);
    
    const newOrder = {
      id: `ORD-${Date.now().toString().slice(-5)}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', May 17 2026',
      items: cart,
      subtotal: subtotal,
      discountAmount: discountAmount,
      tax: subtotal * 0.08,
      status: 'Received', // Received -> Preparing -> Ready -> Collected
      barista: 'Sarah K.',
      table: 'Table ' + Math.floor(Math.random() * 15 + 1).toString().padStart(2, '0'),
      timer: 0
    };

    // Trigger state change in parent App.jsx
    onSubmitOrder(newOrder);
    setPlacedOrder(newOrder);
    setCart([]);
    setDiscountPct(0);
    setPromoCode('');
    setCheckoutStep('receipt');
  };

  // Get status class for timeline nodes
  const getTimelineClass = (currentStatus, targetStatus) => {
    const states = ['Received', 'Preparing', 'Ready', 'Collected'];
    const currentIndex = states.indexOf(currentStatus);
    const targetIndex = states.indexOf(targetStatus);
    
    if (currentIndex >= targetIndex) {
      return {
        dot: '#6B8E6B',
        line: '#6B8E6B',
        color: '#F5ECD7',
        weight: '600'
      };
    }
    return {
      dot: 'rgba(255, 255, 255, 0.1)',
      line: 'rgba(255, 255, 255, 0.1)',
      color: '#8A7060',
      weight: '400'
    };
  };

  // Retrieve current state of our placed order
  const activeOrderLive = placedOrder ? activeOrders.find(o => o.id === placedOrder.id) : null;
  const currentOrderStatus = activeOrderLive ? activeOrderLive.status : 'Received';
  const currentOrderTimer = activeOrderLive ? activeOrderLive.timer : 0;

  return (
    <div className="container-max" style={{ padding: '30px 0 60px' }}>
      
      {/* ── GUEST VIEW: ORDER COMPLETED & TRACKING STAGE ── */}
      {checkoutStep === 'tracking' && placedOrder && (
        <div className="glass-panel" style={{
          borderRadius: '16px',
          padding: '40px',
          maxWidth: '700px',
          margin: '0 auto',
          textAlign: 'center'
        }}>
          <span style={{ fontSize: '64px', display: 'block', marginBottom: '20px' }}>
            {currentOrderStatus === 'Received' && '📥'}
            {currentOrderStatus === 'Preparing' && '☕'}
            {currentOrderStatus === 'Ready' && '🔔'}
            {currentOrderStatus === 'Collected' && '😋'}
          </span>
          <div className="title-badge" style={{ marginBottom: '10px' }}>LIVE ORDER TRACKER</div>
          <h2 style={{ fontSize: '28px', color: '#F5ECD7', marginBottom: '4px', fontFamily: 'var(--font-serif)' }}>
            {currentOrderStatus === 'Received' && 'We\'ve received your order!'}
            {currentOrderStatus === 'Preparing' && 'Barista is crafting your order...'}
            {currentOrderStatus === 'Ready' && 'Your order is ready for pickup!'}
            {currentOrderStatus === 'Collected' && 'Enjoy your fresh brew!'}
          </h2>
          <p style={{ color: '#A89070', fontSize: '14px', marginBottom: '35px' }}>
            Order ID: <b>{placedOrder.id}</b> · Table Pickup Point: <b>{placedOrder.table}</b>
          </p>

          {/* Timeline */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative',
            maxWidth: '500px',
            margin: '0 auto 40px',
            padding: '0 20px'
          }}>
            {/* Horizontal Line background */}
            <div style={{
              position: 'absolute',
              top: '12px',
              left: '40px',
              right: '40px',
              height: '2px',
              background: 'rgba(255,255,255,0.06)',
              zIndex: 1
            }} />
            
            {/* Timeline nodes */}
            {['Received', 'Preparing', 'Ready', 'Collected'].map((st, idx, arr) => {
              const styles = getTimelineClass(currentOrderStatus, st);
              const nodeLineStyle = idx < arr.length - 1 ? getTimelineClass(currentOrderStatus, arr[idx + 1]) : null;
              
              return (
                <div key={st} style={{ position: 'relative', zIndex: 2, flex: 1, textAlign: 'center' }}>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: styles.dot,
                    margin: '0 auto 8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '3px solid #1A1208',
                    transition: 'all 0.5s ease',
                    boxShadow: styles.dot !== 'rgba(255, 255, 255, 0.1)' ? '0 0 10px rgba(107, 142, 107, 0.5)' : 'none'
                  }}>
                    {styles.dot !== 'rgba(255, 255, 255, 0.1)' && <span style={{ color: '#1A1208', fontSize: '10px', fontWeight: 'bold' }}>✓</span>}
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: styles.color,
                    fontWeight: styles.weight,
                    transition: 'all 0.3s'
                  }}>{st}</div>
                </div>
              );
            })}
          </div>

          {/* Wait timer / Status display */}
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid rgba(200, 149, 108, 0.1)',
            marginBottom: '30px',
            display: 'inline-block',
            minWidth: '280px'
          }}>
            <div style={{ fontSize: '11px', color: '#8A7060', letterSpacing: '1px', textTransform: 'uppercase' }}>ESTIMATED WAIT TIME</div>
            <div style={{ fontSize: '32px', color: '#C8956C', fontWeight: '300', margin: '4px 0' }}>
              {currentOrderStatus === 'Collected' ? 'Collected' : currentOrderStatus === 'Ready' ? '0:00' : `${Math.max(0, 3 - Math.floor(currentOrderTimer / 60))}:${(60 - (currentOrderTimer % 60)).toString().padStart(2, '0')}`}
            </div>
            <span style={{ fontSize: '11px', color: '#6B8E6B' }}>
              {currentOrderStatus === 'Received' && 'Waiting for barista queue acceptance'}
              {currentOrderStatus === 'Preparing' && 'Grinding beans & preparing milk'}
              {currentOrderStatus === 'Ready' && 'Grab your order from table-point!'}
              {currentOrderStatus === 'Collected' && 'Check out complete, thank you!'}
            </span>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button 
              onClick={() => setCheckoutStep('receipt')} 
              className="btn-secondary" 
              style={{ padding: '10px 24px', borderRadius: '8px' }}
            >
              📄 View My Receipt
            </button>
            <button 
              onClick={() => { setCheckoutStep('menu'); setPlacedOrder(null); }} 
              className="btn-primary" 
              style={{ padding: '10px 24px', borderRadius: '8px' }}
            >
              🛍️ Order Something Else
            </button>
          </div>
        </div>
      )}

      {/* ── GUEST VIEW: RECEIPT MODAL ── */}
      {checkoutStep === 'receipt' && placedOrder && (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div className="glass-panel" style={{ borderRadius: '16px', padding: '24px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ color: '#F5ECD7', fontFamily: 'var(--font-serif)', fontSize: '20px' }}>🎉 Thank you for your purchase!</h3>
              <span style={{ fontSize: '12px', color: '#6B8E6B', background: 'rgba(107,142,107,0.15)', padding: '4px 10px', borderRadius: '99px', fontWeight: 'bold' }}>PAID & COMPLETED</span>
            </div>
          </div>
          <OrderReceipt 
            order={placedOrder} 
            onCompleteClose={() => setCheckoutStep('tracking')} 
          />
        </div>
      )}

      {/* ── GUEST VIEW: CORE ORDERING INTERFACE ── */}
      {checkoutStep === 'menu' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '30px', alignItems: 'start' }}>
          
          {/* Menu Main Section */}
          <div>
            {/* Header */}
            <div style={{ marginBottom: '30px' }}>
              <div className="title-badge" style={{ marginBottom: '10px' }}>BREW & CO. CAFE</div>
              <h2 style={{ fontSize: '36px', color: '#F5ECD7', marginBottom: '16px', fontFamily: 'var(--font-serif)' }}>Explore Our Artisanal Menu</h2>
              
              {/* Filters & Search Row */}
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                
                {/* Search Bar */}
                <input
                  type="text"
                  placeholder="Search coffee, pastries..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{
                    flex: '1 1 200px',
                    padding: '12px 18px',
                    borderRadius: '10px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(200, 149, 108, 0.25)',
                    color: '#F5ECD7',
                    fontSize: '14px',
                    outline: 'none',
                    fontFamily: 'var(--font-sans)',
                  }}
                />

                {/* Category Toggles */}
                <div style={{ display: 'flex', gap: '6px', background: 'rgba(255,255,255,0.02)', padding: '4px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <button 
                    onClick={() => setActiveCategory('all')} 
                    style={{
                      padding: '8px 14px',
                      border: 'none',
                      borderRadius: '8px',
                      background: activeCategory === 'all' ? '#C8956C' : 'transparent',
                      color: activeCategory === 'all' ? '#0f0905' : '#D0B890',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: '600',
                      fontFamily: 'var(--font-sans)',
                      transition: 'all 0.15s'
                    }}
                  >All</button>
                  {categories.map(cat => (
                    <button 
                      key={cat.id} 
                      onClick={() => setActiveCategory(cat.id)} 
                      style={{
                        padding: '8px 14px',
                        border: 'none',
                        borderRadius: '8px',
                        background: activeCategory === cat.id ? '#C8956C' : 'transparent',
                        color: activeCategory === cat.id ? '#0f0905' : '#D0B890',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: '600',
                        fontFamily: 'var(--font-sans)',
                        transition: 'all 0.15s',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <span>{cat.icon}</span>
                      <span>{cat.name}</span>
                    </button>
                  ))}
                </div>

              </div>
            </div>

            {/* Menu Grid */}
            {filteredProducts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: '#8A7060' }}>
                <span style={{ fontSize: '40px' }}>🔍</span>
                <p style={{ marginTop: '10px' }}>No items match your search filter.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
                {filteredProducts.map(product => (
                  <div
                    key={product.id}
                    onClick={() => handleOpenProduct(product)}
                    style={{
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      borderRadius: '14px',
                      padding: '20px',
                      cursor: product.inStock ? 'pointer' : 'not-allowed',
                      transition: 'all 0.25s ease',
                      position: 'relative',
                      display: 'flex',
                      flexDirection: 'column',
                      opacity: product.inStock ? 1 : 0.45
                    }}
                    className="float-hover"
                  >
                    {/* Badge Spotlight */}
                    {product.tags && product.tags.map(t => (
                      <span key={t} style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        fontSize: '9px',
                        background: t === 'Best Seller' ? '#6B8E6B' : t === 'High Margin' ? 'rgba(200, 149, 108, 0.2)' : 'rgba(255,255,255,0.08)',
                        border: '1px solid rgba(200, 149, 108, 0.3)',
                        color: t === 'Best Seller' ? '#fff' : '#C8956C',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontWeight: 'bold',
                        letterSpacing: '0.5px'
                      }}>{t}</span>
                    ))}

                    <span style={{ fontSize: '40px', display: 'block', margin: '10px 0 16px' }}>{product.image}</span>
                    
                    <h3 style={{ fontSize: '18px', color: '#F0E0C8', marginBottom: '4px', fontFamily: 'var(--font-serif)' }}>{product.name}</h3>
                    <p style={{ fontSize: '11px', color: '#8A7060', marginBottom: '8px' }}>⚡ {product.calories} kcal</p>
                    <p style={{ fontSize: '12.5px', color: '#A89070', lineHeight: 1.5, flexGrow: 1, marginBottom: '16px' }}>
                      {product.desc}
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '12px' }}>
                      <span style={{ fontSize: '18px', color: '#C8956C', fontWeight: 'bold' }}>${product.price.toFixed(2)}</span>
                      {product.inStock ? (
                        <span style={{
                          fontSize: '11px', color: '#C8956C', border: '1px solid rgba(200, 149, 108, 0.4)',
                          borderRadius: '6px', padding: '4px 10px', background: 'rgba(200,149,108,0.08)',
                          fontWeight: '600'
                        }}>+ Add order</span>
                      ) : (
                        <span style={{
                          fontSize: '11px', color: '#A84E32', border: '1px solid rgba(168,78,50,0.3)',
                          borderRadius: '6px', padding: '4px 10px', background: 'rgba(168,78,50,0.08)',
                          fontWeight: '600'
                        }}>OUT OF STOCK</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cart Sidebar Panel */}
          <div className="glass-panel" style={{
            borderRadius: '16px',
            padding: '20px',
            position: 'sticky',
            top: '90px'
          }}>
            <h3 style={{ fontSize: '18px', color: '#F5ECD7', borderBottom: '1px solid rgba(200, 149, 108, 0.15)', paddingBottom: '12px', marginBottom: '16px', fontFamily: 'var(--font-serif)', display: 'flex', justifyContent: 'space-between' }}>
              <span>🛍️ Shopping Cart</span>
              <span style={{ fontSize: '12px', color: '#8A7060', fontWeight: 'normal' }}>({cart.length} items)</span>
            </h3>

            {cart.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 10px', color: '#8A7060' }}>
                <span style={{ fontSize: '32px' }}>🛒</span>
                <p style={{ fontSize: '13px', marginTop: '10px' }}>Your cart is empty. Select a drink to customize modifiers!</p>
              </div>
            ) : (
              <div>
                {/* Cart items list */}
                <div style={{ maxHeight: '250px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', paddingRight: '4px', marginBottom: '16px' }}>
                  {cart.map(item => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', padding: '10px', borderRadius: '8px' }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '16px' }}>{item.image}</span>
                          <span style={{ fontSize: '13px', color: '#F0E0C8', fontWeight: '600', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{item.name}</span>
                          {item.size && <span style={{ fontSize: '10px', color: '#8A7060' }}>({item.size})</span>}
                        </div>
                        {item.mods && item.mods.length > 0 && (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2px', marginTop: '4px' }}>
                            {item.mods.map((m, mi) => (
                              <span key={mi} style={{ fontSize: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', color: '#A89070', padding: '1px 5px', borderRadius: '4px' }}>{m}</span>
                            ))}
                          </div>
                        )}
                        {/* Qty controls */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                          <button onClick={() => handleQtyChange(item.id, -1)} style={{ border: 'none', background: 'rgba(255,255,255,0.05)', color: '#D0B890', cursor: 'pointer', width: '18px', height: '18px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>-</button>
                          <span style={{ fontSize: '12px', color: '#F0E0C8', fontWeight: 'bold' }}>{item.qty}</span>
                          <button onClick={() => handleQtyChange(item.id, 1)} style={{ border: 'none', background: 'rgba(255,255,255,0.05)', color: '#D0B890', cursor: 'pointer', width: '18px', height: '18px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>+</button>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right', marginLeft: '8px' }}>
                        <span style={{ fontSize: '13px', color: '#C8956C', fontWeight: 'bold', display: 'block' }}>${(item.price * item.qty).toFixed(2)}</span>
                        <button onClick={() => handleRemoveFromCart(item.id)} style={{ border: 'none', background: 'transparent', color: '#A84E32', cursor: 'pointer', fontSize: '10px', marginTop: '6px' }}>Delete</button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Promo Code box */}
                <div style={{ borderTop: '1px solid rgba(200, 149, 108, 0.15)', paddingTop: '14px', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <input 
                      type="text" 
                      placeholder="Promo code (e.g. BREW20)" 
                      value={promoCode} 
                      onChange={e => setPromoCode(e.target.value)}
                      style={{
                        flex: 1,
                        padding: '6px 10px',
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(200, 149, 108, 0.2)',
                        borderRadius: '6px',
                        color: '#F5ECD7',
                        fontSize: '12px',
                        outline: 'none',
                        textTransform: 'uppercase'
                      }}
                    />
                    <button onClick={handleApplyPromo} className="btn-secondary" style={{ padding: '6px 12px', borderRadius: '6px', fontSize: '11px' }}>Apply</button>
                  </div>
                  {promoError && <span style={{ fontSize: '10px', color: '#A84E32', display: 'block', marginTop: '4px' }}>{promoError}</span>}
                  {promoSuccess && <span style={{ fontSize: '10px', color: '#6B8E6B', display: 'block', marginTop: '4px' }}>{promoSuccess}</span>}
                </div>

                {/* Summary list */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px', borderTop: '1px solid rgba(200, 149, 108, 0.15)', paddingTop: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#8A7060' }}>
                    <span>Subtotal</span>
                    <span>${cart.reduce((s, i) => s + i.price * i.qty, 0).toFixed(2)}</span>
                  </div>
                  {discountPct > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#A84E32' }}>
                      <span>Discount ({discountPct}%)</span>
                      <span>-${(cart.reduce((s, i) => s + i.price * i.qty, 0) * (discountPct / 100)).toFixed(2)}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#8A7060' }}>
                    <span>Estimated Tax (8%)</span>
                    <span>${(cart.reduce((s, i) => s + i.price * i.qty, 0) * 0.08).toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#F5ECD7', fontWeight: 'bold', borderTop: '1px dashed rgba(200, 149, 108, 0.15)', paddingTop: '8px', marginTop: '4px' }}>
                    <span>Grand Total</span>
                    <span style={{ color: '#C8956C' }}>
                      ${Math.max(0, 
                        cart.reduce((s, i) => s + i.price * i.qty, 0) * (1 - discountPct / 100) * 1.08
                      ).toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Checkout button */}
                <button 
                  onClick={handleCheckoutSubmit} 
                  className="btn-primary" 
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    fontSize: '13px'
                  }}
                >
                  🔒 Process PCI Secure Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── FORCED MODIFIERS MODAL (GLASSMORPHIC) ── */}
      {selectedProduct && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 9, 5, 0.65)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 200,
          padding: '20px'
        }}>
          <div className="glass-panel" style={{
            borderRadius: '16px',
            width: '100%',
            maxWidth: '550px',
            overflow: 'hidden',
            boxShadow: '0 25px 60px rgba(0,0,0,0.8)',
            animation: 'float 6s ease-in-out infinite'
          }}>
            {/* Modal Header */}
            <div style={{ background: 'rgba(200, 149, 108, 0.12)', borderBottom: '1px solid rgba(200, 149, 108, 0.2)', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '28px' }}>{selectedProduct.image}</span>
                <div>
                  <h3 style={{ fontSize: '20px', color: '#F5ECD7', fontFamily: 'var(--font-serif)' }}>Customize {selectedProduct.name}</h3>
                  <span style={{ fontSize: '11px', color: '#A89070' }}>🔥 {modalState.calories} kcal estimated calories</span>
                </div>
              </div>
              <button 
                onClick={() => setSelectedProduct(null)} 
                style={{ background: 'transparent', border: 'none', color: '#8A7060', fontSize: '22px', cursor: 'pointer', outline: 'none' }}
              >×</button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '24px', maxHeight: '420px', overflowY: 'auto' }}>
              {/* If beverage - show standard tea/coffee modifiers */}
              {selectedProduct.category !== 'pastry' ? (
                <div>
                  {/* Cup Size Choice */}
                  <div style={{ marginBottom: '18px' }}>
                    <label style={{ fontSize: '11px', color: '#C8956C', letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Select Cup Size (Required)</label>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {[
                        ['S', 'Small (8oz)', '-$0.50'],
                        ['M', 'Medium (12oz)', 'Base'],
                        ['L', 'Large (16oz)', '+$0.60'],
                        ['XL', 'Extra Lg (20oz)', '+$1.20']
                      ].map(([id, label, priceLabel]) => (
                        <div 
                          key={id} 
                          onClick={() => setSize(id)}
                          style={{
                            flex: 1,
                            padding: '8px',
                            background: size === id ? 'rgba(200, 149, 108, 0.15)' : 'rgba(255,255,255,0.02)',
                            border: size === id ? '1px solid #C8956C' : '1px solid rgba(255,255,255,0.06)',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            textAlign: 'center',
                            transition: 'all 0.15s'
                          }}
                        >
                          <div style={{ fontSize: '13px', fontWeight: 'bold', color: size === id ? '#C8956C' : '#F5ECD7' }}>{id}</div>
                          <div style={{ fontSize: '9px', color: '#8A7060', marginTop: '2px' }}>{label}</div>
                          <div style={{ fontSize: '8px', color: '#C8956C', marginTop: '1px' }}>{priceLabel}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Roast selection */}
                  <div style={{ marginBottom: '18px' }}>
                    <label style={{ fontSize: '11px', color: '#C8956C', letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Espresso Roast selection (Required)</label>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {['Light', 'Medium', 'Dark', 'Decaf'].map(r => (
                        <div 
                          key={r} 
                          onClick={() => setRoast(r)}
                          style={{
                            flex: 1,
                            padding: '8px 4px',
                            background: roast === r ? 'rgba(200, 149, 108, 0.15)' : 'rgba(255,255,255,0.02)',
                            border: roast === r ? '1px solid #C8956C' : '1px solid rgba(255,255,255,0.06)',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            textAlign: 'center',
                            fontSize: '12px',
                            color: roast === r ? '#F5ECD7' : '#D0B890',
                            transition: 'all 0.15s'
                          }}
                        >
                          {r}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Milk Substitution */}
                  <div style={{ marginBottom: '18px' }}>
                    <label style={{ fontSize: '11px', color: '#C8956C', letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Choose Milk Choice (Required)</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                      {[
                        ['Whole Milk', 'Standard', 'Base'],
                        ['Oat Milk', 'Premium', '+$0.75'],
                        ['Almond Milk', 'Nuts', '+$0.75'],
                        ['Soy Milk', 'Plant-based', '+$0.50'],
                        ['Coconut Milk', 'Tropical', '+$0.60']
                      ].map(([m, desc, extra]) => (
                        <div 
                          key={m} 
                          onClick={() => setMilk(m)}
                          style={{
                            padding: '6px',
                            background: milk === m ? 'rgba(200, 149, 108, 0.15)' : 'rgba(255,255,255,0.02)',
                            border: milk === m ? '1px solid #C8956C' : '1px solid rgba(255,255,255,0.06)',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            textAlign: 'center',
                            transition: 'all 0.15s'
                          }}
                        >
                          <div style={{ fontSize: '11.5px', fontWeight: '600', color: milk === m ? '#C8956C' : '#F5ECD7' }}>{m}</div>
                          <div style={{ fontSize: '8px', color: '#8A7060' }}>{desc}</div>
                          <div style={{ fontSize: '8px', color: '#C8956C' }}>{extra}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Temperature */}
                  <div style={{ marginBottom: '18px' }}>
                    <label style={{ fontSize: '11px', color: '#C8956C', letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Drink Temperature</label>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {[
                        ['Hot', 'Warm brew', 'Base'],
                        ['Iced', 'Over organic ice', 'Base'],
                        ['Blended', 'Ice slushy whip', '+$0.40']
                      ].map(([t, desc, price]) => (
                        <div 
                          key={t} 
                          onClick={() => setTemperature(t)}
                          style={{
                            flex: 1,
                            padding: '6px',
                            background: temperature === t ? 'rgba(200, 149, 108, 0.15)' : 'rgba(255,255,255,0.02)',
                            border: temperature === t ? '1px solid #C8956C' : '1px solid rgba(255,255,255,0.06)',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            textAlign: 'center',
                            transition: 'all 0.15s'
                          }}
                        >
                          <div style={{ fontSize: '12px', fontWeight: '600', color: temperature === t ? '#C8956C' : '#F5ECD7' }}>{t}</div>
                          <div style={{ fontSize: '8px', color: '#C8956C' }}>{price}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Syrups Pumps Selection */}
                  <div style={{ marginBottom: '18px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', padding: '12px', borderRadius: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <label style={{ fontSize: '11px', color: '#C8956C', letterSpacing: '1px', textTransform: 'uppercase', margin: 0, fontWeight: 'bold' }}>Syrup Selection</label>
                      <span style={{ fontSize: '10px', color: '#C8956C' }}>+$0.30 per syrup</span>
                    </div>
                    <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
                      {['None', 'Vanilla', 'Caramel', 'Hazelnut', 'Sugar Free'].map(s => (
                        <button 
                          key={s} 
                          onClick={() => setSyrup(s)} 
                          style={{
                            flex: 1,
                            padding: '6px 0',
                            borderRadius: '6px',
                            border: 'none',
                            background: syrup === s ? '#C8956C' : 'rgba(255,255,255,0.04)',
                            color: syrup === s ? '#0f0905' : '#D0B890',
                            fontSize: '11px',
                            cursor: 'pointer',
                            fontWeight: '600'
                          }}
                        >{s}</button>
                      ))}
                    </div>
                    {syrup !== 'None' && (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(0,0,0,0.2)', padding: '6px 12px', borderRadius: '6px' }}>
                        <span style={{ fontSize: '11.5px', color: '#8A7060' }}>Number of Pumps (20 kcal each)</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <button onClick={() => setSyrupPumps(Math.max(1, syrupPumps - 1))} style={{ border: 'none', width: '22px', height: '22px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', color: '#fff', cursor: 'pointer' }}>-</button>
                          <span style={{ fontSize: '13px', color: '#C8956C', fontWeight: 'bold' }}>{syrupPumps}</span>
                          <button onClick={() => setSyrupPumps(Math.min(5, syrupPumps + 1))} style={{ border: 'none', width: '22px', height: '22px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', color: '#fff', cursor: 'pointer' }}>+</button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Add-ons Checkboxes */}
                  <div style={{ marginBottom: '10px' }}>
                    <label style={{ fontSize: '11px', color: '#C8956C', letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Optional Add-Ons</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {[
                        ['extraShot', '☕ Extra Espresso Shot', '+$1.00 (5 kcal)'],
                        ['whip', '🍦 Sweet Whipped Cream', '+$0.50 (80 kcal)'],
                        ['coldFoam', '☁️ Cold Salted foam', '+$0.80 (70 kcal)']
                      ].map(([id, name, extra]) => (
                        <div 
                          key={id}
                          onClick={() => setAddOns({ ...addOns, [id]: !addOns[id] })}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            background: addOns[id] ? 'rgba(200, 149, 108, 0.08)' : 'rgba(255,255,255,0.01)',
                            border: addOns[id] ? '1px solid #C8956C' : '1px solid rgba(255,255,255,0.04)',
                            padding: '10px 14px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            transition: 'all 0.15s'
                          }}
                        >
                          <span style={{ fontSize: '12.5px', color: addOns[id] ? '#F5ECD7' : '#D0B890' }}>{name}</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '11px', color: '#C8956C' }}>{extra}</span>
                            <span style={{
                              width: '14px', height: '14px', borderRadius: '4px',
                              border: '1.5px solid #C8956C', display: 'flex', alignItems: 'center', justifyContent: 'center',
                              background: addOns[id] ? '#C8956C' : 'transparent',
                              fontSize: '9px', color: '#0f0905', fontWeight: 'bold'
                            }}>{addOns[id] ? '✓' : ''}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                // Pastry modifiers (Warm only)
                <div>
                  <div 
                    onClick={() => setAddOns({ ...addOns, whip: !addOns.whip })}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      background: addOns.whip ? 'rgba(200, 149, 108, 0.08)' : 'rgba(255,255,255,0.01)',
                      border: addOns.whip ? '1px solid #C8956C' : '1px solid rgba(255,255,255,0.04)',
                      padding: '14px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.15s'
                    }}
                  >
                    <div>
                      <span style={{ fontSize: '13px', color: '#F5ECD7', fontWeight: '600' }}>Warmed & Served Heated</span>
                      <p style={{ fontSize: '10px', color: '#8A7060', margin: '2px 0 0' }}>Heat twice-baked pastry in convection oven.</p>
                    </div>
                    <span style={{
                      width: '16px', height: '16px', borderRadius: '4px',
                      border: '1.5px solid #C8956C', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: addOns.whip ? '#C8956C' : 'transparent',
                      fontSize: '11px', color: '#0f0905', fontWeight: 'bold'
                    }}>{addOns.whip ? '✓' : ''}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div style={{ background: 'rgba(15, 9, 5, 0.4)', borderTop: '1px solid rgba(255, 255, 255, 0.05)', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '11px', color: '#8A7060', display: 'block', textTransform: 'uppercase' }}>ITEM TOTAL</span>
                <span style={{ fontSize: '24px', color: '#C8956C', fontWeight: 'bold' }}>${modalState.price.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => setSelectedProduct(null)} className="btn-secondary" style={{ padding: '10px 18px', borderRadius: '6px', fontSize: '12px' }}>Cancel</button>
                <button onClick={handleAddToCart} className="btn-primary" style={{ padding: '10px 22px', borderRadius: '6px', fontSize: '12px' }}>Add to Cart 🛒</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
