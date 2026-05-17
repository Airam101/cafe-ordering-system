import React, { useState } from 'react';

export default function BaristaKDS({ orders, onUpdateOrderStatus }) {
  const [stationFilter, setStationFilter] = useState('all'); // 'all' | 'espresso' | 'cold' | 'pastry'

  // Format timer seconds into mm:ss
  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Filter orders based on selected station
  const filteredOrders = orders.filter(order => {
    // Show completed (Collected) orders in KDS only if they were done recently or hide them
    if (order.status === 'Collected') return false;

    if (stationFilter === 'all') return true;
    
    // Check if order contains an item belonging to the filtered category
    return order.items.some(item => {
      // Find the product's category (using quick name check or fallback)
      const name = item.name.toLowerCase();
      if (stationFilter === 'espresso') {
        return name.includes('flat') || name.includes('latte') || name.includes('cortado');
      }
      if (stationFilter === 'cold') {
        return name.includes('cold') || name.includes('brew') || name.includes('iced');
      }
      if (stationFilter === 'pastry') {
        return name.includes('croissant') || name.includes('cruffin');
      }
      return true;
    });
  });

  // Split orders by status column
  const newOrders = filteredOrders.filter(o => o.status === 'Received');
  const preparingOrders = filteredOrders.filter(o => o.status === 'Preparing');
  const readyOrders = filteredOrders.filter(o => o.status === 'Ready');

  // Calculating stats
  const activeTickets = orders.filter(o => o.status !== 'Collected').length;
  const avgWaitTime = orders.length > 0 
    ? Math.round(orders.reduce((sum, o) => sum + o.timer, 0) / orders.length) 
    : 0;

  return (
    <div className="container-max" style={{ padding: '30px 0 60px' }}>
      
      {/* KDS Header Controls */}
      <div className="glass-panel" style={{
        borderRadius: '16px',
        padding: '20px 24px',
        marginBottom: '26px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div>
          <div className="title-badge" style={{ marginBottom: '6px' }}>BARISTA CONSOLE</div>
          <h2 style={{ fontSize: '24px', color: '#F5ECD7', fontFamily: 'var(--font-serif)', margin: 0 }}>Kitchen Display System (KDS)</h2>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {[
            ['all', 'All Stations 📋'],
            ['espresso', 'Espresso Bar ☕'],
            ['cold', 'Cold Bar 🥤'],
            ['pastry', 'Bakery Station 🥐']
          ].map(([id, label]) => (
            <button
              key={id}
              onClick={() => setStationFilter(id)}
              style={{
                padding: '10px 16px',
                border: 'none',
                borderRadius: '8px',
                background: stationFilter === id ? '#C8956C' : 'rgba(255, 255, 255, 0.04)',
                color: stationFilter === id ? '#0f0905' : '#D0B890',
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

        {/* Stats Strip */}
        <div style={{ display: 'flex', gap: '20px', fontSize: '12px' }}>
          <div>
            <span style={{ color: '#8A7060', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Active Tickets</span>
            <span style={{ fontSize: '18px', color: '#C8956C', fontWeight: 'bold', fontFamily: 'var(--font-sans)' }}>{activeTickets} orders</span>
          </div>
          <div style={{ borderLeft: '1px solid rgba(255,255,255,0.1)', height: '30px' }}></div>
          <div>
            <span style={{ color: '#8A7060', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Avg Ticket Age</span>
            <span style={{ fontSize: '18px', color: '#6B8E6B', fontWeight: 'bold', fontFamily: 'var(--font-sans)' }}>{formatTimer(avgWaitTime)}</span>
          </div>
        </div>
      </div>

      {/* KDS Columns Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '24px',
        alignItems: 'start'
      }}>
        
        {/* COLUMN 1: NEW / RECEIVED */}
        <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '14px', padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #4A7EA5', paddingBottom: '10px', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#4A7EA5', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>📥</span> NEW ORDERS
            </h3>
            <span style={{ background: '#4A7EA5', color: '#fff', fontSize: '11px', fontWeight: 'bold', padding: '2px 8px', borderRadius: '10px' }}>{newOrders.length}</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {newOrders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 10px', color: '#8A7060', fontSize: '13px' }}>No new orders pending.</div>
            ) : (
              newOrders.map(order => (
                <KDSTicketCard key={order.id} order={order} formatTimer={formatTimer} onUpdate={onUpdateOrderStatus} />
              ))
            )}
          </div>
        </div>

        {/* COLUMN 2: IN PREPARATION */}
        <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '14px', padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #C8956C', paddingBottom: '10px', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#C8956C', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>☕</span> IN PROGRESS
            </h3>
            <span style={{ background: '#C8956C', color: '#0f0905', fontSize: '11px', fontWeight: 'bold', padding: '2px 8px', borderRadius: '10px' }}>{preparingOrders.length}</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {preparingOrders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 10px', color: '#8A7060', fontSize: '13px' }}>No orders in progress.</div>
            ) : (
              preparingOrders.map(order => (
                <KDSTicketCard key={order.id} order={order} formatTimer={formatTimer} onUpdate={onUpdateOrderStatus} />
              ))
            )}
          </div>
        </div>

        {/* COLUMN 3: READY / DELIVERABLE */}
        <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '14px', padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #6B8E6B', paddingBottom: '10px', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#6B8E6B', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🔔</span> READY FOR PICKUP
            </h3>
            <span style={{ background: '#6B8E6B', color: '#fff', fontSize: '11px', fontWeight: 'bold', padding: '2px 8px', borderRadius: '10px' }}>{readyOrders.length}</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {readyOrders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 10px', color: '#8A7060', fontSize: '13px' }}>No completed orders waiting.</div>
            ) : (
              readyOrders.map(order => (
                <KDSTicketCard key={order.id} order={order} formatTimer={formatTimer} onUpdate={onUpdateOrderStatus} />
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

// Subcomponent: Individual KDS ticket card
function KDSTicketCard({ order, formatTimer, onUpdate }) {
  const isSlaBreached = order.timer > 120; // SLA breach at 2 minutes

  return (
    <div 
      className={`glass-panel ${isSlaBreached && order.status !== 'Ready' ? 'kds-alert-glow' : ''}`}
      style={{
        borderRadius: '10px',
        padding: '16px',
        borderLeft: order.status === 'Received' 
          ? '4px solid #4A7EA5' 
          : order.status === 'Preparing' 
          ? '4px solid #C8956C' 
          : '4px solid #6B8E6B',
        transition: 'all 0.3s ease',
        background: 'rgba(30, 20, 15, 0.5)'
      }}
    >
      {/* Card Header metadata */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div>
          <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#F5ECD7', letterSpacing: '0.5px' }}>{order.id}</span>
          <span style={{ fontSize: '10px', color: '#8A7060', marginLeft: '6px' }}>({order.table})</span>
        </div>
        <div style={{
          fontSize: '11px',
          fontWeight: 'bold',
          color: isSlaBreached && order.status !== 'Ready' ? '#A84E32' : '#C8956C',
          fontFamily: 'var(--font-sans)',
          background: isSlaBreached && order.status !== 'Ready' ? 'rgba(168,78,50,0.15)' : 'rgba(255,255,255,0.05)',
          padding: '2px 8px',
          borderRadius: '4px'
        }}>
          ⏱️ {formatTimer(order.timer)}
        </div>
      </div>

      {/* Items list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
        {order.items.map((item, idx) => (
          <div key={idx} style={{ fontSize: '12.5px', color: '#D0B890', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '600' }}>
              <span>
                {item.qty > 1 && <span style={{ color: '#C8956C', marginRight: '4px' }}>{item.qty}×</span>}
                {item.name}
              </span>
              {item.size && <span style={{ fontSize: '10px', color: '#8A7060' }}>({item.size})</span>}
            </div>
            
            {/* List custom selected modifiers in clear purple tags */}
            {item.mods && item.mods.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px', marginTop: '4px' }}>
                {item.mods.map((m, mi) => (
                  <span key={mi} style={{
                    fontSize: '9px',
                    color: '#E1D5F0',
                    background: 'rgba(139, 110, 158, 0.2)',
                    border: '1px solid rgba(139, 110, 158, 0.4)',
                    padding: '1px 5px',
                    borderRadius: '4px',
                    fontWeight: '500'
                  }}>{m}</span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* SLA breach alert text */}
      {isSlaBreached && order.status !== 'Ready' && (
        <div style={{
          fontSize: '9.5px',
          color: '#A84E32',
          background: 'rgba(168,78,50,0.1)',
          padding: '4px',
          borderRadius: '4px',
          textAlign: 'center',
          marginBottom: '12px',
          fontWeight: 'bold',
          letterSpacing: '0.5px'
        }}>
          ⚠️ SLA WARNING: ORDER PENDING OVER 2 MINS
        </div>
      )}

      {/* Bump workflow CTA */}
      <div>
        {order.status === 'Received' && (
          <button 
            onClick={() => onUpdate(order.id, 'Preparing')} 
            className="btn-primary" 
            style={{ width: '100%', padding: '8px', borderRadius: '6px', fontSize: '11px' }}
          >
            Accept Ticket ➔
          </button>
        )}
        {order.status === 'Preparing' && (
          <button 
            onClick={() => onUpdate(order.id, 'Ready')} 
            className="btn-primary" 
            style={{ width: '100%', padding: '8px', borderRadius: '6px', fontSize: '11px', background: '#C8956C' }}
          >
            Mark Ready ✓
          </button>
        )}
        {order.status === 'Ready' && (
          <button 
            onClick={() => onUpdate(order.id, 'Collected')} 
            className="btn-primary" 
            style={{ width: '100%', padding: '8px', borderRadius: '6px', fontSize: '11px', background: '#6B8E6B', color: '#fff' }}
          >
            Deliver Order 🚀
          </button>
        )}
      </div>
    </div>
  );
}
