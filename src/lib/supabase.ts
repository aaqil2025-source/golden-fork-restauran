import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://srvmhutyibwjdfntxuhz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNydm1odXR5aWJ3amRmbnR4dWh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3NDA2OTgsImV4cCI6MjA5MjMxNjY5OH0.XHMGbha7KlDJFRctDhJmeCIPaPv-hTs61v6tajYz50o';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Order {
  id?: number;
  table_no: string;
  customer_name: string;
  total: number;
  status: 'pending' | 'preparing' | 'ready' | 'done';
  order_type: 'pickup' | 'delivery';
  created_at?: string;
}

export interface OrderItem {
  id?: number;
  order_id: number;
  item_name: string;
  price: number;
  qty: number;
}