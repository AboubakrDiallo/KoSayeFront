import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Switch,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

interface NotificationCategory {
  id: string;
  title: string;
  description: string;
  icon: string;
  enabled: boolean;
}

export default function NotificationScreen() {
  const router = useRouter();
  const [categories, setCategories] = useState<NotificationCategory[]>([
    {
      id: "messages",
      title: "Messages",
      description: "Notifications pour les nouveaux messages et conversations",
      icon: "chatbubble-ellipses",
      enabled: true,
    },
    {
      id: "reservations",
      title: "Réservations",
      description:
        "Notifications pour les nouvelles réservations et modifications",
      icon: "calendar",
      enabled: true,
    },
    {
      id: "promotions",
      title: "Promotions",
      description: "Notifications pour les offres spéciales et promotions",
      icon: "pricetag",
      enabled: false,
    },
    {
      id: "updates",
      title: "Mises à jour",
      description:
        "Notifications pour les nouvelles fonctionnalités et mises à jour",
      icon: "notifications",
      enabled: true,
    },
  ]);

  const toggleCategory = (id: string) => {
    setCategories(
      categories.map((category) =>
        category.id === id
          ? { ...category, enabled: !category.enabled }
          : category
      )
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header avec bouton retour */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <Text style={styles.sectionDescription}>
            Gérez vos préférences de notification pour rester informé des
            activités importantes
          </Text>

          <View style={styles.categoriesContainer}>
            {categories.map((category) => (
              <View key={category.id} style={styles.categoryItem}>
                <View style={styles.categoryContent}>
                  <View style={styles.categoryIconContainer}>
                    <Ionicons
                      name={category.icon as any}
                      size={24}
                      color="#F59E0B"
                    />
                  </View>
                  <View style={styles.categoryTextContainer}>
                    <Text style={styles.categoryTitle}>{category.title}</Text>
                    <Text style={styles.categoryDescription}>
                      {category.description}
                    </Text>
                  </View>
                </View>
                <Switch
                  value={category.enabled}
                  onValueChange={() => toggleCategory(category.id)}
                  trackColor={{ false: "#767577", true: "#F59E0B" }}
                  thumbColor={category.enabled ? "#fff" : "#f4f3f4"}
                />
              </View>
            ))}
          </View>

          <View style={styles.infoBox}>
            <Ionicons name="information-circle" size={24} color="#F59E0B" />
            <Text style={styles.infoText}>
              Les notifications sont importantes pour ne pas manquer les mises à
              jour importantes de votre compte
            </Text>
          </View>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "600",
    marginRight: 40,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    padding: 16,
  },
  sectionDescription: {
    fontSize: 16,
    color: "#666",
    marginBottom: 24,
  },
  categoriesContainer: {
    gap: 16,
  },
  categoryItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    padding: 16,
    borderRadius: 12,
  },
  categoryContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  categoryIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  categoryTextContainer: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  categoryDescription: {
    fontSize: 14,
    color: "#666",
  },
  infoBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF8E1",
    padding: 16,
    borderRadius: 12,
    marginTop: 24,
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: "#666",
  },
});
