import React from "react";
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

export default function ProductDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Récupération et parsing des paramètres
  const {
    name,
    price,
    image,
    description,
    sizes: sizesJson,
    availableSizes: availableSizesJson,
  } = params;

  const sizes = JSON.parse(sizesJson as string);
  const availableSizes = JSON.parse(availableSizesJson as string);

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
          source={{ uri: image as string }}
          style={styles.productImage}
          onError={(e) =>
            console.log("Erreur de chargement image:", e.nativeEvent.error)
          }
        />

        {/* Informations du produit */}
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{name}</Text>
          <Text style={styles.productPrice}>{price} €</Text>
          <Text style={styles.descriptionTitle}>Description</Text>
          <Text style={styles.description}>{description}</Text>

          {/* Tailles disponibles */}
          <Text style={styles.sizesTitle}>Tailles disponibles</Text>
          <View style={styles.sizesContainer}>
            {sizes.map((size) => (
              <TouchableOpacity
                key={size}
                style={[
                  styles.sizeButton,
                  availableSizes.includes(size) && styles.sizeButtonAvailable,
                ]}
                disabled={!availableSizes.includes(size)}
              >
                <Text
                  style={[
                    styles.sizeButtonText,
                    availableSizes.includes(size) &&
                      styles.sizeButtonTextAvailable,
                  ]}
                >
                  {size}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Bouton Ajouter au panier */}
          <TouchableOpacity style={styles.addToCartButton}>
            <Text style={styles.addToCartButtonText}>Ajouter au panier</Text>
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
  },
  sizeButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
    margin: 4,
    backgroundColor: "#f5f5f5",
  },
  sizeButtonAvailable: {
    borderColor: "#000",
    backgroundColor: "#fff",
  },
  sizeButtonText: {
    fontSize: 16,
    color: "#999",
  },
  sizeButtonTextAvailable: {
    color: "#000",
  },
  addToCartButton: {
    backgroundColor: "#000",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 8,
  },
  addToCartButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
