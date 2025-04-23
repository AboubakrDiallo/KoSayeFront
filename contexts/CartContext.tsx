import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => {
    subtotal: number;
    discount: number;
    shippingFee: number;
    total: number;
  };
}

// Création du contexte avec une valeur par défaut
const CartContext = createContext<CartContextType>({
  items: [],
  addItem: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  getCartTotal: () => ({
    subtotal: 0,
    discount: 0,
    shippingFee: 0,
    total: 0,
  }),
});

// Hook personnalisé pour utiliser le contexte
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

// Provider du panier
export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Charger le panier depuis le stockage local au démarrage
  useEffect(() => {
    const loadCart = async () => {
      try {
        const savedCart = await AsyncStorage.getItem("cart");
        if (savedCart) {
          setItems(JSON.parse(savedCart));
        }
      } catch (error) {
        console.error("Erreur lors du chargement du panier:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCart();
  }, []);

  // Sauvegarder le panier dans le stockage local
  const saveCart = async (cartItems: CartItem[]) => {
    try {
      await AsyncStorage.setItem("cart", JSON.stringify(cartItems));
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du panier:", error);
    }
  };

  // Ajouter un article au panier
  const addItem = (item: CartItem) => {
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
      return newItems;
    });
  };

  // Supprimer un article du panier
  const removeItem = (id: string) => {
    setItems((currentItems) => {
      const newItems = currentItems.filter((item) => item.id !== id);
      saveCart(newItems);
      return newItems;
    });
  };

  // Mettre à jour la quantité d'un article
  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 0) return;

    setItems((currentItems) => {
      const newItems = currentItems.map((item) =>
        item.id === id ? { ...item, quantity } : item
      );
      saveCart(newItems);
      return newItems;
    });
  };

  // Vider le panier
  const clearCart = () => {
    setItems([]);
    saveCart([]);
  };

  // Calculer les totaux
  const getCartTotal = () => {
    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const discount = subtotal > 100 ? 10 : 0;
    const shippingFee = subtotal > 200 ? 0 : 5;
    const total = subtotal - discount + shippingFee;

    return {
      subtotal,
      discount,
      shippingFee,
      total,
    };
  };

  if (isLoading) {
    return null; // ou un composant de chargement
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
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
