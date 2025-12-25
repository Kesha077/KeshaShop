import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Language, Translations, Order, OrderStatus, User } from '../types';
import { TRANSLATIONS, INITIAL_PRODUCTS } from '../constants';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  products: Product[];
  addProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  updateProduct: (product: Product) => void;
  cart: CartItem[];
  addToCart: (product: Product, selectedSize?: string) => void;
  removeFromCart: (productId: string, selectedSize?: string) => void;
  clearCart: () => void;
  orders: Order[];
  addOrder: (order: Omit<Order, 'timeline'>) => void;
  updateOrder: (orderId: string, status: OrderStatus, data?: Partial<Order>) => void;
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  users: User[]; // The "Database" of users
  registerUser: (user: User) => boolean;
  loginUser: (fiveDigitId: string, password?: string) => User | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('kesha_language');
      return (stored as Language) || 'ru';
    }
    return 'ru';
  });

  // --- USER DATABASE LOGIC ---
  const [users, setUsers] = useState<User[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('kesha_db_users');
      if (stored) return JSON.parse(stored);
    }
    return [];
  });

  // Current Logged In User
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('kesha_current_user');
      if (stored) return JSON.parse(stored);
    }
    return null;
  });

  const [products, setProducts] = useState<Product[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('kesha_products');
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {
          console.error("Failed to parse products", e);
        }
      }
    }
    return INITIAL_PRODUCTS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('kesha_cart');
      if (stored) return JSON.parse(stored);
    }
    return [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('kesha_orders');
      if (stored) return JSON.parse(stored);
    }
    return [];
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('kesha_language', lang);
  };

  // --- PERSISTENCE EFFECTS ---
  useEffect(() => {
    localStorage.setItem('kesha_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('kesha_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('kesha_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('kesha_db_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
        localStorage.setItem('kesha_current_user', JSON.stringify(currentUser));
    } else {
        localStorage.removeItem('kesha_current_user');
    }
  }, [currentUser]);

  // --- HELPER FUNCTIONS ---

  const registerUser = (user: User) => {
    // Check if ID already exists (very rare but good practice)
    const exists = users.find(u => u.fiveDigitId === user.fiveDigitId);
    if (exists) return false;
    
    setUsers(prev => [...prev, user]);
    return true;
  };

  const loginUser = (fiveDigitId: string, password?: string) => {
      const foundUser = users.find(u => u.fiveDigitId === fiveDigitId);
      if (foundUser && foundUser.password === password) {
          return foundUser;
      }
      return null;
  };

  const addProduct = (product: Product) => {
    setProducts(prev => [product, ...prev]);
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const updateProduct = (updatedProduct: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };

  const addToCart = (product: Product, selectedSize?: string) => {
    setCart(prev => {
      const existing = prev.find(item => 
        item.id === product.id && item.selectedSize === selectedSize
      );
      
      if (existing) {
        return prev.map(item => 
          (item.id === product.id && item.selectedSize === selectedSize)
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, { ...product, quantity: 1, selectedSize }];
    });
  };

  const removeFromCart = (productId: string, selectedSize?: string) => {
    setCart(prev => prev.filter(item => 
      !(item.id === productId && item.selectedSize === selectedSize)
    ));
  };

  const clearCart = () => {
    setCart([]);
  };

  const addOrder = (order: Omit<Order, 'timeline'>) => {
    const newOrder: Order = {
        ...order,
        timeline: [{ status: order.status, date: new Date().toISOString() }]
    };
    setOrders(prev => [newOrder, ...prev]);
  };

  const updateOrder = (orderId: string, status: OrderStatus, data?: Partial<Order>) => {
    setOrders(prev => prev.map(o => {
        if (o.id === orderId) {
            const shouldUpdateTimeline = o.status !== status;
            return { 
                ...o, 
                ...data, 
                status,
                timeline: shouldUpdateTimeline 
                    ? [...(o.timeline || []), { status, date: new Date().toISOString() }] 
                    : o.timeline
            };
        }
        return o;
    }));
  };

  return (
    <AppContext.Provider value={{
      language,
      setLanguage,
      t: TRANSLATIONS[language],
      products,
      addProduct,
      deleteProduct,
      updateProduct,
      cart,
      addToCart,
      removeFromCart,
      clearCart,
      orders,
      addOrder,
      updateOrder,
      currentUser,
      setCurrentUser,
      users,
      registerUser,
      loginUser
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within an AppProvider');
  return context;
};