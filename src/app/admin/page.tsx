'use client';

import { useEffect, useState } from 'react';
import { supabase, Order } from '@/lib/supabase';

export default function AdminPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setOrders(data);
    }
    setLoading(false);
  };

  const updateStatus = async (id: number, status: string) => {
    await supabase
      .from('orders')
      .update({ status })
      .eq('id', id);
    fetchOrders();
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="admin-container">
      <h1 className="admin-title">Admin Dashboard</h1>
      <a href="/" className="back-link">← Back to Menu</a>
      
      <div className="orders-list">
        {loading ? (
          <div className="loading">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="no-orders">No orders yet</div>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <span className="order-id">Order #{order.id}</span>
                <span className={`order-status ${order.status}`}>{order.status}</span>
              </div>
              <div className="order-details">
                <div>Table: {order.table_no}</div>
                <div>Type: {order.order_type}</div>
                <div>Total: ₹{order.total}</div>
                <div>{new Date(order.created_at || '').toLocaleTimeString()}</div>
              </div>
              <div className="order-actions">
                <button onClick={() => updateStatus(order.id!, 'preparing')}>Preparing</button>
                <button onClick={() => updateStatus(order.id!, 'ready')}>Ready</button>
                <button onClick={() => updateStatus(order.id!, 'done')}>Done</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}