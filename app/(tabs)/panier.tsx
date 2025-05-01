import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import api from '../api/api';
import { getToken } from '../utils/auth';

interface CartItem {
  id: string;
  product: {
    id: string;
    name: string;
    price: number;
    image?: string;
    stock: number;
  };
  variant?: {
    id: string;
    name: string;
    price: number;
    stock: number;
  };
  quantity: number;
  unit_price: number;
}

interface Cart {
  id: string;
  reference: string;
  status: string;
  userId: number;
  createdAt: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping_fee: number;
  total: number;
}

export default function CartScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<Cart | null>(null);
  const [processing, setProcessing] = useState(false);

  const createNewCart = async (token: string) => {
    try {
      console.log("Création d'un nouveau panier");
      const response = await api.post("/cart", {
        status: "draft",
        items: []
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("Nouveau panier créé:", response.data);
      return response.data.data;
    } catch (error: any) {
      console.error("Erreur lors de la création du panier:", error);
      throw error;
    }
  };

  const fetchCart = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      
      if (!token) {
        console.log("Aucun token trouvé, redirection vers la connexion");
        Alert.alert("Erreur", "Vous devez être connecté pour voir votre panier");
        router.push("/connexion");
        return;
      }

      console.log("Récupération des paniers avec le token");
      
      const response = await api.get("/cart", {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log("Réponse de l'API pour les paniers:", response.data);

      if (response.data && response.data.data) {
        const draftCart = response.data.data.find((cart: Cart) => cart.status === 'draft');
        
        if (!draftCart) {
          console.log("Aucun panier en brouillon trouvé, création d'un nouveau panier");
          const newCart = await createNewCart(token);
          setCart({
            ...newCart,
            subtotal: 0,
            discount: 0,
            shipping_fee: 0,
            total: 0,
            items: []
          });
          return;
        }

        console.log("Données du panier reçues:", {
          id: draftCart.id,
          userId: draftCart.userId,
          itemsCount: draftCart.items?.length || 0,
          status: draftCart.status
        });

        const processedItems = draftCart.items.map((item: CartItem) => {
          const unitPrice = Number(item.unit_price) || 0;
          const productPrice = Number(item.product.price) || 0;
          const variantPrice = item.variant ? Number(item.variant.price) || 0 : 0;

          const finalUnitPrice = unitPrice || variantPrice || productPrice;

          return {
            ...item,
            unit_price: finalUnitPrice,
            product: {
              ...item.product,
              price: productPrice
            },
            variant: item.variant ? {
              ...item.variant,
              price: variantPrice
            } : undefined
          };
        });

        const subtotal = processedItems.reduce((sum: number, item: { unit_price: number; quantity: number; }) => sum + (item.unit_price * item.quantity), 0);
        const discount = Number(draftCart.discount) || 0;
        const shipping_fee = Number(draftCart.shipping_fee) || 0;
        const total = subtotal - discount + shipping_fee;

        setCart({
          ...draftCart,
          subtotal,
          discount,
          shipping_fee,
          total,
          items: processedItems
        });
      } else {
        console.log("Aucun panier trouvé, création d'un nouveau panier");
        const newCart = await createNewCart(token);
        setCart({
          ...newCart,
          subtotal: 0,
          discount: 0,
          shipping_fee: 0,
          total: 0,
          items: []
        });
      }
    } catch (error: any) {
      console.error("Erreur lors de la récupération du panier:", {
        status: error.response?.status,
        message: error.response?.data?.message,
        error: error.message
      });

      if (error.response?.status === 401) {
        Alert.alert("Erreur", "Session expirée. Veuillez vous reconnecter.");
        router.push("/connexion");
      } else if (error.response?.status === 404) {
        console.log("Aucun panier trouvé, tentative de création d'un nouveau panier");
        try {
          const token = await getToken();
          if (token) {
            const newCart = await createNewCart(token);
            setCart({
              ...newCart,
              subtotal: 0,
              discount: 0,
              shipping_fee: 0,
              total: 0,
              items: []
            });
          }
        } catch (createError) {
          console.error("Erreur lors de la création du panier:", createError);
          Alert.alert("Erreur", "Impossible de créer un nouveau panier");
          setCart(null);
        }
      } else {
        Alert.alert("Erreur", "Impossible de charger le panier");
        setCart(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      console.log('CartScreen - Rechargement des données du panier');
      fetchCart();
    }, [])
  );

  const checkStock = async (productId: string, variantId: string | null, quantity: number) => {
    try {
      const token = await getToken();
      if (!token) return false;

      const response = await api.get(`/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const product = response.data.data;
      
      if (!product) {
        console.error("Produit non trouvé");
        return false;
      }

      if (variantId) {
        const variant = product.variants?.find((v: any) => v.id === variantId);
        if (!variant) {
          console.error("Variante non trouvée");
          return false;
        }
        return variant.stock >= quantity;
      }

      return product.stock >= quantity;
    } catch (error: any) {
      console.error("Erreur lors de la vérification du stock:", error);
      return true;
    }
  };

  const handleUpdateQuantity = async (itemId: string, increment: boolean) => {
    try {
      setProcessing(true);
      const token = await getToken();
      
      if (!token) {
        Alert.alert("Erreur", "Session expirée. Veuillez vous reconnecter.");
        router.push("/connexion");
        return;
      }

      const item = cart?.items.find(i => i.id === itemId);
      if (!item) return;

      const newQuantity = increment ? item.quantity + 1 : item.quantity - 1;
      
      if (newQuantity === 0) {
        await handleRemoveItem(itemId);
        return;
      }

      const hasStock = await checkStock(
        item.product.id,
        item.variant?.id || null,
        newQuantity
      );

      if (!hasStock) {
        Alert.alert(
          "Stock insuffisant",
          `Désolé, il ne reste que ${item.variant?.stock || item.product.stock} unités disponibles pour ce produit.`
        );
        return;
      }

      const endpoint = increment 
        ? `/cart/${cart?.id}/items/${itemId}/increment`
        : `/cart/${cart?.id}/items/${itemId}/decrement`;
      
      await api.patch(endpoint, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      await fetchCart();
    } catch (error: any) {
      console.error("Erreur lors de la mise à jour de la quantité:", error);
      Alert.alert("Erreur", "Impossible de mettre à jour la quantité");
    } finally {
      setProcessing(false);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      setProcessing(true);
      const token = await getToken();
      
      if (!token) {
        Alert.alert("Erreur", "Session expirée. Veuillez vous reconnecter.");
        router.push("/connexion");
        return;
      }

      await api.delete(`/cart/${cart?.id}/items/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      await fetchCart();
    } catch (error: any) {
      console.error("Erreur lors de la suppression de l'article:", error);
      Alert.alert("Erreur", "Impossible de supprimer l'article");
    } finally {
      setProcessing(false);
    }
  };

  const handleCheckout = () => {
    if (!cart || cart.items.length === 0) {
      Alert.alert("Panier vide", "Votre panier est vide. Ajoutez des articles avant de procéder au paiement.");
      return;
    }
    router.push('/verification');
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#F59E0B" />
      </SafeAreaView>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyCart}>
          <Ionicons name="cart-outline" size={64} color="#666" />
          <Text style={styles.emptyCartText}>Votre panier est vide</Text>
          <TouchableOpacity
            style={styles.continueShopping}
            onPress={() => router.push('/(tabs)/accueil')}
          >
            <Text style={styles.continueShoppingText}>Continuer vos achats</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Panier</Text>
      </View>

      <ScrollView style={styles.cartList} showsVerticalScrollIndicator={false}>
        {cart.items.map((item) => (
          <View key={item.id} style={styles.cartItem}>
            <Image
              source={{ uri: item.product.image || 'https://via.placeholder.com/80' }}
              style={styles.productImage}
              onError={(e) => {
                console.log('Erreur de chargement image:', e.nativeEvent.error);
                item.product.image = 'https://via.placeholder.com/80';
              }}
            />
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{item.product.name}</Text>
              {item.variant && (
                <Text style={styles.productVariant}>{item.variant.name}</Text>
              )}
              <Text style={styles.productPrice}>
                {Number(item.unit_price || item.variant?.price || item.product.price || 0).toFixed(2)} €
              </Text>
            </View>
            <View style={styles.rightContainer}>
              <TouchableOpacity
                onPress={() => handleRemoveItem(item.id)}
                style={styles.deleteButton}
              >
                <Ionicons name="trash-outline" size={24} color="#FF6B6B" />
              </TouchableOpacity>
              <View style={styles.quantityContainer}>
                <TouchableOpacity
                  onPress={() => handleUpdateQuantity(item.id, false)}
                  style={styles.quantityButton}
                  disabled={processing}
                >
                  <Ionicons name="remove" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.quantityText}>
                  {item.quantity.toString().padStart(2, '0')}
                </Text>
                <TouchableOpacity
                  onPress={() => handleUpdateQuantity(item.id, true)}
                  style={styles.quantityButton}
                  disabled={processing}
                >
                  <Ionicons name="add" size={24} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.orderSummary}>
        <Text style={styles.summaryTitle}>Récapitulatif de la commande</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Articles</Text>
          <Text style={styles.summaryValue}>{cart.items.length}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Sous-total</Text>
          <Text style={styles.summaryValue}>{Number(cart.subtotal || 0).toFixed(2)} €</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Réduction</Text>
          <Text style={styles.summaryValue}>{Number(cart.discount || 0).toFixed(2)} €</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Frais de livraison</Text>
          <Text style={styles.summaryValue}>{Number(cart.shipping_fee || 0).toFixed(2)} €</Text>
        </View>
        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>{Number(cart.total || 0).toFixed(2)} €</Text>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.checkoutButton} 
        onPress={handleCheckout}
        disabled={processing}
      >
        {processing ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.checkoutButtonText}>Vérifier</Text>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
  },
  emptyCart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyCartText: {
    fontSize: 18,
    color: '#666',
    marginTop: 16,
    marginBottom: 24,
  },
  continueShopping: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  continueShoppingText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  cartList: {
    flex: 1,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F5F5F5',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#E0E0E0',
  },
  productInfo: {
    flex: 1,
    marginLeft: 16,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  productVariant: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F59E0B',
    marginTop: 4,
  },
  rightContainer: {
    alignItems: 'flex-end',
  },
  deleteButton: {
    padding: 8,
    marginBottom: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 4,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F59E0B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 12,
    color: '#000',
  },
  orderSummary: {
    padding: 16,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#666',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  checkoutButton: {
    backgroundColor: '#F59E0B',
    margin: 16,
    padding: 16,
    borderRadius: 30,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
});