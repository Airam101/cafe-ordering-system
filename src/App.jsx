import React, { useState, useEffect } from 'react';
import RoleSwitcher from './components/RoleSwitcher';
import BlueprintView from './components/BlueprintView';
import GuestView from './components/GuestView';
import BaristaKDS from './components/BaristaKDS';
import ManagerView from './components/ManagerView';

// Import seed initial data
import {
  initialCategories,
  initialProducts,
  initialInventory,
  initialStaff,
  initialPromotions
} from './data/initialData';

export default function App() {
  const [activeRole, setActiveRole] = useState('blueprint'); // 'blueprint' | 'guest' | 'barista' | 'manager'
  
  // Seed Database States
  const [categories] = useState(initialCategories);
  const [menu, setMenu] = useState(initialProducts);
  const [inventory, setInventory] = useState(initialInventory);
  const [staff, setStaff] = useState(initialStaff);
  const [promotions, setPromotions] = useState(initialPromotions);

  // Active & Historical Orders State
  const [orders, setOrders] = useState([
    {
      id: "ORD-04871",
      time: "10:32 AM, May 17 2026",
      items: [
        { id: 1, name: "Flat White", size: "M", mods: ["Oat milk", "Medium roast", "1 vanilla pump"], qty: 1, price: 5.50, image: "☕" },
        { id: 2, name: "Signature Cold Brew", size: "L", mods: ["No sugar", "Extra ice"], qty: 1, price: 5.75, image: "🧊" },
        { id: 3, name: "Almond Croissant", size: null, mods: ["Warmed"], qty: 2, price: 4.50, image: "🥐" }
      ],
      subtotal: 20.25,
      discountAmount: 0,
      tax: 1.62,
      status: 'Received', // Received | Preparing | Ready | Collected
      barista: 'Sarah K.',
      table: 'Table 07',
      timer: 88 // seconds elapsed
    },
    {
      id: "ORD-04870",
      time: "10:15 AM, May 17 2026",
      items: [
        { id: 4, name: "Golden Oat Latte", size: "L", mods: ["Extra hot"], qty: 1, price: 6.85, image: "🌾" }
      ],
      subtotal: 6.85,
      discountAmount: 0,
      tax: 0.55,
      status: 'Preparing',
      barista: 'Alex M.',
      table: 'Table 12',
      timer: 145
    }
  ]);

  // Real-time ticking KDS order age counter
  useEffect(() => {
    const interval = setInterval(() => {
      setOrders(prevOrders => 
        prevOrders.map(order => {
          if (order.status !== 'Collected') {
            return { ...order, timer: order.timer + 1 };
          }
          return order;
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // ── OPERATIONS LOGIC ──

  // Order Submission & Inventory Deduction Logic
  const handleAddNewOrder = (newOrder) => {
    // 1. Add order to list
    setOrders(prev => [newOrder, ...prev]);

    // 2. Deduct ingredient inventory levels dynamically
    setInventory(prevInventory => {
      const updatedInv = { ...prevInventory };

      newOrder.items.forEach(cartItem => {
        // Find corresponding product definitions in menu
        const menuProduct = menu.find(p => p.id === cartItem.productId);
        if (menuProduct && menuProduct.ingredients) {
          menuProduct.ingredients.forEach(recipeIngredient => {
            const name = recipeIngredient.name;
            const requiredQty = recipeIngredient.amount * cartItem.qty;

            if (updatedInv[name]) {
              updatedInv[name] = {
                ...updatedInv[name],
                qty: Math.max(0, updatedInv[name].qty - requiredQty)
              };
            }
          });
        }
      });

      // 3. Auto-hide out-of-stock items:
      // If any ingredient level hits 0, auto-toggle product status to out of stock!
      setMenu(prevMenu => 
        prevMenu.map(product => {
          if (product.ingredients) {
            const hasMissingIngredients = product.ingredients.some(recipeIngredient => {
              const name = recipeIngredient.name;
              return updatedInv[name] && updatedInv[name].qty <= 0;
            });
            if (hasMissingIngredients) {
              return { ...product, inStock: false };
            }
          }
          return product;
        })
      );

      return updatedInv;
    });
  };

  // KDS Status Bumping
  const handleUpdateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return { ...o, status: newStatus };
      }
      return o;
    }));
  };

  // Menu CRUD Callbacks
  const handleAddMenuItem = (newItem) => {
    setMenu(prev => [...prev, newItem]);
  };

  const handleUpdateMenuItem = (id, updatedFields) => {
    setMenu(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, ...updatedFields };
      }
      return item;
    }));
  };

  const handleDeleteMenuItem = (id) => {
    setMenu(prev => prev.filter(item => item.id !== id));
  };

  // Restock Inventory back to full capacity
  const handleRestockInventory = () => {
    setInventory(prev => {
      const restocked = { ...prev };
      Object.keys(restocked).forEach(key => {
        const fullAmount = key.includes('milk') ? 10000 : key.includes('beans') ? 2500 : 200;
        restocked[key] = {
          ...restocked[key],
          qty: fullAmount
        };
      });
      
      // Also restore menu items stock indicators back to true!
      setMenu(prevMenu => prevMenu.map(p => ({ ...p, inStock: true })));

      return restocked;
    });
  };

  // Staff Clock In/Out Status Toggle
  const handleToggleStaffShift = (staffId) => {
    setStaff(prev => prev.map(member => {
      if (member.id === staffId) {
        const isClockingIn = !member.activeShift;
        return {
          ...member,
          activeShift: isClockingIn,
          clockInTime: isClockingIn ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null
        };
      }
      return member;
    }));
  };

  // Promotion Coupons Callbacks
  const handleAddPromotion = (newPromo) => {
    setPromotions(prev => [...prev, newPromo]);
  };

  const handleTogglePromotion = (code) => {
    setPromotions(prev => prev.map(p => {
      if (p.code === code) {
        return { ...p, active: !p.active };
      }
      return p;
    }));
  };

  // Nav counts
  const pendingKdsCount = orders.filter(o => o.status !== 'Collected').length;
  const activeStaffCount = staff.filter(s => s.activeShift).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      
      {/* Central Role Selector Navigation bar */}
      <RoleSwitcher
        activeRole={activeRole}
        setActiveRole={setActiveRole}
        cartCount={0} // dynamically managed inside GuestView cart locally
        pendingKdsCount={pendingKdsCount}
        activeStaffCount={activeStaffCount}
      />

      {/* Screen Render Router */}
      <main style={{ flex: 1 }}>
        {activeRole === 'blueprint' && (
          <BlueprintView onSwitchToDemo={() => setActiveRole('guest')} />
        )}
        
        {activeRole === 'guest' && (
          <GuestView
            menu={menu}
            categories={categories}
            promotions={promotions}
            onSubmitOrder={handleAddNewOrder}
            activeOrders={orders}
          />
        )}

        {activeRole === 'barista' && (
          <BaristaKDS
            orders={orders}
            onUpdateOrderStatus={handleUpdateOrderStatus}
          />
        )}

        {activeRole === 'manager' && (
          <ManagerView
            menu={menu}
            onAddMenuItem={handleAddMenuItem}
            onUpdateMenuItem={handleUpdateMenuItem}
            onDeleteMenuItem={handleDeleteMenuItem}
            inventory={inventory}
            onRestockInventory={handleRestockInventory}
            staff={staff}
            onToggleStaffShift={handleToggleStaffShift}
            orders={orders}
            promotions={promotions}
            onAddPromotion={handleAddPromotion}
            onTogglePromotion={handleTogglePromotion}
          />
        )}
      </main>

    </div>
  );
}
