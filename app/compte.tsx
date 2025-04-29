import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useProfile } from "../contexts/ProfileContext";

export default function CompteScreen() {
  const router = useRouter();
  const { profileImage } = useProfile();

  const handleLogout = () => {
    // TODO: Implémenter la déconnexion
    router.replace("/");
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
        <Text style={styles.headerTitle}>Compte</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Section Profil */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profil</Text>
          <View style={styles.profileCard}>
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>Aboubacar Diallo</Text>
              <Text style={styles.profileEmail}>
                aladji.diallo.7509@gmail.com
              </Text>
            </View>
          </View>
        </View>

        {/* Section Informations personnelles */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informations personnelles</Text>
          <View style={styles.settingsContainer}>
            <TouchableOpacity
              style={styles.settingItem}
              onPress={() => router.push("/detail-profil")}
            >
              <Ionicons name="person" size={24} color="#F59E0B" />
              <Text style={styles.settingTitle}>Détails du profil</Text>
              <Ionicons name="chevron-forward" size={24} color="#000" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.settingItem}
              onPress={() => router.push("/changer_mot_de_passe")}
            >
              <Ionicons name="lock-closed" size={24} color="#F59E0B" />
              <Text style={styles.settingTitle}>Changer le mot de passe</Text>
              <Ionicons name="chevron-forward" size={24} color="#000" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Section Sécurité */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sécurité</Text>
          <View style={styles.settingsContainer}>
            <TouchableOpacity
              style={styles.settingItem}
              onPress={() => router.push("/authentification-deux-facteurs")}
            >
              <Ionicons name="shield-checkmark" size={24} color="#F59E0B" />
              <Text style={styles.settingTitle}>
                Authentification à deux facteurs
              </Text>
              <Ionicons name="chevron-forward" size={24} color="#000" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.settingItem}
              onPress={() => router.push("/notifications-securite")}
            >
              <Ionicons name="notifications" size={24} color="#F59E0B" />
              <Text style={styles.settingTitle}>Notifications de sécurité</Text>
              <Ionicons name="chevron-forward" size={24} color="#000" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Bouton Déconnexion */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out" size={24} color="#FF3B30" />
          <Text style={styles.logoutText}>Déconnexion</Text>
        </TouchableOpacity>
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
  settingTitle: {
    flex: 1,
    fontSize: 16,
    color: "#000",
    marginLeft: 12,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F5F5F5",
    padding: 16,
    margin: 16,
    borderRadius: 12,
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
    color: "#FF3B30",
    fontWeight: "600",
  },
});
