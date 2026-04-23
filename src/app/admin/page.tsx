'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase, Order, OrderItem } from '@/lib/supabase';

export default function AdminPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderItems, setOrderItems] = useState<Record<number, OrderItem[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;

      if (ordersData && ordersData.length > 0) {
        setOrders(ordersData);

        // Fetch ALL order items in one query instead of looping one-by-one
        const orderIds = ordersData.map((o: Order) => o.id);
        const { data: allItems, error: itemsError } = await supabase
          .from('order_items')
          .select('*')
          .in('order_id', orderIds);

        if (itemsError) throw itemsError;

        // Group items by order_id
        const grouped: Record<number, OrderItem[]> = {};
        (allItems || []).forEach((item: OrderItem) => {
          if (!grouped[item.order_id]) grouped[item.order_id] = [];
          grouped[item.order_id].push(item);
        });
        setOrderItems(grouped);
      } else {
        setOrders([]);
        setOrderItems({});
      }

      setError('');
      setLastUpdated(new Date());
    } catch (err: any) {
      console.error('Fetch error:', err);
      setError('Could not load orders. Check your Supabase connection and RLS policies.');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateStatus = async (id: number, status: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id);
    if (error) {
      alert('Failed to update status: ' + error.message);
      return;
    }
    setOrders(prev =>
      prev.map(o => (o.id === id ? { ...o, status: status as Order['status'] } : o))
    );
  };

  useEffect(() => {
    fetchOrders();

    // Real-time subscription — no more stuck "Loading orders..."
    const channel = supabase
      .channel('orders-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        fetchOrders();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'order_items' }, () => {
        fetchOrders();
      })
      .subscribe();

    // Fallback polling every 10s
    const interval = setInterval(fetchOrders, 10000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, [fetchOrders]);

  const statusColors: Record<string, string> = {
    pending: '#d4a53c',
    preparing: '#5cb8ff',
    ready: '#5cb85c',
    done: '#888',
  };

  return (
    <div className="admin-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <h1 className="admin-title" style={{ margin: 0 }}>Admin Dashboard</h1>
        <button
          onClick={fetchOrders}
          style={{
            background: 'transparent',
            border: '1px solid #3a3020',
            color: '#d4a53c',
            padding: '0.4rem 1rem',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.85rem',
          }}
        >
          ↻ Refresh
        </button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <a href="/" className="back-link">← Back to Menu</a>
        {lastUpdated && (
          <span style={{ fontSize: '0.75rem', color: '#7a6e5a' }}>
            Updated: {lastUpdated.toLocaleTimeString()}
          </span>
        )}
      </div>

      {/* Summary bar */}
      {!loading && orders.length > 0 && (
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          {(['pending', 'preparing', 'ready', 'done'] as const).map(s => {
            const count = orders.filter(o => o.status === s).length;
            return (
              <div key={s} style={{
                background: '#141414',
                border: '1px solid #222',
                borderRadius: '8px',
                padding: '0.6rem 1rem',
                minWidth: '80px',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '1.3rem', fontWeight: 700, color: statusColors[s] }}>{count}</div>
                <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#7a6e5a' }}>{s}</div>
              </div>
            );
          })}
        </div>
      )}

      <div className="orders-list">
        {loading ? (
          <div className="loading">Loading orders...</div>
        ) : error ? (
          <div style={{ color: '#ff6b6b', padding: '2rem', textAlign: 'center', background: '#1a0a0a', borderRadius: '12px', border: '1px solid #3a1010' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>⚠️</div>
            <div style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Connection Error</div>
            <div style={{ fontSize: '0.85rem', color: '#9c8660' }}>{error}</div>
            <button
              onClick={fetchOrders}
              style={{ marginTop: '1rem', background: '#d4a53c', color: '#0a0a0a', border: 'none', padding: '0.5rem 1.5rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 700 }}
            >
              Try Again
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="no-orders">
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🍽️</div>
            <div>No orders yet</div>
            <div style={{ fontSize: '0.8rem', marginTop: '0.5rem', color: '#7a6e5a' }}>Orders will appear here in real-time</div>
          </div>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="order-card" style={{ borderLeft: `3px solid ${statusColors[order.status] || '#222'}` }}>
              <div className="order-header">
                <div>
                  <span className="order-id">Order #{order.id}</span>
                  <span style={{ marginLeft: '0.8rem', color: '#9c8660', fontSize: '0.85rem' }}>
                    {order.customer_name}
                  </span>
                </div>
                <span className={`order-status ${order.status}`}>{order.status}</span>
              </div>
              <div className="order-details">
                <div>🪑 Table: <strong style={{ color: '#f5f0e8' }}>{order.table_no}</strong></div>
                <div>📦 Type: <strong style={{ color: '#f5f0e8', textTransform: 'capitalize' }}>{order.order_type}</strong></div>
                <div>💰 Total: <strong style={{ color: '#d4a53c' }}>₹{order.total}</strong></div>
                <div>🕐 {order.created_at ? new Date(order.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : ''}</div>
              </div>

              {orderItems[order.id!] && orderItems[order.id!].length > 0 && (
                <div className="order-items-list">
                  <strong>Items:</strong>
                  <ul>
                    {orderItems[order.id!].map((item) => (
                      <li key={item.id}>
                        {item.item_name} × {item.qty}
                        <span style={{ color: '#d4a53c', marginLeft: '0.5rem' }}>₹{item.price * item.qty}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="order-actions">
                {(['pending', 'preparing', 'ready', 'done'] as const).map(s => (
                  <button
                    key={s}
                    onClick={() => updateStatus(order.id!, s)}
                    style={{
                      borderColor: order.status === s ? statusColors[s] : undefined,
                      color: order.status === s ? statusColors[s] : undefined,
                      fontWeight: order.status === s ? 700 : undefined,
                    }}
                  >
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
