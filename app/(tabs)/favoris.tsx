import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import api from "../api/api";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";

interface Product {
  id: string;
  name: string;
  price: number | string;
  image?: string;
}

interface WishlistItem {
  id: string;
  wishlist_id: string;
  product_id: string;
  product: Product;
}

const useAuthToken = () => {
  const getToken = async (): Promise<string | null> => {
    if (Platform.OS !== "web") {
      return await SecureStore.getItemAsync("authToken");
    } else {
      return localStorage.getItem("authToken");
    }
  };
  return { getToken };
};

export default function Favoris() {
  const [favorites, setFavorites] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { getToken } = useAuthToken();
  const { refresh } = useLocalSearchParams();

  const fetchFavorites = async (token: string) => {
    try {
      const response = await api.get("/wishlist", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Favoris.tsx - Réponse GET /wishlist :", JSON.stringify(response.data, null, 2));
      const wishlistItems = response.data.data || [];
      setFavorites(wishlistItems);
      console.log("Favoris.tsx - État favorites mis à jour :", wishlistItems);
    } catch (error: any) {
      console.error("Favoris.tsx - Erreur récupération favoris :", error);
      console.log("Favoris.tsx - Détails erreur :", JSON.stringify(error.response?.data, null, 2));
      if (error.response?.status === 403 || error.response?.status === 401) {
        Alert.alert(
          "Erreur d'authentification",
          "Session invalide. Veuillez vous reconnecter.",
          [{ text: "OK", onPress: () => router.push("/connexion") }]
        );
        if (Platform.OS !== "web") {
          await SecureStore.deleteItemAsync("authToken");
        } else {
          localStorage.removeItem("authToken");
        }
      } else {
        Alert.alert("Erreur", "Impossible de charger les favoris.");
      }
      setFavorites([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFavorite = async (wishlistItemId: string) => {
    const token = await getToken();
    if (!token) {
      Alert.alert("Erreur", "Vous devez être connecté pour gérer les favoris.");
      router.push("/connexion");
      return;
    }

    try {
      console.log("Favoris.tsx - Suppression wishlistItemId :", wishlistItemId);
      await api.delete(`/wishlist/${wishlistItemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Alert.alert("Succès", "Produit retiré des favoris.");
      await fetchFavorites(token);
    } catch (error: any) {
      console.error("Favoris.tsx - Erreur suppression favori :", error);
      console.log("Favoris.tsx - Détails erreur :", JSON.stringify(error.response?.data, null, 2));
      let errorMessage = "Impossible de supprimer le favori. Veuillez réessayer.";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      Alert.alert("Erreur", errorMessage);
    }
  };

  useFocusEffect(
    useCallback(() => {
      console.log("Favoris.tsx - useFocusEffect exécuté, refresh :", refresh);
      const loadFavorites = async () => {
        const token = await getToken();
        console.log("Favoris.tsx - useFocusEffect - Token :", token);
        if (token) {
          setIsLoading(true);
          await fetchFavorites(token);
        } else {
          setIsLoading(false);
          setFavorites([]);
        }
      };
      loadFavorites();
    }, [refresh])
  );

  const renderFavoriteItem = ({ item }: { item: WishlistItem }) => (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={() => {
        console.log("Favoris.tsx - Navigation vers detail_produit avec productId :", item.product.id);
        router.push({
          pathname: "/detail_produit",
          params: { productId: item.product.id },
        });
      }}
    >
      <Image
        source={{ uri: item.product.image || "https://placehold.co/300x300" }}
        style={styles.cardImage}
        resizeMode="cover"
      />
      <View style={styles.cardContent}>
        <Text style={styles.cardName}>{item.product.name}</Text>
        <Text style={styles.cardPrice}>${item.product.price}</Text>
      </View>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemoveFavorite(item.id)}
      >
        <Ionicons name="trash-outline" size={20} color="#FF0000" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Mes Favoris</Text>
      </View>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#F59E0B" />
        </View>
      ) : favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Aucun produit dans vos favoris.</Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          renderItem={renderFavoriteItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  headerContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
  },
  listContent: {
    padding: 15,
  },
  cardContainer: {
    flexDirection: "row",
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    marginBottom: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: "#eee",
    alignItems: "center",
  },
  cardImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  cardContent: {
    flex: 1,
    marginLeft: 10,
  },
  cardName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  cardPrice: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  removeButton: {
    padding: 10,
  },
});