'use client';

import { useState } from 'react';
import { useCart, CartItem } from './CartContext';
import { supabase, Order, OrderItem } from '@/lib/supabase';

interface CartPanelProps {
  tableNo: string;
  onClose: () => void;
}

export default function CartPanel({ tableNo, onClose }: CartPanelProps) {
  const { cart, changeQty, clearCart, totalPrice } = useCart();
  const [ordered, setOrdered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [orderType, setOrderType] = useState('pickup');
  const items = Object.values(cart);
  const gst = Math.round(totalPrice * 0.05);

  const placeOrder = async () => {
    if (!customerName.trim()) {
      setError('Please enter your name');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert([{
          table_no: tableNo,
          customer_name: customerName.trim(),
          total: totalPrice + gst,
          status: 'pending',
          order_type: orderType
        }])
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems: Omit<OrderItem, 'id'>[] = items.map(({ item, qty }: CartItem) => ({
        order_id: orderData.id,
        item_name: item.name,
        price: item.price,
        qty
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      setOrdered(true);
      clearCart();
      setCustomerName('');
      setTimeout(() => {
        setOrdered(false);
        onClose();
      }, 3000);
    } catch (err: any) {
      console.error('Order error:', err);
      setError('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cart-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="cart-panel">
        {ordered ? (
          <div className="order-success">
            <div className="success-icon">✓</div>
            <div className="success-msg">Order Placed!</div>
            <div className="success-sub">
              {customerName} · Table {tableNo} · {orderType === 'pickup' ? 'Pickup' : 'Delivery'}
            </div>
          </div>
        ) : (
          <>
            <div className="cart-header">
              <span className="cart-title">Your Order</span>
              <button className="close-btn" onClick={onClose}>✕</button>
            </div>

            {items.length === 0 ? (
              <div className="empty-cart">Your order is empty.<br />Add some dishes to get started!</div>
            ) : (
              <>
                <div className="customer-info">
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="customer-name-input"
                  />
                  <select 
                    value={orderType} 
                    onChange={(e) => setOrderType(e.target.value)}
                    className="order-type-select"
                  >
                    <option value="pickup">Pickup</option>
                    <option value="delivery">Delivery</option>
                    <option value="dine-in">Dine In</option>
                  </select>
                </div>

                <div className="cart-items">
                  {items.map(({ item, qty }: CartItem) => (
                    <div key={item.id} className="cart-item">
                      <span className="cart-item-name">{item.name}</span>
                      <div className="cart-item-qty">
                        <button className="qty-btn minus" onClick={() => changeQty(item.id, -1)}>−</button>
                        <span style={{ minWidth: '20px', textAlign: 'center', color: '#f5f0e8' }}>{qty}</span>
                        <button className="qty-btn plus" onClick={() => changeQty(item.id, 1)}>+</button>
                      </div>
                      <span className="cart-item-price">₹{item.price * qty}</span>
                    </div>
                  ))}
                </div>

                <div className="cart-totals">
                  <div className="subtotal-row">
                    <span>Subtotal</span><span>₹{totalPrice}</span>
                  </div>
                  <div className="subtotal-row">
                    <span>GST (5%)</span><span>₹{gst}</span>
                  </div>
                  <div className="cart-total">
                    <span>Total</span><span>₹{totalPrice + gst}</span>
                  </div>
                  <button 
                    className="place-order-btn" 
                    onClick={placeOrder}
                    disabled={loading}
                  >
                    {loading ? 'Placing Order...' : 'Place Order →'}
                  </button>
                  {error && <div style={{ color: '#ff6b6b', marginTop: '8px' }}>{error}</div>}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}