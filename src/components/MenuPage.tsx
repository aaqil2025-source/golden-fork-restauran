'use client';

import { useState } from 'react';
import { menuItems, categories, categoryNames } from '@/data/menu';
import { useCart } from './CartContext';
import MenuItemCard from './MenuItemCard';
import CartPanel from './CartPanel';
import ScrollAnimation from './ScrollAnimation';

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [tableNo, setTableNo] = useState('1');
  const [cartOpen, setCartOpen] = useState(false);
  const { totalItems } = useCart();

  const visibleCategories =
    activeCategory === 'all'
      ? ['starters', 'mains', 'breads', 'rice', 'desserts', 'drinks']
      : [activeCategory];

  return (
    <>
      <ScrollAnimation />
      {/* Hero */}
      <header className="hero">
        <div className="fork-icon">🍴</div>
        <h1 className="brand">The Golden Fork</h1>
        <p className="tagline">Fine Dining &amp; Cuisine</p>
        <div className="gold-line" />
      </header>

      {/* Table bar */}
      <div className="table-bar">
        <div className="table-info">
          <span className="table-label">Table</span>
          <select
            className="table-select"
            value={tableNo}
            onChange={e => setTableNo(e.target.value)}
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map(n => (
              <option key={n} value={String(n)}>{n}</option>
            ))}
          </select>
        </div>
        <button className="cart-btn" onClick={() => setCartOpen(true)}>
          View Order{' '}
          <span className="cart-count">{totalItems}</span>
        </button>
      </div>

      {/* Category filter */}
      <nav className="categories">
        {categories.map(cat => (
          <button
            key={cat.id}
            className={`cat-btn${activeCategory === cat.id ? ' active' : ''}`}
            onClick={() => setActiveCategory(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </nav>

      {/* Menu sections */}
      <main>
        {visibleCategories.map(cat => {
          const items = menuItems.filter(i => i.category === cat);
          if (!items.length) return null;
          return (
            <section key={cat}>
              <h2 className="section-title">{categoryNames[cat]}</h2>
              <div className="menu-grid">
                {items.map(item => (
                  <MenuItemCard key={item.id} item={item} />
                ))}
              </div>
            </section>
          );
        })}
      </main>

      {/* Cart panel */}
      {cartOpen && (
        <CartPanel tableNo={tableNo} onClose={() => setCartOpen(false)} />
      )}
    </>
  );
}
