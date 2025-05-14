import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "./contexts/AuthContext";
import api from "./api/api";
import { getToken } from "./utils/auth";

interface OrderItem {
  id: number;
  productName: string;
  variantName: string | null;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  product: {
    id: number;
    name: string;
    image: string;
  };
  variant: {
    id: number;
    name: string;
    image: string;
  } | null;
}

interface Order {
  id: number;
  reference: string;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  paymentStatus: "pending" | "paid" | "failed";
  totalAmount: number;
  createdAt: string;
  items: OrderItem[];
  shippingAddress: {
    recipientName: string;
    city: string;
    phone: string | null;
    additionalInfo: string | null;
  };
}

export default function CommandeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchOrders = async (pageNum = 1, shouldRefresh = false) => {
    try {
      const token = await getToken();
      if (!token) {
        router.push("/connexion");
        return;
      }

      const response = await api.get(`/orders?page=${pageNum}&limit=10`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const newOrders = response.data.data.data;
      setHasMore(newOrders.length === 10);

      if (shouldRefresh) {
        setOrders(newOrders);
      } else {
        setOrders((prev) => [...prev, ...newOrders]);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des commandes:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setPage(1);
    fetchOrders(1, true);
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchOrders(nextPage);
    }
  };

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "#F59E0B";
      case "confirmed":
        return "#3B82F6";
      case "shipped":
        return "#8B5CF6";
      case "delivered":
        return "#10B981";
      case "cancelled":
        return "#EF4444";
      default:
        return "#6B7280";
    }
  };

  const getStatusText = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "En attente";
      case "confirmed":
        return "Confirmée";
      case "shipped":
        return "Expédiée";
      case "delivered":
        return "Livrée";
      case "cancelled":
        return "Annulée";
      default:
        return status;
    }
  };

  const renderOrderItem = ({ item }: { item: Order }) => (
    <TouchableOpacity
      style={styles.orderCard}
      onPress={() => router.push(`/detail-commande/${item.id}` as any)}
    >
      <View style={styles.orderHeader}>
        <Text style={styles.orderReference}>Commande #{item.reference}</Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(item.status) },
          ]}
        >
          <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
        </View>
      </View>

      <View style={styles.orderInfo}>
        <Text style={styles.orderDate}>
          {new Date(item.createdAt).toLocaleDateString("fr-FR")}
        </Text>
        <Text style={styles.orderTotal}>{item.totalAmount.toFixed(2)} €</Text>
      </View>

      <View style={styles.itemsPreview}>
        {item.items.slice(0, 2).map((orderItem, index) => (
          <Text key={index} style={styles.itemText}>
            {orderItem.quantity}x {orderItem.productName}
            {orderItem.variantName ? ` - ${orderItem.variantName}` : ""}
          </Text>
        ))}
        {item.items.length > 2 && (
          <Text style={styles.moreItems}>
            +{item.items.length - 2} autre(s) article(s)
          </Text>
        )}
      </View>

      <View style={styles.orderFooter}>
        <Text style={styles.addressText}>
          Livraison à {item.shippingAddress.recipientName}
        </Text>
        <Ionicons name="chevron-forward" size={20} color="#6B7280" />
      </View>
    </TouchableOpacity>
  );

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#F59E0B" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={orders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={
          <View style={styles.emptyWrapper}>
            <View style={styles.emptyContainer}>
              <Ionicons
                name="cart-outline"
                size={80}
                color="#F59E0B"
                style={{ marginBottom: 16 }}
              />
              <Text style={styles.emptyTitle}>
                Aucune commande pour l'instant
              </Text>
              <Text style={styles.emptyText}>
                Vous n'avez pas encore passé de commande. Découvrez nos produits
                et faites-vous plaisir !
              </Text>
              <TouchableOpacity
                style={styles.browseButton}
                onPress={() => router.push("/produits")}
                activeOpacity={0.85}
              >
                <Text style={styles.browseButtonText}>
                  Découvrir les produits
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: {
    padding: 16,
  },
  orderCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  orderReference: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1F2937",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  orderInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  orderDate: {
    fontSize: 14,
    color: "#6B7280",
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
  },
  itemsPreview: {
    marginBottom: 12,
  },
  itemText: {
    fontSize: 14,
    color: "#4B5563",
    marginBottom: 4,
  },
  moreItems: {
    fontSize: 14,
    color: "#6B7280",
    fontStyle: "italic",
  },
  orderFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingTop: 12,
  },
  addressText: {
    fontSize: 14,
    color: "#6B7280",
  },
  emptyWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 500,
  },
  emptyContainer: {
    backgroundColor: "#FFF8E1",
    borderRadius: 28,
    paddingVertical: 36,
    paddingHorizontal: 28,
    alignItems: "center",
    shadowColor: "#F59E0B",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 6,
    minWidth: 300,
    maxWidth: 340,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#F59E0B",
    marginBottom: 10,
    textAlign: "center",
    letterSpacing: 0.2,
  },
  emptyText: {
    fontSize: 16,
    color: "#6B7280",
    marginBottom: 28,
    textAlign: "center",
    paddingHorizontal: 6,
    lineHeight: 22,
  },
  browseButton: {
    backgroundColor: "#F59E0B",
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 28,
    shadowColor: "#F59E0B",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 2,
  },
  browseButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
    letterSpacing: 0.3,
  },
});
