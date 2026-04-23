'use client';

import { MenuItem } from '@/data/menu';
import { useCart } from './CartContext';

const badgeConfig: Record<string, { label: string; className: string }> = {
  veg:     { label: 'Veg',            className: 'badge-veg' },
  spicy:   { label: 'Spicy',          className: 'badge-spicy' },
  special: { label: "Chef's Special", className: 'badge-special' },
  popular: { label: 'Popular',        className: 'badge-popular' },
};

export default function MenuItemCard({ item }: { item: MenuItem }) {
  const { cart, addToCart, changeQty } = useCart();
  const inCart = cart[item.id]?.qty ?? 0;

  return (
    <div className="item-card">
      <div className="item-img-placeholder">{item.emoji}</div>
      <div className="item-body">
        <div className="item-name">{item.name}</div>
        <div className="item-desc">{item.desc}</div>
        <div className="item-footer">
          <span className="item-price">₹{item.price}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div className="item-badges">
              {item.badges.map(b => (
                <span key={b} className={`badge ${badgeConfig[b]?.className}`}>
                  {badgeConfig[b]?.label}
                </span>
              ))}
            </div>
            {inCart > 0 ? (
              <div className="qty-controls">
                <button className="qty-btn minus" onClick={() => changeQty(item.id, -1)}>−</button>
                <span className="qty-num">{inCart}</span>
                <button className="qty-btn plus" onClick={() => changeQty(item.id, 1)}>+</button>
              </div>
            ) : (
              <button className="add-btn" onClick={() => addToCart(item)}>+</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
