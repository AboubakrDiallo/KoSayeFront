import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useCart } from "../contexts/CartContext";

export default function PaymentScreen() {
  const router = useRouter();
  const { items, getCartTotal, clearCart } = useCart();
  const { subtotal, discount, shippingFee, total } = getCartTotal();

  // État pour le formulaire
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    adresse: "",
    ville: "",
    codePostal: "",
    pays: "",
  });

  // Gérer les changements dans le formulaire
  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Valider le formulaire
  const validateForm = () => {
    const requiredFields = [
      "nom",
      "prenom",
      "email",
      "telephone",
      "adresse",
      "ville",
      "codePostal",
      "pays",
    ];

    for (const field of requiredFields) {
      if (!formData[field as keyof typeof formData]) {
        Alert.alert("Erreur", `Le champ ${field} est requis`);
        return false;
      }
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert("Erreur", "Veuillez entrer une adresse email valide");
      return false;
    }

    return true;
  };

  // Gérer la soumission du formulaire
  const handleSubmit = () => {
    if (!validateForm()) return;

    // Ici, vous pourriez ajouter la logique de paiement
    Alert.alert("Confirmation", "Votre commande a été passée avec succès !", [
      {
        text: "OK",
        onPress: () => {
          clearCart();
          router.push("/(tabs)/accueil");
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      {/* En-tête */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Paiement</Text>
        <View style={styles.menuButton} />
      </View>

      <ScrollView style={styles.content}>
        {/* Informations de livraison */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informations de livraison</Text>
          <View style={styles.form}>
            <View style={styles.row}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Nom</Text>
                <TextInput
                  style={styles.input}
                  value={formData.nom}
                  onChangeText={(text) => handleChange("nom", text)}
                  placeholder="Entrez votre nom"
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Prénom</Text>
                <TextInput
                  style={styles.input}
                  value={formData.prenom}
                  onChangeText={(text) => handleChange("prenom", text)}
                  placeholder="Entrez votre prénom"
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                value={formData.email}
                onChangeText={(text) => handleChange("email", text)}
                placeholder="Entrez votre email"
                keyboardType="email-address"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Téléphone</Text>
              <TextInput
                style={styles.input}
                value={formData.telephone}
                onChangeText={(text) => handleChange("telephone", text)}
                placeholder="Entrez votre numéro de téléphone"
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Adresse</Text>
              <TextInput
                style={styles.input}
                value={formData.adresse}
                onChangeText={(text) => handleChange("adresse", text)}
                placeholder="Entrez votre adresse"
              />
            </View>

            <View style={styles.row}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Ville</Text>
                <TextInput
                  style={styles.input}
                  value={formData.ville}
                  onChangeText={(text) => handleChange("ville", text)}
                  placeholder="Entrez votre ville"
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Code postal</Text>
                <TextInput
                  style={styles.input}
                  value={formData.codePostal}
                  onChangeText={(text) => handleChange("codePostal", text)}
                  placeholder="Entrez votre code postal"
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Pays</Text>
              <TextInput
                style={styles.input}
                value={formData.pays}
                onChangeText={(text) => handleChange("pays", text)}
                placeholder="Entrez votre pays"
              />
            </View>
          </View>
        </View>

        {/* Récapitulatif de la commande */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Récapitulatif de la commande</Text>
          <View style={styles.orderSummary}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Articles</Text>
              <Text style={styles.summaryValue}>{items.length}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total</Text>
              <Text style={styles.summaryValue}>${subtotal}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Rabais</Text>
              <Text style={styles.summaryValue}>${discount}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Frais de livraison</Text>
              <Text style={styles.summaryValue}>${shippingFee}</Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>${total}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bouton de paiement */}
      <TouchableOpacity style={styles.paymentButton} onPress={handleSubmit}>
        <Text style={styles.paymentButtonText}>Payer ${total}</Text>
      </TouchableOpacity>
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
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
  },
  menuButton: {
    width: 40,
    height: 40,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    marginBottom: 16,
  },
  form: {
    backgroundColor: "#F5F5F5",
    padding: 16,
    borderRadius: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
  },
  inputContainer: {
    flex: 1,
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    color: "#000",
  },
  orderSummary: {
    backgroundColor: "#F5F5F5",
    padding: 16,
    borderRadius: 12,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: "#666",
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  paymentButton: {
    backgroundColor: "#F59E0B",
    margin: 16,
    padding: 16,
    borderRadius: 30,
    alignItems: "center",
  },
  paymentButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "600",
  },
});
