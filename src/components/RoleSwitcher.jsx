import React from 'react';

export default function RoleSwitcher({ activeRole, setActiveRole, cartCount, pendingKdsCount, activeStaffCount }) {
  const roles = [
    { id: 'blueprint', label: 'Tech Blueprint', icon: '📋', desc: 'System Roadmap & Modules' },
    { id: 'guest', label: 'Guest Ordering', icon: '🛒', desc: 'Browse Menu & Checkout' },
    { id: 'barista', label: 'Barista KDS', icon: '🖥️', desc: 'Kitchen Display Screen' },
    { id: 'manager', label: 'Manager Panel', icon: '📊', desc: 'Analytics & Menu Admin' }
  ];

  return (
    <header style={{
      background: 'rgba(15, 9, 5, 0.85)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(200, 149, 108, 0.15)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      padding: '12px 24px'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        {/* Left - Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => setActiveRole('blueprint')}>
          <span style={{ fontSize: '24px', animation: 'brewing-pulse 2s ease-in-out infinite' }}>☕</span>
          <div>
            <h1 style={{ fontSize: '18px', color: '#F5ECD7', letterSpacing: '1.5px', margin: 0, fontFamily: 'var(--font-serif)' }}>BREW & CO.</h1>
            <span style={{ fontSize: '10px', color: '#C8956C', letterSpacing: '2px', textTransform: 'uppercase', display: 'block', marginTop: '-2px' }}>Smart Cafe OS</span>
          </div>
        </div>

        {/* Center - Tabs */}
        <nav style={{
          display: 'flex',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          borderRadius: '12px',
          padding: '4px',
          gap: '2px'
        }}>
          {roles.map((role) => {
            const isActive = activeRole === role.id;
            return (
              <button
                key={role.id}
                onClick={() => setActiveRole(role.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  background: isActive ? '#C8956C' : 'transparent',
                  color: isActive ? '#0f0905' : '#D0B890',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '13px',
                  fontWeight: '600',
                  transition: 'all 0.2s ease',
                  position: 'relative'
                }}
              >
                <span>{role.icon}</span>
                <span className="nav-label">{role.label}</span>
                
                {/* Visual badges on navigation bar items */}
                {role.id === 'guest' && cartCount > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '-6px',
                    background: '#6B8E6B',
                    color: '#fff',
                    borderRadius: '99px',
                    fontSize: '9px',
                    padding: '2px 6px',
                    fontWeight: 'bold',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.3)'
                  }}>{cartCount}</span>
                )}
                {role.id === 'barista' && pendingKdsCount > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '-6px',
                    background: '#A84E32',
                    color: '#fff',
                    borderRadius: '99px',
                    fontSize: '9px',
                    padding: '2px 6px',
                    fontWeight: 'bold',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
                    animation: 'brewing-pulse 1.5s ease-in-out infinite'
                  }}>{pendingKdsCount}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right - Live Counters */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          fontSize: '11px',
          color: '#8A7060',
          fontFamily: 'var(--font-sans)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#6B8E6B', display: 'inline-block', animation: 'status-fade 2s ease-in-out infinite' }}></span>
            <span>SYSTEM ONLINE</span>
          </div>
          <div style={{ borderLeft: '1px solid rgba(255,255,255,0.1)', height: '14px' }}></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>👥 STAFF ON-SHIFT: <b>{activeStaffCount}</b></span>
          </div>
        </div>
      </div>
    </header>
  );
}
