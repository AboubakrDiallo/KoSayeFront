import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import api from "./api/api";
import { getToken, removeToken } from "./utils/auth";

interface Product {
  id: string;
  name: string;
  price: number;
  image?: string;
  description?: string;
  brand?: string;
  sizes?: string[];
  availableSizes?: string[];
  variants?: Variant[];
}

interface Variant {
  id: string;
  name: string;
  price: number;
  stock: number;
  image?: string;
}

const { width } = Dimensions.get("window");
const NUM_COLUMNS = 2;
const CARD_MARGIN = 10;
const CARD_WIDTH = (width - CARD_MARGIN * (NUM_COLUMNS + 1)) / NUM_COLUMNS;

export default function ProductsScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"price-asc" | "price-desc" | "name">("name");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchProducts = async (pageNum: number = 1, shouldRefresh: boolean = false) => {
    try {
      if (shouldRefresh) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const params = new URLSearchParams({
        page: pageNum.toString(),
        limit: '10',
        ...(selectedCategory && { category_id: selectedCategory }),
        ...(searchQuery && { search: searchQuery }),
      });

      const response = await api.get(`/products?${params}`);
      const newProducts = response.data.data.data || [];
      
      if (shouldRefresh) {
        setProducts(newProducts);
      } else {
        setProducts(prev => [...prev, ...newProducts]);
      }

      setHasMore(newProducts.length === 10);
      setPage(pageNum);
    } catch (error) {
      console.error("Erreur lors de la récupération des produits:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProducts(1, true);
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    let filtered = [...products];

    // Filtrage par recherche
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filtrage par catégorie
    if (selectedCategory) {
      filtered = filtered.filter(product =>
        product.brand === selectedCategory
      );
    }

    // Tri des produits
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  }, [products, searchQuery, selectedCategory, sortBy]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchProducts(1, true);
  };

  const loadMore = () => {
    if (!loadingMore && hasMore) {
      fetchProducts(page + 1);
    }
  };

  const toggleFavorite = async (productId: string) => {
    try {
      const token = await getToken();
      console.log('ProductsScreen - Token récupéré :', token ? 'Présent' : 'Absent');
      if (!token) {
        console.warn('ProductsScreen - Aucun token trouvé, redirection vers connexion');
        Alert.alert("Erreur", "Vous devez être connecté pour ajouter aux favoris.");
        router.push("/connexion");
        return;
      }
  
      const isFavorite = favorites.has(productId);
      const previousFavorites = new Set(favorites);
  
      try {
        if (isFavorite) {
          console.log('ProductsScreen - Récupération wishlist pour productId:', productId);
          const response = await api.get("/wishlist", {
            headers: { Authorization: `Bearer ${token}` },
          });
          console.log('ProductsScreen - Réponse GET /wishlist :', JSON.stringify(response.data, null, 2));
          const wishlistItem = response.data.data.find(
            (item: any) => item.product_id === productId
          );
          if (wishlistItem) {
            console.log('ProductsScreen - Suppression wishlist item:', wishlistItem.id);
            await api.delete(`/wishlist/${wishlistItem.id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            setFavorites(prev => {
              const newFavs = new Set(prev);
              newFavs.delete(productId);
              return newFavs;
            });
            Alert.alert("Succès", "Produit retiré des favoris.");
          } else {
            console.warn('ProductsScreen - Aucun item wishlist trouvé pour productId:', productId);
            setFavorites(prev => {
              const newFavs = new Set(prev);
              newFavs.delete(productId);
              return newFavs;
            });
          }
        } else {
          console.log('ProductsScreen - Ajout à la wishlist, productId:', productId);
          await api.post(
            "/wishlist",
            { productId },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setFavorites(prev => {
            const newFavs = new Set(prev);
            newFavs.add(productId);
            return newFavs;
          });
          Alert.alert("Succès", "Produit ajouté aux favoris.");
        }
      } catch (error: any) {
        console.error('ProductsScreen - Erreur modification favoris :', error.message);
        console.log('ProductsScreen - Détails erreur :', JSON.stringify(error.response?.data, null, 2));
        setFavorites(previousFavorites);
        let errorMessage = "Impossible de modifier les favoris. Veuillez réessayer.";
        if (error.response?.status === 401) {
          console.warn('ProductsScreen - Erreur 401, redirection vers connexion');
          errorMessage = "Session expirée. Veuillez vous reconnecter.";
          await removeToken(); // Supprimer le token invalide
          router.push("/connexion");
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        }
        Alert.alert("Erreur", errorMessage);
      }
    } catch (error) {
      console.error('ProductsScreen - Erreur récupération token :', error);
      Alert.alert("Erreur", "Impossible d'accéder aux favoris. Veuillez vous reconnecter.");
      router.push("/connexion");
    }
  };

  const handleAddToCart = async (product: Product) => {
    try {
      // Récupérer le panier actif ou en créer un
      let cartResponse = await api.get("/cart/active");
      let cart = cartResponse.data.data;

      if (!cart) {
        cartResponse = await api.post("/cart", { status: "draft" });
        cart = cartResponse.data.data;
      }

      // Préparer les données pour l'ajout au panier
      const cartItemData = {
        cartId: cart.id,
        productId: product.id,
        quantity: 1,
        unit_price: parseFloat(product.price.toString()),
      };

      console.log('Données envoyées au panier:', cartItemData);

      // Ajouter le produit au panier
      const response = await api.post('/cart-items', cartItemData);
      console.log('Réponse ajout au panier:', response.data);

      Alert.alert(
        'Succès',
        `${product.name} a été ajouté au panier`,
        [
          {
            text: 'Continuer mes achats',
            style: 'cancel',
          },
          {
            text: 'Voir mon panier',
            onPress: () => {
              router.push({
                pathname: '/panier',
                params: { refresh: Date.now() }
              });
            },
          },
        ]
      );
    } catch (error: any) {
      console.error('Erreur lors de l\'ajout au panier:', error);
      console.log('Détails de l\'erreur:', error.response?.data);
      
      let errorMessage = 'Impossible d\'ajouter le produit au panier';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      Alert.alert('Erreur', errorMessage);
    }
  };

  const categories = Array.from(new Set(products.map(p => p.brand || "").filter(Boolean)));

  const renderCategoryFilter = () => (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      style={styles.categoryContainer}
    >
      <TouchableOpacity
        style={[
          styles.categoryButton,
          !selectedCategory && styles.selectedCategory
        ]}
        onPress={() => setSelectedCategory(null)}
      >
        <Text>Tous</Text>
      </TouchableOpacity>
      {categories.map(category => (
        <TouchableOpacity
          key={category}
          style={[
            styles.categoryButton,
            selectedCategory === category && styles.selectedCategory
          ]}
          onPress={() => setSelectedCategory(category)}
        >
          <Text>{category}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderSortOptions = () => (
    <View style={styles.sortContainer}>
      <Text style={styles.sortLabel}>Trier par:</Text>
      <TouchableOpacity
        style={[styles.sortButton, sortBy === "name" && styles.selectedSort]}
        onPress={() => setSortBy("name")}
      >
        <Text>Nom</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.sortButton, sortBy === "price-asc" && styles.selectedSort]}
        onPress={() => setSortBy("price-asc")}
      >
        <Text>Prix croissant</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.sortButton, sortBy === "price-desc" && styles.selectedSort]}
        onPress={() => setSortBy("price-desc")}
      >
        <Text>Prix décroissant</Text>
      </TouchableOpacity>
    </View>
  );

  const renderProduct = ({ item }: { item: Product }) => (
    <View style={styles.productCard}>
      <TouchableOpacity
        onPress={() => {
          router.push({
            pathname: "/detail_produit",
            params: {
              id: item.id,
              name: item.name,
              price: item.price.toString(),
              image: item.image || "",
              description: item.description || "",
              sizes: JSON.stringify(item.sizes || []),
              availableSizes: JSON.stringify(item.availableSizes || []),
              variants: JSON.stringify(item.variants || []),
            },
          });
        }}
      >
        <Image 
          source={{ uri: item.image || "https://placehold.co/300x300" }} 
          style={styles.productImage} 
        />
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{item.name}</Text>
          <Text style={styles.productPrice}>{item.price} €</Text>
        </View>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.favoriteButton}
        onPress={() => toggleFavorite(item.id)}
      >
        <Ionicons
          name={favorites.has(item.id) ? "heart" : "heart-outline"}
          size={20}
          color={favorites.has(item.id) ? "red" : "black"}
        />
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => handleAddToCart(item)}
      >
        <Ionicons name="add" size={20} color="white" />
      </TouchableOpacity>
    </View>
  );

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#F59E0B" />
      </View>
    );
  };

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher un produit..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      
      {renderCategoryFilter()}
      {renderSortOptions()}

      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        numColumns={NUM_COLUMNS}
        contentContainerStyle={styles.listContainer}
        columnWrapperStyle={styles.row}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text>Aucun produit disponible</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
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
    padding: 20,
  },
  listContainer: {
    paddingHorizontal: CARD_MARGIN / 2,
    paddingVertical: CARD_MARGIN,
  },
  row: {
    justifyContent: "space-between",
  },
  productCard: {
    width: CARD_WIDTH,
    marginBottom: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: "hidden",
  },
  productImage: {
    width: "100%",
    height: CARD_WIDTH,
    backgroundColor: "#f5f5f5",
  },
  productInfo: {
    padding: 12,
    position: "relative",
  },
  productName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    color: "#666",
    fontWeight: "bold",
  },
  favoriteButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 15,
    padding: 5,
  },
  addButton: {
    position: "absolute",
    bottom: 8,
    right: 8,
    backgroundColor: "#F59E0B",
    borderRadius: 15,
    padding: 5,
  },
  searchContainer: {
    padding: 10,
    backgroundColor: "#fff",
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: "#f5f5f5",
  },
  categoryContainer: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#fff",
  },
  categoryButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
  },
  selectedCategory: {
    backgroundColor: "#F59E0B",
  },
  sortContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
  },
  sortLabel: {
    marginRight: 10,
    fontWeight: "bold",
  },
  sortButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 10,
    borderRadius: 15,
    backgroundColor: "#f5f5f5",
  },
  selectedSort: {
    backgroundColor: "#F59E0B",
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: "center",
  },
});