import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Switch,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function EcranConfidentialite() {
  const router = useRouter();
  const [isProfilePrivate, setIsProfilePrivate] = React.useState(false);
  const [isSearchable, setIsSearchable] = React.useState(true);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header avec retour */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Confidentialité</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Paramètres de confidentialité</Text>
        <View style={styles.optionRow}>
          <Text style={styles.optionLabel}>Profil privé</Text>
          <Switch
            value={isProfilePrivate}
            onValueChange={setIsProfilePrivate}
            trackColor={{ false: "#767577", true: "#F59E0B" }}
            thumbColor={isProfilePrivate ? "#fff" : "#f4f3f4"}
          />
        </View>
        <View style={styles.optionRow}>
          <Text style={styles.optionLabel}>
            Autoriser la recherche de mon profil
          </Text>
          <Switch
            value={isSearchable}
            onValueChange={setIsSearchable}
            trackColor={{ false: "#767577", true: "#F59E0B" }}
            thumbColor={isSearchable ? "#fff" : "#f4f3f4"}
          />
        </View>
        <Text style={styles.infoText}>
          Gérez qui peut voir votre profil et comment il apparaît dans les
          résultats de recherche.
        </Text>
      </View>
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
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
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
  content: {
    padding: 24,
    gap: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    color: "#000",
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F5F5F5",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  optionLabel: {
    fontSize: 16,
    color: "#000",
  },
  infoText: {
    fontSize: 14,
    color: "#666",
    marginTop: 16,
  },
});
