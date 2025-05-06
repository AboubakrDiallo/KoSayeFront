import React, { useState, useEffect } from "react";
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
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useCart } from "../contexts/CartContext";
import api from "./api/api";
import { getToken } from "./utils/auth";

type PaymentMethod = 'orange' | 'areeba';

interface PaymentParams {
  orderId: string;
  amount: string;
  paymentMethod: PaymentMethod;
  phoneNumber: string;
  cartId: string;
  recipientName?: string;
  city?: string;
  phone?: string;
  additionalInfo?: string;
  newAddress?: {
    recipientName: string;
    city: string;
    phone: string;
    additionalInfo?: string;
  };
}

interface Address {
  id: number;
  userId: number;
  recipientName: string;
  city: string;
  phone: string | null;
  additionalInfo: string | null;
  isDefaultShipping: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function PaymentScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { items, getCartTotal, clearCart } = useCart();
  const { subtotal, discount, shippingFee, total } = getCartTotal();
  const [loading, setLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(params.phoneNumber as string || "");
  const [paymentStatus, setPaymentStatus] = useState<"pending" | "success" | "failed">("pending");
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [newAddress, setNewAddress] = useState<any>(null);

  useEffect(() => {
    const initializeAddress = async () => {
      try {
        // Vérifier si une nouvelle adresse est fournie
        if (params.newAddress) {
          const parsedAddress = JSON.parse(params.newAddress as string);
          setNewAddress(parsedAddress);
          console.log('Nouvelle adresse reçue:', parsedAddress);
        }

        // Récupérer les adresses existantes
        const token = await getToken();
        if (!token) return;

        const response = await api.get("/addresses", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAddresses(response.data.data);
        
        // Trouver l'adresse sélectionnée
        if (params.shippingAddressId) {
          const addressId = Number(params.shippingAddressId);
          const address = response.data.data.find((addr: Address) => addr.id === addressId);
          if (address) {
            setSelectedAddress(address);
            console.log('Adresse sélectionnée trouvée:', address);
          }
        }
      } catch (error) {
        console.error("Erreur lors de l'initialisation des adresses:", error);
      }
    };

    initializeAddress();
  }, []); // Suppression de la dépendance à params.newAddress

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

  const handlePayment = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      
      if (!token) {
        Alert.alert("Erreur", "Session expirée. Veuillez vous reconnecter.");
        router.push("/connexion");
        return;
      }

      if (!phoneNumber) {
        Alert.alert("Erreur", "Veuillez entrer un numéro de téléphone");
        setLoading(false);
        return;
      }

      // Récupérer l'adresse sélectionnée
      let shippingAddressId: string | undefined = params.shippingAddressId as string;
      let selectedAddress = null;

      try {
        const addressesResponse = await api.get('/addresses', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (shippingAddressId) {
          // Trouver l'adresse sélectionnée
          selectedAddress = addressesResponse.data.data.find((addr: any) => addr.id === Number(shippingAddressId));
          if (!selectedAddress) {
            Alert.alert("Erreur", "L'adresse sélectionnée n'existe plus");
            setLoading(false);
            return;
          }
        } else if (newAddress) {
          // Utiliser la nouvelle adresse
          shippingAddressId = undefined;
        } else {
          // Utiliser l'adresse par défaut
          selectedAddress = addressesResponse.data.data.find((addr: any) => addr.isDefaultShipping);
          if (selectedAddress) {
            shippingAddressId = selectedAddress.id.toString();
          } else {
            Alert.alert("Erreur", "Veuillez sélectionner une adresse de livraison");
            setLoading(false);
            return;
          }
        }

        // Afficher l'adresse sélectionnée
        console.log('Adresse sélectionnée:', {
          id: selectedAddress?.id,
          recipientName: selectedAddress?.recipientName || newAddress?.recipientName,
          city: selectedAddress?.city || newAddress?.city,
          phone: selectedAddress?.phone || newAddress?.phone,
          isDefaultShipping: selectedAddress?.isDefaultShipping
        });

      } catch (error) {
        console.error("Erreur lors de la récupération des adresses:", error);
        Alert.alert("Erreur", "Impossible de récupérer les adresses");
        setLoading(false);
        return;
      }

      // 1. Création de la commande
      const orderData = {
        cartId: params.cartId || '',
        amount: params.amount || '0',
        paymentMethod: params.paymentMethod || 'orange',
        status: 'pending',
        items: items.map(item => ({
          productId: Number(item.productId),
          variantId: item.variantId ? Number(item.variantId) : undefined,
          quantity: Number(item.quantity)
        })),
        addressChoice: newAddress ? 'new' : 'existing',
        shippingAddressId: newAddress ? undefined : shippingAddressId,
        newAddress: newAddress ? {
          recipientName: newAddress.recipientName,
          city: newAddress.city,
          phone: newAddress.phone,
          additionalInfo: newAddress.additionalInfo,
          isDefaultShipping: false
        } : undefined
      };

      console.log('Données de la commande:', JSON.stringify(orderData, null, 2));

      // Vérification des paramètres requis pour la commande
      if (!orderData.cartId || !orderData.amount || !orderData.items || orderData.items.length === 0) {
        Alert.alert("Erreur", "Paramètres de commande manquants");
        setLoading(false);
        return;
      }

      if (!orderData.shippingAddressId && !orderData.newAddress) {
        Alert.alert("Erreur", "Veuillez sélectionner une adresse de livraison");
        setLoading(false);
        return;
      }

      try {
        const orderResponse = await api.post('/orders', orderData, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('Réponse de la commande:', JSON.stringify(orderResponse.data, null, 2));

        // Vérification de la réponse
        if (!orderResponse.data) {
          throw new Error("Pas de réponse du serveur");
        }

        if (orderResponse.data.status !== 200) {
          throw new Error(orderResponse.data.message || "Erreur lors de la création de la commande");
        }

        const order = orderResponse.data.data?.order;
        if (!order) {
          throw new Error("Données de la commande manquantes dans la réponse");
        }

        // 2. Processus de paiement
        const paymentData = {
          orderId: order.id,
          cartId: params.cartId || '',
          phoneNumber: phoneNumber.trim(),
          provider: params.paymentMethod || 'orange',
          amount: order.totalAmount.toString(),
          shippingAddressId: order.shippingAddressId,
          reference: order.reference
        };

        console.log('Données du paiement:', JSON.stringify(paymentData, null, 2));

        try {
          const paymentResponse = await api.post('/payment/process', paymentData, {
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          console.log('Réponse du paiement:', JSON.stringify(paymentResponse.data, null, 2));

          if (!paymentResponse.data) {
            throw new Error("Pas de réponse du serveur pour le paiement");
          }

          if (paymentResponse.data.status !== 'success') {
            throw new Error(paymentResponse.data.message || "Le paiement a échoué");
          }

          // 3. Vérification du paiement
          const verifyData = {
            transactionId: paymentResponse.data.data?.transactionId,
            orderId: order.id,
            cartId: params.cartId || ''
          };

          if (!verifyData.transactionId) {
            throw new Error("Transaction ID manquant dans la réponse du paiement");
          }

          console.log('Données de vérification:', JSON.stringify(verifyData, null, 2));

          const verifyResponse = await api.post('/payment/verify', verifyData, {
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          console.log('Réponse de vérification:', JSON.stringify(verifyResponse.data, null, 2));

          if (!verifyResponse.data) {
            throw new Error("Pas de réponse du serveur pour la vérification");
          }

          if (verifyResponse.data.status !== 'success') {
            throw new Error(verifyResponse.data.message || "La vérification du paiement a échoué");
          }

          // Vider le panier après une commande réussie
          try {
            const clearCartResponse = await api.delete(`/cart/${params.cartId}`, {
              headers: { 
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            });

            console.log('Panier vidé:', JSON.stringify(clearCartResponse.data, null, 2));
          } catch (clearCartError) {
            console.error("Erreur lors de la suppression du panier:", clearCartError);
            // On continue quand même car la commande est réussie
          }

          // Redirection vers la page de confirmation
          router.replace({
            pathname: "/commande-confirmee",
            params: {
              orderId: order.id,
              reference: order.reference,
              amount: order.totalAmount,
              paymentMethod: params.paymentMethod,
              transactionId: paymentResponse.data.data.transactionId
            }
          });
        } catch (paymentError: any) {
          console.error("Erreur lors du paiement:", paymentError);
          throw new Error(paymentError.response?.data?.message || paymentError.message || "Erreur lors du paiement");
        }
      } catch (error: any) {
        console.error("Erreur détaillée:", error.response?.data || error);
        setPaymentStatus('failed');
        let errorMessage = "Une erreur est survenue lors du paiement";
        
        if (error.response?.status === 401) {
          errorMessage = "Session expirée. Veuillez vous reconnecter.";
          router.push("/connexion");
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        Alert.alert("Erreur", errorMessage, [
          {
            text: "OK",
            onPress: () => router.back()
          }
        ]);
      }
    } catch (error: any) {
      console.error("Erreur lors du paiement:", error);
      setPaymentStatus('failed');
      let errorMessage = "Une erreur est survenue lors du paiement";
      
      if (error.response?.status === 401) {
        errorMessage = "Session expirée. Veuillez vous reconnecter.";
        router.push("/connexion");
      } else if (error.response?.data?.message) {
        errorMessage = errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Alert.alert("Erreur", errorMessage, [
        {
          text: "OK",
          onPress: () => router.back()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      
      if (!token) {
        Alert.alert("Erreur", "Session expirée. Veuillez vous reconnecter.");
        router.push("/connexion");
        return;
      }

      const response = await api.post(`/api/v1/payment/cancel/${params.cartId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.status === 'success') {
        Alert.alert(
          "Annulation",
          "Le paiement a été annulé",
          [
            {
              text: "OK",
              onPress: () => router.back()
            }
          ]
        );
      } else {
        throw new Error(response.data.message || "Erreur lors de l'annulation");
      }
    } catch (error: any) {
      console.error("Erreur lors de l'annulation:", error);
      let errorMessage = "Une erreur est survenue lors de l'annulation du paiement";
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      Alert.alert("Erreur", errorMessage);
    } finally {
      setLoading(false);
    }
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

        {/* Adresse de livraison */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Adresse de livraison</Text>
          {selectedAddress ? (
            <View style={styles.addressCard}>
              <Text style={styles.addressText}>
                <Text style={styles.addressLabel}>Nom: </Text>
                {selectedAddress.recipientName}
              </Text>
              <Text style={styles.addressText}>
                <Text style={styles.addressLabel}>Ville: </Text>
                {selectedAddress.city}
              </Text>
              <Text style={styles.addressText}>
                <Text style={styles.addressLabel}>Téléphone: </Text>
                {selectedAddress.phone}
              </Text>
              {selectedAddress.additionalInfo && (
                <Text style={styles.addressText}>
                  <Text style={styles.addressLabel}>Informations complémentaires: </Text>
                  {selectedAddress.additionalInfo}
                </Text>
              )}
              {selectedAddress.isDefaultShipping && (
                <Text style={styles.defaultAddressText}>Adresse par défaut</Text>
              )}
            </View>
          ) : newAddress ? (
            <View style={styles.addressCard}>
              <Text style={styles.addressText}>
                <Text style={styles.addressLabel}>Nom: </Text>
                {newAddress.recipientName}
              </Text>
              <Text style={styles.addressText}>
                <Text style={styles.addressLabel}>Ville: </Text>
                {newAddress.city}
              </Text>
              <Text style={styles.addressText}>
                <Text style={styles.addressLabel}>Téléphone: </Text>
                {newAddress.phone}
              </Text>
              {newAddress.additionalInfo && (
                <Text style={styles.addressText}>
                  <Text style={styles.addressLabel}>Informations complémentaires: </Text>
                  {newAddress.additionalInfo}
                </Text>
              )}
              {newAddress.isDefaultShipping === 1 && (
                <Text style={styles.defaultAddressText}>Adresse par défaut</Text>
              )}
            </View>
          ) : (
            <Text style={styles.noAddressText}>Aucune adresse sélectionnée</Text>
          )}
        </View>

        {/* Informations de paiement */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informations de paiement</Text>
          <View style={styles.paymentInfo}>
            <Text style={styles.paymentInfoText}>
              Mode de paiement: {params.paymentMethod === 'orange' ? 'Orange Money' : 'Areeba'}
            </Text>
            <Text style={styles.paymentInfoText}>
              Numéro de téléphone: {params.phoneNumber}
            </Text>
          </View>
        </View>

        {/* Numéro de téléphone pour le paiement */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Numéro de téléphone pour le paiement</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Entrez votre numéro de téléphone"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
            />
          </View>
        </View>

        {/* Bouton de paiement */}
        <View style={styles.paymentButtonContainer}>
          <TouchableOpacity 
            style={styles.paymentButton}
            onPress={handlePayment}
            disabled={loading || !phoneNumber}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.paymentButtonText}>
                Payer {params.amount} €
              </Text>
            )}
          </TouchableOpacity>
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
  paymentButtonContainer: {
    padding: 16,
    backgroundColor: '#fff',
  },
  paymentButton: {
    backgroundColor: '#F59E0B',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  paymentButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  paymentInfo: {
    backgroundColor: "#F5F5F5",
    padding: 16,
    borderRadius: 12,
  },
  paymentInfoText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 8,
  },
  addressCard: {
    backgroundColor: "#F5F5F5",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  addressText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 8,
  },
  addressLabel: {
    fontWeight: 'bold',
    color: '#000',
  },
  defaultAddressText: {
    fontSize: 14,
    color: "#F59E0B",
    marginTop: 4,
  },
  noAddressText: {
    fontSize: 16,
    color: "#666",
    textAlign: 'center',
    padding: 16,
  },
});
