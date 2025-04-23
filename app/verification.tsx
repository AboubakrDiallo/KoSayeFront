import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useCart } from "../contexts/CartContext";

type PaymentMethod = "paypal" | "credit" | "cash";

export default function VerificationScreen() {
  const router = useRouter();
  const { getCartTotal } = useCart();
  const { subtotal, discount, shippingFee, total } = getCartTotal();
  const [selectedPayment, setSelectedPayment] =
    useState<PaymentMethod>("credit");

  // Données de livraison (à remplacer par les vraies données)
  const deliveryInfo = {
    address: "325 15th Eighth Avenue, NewYork",
    description: "Saepe eaque fugiat ea voluptatum veniam.",
    time: "18h00, mercredi 20",
  };

  const handlePaymentSelect = (method: PaymentMethod) => {
    setSelectedPayment(method);
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
        <Text style={styles.headerTitle}>Vérifier</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Informations de livraison */}
        <View style={styles.deliveryInfo}>
          <View style={styles.infoRow}>
            <View style={styles.iconContainer}>
              <Ionicons name="location" size={24} color="#F59E0B" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>{deliveryInfo.address}</Text>
              <Text style={styles.infoDescription}>
                {deliveryInfo.description}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.iconContainer}>
              <Ionicons name="time" size={24} color="#F59E0B" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>{deliveryInfo.time}</Text>
            </View>
          </View>
        </View>

        {/* Récapitulatif de la commande */}
        <View style={styles.orderSummary}>
          <Text style={styles.sectionTitle}>Récapitulatif de la commande</Text>
          <View style={styles.summaryContent}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Articles</Text>
              <Text style={styles.summaryValue}>3</Text>
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

        {/* Options de paiement */}
        <View style={styles.paymentSection}>
          <Text style={styles.sectionTitle}>
            Choisissez le mode de paiement
          </Text>

          <TouchableOpacity
            style={[
              styles.paymentOption,
              selectedPayment === "paypal" && styles.selectedPayment,
            ]}
            onPress={() => handlePaymentSelect("paypal")}
          >
            <View style={styles.paymentLeft}>
              <Ionicons name="logo-paypal" size={24} color="#00457C" />
              <Text style={styles.paymentText}>Paypal</Text>
            </View>
            {selectedPayment === "paypal" && (
              <Ionicons name="checkmark" size={24} color="#F59E0B" />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.paymentOption,
              selectedPayment === "credit" && styles.selectedPayment,
            ]}
            onPress={() => handlePaymentSelect("credit")}
          >
            <View style={styles.paymentLeft}>
              <Ionicons name="card" size={24} color="#F59E0B" />
              <Text style={styles.paymentText}>Credit Card</Text>
            </View>
            {selectedPayment === "credit" && (
              <Ionicons name="checkmark" size={24} color="#F59E0B" />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.paymentOption,
              selectedPayment === "cash" && styles.selectedPayment,
            ]}
            onPress={() => handlePaymentSelect("cash")}
          >
            <View style={styles.paymentLeft}>
              <Ionicons name="cash" size={24} color="#2ECC71" />
              <Text style={styles.paymentText}>Cash</Text>
            </View>
            {selectedPayment === "cash" && (
              <Ionicons name="checkmark" size={24} color="#F59E0B" />
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.addPaymentButton}>
            <Text style={styles.addPaymentText}>
              Ajouter un nouveau mode de paiement
            </Text>
            <Ionicons name="add" size={24} color="#F59E0B" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bouton de validation */}
      <TouchableOpacity style={styles.verifyButton}>
        <Text style={styles.verifyButtonText}>Vérifier</Text>
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
  content: {
    flex: 1,
    padding: 16,
  },
  deliveryInfo: {
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FEF3C7",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  infoDescription: {
    fontSize: 14,
    color: "#666",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    marginBottom: 16,
  },
  orderSummary: {
    marginBottom: 24,
  },
  summaryContent: {
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
  paymentSection: {
    marginBottom: 24,
  },
  paymentOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    marginBottom: 12,
  },
  selectedPayment: {
    backgroundColor: "#FEF3C7",
  },
  paymentLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  paymentText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
    marginLeft: 12,
  },
  addPaymentButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
    padding: 16,
  },
  addPaymentText: {
    fontSize: 16,
    color: "#F59E0B",
    fontWeight: "500",
  },
  verifyButton: {
    backgroundColor: "#F59E0B",
    margin: 16,
    padding: 16,
    borderRadius: 30,
    alignItems: "center",
  },
  verifyButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "600",
  },
});
