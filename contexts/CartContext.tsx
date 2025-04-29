import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import api from '../app/api/api';

// Types
export interface CartItem {
  id: string;
  name: string;
  brand: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getCartTotal: () => {
    subtotal: number;
    discount: number;
    shippingFee: number;
    total: number;
  };
  fetchCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Récupérer le token
  const getToken = async (): Promise<string | null> => {
    try {
      if (Platform.OS === 'web') {
        const token = localStorage.getItem('authToken');
        console.log('CartContext - Token web :', token ? 'Présent' : 'Aucun');
        return token;
      }
      const token = await SecureStore.getItemAsync('authToken');
      console.log('CartContext - Token mobile :', token ? 'Présent' : 'Aucun');
      return token;
    } catch (error) {
      console.error('CartContext - Erreur récupération token :', error);
      return null;
    }
  };

  // Sauvegarder dans AsyncStorage
  const saveCart = async (cartItems: CartItem[]) => {
    try {
      await AsyncStorage.setItem('cart', JSON.stringify(cartItems));
      console.log('CartContext - Panier sauvegardé dans AsyncStorage :', cartItems);
    } catch (error) {
      console.error('CartContext - Erreur sauvegarde panier :', error);
    }
  };

  // Charger le panier depuis l'API ou AsyncStorage
  const fetchCart = async () => {
    try {
      const token = await getToken();
      if (token) {
        const response = await api.get('/cart/active');
        console.log('CartContext - Réponse GET /cart/active :', JSON.stringify(response.data, null, 2));

        const cart = response.data.data;
        const cartItems = cart.items?.map((item: any) => ({
          id: item.id.toString(),
          name: item.product?.name || 'Produit inconnu',
          brand: item.product?.category?.name || 'Inconnu',
          price: parseFloat(item.unit_price) || 0,
          quantity: item.quantity,
          image: item.product_variant?.image || item.product?.image || 'https://placehold.co/80x80',
        })) || [];

        setItems(cartItems);
        await saveCart(cartItems);
      } else {
        const savedCart = await AsyncStorage.getItem('cart');
        console.log('CartContext - Contenu AsyncStorage :', savedCart);
        if (savedCart) {
          setItems(JSON.parse(savedCart));
        }
      }
    } catch (error: any) {
      console.error('CartContext - Erreur fetchCart :', error.message);
      console.log('CartContext - Détails erreur :', JSON.stringify(error.response?.data, null, 2));
      const savedCart = await AsyncStorage.getItem('cart');
      console.log('CartContext - Contenu AsyncStorage (erreur) :', savedCart);
      if (savedCart) {
        setItems(JSON.parse(savedCart));
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const addItem = async (item: CartItem) => {
    try {
      const token = await getToken();
      if (token) {
        await fetchCart(); // Recharger pour éviter les conflits
      }

      setItems((currentItems) => {
        const existingItem = currentItems.find((i) => i.id === item.id);
        let newItems;

        if (existingItem) {
          newItems = currentItems.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
          );
        } else {
          newItems = [...currentItems, item];
        }

        saveCart(newItems);
        console.log('CartContext - Article ajouté localement :', item);
        return newItems;
      });
    } catch (error) {
      console.error('CartContext - Erreur addItem :', error);
    }
  };

  const removeItem = async (id: string) => {
    try {
      const token = await getToken();
      if (token) {
        await api.delete(`/cart-items/${id}`);
        console.log('CartContext - Article supprimé via DELETE /cart-items/', id);
        await fetchCart();
      } else {
        setItems((currentItems) => {
          const newItems = currentItems.filter((item) => item.id !== id);
          saveCart(newItems);
          return newItems;
        });
      }
    } catch (error: any) {
      console.error('CartContext - Erreur removeItem :', error.message);
      console.log('CartContext - Détails erreur :', JSON.stringify(error.response?.data, null, 2));
    }
  };

  const updateQuantity = async (id: string, quantity: number) => {
    if (quantity < 0) return;

    try {
      const token = await getToken();
      if (token) {
        await api.patch(`/cart-items/${id}`, { quantity });
        console.log('CartContext - Quantité mise à jour via PATCH /cart-items/', id);
        await fetchCart();
      } else {
        setItems((currentItems) => {
          const newItems = currentItems.map((item) =>
            item.id === id ? { ...item, quantity } : item
          );
          saveCart(newItems);
          return newItems;
        });
      }
    } catch (error: any) {
      console.error('CartContext - Erreur updateQuantity :', error.message);
      console.log('CartContext - Détails erreur :', JSON.stringify(error.response?.data, null, 2));
    }
  };

  const clearCart = async () => {
    try {
      const token = await getToken();
      if (token) {
        const response = await api.get('/cart/active');
        const cart = response.data.data;
        for (const item of cart.items || []) {
          await api.delete(`/cart-items/${item.id}`);
        }
        console.log('CartContext - Panier vidé via API');
      }
      setItems([]);
      await saveCart([]);
    } catch (error: any) {
      console.error('CartContext - Erreur clearCart :', error.message);
      console.log('CartContext - Détails erreur :', JSON.stringify(error.response?.data, null, 2));
    }
  };

  const getCartTotal = () => {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discount = subtotal > 100 ? 10 : 0;
    const shippingFee = subtotal > 200 ? 0 : 5;
    const total = subtotal - discount + shippingFee;

    return { subtotal, discount, shippingFee, total };
  };

  if (isLoading) {
    return null;
  }

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getCartTotal,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};