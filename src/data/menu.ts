export type Badge = 'veg' | 'spicy' | 'special' | 'popular';

export interface MenuItem {
  id: number;
  category: string;
  name: string;
  desc: string;
  price: number;
  emoji: string;
  badges: Badge[];
}

export interface Category {
  id: string;
  label: string;
}

export const categories: Category[] = [
  { id: 'all', label: 'All' },
  { id: 'starters', label: 'Starters' },
  { id: 'mains', label: 'Main Course' },
  { id: 'breads', label: 'Breads' },
  { id: 'rice', label: 'Rice & Biryani' },
  { id: 'desserts', label: 'Desserts' },
  { id: 'drinks', label: 'Drinks' },
];

export const categoryNames: Record<string, string> = {
  starters: 'Starters',
  mains: 'Main Course',
  breads: 'Breads & Rotis',
  rice: 'Rice & Biryani',
  desserts: 'Desserts',
  drinks: 'Beverages',
};

export const menuItems: MenuItem[] = [
  { id: 1, category: 'starters', name: 'Crispy Paneer Tikka', desc: 'Tender paneer cubes marinated in spiced yogurt, grilled to golden perfection.', price: 299, emoji: '🧀', badges: ['veg', 'popular'] },
  { id: 2, category: 'starters', name: 'Chicken Seekh Kebab', desc: 'Minced chicken with herbs and spices, skewered and charcoal grilled.', price: 349, emoji: '🍢', badges: ['spicy'] },
  { id: 3, category: 'starters', name: 'Mushroom 65', desc: 'Crispy fried mushrooms tossed in a fiery, tangy masala sauce.', price: 249, emoji: '🍄', badges: ['veg', 'spicy'] },
  { id: 4, category: 'starters', name: 'Prawn Koliwada', desc: 'Coastal-style crispy prawns with cumin, ajwain and lemon.', price: 399, emoji: '🍤', badges: ['special'] },
  { id: 5, category: 'mains', name: 'Butter Chicken', desc: 'Succulent chicken in a rich, velvety tomato-butter gravy. A timeless classic.', price: 449, emoji: '🍛', badges: ['popular'] },
  { id: 6, category: 'mains', name: 'Dal Makhani', desc: 'Slow-cooked black lentils simmered overnight in cream and butter.', price: 299, emoji: '🫘', badges: ['veg', 'popular'] },
  { id: 7, category: 'mains', name: 'Mutton Rogan Josh', desc: 'Kashmiri-style slow-braised mutton with aromatic whole spices.', price: 549, emoji: '🥩', badges: ['special', 'spicy'] },
  { id: 8, category: 'mains', name: 'Palak Paneer', desc: 'Fresh cottage cheese in a smooth, spiced spinach gravy.', price: 319, emoji: '🌿', badges: ['veg'] },
  { id: 9, category: 'mains', name: 'Chettinad Chicken Curry', desc: 'Bold, fiery South Indian curry with kalpasi and marathi mokku spices.', price: 479, emoji: '🍲', badges: ['spicy', 'special'] },
  { id: 10, category: 'breads', name: 'Butter Naan', desc: 'Soft leavened bread baked in a tandoor, brushed with butter.', price: 59, emoji: '🫓', badges: ['veg'] },
  { id: 11, category: 'breads', name: 'Garlic Kulcha', desc: 'Stuffed flatbread with garlic and coriander, tandoor-baked.', price: 79, emoji: '🫓', badges: ['veg', 'popular'] },
  { id: 12, category: 'breads', name: 'Parotta', desc: 'Layered, flaky South Indian flatbread, best with curries.', price: 49, emoji: '🫓', badges: ['veg'] },
  { id: 13, category: 'rice', name: 'Hyderabadi Dum Biryani', desc: 'Aromatic basmati rice slow-cooked with saffron, caramelized onions and tender mutton.', price: 499, emoji: '🍚', badges: ['special', 'popular'] },
  { id: 14, category: 'rice', name: 'Vegetable Biryani', desc: 'Fragrant basmati with seasonal vegetables and whole spices, sealed in dum.', price: 349, emoji: '🍚', badges: ['veg'] },
  { id: 15, category: 'rice', name: 'Chicken Fried Rice', desc: 'Wok-tossed jasmine rice with chicken, egg and spring onions.', price: 299, emoji: '🍳', badges: [] },
  { id: 16, category: 'desserts', name: 'Gulab Jamun', desc: 'Soft milk-solid dumplings soaked in rose-saffron sugar syrup.', price: 149, emoji: '🍮', badges: ['veg', 'popular'] },
  { id: 17, category: 'desserts', name: 'Kulfi Falooda', desc: 'Traditional Indian ice cream with vermicelli, basil seeds and rose syrup.', price: 179, emoji: '🍦', badges: ['veg', 'special'] },
  { id: 18, category: 'desserts', name: 'Chocolate Lava Cake', desc: 'Warm dark chocolate cake with a molten centre, served with vanilla ice cream.', price: 199, emoji: '🍫', badges: [] },
  { id: 19, category: 'drinks', name: 'Mango Lassi', desc: 'Chilled yogurt blended with ripe Alphonso mangoes and a hint of cardamom.', price: 129, emoji: '🥭', badges: ['veg', 'popular'] },
  { id: 20, category: 'drinks', name: 'Fresh Lime Soda', desc: 'Freshly squeezed lime with your choice of sweet, salty or mixed.', price: 79, emoji: '🍋', badges: ['veg'] },
  { id: 21, category: 'drinks', name: 'Masala Chai', desc: 'Traditional spiced tea brewed with ginger, cardamom, and full cream milk.', price: 69, emoji: '☕', badges: ['veg'] },
  { id: 22, category: 'drinks', name: 'Virgin Mojito', desc: 'Refreshing mint, lime and soda with crushed ice — a house favourite.', price: 149, emoji: '🍹', badges: ['veg', 'popular'] },
];
