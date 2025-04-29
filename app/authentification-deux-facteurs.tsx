import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Switch,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

interface TwoFactorMethod {
  id: string;
  title: string;
  description: string;
  icon: string;
  enabled: boolean;
}

export default function AuthentificationDeuxFacteursScreen() {
  const router = useRouter();
  const [methods, setMethods] = useState<TwoFactorMethod[]>([
    {
      id: "sms",
      title: "SMS",
      description: "Recevoir un code par SMS",
      icon: "phone-portrait",
      enabled: true,
    },
    {
      id: "email",
      title: "Email",
      description: "Recevoir un code par email",
      icon: "mail",
      enabled: false,
    },
    {
      id: "authenticator",
      title: "Application d'authentification",
      description: "Utiliser une application comme Google Authenticator",
      icon: "apps",
      enabled: false,
    },
  ]);

  const toggleMethod = (id: string) => {
    setMethods(
      methods.map((method) =>
        method.id === id ? { ...method, enabled: !method.enabled } : method
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
        <Text style={styles.headerTitle}>Authentification à deux facteurs</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <Text style={styles.sectionDescription}>
            Ajoutez une couche supplémentaire de sécurité à votre compte en
            activant l'authentification à deux facteurs
          </Text>

          <View style={styles.methodsContainer}>
            {methods.map((method) => (
              <View key={method.id} style={styles.methodItem}>
                <View style={styles.methodContent}>
                  <View style={styles.methodIconContainer}>
                    <Ionicons
                      name={method.icon as any}
                      size={24}
                      color="#F59E0B"
                    />
                  </View>
                  <View style={styles.methodTextContainer}>
                    <Text style={styles.methodTitle}>{method.title}</Text>
                    <Text style={styles.methodDescription}>
                      {method.description}
                    </Text>
                  </View>
                </View>
                <Switch
                  value={method.enabled}
                  onValueChange={() => toggleMethod(method.id)}
                  trackColor={{ false: "#767577", true: "#F59E0B" }}
                  thumbColor={method.enabled ? "#fff" : "#f4f3f4"}
                />
              </View>
            ))}
          </View>

          <View style={styles.infoBox}>
            <Ionicons name="information-circle" size={24} color="#F59E0B" />
            <Text style={styles.infoText}>
              L'authentification à deux facteurs est recommandée pour renforcer
              la sécurité de votre compte
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
  methodsContainer: {
    gap: 16,
  },
  methodItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    padding: 16,
    borderRadius: 12,
  },
  methodContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  methodIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  methodTextContainer: {
    flex: 1,
  },
  methodTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  methodDescription: {
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
