import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  FlatList,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.4; // Largeur des cartes produit

// --- Données Fictives ---
const featuredProducts = [
  {
    id: "1",
    name: "Montre",
    price: "40",
    image:
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=300&h=300&auto=format&fit=crop",
    description:
      "Une montre élégante et moderne, parfaite pour toutes les occasions. Design minimaliste avec un cadran noir et un bracelet en cuir véritable.",
    brand: "Rolex",
    sizes: ["S", "M", "L"],
    availableSizes: ["S", "M"],
  },
  {
    id: "2",
    name: "Pompe Nike",
    price: "430",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=300&h=300&auto=format&fit=crop",
    description:
      "Chaussures de sport Nike dernière génération. Confort optimal et design moderne pour vos performances sportives.",
    brand: "Nike",
    sizes: ["36", "37", "38", "39", "40", "41", "42", "43", "44"],
    availableSizes: ["38", "40", "41", "42"],
  },
  {
    id: "3",
    name: "Airpods",
    price: "333",
    image:
      "https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?q=80&w=300&h=300&auto=format&fit=crop",
    description:
      "Écouteurs sans fil avec une qualité sonore exceptionnelle. Connexion instantanée et autonomie longue durée.",
    brand: "Apple",
    sizes: ["Unique"],
    availableSizes: ["Unique"],
  },
  {
    id: "4",
    name: "Casque Audio",
    price: "120",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=300&h=300&auto=format&fit=crop",
    description:
      "Casque audio premium avec réduction de bruit active. Son immersif et confort optimal.",
    brand: "Sony",
    sizes: ["Unique"],
    availableSizes: ["Unique"],
  },
];

const popularProducts = [
  {
    id: "5",
    name: "LG TV",
    price: "330",
    image:
      "https://images.unsplash.com/photo-1593784991095-a205069470b6?q=80&w=300&h=300&auto=format&fit=crop",
    description:
      "Télévision LED 4K avec une qualité d'image exceptionnelle. Smart TV avec accès à toutes vos applications préférées.",
    brand: "LG",
    sizes: ['43"', '50"', '55"', '65"'],
    availableSizes: ['43"', '55"'],
  },
  {
    id: "6",
    name: "Cagoule",
    price: "50",
    image:
      "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?q=80&w=300&h=300&auto=format&fit=crop",
    description:
      "Cagoule de protection thermique haute performance. Idéale pour les activités en montagne et sports d'hiver.",
    brand: "Puma",
    sizes: ["S", "M", "L"],
    availableSizes: ["S", "L"],
  },
  {
    id: "7",
    name: "Veste",
    price: "400",
    image:
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=300&h=300&auto=format&fit=crop",
    description:
      "Veste légère et confortable, parfaite pour la mi-saison. Matériaux de haute qualité et coupe moderne.",
    brand: "The North Face",
    sizes: ["XS", "S", "M", "L", "XL"],
    availableSizes: ["S", "M", "L"],
  },
  {
    id: "8",
    name: "Chaussures",
    price: "250",
    image:
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=300&h=300&auto=format&fit=crop",
    description:
      "Chaussures de ville élégantes en cuir véritable. Design intemporel et confort optimal.",
    brand: "Nike",
    sizes: ["40", "41", "42", "43", "44", "45"],
    availableSizes: ["41", "42", "44"],
  },
];

// --- Composants UI ---

// En-tête de l'écran
const Header = () => (
  <View style={styles.headerContainer}>
    <View style={styles.headerLeft}>
      <Image
        source={{ uri: "https://via.placeholder.com/50/000000" }} // Placeholder image profil
        style={styles.profileImage}
      />
      <View>
        <Text style={styles.greetingText}>Coucou!</Text>
        <Text style={styles.userName}>Aboubacar Diallo</Text>
      </View>
    </View>
    <TouchableOpacity style={styles.notificationButton}>
      <Ionicons name="notifications-outline" size={26} color="#333" />
    </TouchableOpacity>
  </View>
);

// Barre de recherche
const SearchBar = () => (
  <View style={styles.searchContainer}>
    <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
    <TextInput
      placeholder="Rechercher ici"
      style={styles.searchInput}
      placeholderTextColor="#888"
    />
  </View>
);

// Bannière promotionnelle (simple pour l'instant)
const Banner = () => (
  <View style={styles.bannerContainer}>
    <View style={styles.bannerTextContainer}>
      <Text style={styles.bannerTitle}>Bénéficiez d'une réduction</Text>
      <Text style={styles.bannerSubtitle}>d'hiver de 20 %</Text>
      <Text style={styles.bannerSubtitle}>pour les enfants</Text>
    </View>
    <Image
      source={{ uri: "https://via.placeholder.com/100/ffffff" }} // Placeholder image enfant
      style={styles.bannerImage}
      resizeMode="contain"
    />
    {/* TODO: Ajouter les points de pagination si carousel */}
  </View>
);

// Carte Produit
interface ProductCardProps {
  item: {
    id: string;
    name: string;
    price: string;
    image: string;
    description?: string;
    brand?: string;
    sizes?: string[];
    availableSizes?: string[];
  };
}
const ProductCard = ({ item }: ProductCardProps) => (
  <TouchableOpacity
    style={styles.cardContainer}
    onPress={() => {
      router.push({
        pathname: "/detail_produit",
        params: {
          id: item.id,
          name: item.name,
          price: item.price,
          image: item.image,
          description: item.description || "Description non disponible",
          sizes: JSON.stringify(item.sizes || ["Unique"]),
          availableSizes: JSON.stringify(item.availableSizes || ["Unique"]),
        },
      });
    }}
  >
    <Image
      source={{ uri: item.image }}
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

// Section de Produits (ex: En vedette)
interface ProductSectionProps {
  title: string;
  data: Array<{ id: string; name: string; price: string; image: string }>;
}
const ProductSection = ({ title, data }: ProductSectionProps) => (
  <View style={styles.sectionContainer}>
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <TouchableOpacity onPress={() => router.push("/produits")}>
        <Text style={styles.sectionSeeAll}>Tout voir</Text>
      </TouchableOpacity>
    </View>
    <FlatList
      data={data}
      renderItem={({ item }) => <ProductCard item={item} />}
      keyExtractor={(item) => item.id}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.productListContent}
    />
  </View>
);

// --- Écran Principal Accueil ---
export default function EcranAccueil() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <Header />
        <SearchBar />
        <Banner />
        <ProductSection title="En vedette" data={featuredProducts} />
        <ProductSection title="Most Popular" data={popularProducts} />
        {/* Espace en bas pour éviter que la tabbar masque le dernier élément */}
        <View style={{ height: 20 }} />
      </ScrollView>
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
  // Header Styles
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginTop: 10, // Espace avec le haut
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
    backgroundColor: "#eee", // Placeholder color
  },
  greetingText: {
    fontSize: 14,
    color: "#666",
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  notificationButton: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 25,
  },
  // SearchBar Styles
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 25,
    marginHorizontal: 15,
    marginVertical: 15,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  // Banner Styles
  bannerContainer: {
    backgroundColor: "#F59E0B",
    borderRadius: 15,
    marginHorizontal: 15,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
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
  // Product Section Styles
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
    color: "#6A1B9A", // Couleur du thème (violet exemple)
    fontWeight: "500",
  },
  productListContent: {
    paddingHorizontal: 15,
  },
  // Product Card Styles
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
    height: CARD_WIDTH * 0.8, // Ratio pour l'image
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
