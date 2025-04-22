import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

// Interface pour un produit dans le panier
interface CartItem {
  id: string;
  name: string;
  brand: string;
  price: number;
  quantity: number;
  image: string;
}

export default function CartScreen() {
  const router = useRouter();
  const [cartItems, setCartItems] = React.useState<CartItem[]>([
    {
      id: "1",
      name: "Montre",
      brand: "Rolex",
      price: 40,
      quantity: 2,
      image:
        "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=300&h=300&auto=format&fit=crop",
    },
    {
      id: "2",
      name: "Airpods",
      brand: "Apple",
      price: 333,
      quantity: 2,
      image:
        "https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?q=80&w=300&h=300&auto=format&fit=crop",
    },
    {
      id: "3",
      name: "Cagoule",
      brand: "Puma",
      price: 50,
      quantity: 2,
      image:
        "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?q=80&w=300&h=300&auto=format&fit=crop",
    },
  ]);

  // Calculer les totaux
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const discount = 4;
  const shippingFee = 2;
  const total = subtotal - discount + shippingFee;

  // Gérer la quantité
  const updateQuantity = (id: string, increment: boolean) => {
    setCartItems(
      cartItems.map((item) => {
        if (item.id === id) {
          const newQuantity = increment
            ? item.quantity + 1
            : Math.max(0, item.quantity - 1);
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  // Supprimer un article
  const removeItem = (id: string) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* En-tête */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Panier</Text>
        <TouchableOpacity style={styles.menuButton}>
          <Ionicons name="ellipsis-vertical" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Liste des produits */}
      <ScrollView style={styles.cartList}>
        {cartItems.map((item) => (
          <View key={item.id} style={styles.cartItem}>
            <Image
              source={{ uri: item.image }}
              style={styles.productImage}
              onError={(e) =>
                console.log("Erreur de chargement image:", e.nativeEvent.error)
              }
            />
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productBrand}>{item.brand}</Text>
              <Text style={styles.productPrice}>${item.price}</Text>
            </View>
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                onPress={() => updateQuantity(item.id, false)}
                style={styles.quantityButton}
              >
                <Ionicons name="remove" size={24} color="white" />
              </TouchableOpacity>
              <Text style={styles.quantityText}>
                {item.quantity.toString().padStart(2, "0")}
              </Text>
              <TouchableOpacity
                onPress={() => updateQuantity(item.id, true)}
                style={styles.quantityButton}
              >
                <Ionicons name="add" size={24} color="white" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={() => removeItem(item.id)}
              style={styles.deleteButton}
            >
              <Ionicons name="trash-outline" size={24} color="#FF6B6B" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* Récapitulatif de la commande */}
      <View style={styles.orderSummary}>
        <Text style={styles.summaryTitle}>Récapitulatif de la commande</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Articles</Text>
          <Text style={styles.summaryValue}>{cartItems.length}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Total</Text>
          <Text style={styles.summaryValue}>${subtotal}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Rabais</Text>
          <Text style={styles.summaryValue}>${discount}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Frais de livraison</Text>
          <Text style={styles.summaryValue}>${shippingFee}</Text>
        </View>
        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>${total}</Text>
        </View>
      </View>

      {/* Bouton Vérifier */}
      <TouchableOpacity style={styles.checkoutButton}>
        <Text style={styles.checkoutButtonText}>Vérifier</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
  },
  menuButton: {
    padding: 8,
  },
  cartList: {
    flex: 1,
  },
  cartItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: "#F5F5F5",
  },
  productInfo: {
    flex: 1,
    marginLeft: 16,
  },
  productName: {
    fontSize: 16,
    fontWeight: "600",
  },
  productBrand: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FF8C00",
    marginTop: 4,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FF8C00",
    justifyContent: "center",
    alignItems: "center",
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "600",
    marginHorizontal: 12,
  },
  deleteButton: {
    padding: 8,
  },
  orderSummary: {
    padding: 16,
    backgroundColor: "#F8F8F8",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: "#666",
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: "500",
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "600",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FF8C00",
  },
  checkoutButton: {
    margin: 16,
    padding: 16,
    backgroundColor: "#FF8C00",
    borderRadius: 12,
    alignItems: "center",
  },
  checkoutButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
