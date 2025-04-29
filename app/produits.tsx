import React from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const { width } = Dimensions.get("window");
const NUM_COLUMNS = 2;
// Calcul de la largeur de la carte en fonction de la largeur de l'écran, du nombre de colonnes et des marges
const CARD_MARGIN = 10;
const CARD_WIDTH = (width - CARD_MARGIN * (NUM_COLUMNS + 1)) / NUM_COLUMNS;

// --- Données Fictives (combinées et étendues) ---
const allProducts = [
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

// Interface pour un produit
interface Product {
  id: string;
  name: string;
  price: string;
  image: string;
  description: string;
  brand: string;
  sizes: string[];
  availableSizes: string[];
}

// Props pour la carte produit
interface ProductGridCardProps {
  item: Product;
  onPressAdd: () => void;
  onPressHeart: () => void;
  isFavorite: boolean;
}

const ProductGridCard = ({
  item,
  onPressAdd,
  onPressHeart,
  isFavorite,
}: ProductGridCardProps) => (
  <View style={styles.cardOuterContainer}>
    <TouchableOpacity style={styles.cardInnerContainer}>
      <Image
        source={{ uri: item.image }}
        style={styles.cardImage}
        resizeMode="cover"
      />
      {/* Overlay semi-transparent en bas */}
      <View style={styles.textOverlay}>
        <Text style={styles.cardName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.cardPrice}>{item.price}</Text>
      </View>
      {/* Bouton Coeur */}
      <TouchableOpacity
        style={styles.heartIconContainer}
        onPress={onPressHeart}
      >
        <Ionicons
          name={isFavorite ? "heart" : "heart-outline"} // Change l'icône si favori
          size={22}
          color={isFavorite ? "#E53935" : "#FFFFFF"} // Change la couleur si favori
        />
      </TouchableOpacity>
      {/* Bouton Ajouter */}
      <TouchableOpacity style={styles.addIconContainer} onPress={onPressAdd}>
        <Ionicons name="add" size={24} color="#000000" />
      </TouchableOpacity>
    </TouchableOpacity>
  </View>
);

// --- Écran Liste Produits ---
export default function ProductsScreen() {
  const [favorites, setFavorites] = React.useState<Set<string>>(
    new Set(["2", "5"])
  );

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const newFavs = new Set(prev);
      if (newFavs.has(id)) {
        newFavs.delete(id);
      } else {
        newFavs.add(id);
      }
      return newFavs;
    });
  };

  const handleAddToCart = (item: Product) => {
    console.log("Ajouter au panier:", item.name);
    // TODO: Implémenter la logique d'ajout au panier
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => {
        router.push({
          pathname: "/detail_produit",
          params: {
            id: item.id,
            name: item.name,
            price: item.price,
            image: item.image,
            description: item.description,
            sizes: JSON.stringify(item.sizes),
            availableSizes: JSON.stringify(item.availableSizes),
          },
        });
      }}
    >
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>{item.price} €</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* L'en-tête est géré par le layout `app/_layout.tsx` */}
      <FlatList
        data={allProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        numColumns={NUM_COLUMNS}
        contentContainerStyle={styles.listContainer}
        columnWrapperStyle={styles.row}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
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
  },
  productImage: {
    width: "100%",
    height: CARD_WIDTH,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    backgroundColor: "#f5f5f5",
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    color: "#666",
  },
  cardOuterContainer: {
    width: CARD_WIDTH,
    marginHorizontal: CARD_MARGIN / 2,
    marginBottom: CARD_MARGIN,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#f0f0f0",
  },
  cardInnerContainer: {
    width: "100%",
    height: "100%",
  },
  cardImage: {
    width: "100%",
    height: CARD_WIDTH * 1.2,
    backgroundColor: "#e0e0e0",
  },
  textOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  cardName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  cardPrice: {
    fontSize: 12,
    color: "#FFFFFF",
    marginTop: 2,
  },
  heartIconContainer: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    padding: 6,
    borderRadius: 15,
  },
  addIconContainer: {
    position: "absolute",
    bottom: 8,
    right: 8,
    backgroundColor: "#FFFFFF",
    padding: 5,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
});