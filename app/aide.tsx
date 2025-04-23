import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Animated,
  Easing,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function AideScreen() {
  const router = useRouter();
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  const faqItems = [
    {
      id: "1",
      question: "Comment passer une commande ?",
      answer:
        "Pour passer une commande, parcourez notre catalogue, ajoutez les articles souhaités à votre panier, puis suivez les étapes de paiement. Vous pouvez payer par carte bancaire, PayPal ou à la livraison.",
    },
    {
      id: "2",
      question: "Quels sont les délais de livraison ?",
      answer:
        "Les délais de livraison varient entre 2 et 5 jours ouvrables selon votre localisation. Vous pouvez suivre votre commande en temps réel dans la section 'Mes commandes'.",
    },
    {
      id: "3",
      question: "Comment retourner un article ?",
      answer:
        "Vous disposez de 14 jours pour retourner un article. Contactez notre service client pour obtenir une étiquette de retour gratuite et suivez les instructions de retour.",
    },
    {
      id: "4",
      question: "Les paiements sont-ils sécurisés ?",
      answer:
        "Oui, tous nos paiements sont sécurisés. Nous utilisons le cryptage SSL et collaborons avec des prestataires de paiement de confiance pour protéger vos données.",
    },
    {
      id: "5",
      question: "Comment modifier mes informations personnelles ?",
      answer:
        "Accédez à votre profil en cliquant sur l'icône correspondante, puis sur 'Modifier le profil'. Vous pourrez y mettre à jour toutes vos informations.",
    },
  ];

  const supportOptions = [
    {
      id: "chat",
      title: "Chat en direct",
      description: "Discutez avec notre équipe",
      icon: "chatbubbles",
      color: "#F59E0B",
    },
    {
      id: "email",
      title: "Email",
      description: "support@kosaye.com",
      icon: "mail",
      color: "#F59E0B",
    },
    {
      id: "phone",
      title: "Téléphone",
      description: "+221 77 123 45 67",
      icon: "call",
      color: "#F59E0B",
    },
  ];

  const handleSupportOption = (id: string) => {
    switch (id) {
      case "chat":
        // Implémenter l'ouverture du chat
        console.log("Ouvrir le chat");
        break;
      case "email":
        // Implémenter l'envoi d'email
        console.log("Envoyer un email");
        break;
      case "phone":
        // Implémenter l'appel téléphonique
        console.log("Appeler le support");
        break;
    }
  };

  const toggleFaq = (id: string) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

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
        <Text style={styles.headerTitle}>Centre d'aide</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* FAQ Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Questions fréquentes</Text>
          <View style={styles.faqContainer}>
            {faqItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.faqItem}
                onPress={() => toggleFaq(item.id)}
              >
                <View style={styles.faqHeader}>
                  <Text style={styles.faqQuestion}>{item.question}</Text>
                  <Ionicons
                    name={
                      expandedFaq === item.id ? "chevron-up" : "chevron-down"
                    }
                    size={24}
                    color="#666"
                  />
                </View>
                {expandedFaq === item.id && (
                  <Text style={styles.faqAnswer}>{item.answer}</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Besoin d'aide ?</Text>
          <View style={styles.supportContainer}>
            {supportOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={styles.supportOption}
                onPress={() => handleSupportOption(option.id)}
              >
                <View
                  style={[
                    styles.supportIconContainer,
                    { backgroundColor: option.color + "20" },
                  ]}
                >
                  <Ionicons name={option.icon} size={24} color={option.color} />
                </View>
                <View style={styles.supportInfo}>
                  <Text style={styles.supportTitle}>{option.title}</Text>
                  <Text style={styles.supportDescription}>
                    {option.description}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color="#000" />
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
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
    marginBottom: 16,
  },
  faqContainer: {
    gap: 12,
  },
  faqItem: {
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    padding: 16,
  },
  faqHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  faqQuestion: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
    marginRight: 16,
  },
  faqAnswer: {
    fontSize: 14,
    color: "#666",
    marginTop: 12,
    lineHeight: 20,
  },
  supportContainer: {
    gap: 12,
  },
  supportOption: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    padding: 16,
    borderRadius: 12,
  },
  supportIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  supportInfo: {
    flex: 1,
  },
  supportTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  supportDescription: {
    fontSize: 14,
    color: "#666",
  },
});
