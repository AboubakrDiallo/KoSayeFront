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

interface NotificationOption {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
}

export default function NotificationsSecuriteScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<NotificationOption[]>([
    {
      id: "connexion",
      title: "Nouvelles connexions",
      description:
        "Recevoir une notification lors d'une nouvelle connexion à votre compte",
      enabled: true,
    },
    {
      id: "changement",
      title: "Changements de sécurité",
      description:
        "Être alerté des modifications importantes de vos paramètres de sécurité",
      enabled: true,
    },
    {
      id: "suspicious",
      title: "Activité suspecte",
      description:
        "Recevoir des alertes en cas d'activité inhabituelle sur votre compte",
      enabled: true,
    },
    {
      id: "updates",
      title: "Mises à jour de sécurité",
      description: "Être informé des nouvelles fonctionnalités de sécurité",
      enabled: false,
    },
  ]);

  const toggleNotification = (id: string) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id
          ? { ...notification, enabled: !notification.enabled }
          : notification
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
        <Text style={styles.headerTitle}>Notifications de sécurité</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <Text style={styles.sectionDescription}>
            Gérez les notifications liées à la sécurité de votre compte
          </Text>

          <View style={styles.notificationsContainer}>
            {notifications.map((notification) => (
              <View key={notification.id} style={styles.notificationItem}>
                <View style={styles.notificationContent}>
                  <Text style={styles.notificationTitle}>
                    {notification.title}
                  </Text>
                  <Text style={styles.notificationDescription}>
                    {notification.description}
                  </Text>
                </View>
                <Switch
                  value={notification.enabled}
                  onValueChange={() => toggleNotification(notification.id)}
                  trackColor={{ false: "#767577", true: "#F59E0B" }}
                  thumbColor={notification.enabled ? "#fff" : "#f4f3f4"}
                />
              </View>
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
  sectionDescription: {
    fontSize: 16,
    color: "#666",
    marginBottom: 24,
  },
  notificationsContainer: {
    gap: 16,
  },
  notificationItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    padding: 16,
    borderRadius: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  notificationDescription: {
    fontSize: 14,
    color: "#666",
  },
});
