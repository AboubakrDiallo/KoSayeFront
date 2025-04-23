import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Share,
  Platform,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function PartageScreen() {
  const router = useRouter();

  const handleShare = async (platform: string) => {
    const message =
      "Découvrez KoSaye, l'application qui révolutionne votre expérience shopping ! 🛍️\n\n";
    const appStoreLink = "https://apps.apple.com/app/kosaye";
    const playStoreLink =
      "https://play.google.com/store/apps/details?id=com.kosaye";

    const storeLink = Platform.OS === "ios" ? appStoreLink : playStoreLink;

    try {
      const result = await Share.share({
        message: message + "Téléchargez maintenant : " + storeLink,
        url: storeLink, // iOS only
        title: "Partagez KoSaye avec vos amis", // Android only
      });
    } catch (error) {
      console.error(error);
    }
  };

  const shareOptions = [
    {
      id: "whatsapp",
      name: "WhatsApp",
      icon: "logo-whatsapp",
      color: "#25D366",
    },
    {
      id: "facebook",
      name: "Facebook",
      icon: "logo-facebook",
      color: "#1877F2",
    },
    {
      id: "twitter",
      name: "Twitter",
      icon: "logo-twitter",
      color: "#1DA1F2",
    },
    {
      id: "instagram",
      name: "Instagram",
      icon: "logo-instagram",
      color: "#E4405F",
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Partager l'application</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* App Preview */}
        <View style={styles.previewContainer}>
          <Image
            source={{
              uri: "https://img.icons8.com/color/96/000000/shop.png",
            }}
            style={styles.appIcon}
          />
          <Text style={styles.appName}>KoSaye</Text>
          <Text style={styles.appDescription}>
            Votre marketplace préférée pour des achats en toute simplicité
          </Text>
        </View>

        {/* Benefits Section */}
        <View style={styles.benefitsContainer}>
          <Text style={styles.sectionTitle}>Pourquoi partager KoSaye ?</Text>
          <View style={styles.benefitItem}>
            <Ionicons name="cart" size={24} color="#F59E0B" />
            <Text style={styles.benefitText}>
              Large sélection de produits de qualité
            </Text>
          </View>
          <View style={styles.benefitItem}>
            <Ionicons name="shield-checkmark" size={24} color="#F59E0B" />
            <Text style={styles.benefitText}>
              Paiements sécurisés et livraison rapide
            </Text>
          </View>
          <View style={styles.benefitItem}>
            <Ionicons name="gift" size={24} color="#F59E0B" />
            <Text style={styles.benefitText}>
              Offres exclusives et réductions spéciales
            </Text>
          </View>
        </View>

        {/* Share Options */}
        <View style={styles.shareContainer}>
          <Text style={styles.sectionTitle}>Partager via</Text>
          <View style={styles.shareOptions}>
            {shareOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={styles.shareOption}
                onPress={() => handleShare(option.id)}
              >
                <View
                  style={[
                    styles.shareIconContainer,
                    { backgroundColor: option.color },
                  ]}
                >
                  <Ionicons name={option.icon} size={24} color="#FFF" />
                </View>
                <Text style={styles.shareOptionText}>{option.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Direct Share Button */}
        <TouchableOpacity
          style={styles.directShareButton}
          onPress={() => handleShare("direct")}
        >
          <Ionicons name="share-social" size={24} color="#FFF" />
          <Text style={styles.directShareText}>Partager maintenant</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  content: {
    flex: 1,
  },
  previewContainer: {
    alignItems: "center",
    padding: 24,
    backgroundColor: "#FFF",
  },
  appIcon: {
    width: 80,
    height: 80,
    borderRadius: 20,
    marginBottom: 16,
  },
  appName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000",
    marginBottom: 8,
  },
  appDescription: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    paddingHorizontal: 32,
  },
  benefitsContainer: {
    padding: 24,
    backgroundColor: "#F9FAFB",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    marginBottom: 16,
  },
  benefitItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  benefitText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 12,
  },
  shareContainer: {
    padding: 24,
  },
  shareOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  shareOption: {
    width: "48%",
    alignItems: "center",
    marginBottom: 16,
  },
  shareIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  shareOptionText: {
    fontSize: 14,
    color: "#666",
  },
  directShareButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F59E0B",
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 24,
    marginBottom: 24,
  },
  directShareText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFF",
    marginLeft: 8,
  },
});
