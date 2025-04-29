import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  FlatList,
  Dimensions,
  ActivityIndicator,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import api from "../api/api";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.4;

// --- Types ---
interface User {
  firstname: string;
  lastname: string;
}

interface Category {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  price: number | string;
  image?: string;
  description?: string;
  category: { id: string; name: string };
  propertyValues: { property_id: string; value: string }[];
  variants: { id: string; name: string; price: number | string; stock: number; image?: string }[];
}

// --- Données de secours ---
const fallbackCategories: Category[] = [
  { id: "1", name: "Montres" },
  { id: "2", name: "Chaussures" },
  { id: "3", name: "Électronique" },
];

const fallbackProducts: Product[] = [
  {
    id: "1",
    name: "Montre Rolex",
    price: 40,
    image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49",
    description: "Montre élégante",
    category: { id: "1", name: "Montres" },
    propertyValues: [],
    variants: [{ id: "1", name: "Standard", price: 40, stock: 10, image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49" }],
  },
  {
    id: "2",
    name: "Pompe Nike",
    price: 430,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
    description: "Chaussures de sport",
    category: { id: "2", name: "Chaussures" },
    propertyValues: [],
    variants: [{ id: "2", name: "Standard", price: 430, stock: 15, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff" }],
  },
];

// --- Fonction utilitaire pour récupérer le token ---
const useAuthToken = () => {
  const getToken = async (): Promise<string | null> => {
    if (Platform.OS !== 'web') {
      return await SecureStore.getItemAsync('authToken');
    } else {
      return localStorage.getItem('authToken');
    }
  };
  return { getToken };
};

// --- Composants UI ---

const Header = ({ userName }: { userName: string }) => (
  <View style={styles.headerContainer}>
    <Text style={styles.userName}>{userName || "Bienvenue !"}</Text>
    <View style={styles.headerIcons}>
      <TouchableOpacity
        style={styles.iconButton}
        onPress={() => router.push("/recherche")}
      >
        <Ionicons name="search" size={26} color="#333" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconButton}>
        <Ionicons name="notifications-outline" size={26} color="#333" />
      </TouchableOpacity>
    </View>
  </View>
);

const CategoryList = ({ categories }: { categories: Category[] }) => (
  <View style={styles.categoryContainer}>
    {categories.length === 0 ? (
      <Text style={styles.emptyText}>Aucune catégorie disponible</Text>
    ) : (
      <FlatList
        data={categories}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.categoryItem}>
            <Text style={styles.categoryText}>{item.name}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryListContent}
      />
    )}
  </View>
);

const Banner = () => (
  <View style={styles.bannerContainer}>
    <View style={styles.bannerTextContainer}>
      <Text style={styles.bannerTitle}>Bénéficiez d'une réduction</Text>
      <Text style={styles.bannerSubtitle}>d'hiver de 20 %</Text>
      <Text style={styles.bannerSubtitle}>pour les enfants</Text>
    </View>
    <Image
      source={{ uri: "https://placehold.co/100x100/ffffff/000000/png" }}
      style={styles.bannerImage}
      resizeMode="contain"
    />
  </View>
);

const ProductCard = ({ item }: { item: Product }) => (
  <TouchableOpacity
    style={styles.cardContainer}
    onPress={() => {
      console.log('Navigation vers detail_produit avec productId:', item.id);
      router.push({
        pathname: "/detail_produit",
        params: {
          productId: item.id,
        },
      });
    }}
  >
    <Image
      source={{ uri: item.variants[0]?.image || "https://placehold.co/300x300" }}
      style={styles.cardImage}
      resizeMode="cover"
    />
    <TouchableOpacity style={styles.heartIconContainer}>
      <Ionicons name="heart-outline" size={20} color="#555" />
    </TouchableOpacity>
    <Text style={styles.cardName}>{item.name}</Text>
    <Text style={styles.cardPrice}>${item.price}</Text>
  </TouchableOpacity>
);

const ProductSection = ({ title, data }: { title: string; data: Product[] }) => (
  <View style={styles.sectionContainer}>
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <TouchableOpacity onPress={() => router.push("/produits")}>
        <Text style={styles.sectionSeeAll}>Tout voir</Text>
      </TouchableOpacity>
    </View>
    {data.length === 0 ? (
      <Text style={styles.emptyText}>Aucun produit disponible</Text>
    ) : (
      <FlatList
        data={data}
        renderItem={({ item }) => <ProductCard item={item} />}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.productListContent}
      />
    )}
  </View>
);

// --- Écran Principal Accueil ---
export default function EcranAccueil() {
  const [userName, setUserName] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [popularProducts, setPopularProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { getToken } = useAuthToken();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const token = await getToken();
        console.log('Token utilisé:', token);

        if (token) {
          try {
            const userResponse = await api.get("/user");
            console.log("Réponse utilisateur :", JSON.stringify(userResponse.data, null, 2));
            setUserName(`${userResponse.data.data.firstname} ${userResponse.data.data.lastname}`);
          } catch (error) {
            console.error("Erreur récupération utilisateur :", error);
            setUserName("Bienvenue !");
          }
        } else {
          console.log("Aucun token trouvé");
          setUserName("Bienvenue !");
        }

        // Récupérer les catégories
        try {
          const categoriesResponse = await api.get("/categories");
          console.log("Réponse catégories :", JSON.stringify(categoriesResponse.data, null, 2));
          const fetchedCategories = categoriesResponse.data.data?.data || [];
          setCategories(fetchedCategories.length > 0 ? fetchedCategories : fallbackCategories);
        } catch (error: any) {
          console.error("Erreur récupération catégories :", error);
          console.log("Détails erreur:", JSON.stringify(error.response?.data, null, 2));
          setCategories(fallbackCategories);
        }

        // Récupérer les produits en vedette
        try {
          const featuredResponse = await api.get("/products?page=1&limit=5");
          console.log("Réponse produits en vedette :", JSON.stringify(featuredResponse.data, null, 2));
          const fetchedFeatured = featuredResponse.data.data?.data || [];
          setFeaturedProducts(fetchedFeatured.length > 0 ? fetchedFeatured : fallbackProducts);
        } catch (error: any) {
          console.error("Erreur récupération produits en vedette :", error);
          console.log("Détails erreur:", JSON.stringify(error.response?.data, null, 2));
          setFeaturedProducts(fallbackProducts);
        }

        // Récupérer les produits populaires
        try {
          const popularResponse = await api.get("/products?page=2&limit=5");
          console.log("Réponse produits populaires :", JSON.stringify(popularResponse.data, null, 2));
          const fetchedPopular = popularResponse.data.data?.data || [];
          setPopularProducts(fetchedPopular.length > 0 ? fetchedPopular : fallbackProducts);
        } catch (error: any) {
          console.error("Erreur récupération produits populaires :", error);
          console.log("Détails erreur:", JSON.stringify(error.response?.data, null, 2));
          setPopularProducts(fallbackProducts);
        }
      } catch (error: any) {
        console.error("Erreur globale :", error);
        console.log("Détails erreur:", JSON.stringify(error.response?.data, null, 2));
        setUserName("Bienvenue !");
        setCategories(fallbackCategories);
        setFeaturedProducts(fallbackProducts);
        setPopularProducts(fallbackProducts);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#F59E0B" />
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <Header userName={userName} />
          <CategoryList categories={categories} />
          <Banner />
          <ProductSection title="En vedette" data={featuredProducts} />
          <ProductSection title="Most Popular" data={popularProducts} />
          <View style={{ height: 20 }} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    padding: 20,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginTop: 10,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 25,
    marginLeft: 10,
  },
  categoryContainer: {
    paddingTop: 10,
    paddingHorizontal: 15,
  },
  categoryListContent: {
    paddingVertical: 5,
  },
  categoryItem: {
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginRight: 10,
  },
  categoryText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  bannerContainer: {
    backgroundColor: "#F59E0B",
    borderRadius: 15,
    marginHorizontal: 15,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 25,
    overflow: "hidden",
  },
  bannerTextContainer: {
    flex: 1,
    marginRight: 10,
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 5,
  },
  bannerSubtitle: {
    fontSize: 14,
    color: "#FFFFFF",
  },
  bannerImage: {
    width: 80,
    height: 100,
  },
  sectionContainer: {
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  sectionSeeAll: {
    fontSize: 14,
    color: "#6A1B9A",
    fontWeight: "500",
  },
  productListContent: {
    paddingHorizontal: 15,
  },
  cardContainer: {
    width: CARD_WIDTH,
    marginRight: 15,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#eee",
  },
  cardImage: {
    width: "100%",
    height: CARD_WIDTH * 0.8,
    backgroundColor: "#e0e0e0",
  },
  heartIconContainer: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    padding: 5,
    borderRadius: 15,
  },
  cardName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginTop: 8,
    marginHorizontal: 10,
  },
  cardPrice: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
    marginHorizontal: 10,
  },
});