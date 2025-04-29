import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

export default function FavorisScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  // Données de test pour les favoris
  const favorites = [
    {
      id: 1,
      name: "Artisan 1",
      category: "Menuiserie",
      rating: 4.5,
      image: "https://via.placeholder.com/100",
    },
    {
      id: 2,
      name: "Artisan 2",
      category: "Couture",
      rating: 4.8,
      image: "https://via.placeholder.com/100",
    },
    {
      id: 3,
      name: "Artisan 3",
      category: "Bijouterie",
      rating: 4.2,
      image: "https://via.placeholder.com/100",
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t("favorites")}</Text>
        <TouchableOpacity
          onPress={() => router.push("/")}
          style={styles.homeButton}
        >
          <Ionicons name="home" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        {favorites.length > 0 ? (
          favorites.map((item) => (
            <TouchableOpacity key={item.id} style={styles.favoriteItem}>
              <Image source={{ uri: item.image }} style={styles.itemImage} />
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemCategory}>{item.category}</Text>
                <View style={styles.ratingContainer}>
                  <Ionicons name="star" size={16} color="#F59E0B" />
                  <Text style={styles.rating}>{item.rating}</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.removeButton}>
                <Ionicons name="heart" size={24} color="#F59E0B" />
              </TouchableOpacity>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="heart" size={64} color="#F59E0B" />
            <Text style={styles.emptyText}>{t("no_favorites")}</Text>
            <Text style={styles.emptySubtext}>{t("add_favorites")}</Text>
          </View>
        )}
      </ScrollView>
    </View>
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
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
  },
  homeButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  favoriteItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  itemCategory: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rating: {
    fontSize: 14,
    color: "#666",
    marginLeft: 4,
  },
  removeButton: {
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
});
