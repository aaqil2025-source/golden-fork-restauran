import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/components/CartContext';

export const metadata: Metadata = {
  title: 'The Golden Fork',
  description: 'Fine Dining & Cuisine — Digital Menu',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
