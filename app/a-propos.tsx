import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Linking,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

export default function AProposScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  const handleSocialPress = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t("about_us")}</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Logo Section */}
        <View style={styles.logoSection}>
          <View style={styles.logoContainer}>
            <Ionicons name="business" size={80} color="#F59E0B" />
          </View>
          <Text style={styles.appName}>Kosaye</Text>
          <Text style={styles.version}>Version 1.0.0</Text>
        </View>

        {/* Description Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("our_mission")}</Text>
          <Text style={styles.description}>{t("mission_description")}</Text>
        </View>

        {/* Features Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("key_features")}</Text>
          {[t("feature_1"), t("feature_2"), t("feature_3"), t("feature_4")].map(
            (feature, index) => (
              <View key={index} style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            )
          )}
        </View>

        {/* Team Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("our_team")}</Text>
          <Text style={styles.description}>{t("team_description")}</Text>
        </View>

        {/* Contact Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("contact_us")}</Text>
          <View style={styles.contactInfo}>
            <Text style={styles.contactLabel}>{t("email")}:</Text>
            <Text style={styles.contactValue}>contact@kosaye.com</Text>
          </View>
          <View style={styles.contactInfo}>
            <Text style={styles.contactLabel}>{t("phone")}:</Text>
            <Text style={styles.contactValue}>+221 77 123 45 67</Text>
          </View>
        </View>

        {/* Social Media Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("follow_us")}</Text>
          <View style={styles.socialIcons}>
            <TouchableOpacity
              onPress={() => handleSocialPress("https://facebook.com/kosaye")}
              style={styles.socialIcon}
            >
              <Ionicons name="logo-facebook" size={24} color="#1877F2" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleSocialPress("https://twitter.com/kosaye")}
              style={styles.socialIcon}
            >
              <Ionicons name="logo-twitter" size={24} color="#1DA1F2" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleSocialPress("https://instagram.com/kosaye")}
              style={styles.socialIcon}
            >
              <Ionicons name="logo-instagram" size={24} color="#E4405F" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Legal Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("legal")}</Text>
          <TouchableOpacity
            style={styles.legalItem}
            onPress={() => router.push("/confidentialite")}
          >
            <Text style={styles.legalText}>{t("privacy_policy")}</Text>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.legalItem}
            onPress={() => router.push("/conditions")}
          >
            <Text style={styles.legalText}>{t("terms_of_service")}</Text>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>
        </View>
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
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginLeft: 16,
  },
  scrollView: {
    flex: 1,
  },
  logoSection: {
    alignItems: "center",
    padding: 32,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#FFF5E6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  appName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  version: {
    fontSize: 16,
    color: "#666",
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  featureText: {
    fontSize: 16,
    marginLeft: 8,
    color: "#333",
  },
  contactInfo: {
    flexDirection: "row",
    marginBottom: 8,
  },
  contactLabel: {
    fontSize: 16,
    fontWeight: "500",
    width: 80,
  },
  contactValue: {
    fontSize: 16,
    color: "#333",
  },
  socialIcons: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
  },
  socialIcon: {
    marginHorizontal: 12,
    padding: 8,
  },
  legalItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  legalText: {
    fontSize: 16,
    color: "#333",
  },
});
