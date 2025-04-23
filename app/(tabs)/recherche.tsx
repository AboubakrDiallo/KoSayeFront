import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Image,
  Dimensions,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useCart } from "../../contexts/CartContext";

// Données de test (à remplacer par les vraies données de l'API)
const products = [
  {
    id: "1",
    name: "Montre",
    price: 40,
    image:
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=300&h=300&auto=format&fit=crop",
    liked: false,
  },
  {
    id: "2",
    name: "Pompe Nike",
    price: 430,
    image:
      "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?q=80&w=300&h=300&auto=format&fit=crop",
    liked: false,
  },
  {
    id: "3",
    name: "LG TV",
    price: 330,
    image:
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=300&h=300&auto=format&fit=crop",
    liked: false,
  },
  {
    id: "4",
    name: "Airpods",
    price: 333,
    image:
      "https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?q=80&w=300&h=300&auto=format&fit=crop",
    liked: false,
  },
  {
    id: "5",
    name: "Veste",
    price: 50,
    image:
      "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?q=80&w=300&h=300&auto=format&fit=crop",
    liked: false,
  },
  {
    id: "6",
    name: "Cagoule",
    price: 400,
    image:
      "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?q=80&w=300&h=300&auto=format&fit=crop",
    liked: false,
  },
];

const windowWidth = Dimensions.get("window").width;
const cardWidth = (windowWidth - 48) / 2; // 2 colonnes avec padding

export default function SearchScreen() {
  const router = useRouter();
  const { addToCart } = useCart();
  const [searchQuery, setSearchQuery] = useState("Chaussures");
  const [searchResults, setSearchResults] = useState(products);
  const [likedProducts, setLikedProducts] = useState<string[]>([]);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    // Filtrer les résultats en fonction de la recherche
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(text.toLowerCase())
    );
    setSearchResults(filtered);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchResults(products);
  };

  const toggleLike = (productId: string) => {
    setLikedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleAddToCart = (product: any) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    });
    Alert.alert(
      "Produit ajouté",
      `${product.name} a été ajouté à votre panier.`,
      [{ text: "OK" }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Barre de recherche */}
      <View style={styles.searchContainer}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={handleSearch}
            placeholder="Rechercher des produits..."
            placeholderTextColor="#666"
          />
        </View>
        {searchQuery ? (
          <TouchableOpacity
            onPress={handleClearSearch}
            style={styles.clearButton}
          >
            <Ionicons name="close-circle" size={24} color="black" />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Résultats de recherche */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsTitle}>Résultats pour "{searchQuery}"</Text>
        <Text style={styles.resultsCount}>
          {searchResults.length} Résultats trouvés
        </Text>
      </View>

      {/* Grille de produits */}
      <ScrollView
        style={styles.resultsContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.productsGrid}>
          {searchResults.map((product) => (
            <View
              key={product.id}
              style={[styles.productCard, { width: cardWidth }]}
            >
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: product.image }}
                  style={styles.productImage}
                  resizeMode="cover"
                />
                <TouchableOpacity
                  style={styles.likeButton}
                  onPress={() => toggleLike(product.id)}
                >
                  <Ionicons
                    name={
                      likedProducts.includes(product.id)
                        ? "heart"
                        : "heart-outline"
                    }
                    size={24}
                    color={
                      likedProducts.includes(product.id) ? "#FF6B6B" : "#FFF"
                    }
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{product.name}</Text>
                <View style={styles.priceContainer}>
                  <Text style={styles.productPrice}>${product.price}</Text>
                  <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => handleAddToCart(product)}
                  >
                    <Ionicons name="add" size={24} color="#F59E0B" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#F5F5F5",
    borderRadius: 30,
    margin: 16,
  },
  backButton: {
    marginRight: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: "#000",
  },
  clearButton: {
    marginLeft: 12,
  },
  resultsHeader: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  resultsCount: {
    fontSize: 14,
    color: "#F59E0B",
    fontWeight: "500",
  },
  resultsContainer: {
    flex: 1,
  },
  productsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    gap: 16,
  },
  productCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    aspectRatio: 1,
  },
  productImage: {
    width: "100%",
    height: "100%",
  },
  likeButton: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "600",
    color: "#F59E0B",
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FEF3C7",
    justifyContent: "center",
    alignItems: "center",
  },
});
