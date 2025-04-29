import React, { useEffect } from 'react';
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
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../../contexts/CartContext';

export default function CartScreen() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, getCartTotal, fetchCart } = useCart();

  useEffect(() => {
    fetchCart().catch((error) => {
      console.error('CartScreen - Erreur fetchCart :', error);
    });
  }, []);

  const handleUpdateQuantity = async (id: string, increment: boolean) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;

    const newQuantity = increment ? item.quantity + 1 : item.quantity - 1;

    if (newQuantity === 0) {
      Alert.alert(
        "Supprimer l'article",
        "Voulez-vous supprimer cet article du panier ?",
        [
          { text: 'Annuler', style: 'cancel' },
          {
            text: 'Supprimer',
            onPress: () => removeItem(id),
            style: 'destructive',
          },
        ]
      );
      return;
    }

    await updateQuantity(id, newQuantity).catch((error) => {
      console.error('CartScreen - Erreur updateQuantity :', error);
      Alert.alert('Erreur', 'Impossible de mettre à jour la quantité');
    });
  };

  const handleRemoveItem = (id: string) => {
    Alert.alert(
      "Supprimer l'article",
      "Voulez-vous supprimer cet article du panier ?",
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          onPress: () => removeItem(id).catch((error) => {
            console.error('CartScreen - Erreur removeItem :', error);
            Alert.alert('Erreur', 'Impossible de supprimer l’article');
          }),
          style: 'destructive',
        },
      ]
    );
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      Alert.alert(
        'Panier vide',
        'Votre panier est vide. Ajoutez des articles avant de procéder au paiement.'
      );
      return;
    }
    router.push('/verification');
  };

  const { subtotal, discount, shippingFee, total } = getCartTotal();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Panier</Text>
      </View>

      {items.length === 0 ? (
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
      ) : (
        <>
          <ScrollView style={styles.cartList} showsVerticalScrollIndicator={false}>
            {items.map((item) => (
              <View key={item.id} style={styles.cartItem}>
                <Image
                  source={{ uri: item.image }}
                  style={styles.productImage}
                  onError={(e) =>
                    console.log('Erreur de chargement image:', e.nativeEvent.error)
                  }
                />
                <View style={styles.productInfo}>
                  <Text style={styles.productName}>{item.name}</Text>
                  <Text style={styles.productBrand}>{item.brand}</Text>
                  <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
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
                    >
                      <Ionicons name="remove" size={24} color="white" />
                    </TouchableOpacity>
                    <Text style={styles.quantityText}>
                      {item.quantity.toString().padStart(2, '0')}
                    </Text>
                    <TouchableOpacity
                      onPress={() => handleUpdateQuantity(item.id, true)}
                      style={styles.quantityButton}
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
              <Text style={styles.summaryValue}>{items.length}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total</Text>
              <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Rabais</Text>
              <Text style={styles.summaryValue}>${discount.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Frais de livraison</Text>
              <Text style={styles.summaryValue}>${shippingFee.toFixed(2)}</Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
            <Text style={styles.checkoutButtonText}>Vérifier</Text>
          </TouchableOpacity>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  productBrand: {
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