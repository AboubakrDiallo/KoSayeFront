import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useProfile } from "../contexts/ProfileContext";
import { useAuth } from "./contexts/AuthContext";

// Définir un type pour les icônes Ionicons utilisées
type IoniconName = React.ComponentProps<typeof Ionicons>["name"];

interface SettingsItem {
  id: string;
  title: string;
  icon: IoniconName; // Utiliser le type défini
  color: string;
  value?: string; // Rendre la valeur optionnelle si elle n'est pas toujours présente
}

export default function ParametreScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { profileImage } = useProfile();

  // Utiliser l'interface pour typer le tableau
  const settingsItems: SettingsItem[] = [
    {
      id: "notification",
      title: "Notification",
      icon: "notifications",
      color: "#F59E0B",
    },
    {
      id: "langue",
      title: "Langue",
      icon: "language",
      color: "#F59E0B",
      value: "français",
    },
    {
      id: "confidentialite",
      title: "Confidentialité",
      icon: "shield",
      color: "#F59E0B",
    },
    {
      id: "centre-aide",
      title: "Centre d'aide",
      icon: "headset",
      color: "#F59E0B",
    },
    {
      id: "a-propos",
      title: "À propos de nous",
      icon: "information-circle",
      color: "#F59E0B",
    },
  ];

  const handleSettingPress = (id: string) => {
    switch (id) {
      case "compte":
        router.push("/compte");
        break;
      case "notification":
        router.push("/notification");
        break;
      case "langue":
        router.push("/langue");
        break;
      case "confidentialite":
        router.push("/confidentialite");
        break;
      case "centre-aide":
        router.push("/aide");
        break;
      case "a-propos":
        router.push("/a-propos");
        break;
      default:
        console.log("Setting pressed:", id);
    }
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
        <Text style={styles.headerTitle}>Paramètre</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Section Compte */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Compte</Text>
          <TouchableOpacity
            style={styles.profileCard}
            onPress={() => handleSettingPress("compte")}
          >
            {user?.profilePicture ? (
              <Image
                source={{ uri: user.profilePicture }}
                style={styles.profileImage}
              />
            ) : (
              <View style={styles.profileImageFallback}>
                <Text style={styles.profileImageFallbackText}>
                  {user?.firstname?.charAt(0).toUpperCase() || "?"}
                </Text>
              </View>
            )}
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>
                {user?.firstname} {user?.lastname}
              </Text>
              <Text style={styles.profileEmail}>{user?.email}</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Section Paramètres */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Paramètre</Text>
          <View style={styles.settingsContainer}>
            {settingsItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.settingItem}
                onPress={() => handleSettingPress(item.id)}
              >
                <View style={styles.settingIconContainer}>
                  {/* Le type est maintenant correct */}
                  <Ionicons name={item.icon} size={24} color={item.color} />
                </View>
                <Text style={styles.settingTitle}>{item.title}</Text>
                <View style={styles.settingRight}>
                  {item.value && (
                    <Text style={styles.settingValue}>{item.value}</Text>
                  )}
                  <Ionicons name="chevron-forward" size={24} color="#000" />
                </View>
              </TouchableOpacity>
            ))}
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
  sectionTitle: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 16,
    color: "#000",
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    padding: 16,
    borderRadius: 12,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  profileInfo: {
    flex: 1,
    marginLeft: 12,
  },
  profileName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  profileEmail: {
    fontSize: 14,
    color: "#666",
  },
  settingsContainer: {
    gap: 12,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    padding: 16,
    borderRadius: 12,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  settingTitle: {
    flex: 1,
    fontSize: 16,
    color: "#000",
    marginLeft: 12,
  },
  settingRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  settingValue: {
    fontSize: 16,
    color: "#666",
  },
  profileImageFallback: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#F59E0B",
    justifyContent: "center",
    alignItems: "center",
  },
  profileImageFallbackText: {
    fontSize: 22,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});
