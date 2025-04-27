import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

interface Variant {
  id: string;
  name: string;
  price: number;
  stock: number;
  image?: string | null;
}

interface ProductParams {
  id?: string | string[];
  name?: string | string[];
  price?: string | string[];
  image?: string | string[];
  description?: string | string[];
  variants?: string | string[];
  stock?: string | string[];
}

export default function ProductDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const typedParams = params as ProductParams;

  // Fonction pour extraire une valeur string unique des params
  const getStringParam = (param?: string | string[]): string => {
    if (Array.isArray(param)) {
      return param[0] || '';
    }
    return param || '';
  };

  // Fonction pour parser les variantes
  const parseVariants = (variantsParam?: string | string[]): Variant[] => {
    try {
      const variantsString = getStringParam(variantsParam);
      if (!variantsString) {
        return []; // Retourne un tableau vide si la chaîne est vide
      }
      // Vérifie si la chaîne commence par '[' et finit par ']'
      if (variantsString.startsWith('[') && variantsString.endsWith(']')) {
        return JSON.parse(variantsString);
      }
      else {
        console.warn("variantsParam n'est pas un tableau JSON valide", variantsString);
        return [];
      }

    } catch (error) {
      console.error("Erreur lors de l'analyse des variantes:", error);
      return [];
    }
  };

  const name = getStringParam(params.name);
  const price = parseFloat(getStringParam(params.price)) || 0;
  const defaultImage = getStringParam(params.image);
  const description = getStringParam(params.description);
  const variants = parseVariants(params.variants);
  const productStock = parseInt(getStringParam(params.stock), 10) || 0;

  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(variants[0] || null);
  const [currentImage, setCurrentImage] = useState<string>(defaultImage);
  const [stock, setStock] = useState<number>(productStock);

  useEffect(() => {
    if (variants.length > 0) {
      setSelectedVariant(variants[0]);
      setCurrentImage(variants[0].image || defaultImage);
      setStock(variants[0].stock);
    } else {
      setCurrentImage(defaultImage);
      setStock(productStock);
    }
  }, [variants, defaultImage, productStock]);

  const handleVariantSelect = (variant: Variant) => {
    setSelectedVariant(variant);
    setCurrentImage(variant.image || defaultImage);
    setStock(variant.stock);
  };

  const getStockDisplay = () => {
    if (variants.length === 0) {
      return stock > 0 ? `En stock (${stock} disponibles)` : "Rupture de stock";
    }
    if (selectedVariant) {
      return selectedVariant.stock > 0
        ? `En stock (${selectedVariant.stock} disponibles)`
        : "Rupture de stock";
    }
    return "Veuillez choisir une taille";
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* En-tête avec bouton retour */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
        </View>

        {/* Image du produit */}
        <Image
          source={{ uri: currentImage ? currentImage : "https://placehold.co/300x300" }} // Utilise une image par défaut si currentImage est null ou undefined
          style={styles.productImage}
          onError={(e) =>
            console.log("Erreur de chargement image:", e.nativeEvent.error)
          }
        />

        {/* Informations du produit */}
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{name}</Text>
          <Text style={styles.productPrice}>
            {selectedVariant?.price ? `${selectedVariant.price} €` : `${price} €`}
          </Text>
          <Text style={styles.productStock}>
            {getStockDisplay()}
          </Text>
          <Text style={styles.descriptionTitle}>Description</Text>
          <Text style={styles.description}>{description}</Text>

          {/* Tailles disponibles (Affichage des variantes) */}
          <Text style={styles.sizesTitle}>Tailles disponibles</Text>
          <View style={styles.sizesContainer}>
            {variants.map((variant) => (
              <TouchableOpacity
                key={variant.id}
                style={[
                  styles.sizeButton,
                  variant.stock > 0 && styles.sizeButtonAvailable,
                  selectedVariant?.id === variant.id && styles.sizeButtonSelected,
                ]}
                disabled={variant.stock <= 0}
                onPress={() => handleVariantSelect(variant)}
              >
                <Text
                  style={[
                    styles.sizeButtonText,
                    variant.stock > 0 && styles.sizeButtonTextAvailable,
                    selectedVariant?.id === variant.id && styles.sizeButtonTextSelected,
                  ]}
                >
                  {variant.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Bouton Ajouter au panier */}
          <TouchableOpacity
            style={[styles.addToCartButton, stock <= 0 && styles.addToCartButtonDisabled]} // Désactive si stock produit est 0
            disabled={stock <= 0}
            onPress={() => {
              if (stock > 0) {
                console.log("Ajouter au panier:", name, selectedVariant);
                // Ici, tu implémenterais la logique d'ajout au panier
              } else {
                alert("Produit en rupture de stock.");
              }
            }}
          >
            <Text style={styles.addToCartButtonText}>
              {stock > 0 ? "Ajouter au panier" : "Rupture de stock"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    padding: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    justifyContent: "center",
    alignItems: "center",
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
    width: width,
    height: width,
    backgroundColor: "#f5f5f5",
  },
  productInfo: {
    padding: 16,
  },
  productName: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 20,
    fontWeight: "600",
    color: "#666",
    marginBottom: 16,
  },
  productStock: {
    fontSize: 16,
    color: "#666",
    marginBottom: 16,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
    marginBottom: 24,
  },
  sizesTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  sizesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 24,
    justifyContent: 'flex-start', // Aligne les boutons à gauche
  },
  sizeButton: {
    width: 50, // Ajuste la largeur des boutons
    height: 50, // Ajuste la hauteur des boutons
    borderRadius: 25, // Les rend ronds
    borderWidth: 2,
    borderColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8, // Ajoute de la marge à droite pour l'espacement
    marginBottom: 8,
    backgroundColor: "#f5f5f5",
  },
  sizeButtonAvailable: {
    borderColor: "#000",
    backgroundColor: "#fff",
  },
  sizeButtonSelected: {
    backgroundColor: "#000", // Change la couleur de fond pour indiquer la sélection
    borderColor: "#000",
  },
  sizeButtonText: {
    fontSize: 16,
    color: "#999",
  },
  sizeButtonTextAvailable: {
    color: "#000",
  },
  sizeButtonTextSelected: {
    color: "#fff", // Change la couleur du texte pour la sélection
    fontWeight: "bold",
  },
  addToCartButton: {
    backgroundColor: "#000",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 8,
  },
  addToCartButtonDisabled: {
    backgroundColor: "#888",
  },
  addToCartButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

