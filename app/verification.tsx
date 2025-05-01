import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Alert,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import api from "./api/api";
import { getToken } from "./utils/auth";

type PaymentMethod = 'orange' | 'areeba';

interface CartItem {
  id: string;
  product: {
    id: string;
    name: string;
    price: number;
    image?: string;
    category?: {
      id: string;
      name: string;
    };
  };
  variant?: {
    id: string;
    name: string;
    price: number;
  };
  quantity: number;
  unit_price: number;
  productId: string;
  productVariantId?: string;
}

interface Cart {
  id: string;
  reference: string;
  status: string;
  userId: number;
  createdAt: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping_fee: number;
  total: number;
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

export default function VerificationScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<Cart | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>('orange');
  const [processingPayment, setProcessingPayment] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    recipientName: "",
    city: "",
    phone: "",
    additionalInfo: "",
    isDefaultShipping: false
  });

  useEffect(() => {
    fetchCart();
    fetchAddresses();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      if (!token) {
        Alert.alert("Erreur", "Vous devez être connecté pour voir votre panier");
        router.push("/connexion");
        return;
      }

      const response = await api.get("/cart/active", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data && response.data.data) {
        const cartData = response.data.data;
        console.log("Données du panier reçues:", cartData);

        // Traitement des prix des articles
        const processedItems = cartData.items.map((item: CartItem) => {
          // S'assurer que les prix sont des nombres
          const unitPrice = Number(item.unit_price) || 0;
          const productPrice = Number(item.product.price) || 0;
          const variantPrice = item.variant ? Number(item.variant.price) || 0 : 0;

          // Utiliser le prix de la variante si disponible, sinon le prix du produit
          const finalUnitPrice = unitPrice || variantPrice || productPrice;

          return {
            ...item,
            unit_price: finalUnitPrice,
            product: {
              ...item.product,
              price: productPrice
            },
            variant: item.variant ? {
              ...item.variant,
              price: variantPrice
            } : undefined
          };
        });

        // Calculer les totaux
        const subtotal = processedItems.reduce((sum: number, item: CartItem) => 
          sum + (item.unit_price * item.quantity), 0);
        const discount = Number(cartData.discount) || 0;
        const shipping_fee = Number(cartData.shipping_fee) || 0;
        const total = subtotal - discount + shipping_fee;

        console.log("Calculs du panier:", {
          subtotal,
          discount,
          shipping_fee,
          total,
          itemsCount: processedItems.length
        });

        setCart({
          ...cartData,
          items: processedItems,
          subtotal,
          discount,
          shipping_fee,
          total
        });
      }
    } catch (error) {
      console.error("Erreur lors de la récupération du panier:", error);
      Alert.alert("Erreur", "Impossible de charger le panier");
    } finally {
      setLoading(false);
    }
  };

  const fetchAddresses = async () => {
    try {
      const token = await getToken();
      if (!token) return;

      const response = await api.get("/addresses", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAddresses(response.data.data);
      
      // Sélectionner l'adresse par défaut si elle existe
      const defaultAddress = response.data.data.find((addr: Address) => addr.isDefaultShipping);
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress.id);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des adresses:", error);
    }
  };

  const handlePaymentSelect = (method: PaymentMethod) => {
    setSelectedPayment(method);
  };

  const checkStock = async (productId: string, variantId: string | number | null, quantity: number): Promise<boolean> => {
    try {
      const token = await getToken();
      if (!token) return false;

      const response = await api.get(`/products/${productId}/stock`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { variantId }
      });

      const availableStock = response.data.data.stock;
      return availableStock >= quantity;
    } catch (error) {
      console.error("Erreur lors de la vérification du stock:", error);
      return false;
    }
  };

  const handleVerify = async () => {
    if (!cart) {
      Alert.alert("Erreur", "Panier non trouvé");
      return;
    }

    try {
      setProcessingPayment(true);
      const token = await getToken();
      if (!token) {
        Alert.alert("Session expirée", "Veuillez vous reconnecter");
        router.replace("/connexion");
        return;
      }

      const orderData = {
        addressChoice: selectedAddressId ? "existing" : "new",
        paymentMethod: selectedPayment,
        items: cart.items.map(item => ({
          productId: item.product.id,
          productVariantId: item.variant?.id || null,
          quantity: item.quantity
        })),
        ...(selectedAddressId ? { shippingAddressId: selectedAddressId } : {
          newAddress: {
            recipientName: newAddress.recipientName,
            phone: newAddress.phone ? newAddress.phone.trim() : null,
            city: newAddress.city,
            additionalInfo: newAddress.additionalInfo || null,
            isDefaultShipping: newAddress.isDefaultShipping ? 1 : 0,
            street: "Rue principale",
            postalCode: "00000",
            country: "Guinée"
          }
        })
      };

      console.log("Données envoyées pour validation:", orderData);

      const response = await api.post(
        `/carts/${cart.id}/validate`,
        orderData,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log("Réponse de validation:", response.data);

      if (response.data.success) {
        const orderId = response.data.data.orderId;
        const totalAmount = response.data.data.totalAmount;
        
        // Rediriger vers la page de paiement avec les informations nécessaires
        router.push({
          pathname: "/paiement",
          params: {
            orderId,
            amount: totalAmount.toFixed(2),
            paymentMethod: selectedPayment,
            cartId: cart.id,
            addressId: selectedAddressId || "new"
          }
        });
      }
    } catch (error: any) {
      console.error("Erreur lors de la validation du panier:", error);
      
      if (error.response?.status === 400) {
        const errorData = error.response.data;
        if (errorData.message?.includes("Stock insuffisant")) {
          // Extraire les détails du produit concerné
          const { productId, variantId, availableStock, requestedQuantity } = errorData.data || {};
          
          // Trouver le produit concerné dans le panier
          const problematicItem = cart.items.find(item => 
            item.product.id === productId && 
            item.variant?.id === variantId
          );
          
          if (problematicItem) {
            Alert.alert(
              "Stock insuffisant",
              `Le produit "${problematicItem.product.name}"${problematicItem.variant ? ` - ${problematicItem.variant.name}` : ''} n'est plus disponible en quantité suffisante.\n\n` +
              `Quantité demandée: ${requestedQuantity}\n` +
              `Stock disponible: ${availableStock}\n\n` +
              `Veuillez retourner au panier pour ajuster la quantité ou retirer ce produit.`
            );
          } else {
            Alert.alert(
              "Stock insuffisant",
              "Un ou plusieurs produits ne sont plus disponibles en quantité suffisante. Veuillez retourner au panier pour ajuster les quantités."
            );
          }
          router.back();
        } else if (errorData.message === "Le panier n'est pas en brouillon.") {
          Alert.alert("Erreur", "Ce panier a déjà été validé. Veuillez créer un nouveau panier.");
          router.push("/produits");
        } else if (errorData.message === "Le panier est vide.") {
          Alert.alert("Erreur", "Votre panier est vide. Veuillez ajouter des produits.");
          router.push("/produits");
        } else {
          Alert.alert("Erreur de validation", errorData.message || "Une erreur est survenue lors de la validation du panier");
        }
      } else if (error.response?.status === 401) {
        Alert.alert("Session expirée", "Veuillez vous reconnecter");
        router.replace("/connexion");
      } else if (error.response?.status === 404) {
        Alert.alert("Erreur", "L'endpoint de validation n'est pas disponible. Veuillez réessayer plus tard.");
      } else {
        Alert.alert("Erreur", "Une erreur est survenue lors de la validation du panier");
      }
    } finally {
      setProcessingPayment(false);
    }
  };

  const handleDeleteAddress = async (addressId: number) => {
    try {
      const token = await getToken();
      if (!token) {
        Alert.alert("Erreur", "Session expirée. Veuillez vous reconnecter.");
        router.push("/connexion");
        return;
      }

      await api.delete(`/addresses/${addressId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Mettre à jour la liste des adresses
      fetchAddresses();
      
      // Si l'adresse supprimée était sélectionnée, désélectionner
      if (selectedAddressId === addressId) {
        setSelectedAddressId(null);
      }

      Alert.alert("Succès", "Adresse supprimée avec succès");
    } catch (error: any) {
      console.error("Erreur lors de la suppression de l'adresse:", error);
      let errorMessage = "Une erreur est survenue lors de la suppression";
      
      if (error.response?.status === 401) {
        errorMessage = "Session expirée. Veuillez vous reconnecter.";
        router.push("/connexion");
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      Alert.alert("Erreur", errorMessage);
    }
  };

  const renderAddressSection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Adresse de livraison</Text>
      
      {addresses.map(address => (
        <View key={address.id} style={styles.addressContainer}>
          <TouchableOpacity
            style={[
              styles.addressCard,
              selectedAddressId === address.id && styles.selectedAddress
            ]}
            onPress={() => {
              setSelectedAddressId(address.id);
              setShowNewAddressForm(false);
            }}
          >
            <Text style={styles.addressText}>{address.recipientName}</Text>
            <Text style={styles.addressText}>{address.city}</Text>
            <Text style={styles.addressText}>{address.phone}</Text>
            <Text style={styles.addressText}>{address.additionalInfo}</Text>
            {address.isDefaultShipping && (
              <Text style={styles.defaultAddressText}>Adresse par défaut</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeleteAddress(address.id)}
          >
            <Ionicons name="trash-outline" size={24} color="#FF3B30" />
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity
        style={styles.addAddressButton}
        onPress={() => setShowNewAddressForm(!showNewAddressForm)}
      >
        <Ionicons name="add" size={24} color="#F59E0B" />
        <Text style={styles.addAddressText}>
          {showNewAddressForm ? "Masquer le formulaire" : "Ajouter une nouvelle adresse"}
        </Text>
      </TouchableOpacity>

      {showNewAddressForm && (
        <View style={styles.newAddressForm}>
          <TextInput
            style={styles.input}
            placeholder="Nom du destinataire"
            value={newAddress.recipientName}
            onChangeText={text => setNewAddress({ ...newAddress, recipientName: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Ville"
            value={newAddress.city}
            onChangeText={text => setNewAddress({ ...newAddress, city: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Téléphone"
            value={newAddress.phone}
            onChangeText={text => setNewAddress({ ...newAddress, phone: text })}
            keyboardType="phone-pad"
          />
          <TextInput
            style={styles.input}
            placeholder="Informations complémentaires"
            value={newAddress.additionalInfo}
            onChangeText={text => setNewAddress({ ...newAddress, additionalInfo: text })}
            multiline
            numberOfLines={3}
          />
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => setNewAddress({ ...newAddress, isDefaultShipping: !newAddress.isDefaultShipping })}
          >
            <Ionicons
              name={newAddress.isDefaultShipping ? "checkbox" : "square-outline"}
              size={24}
              color="#F59E0B"
            />
            <Text style={styles.checkboxLabel}>Définir comme adresse par défaut</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const renderPaymentSection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Choisissez le mode de paiement</Text>

      <TouchableOpacity
        style={[
          styles.paymentOption,
          selectedPayment === 'orange' && styles.selectedPayment,
        ]}
        onPress={() => handlePaymentSelect('orange')}
      >
        <View style={styles.paymentLeft}>
          <Ionicons name="phone-portrait" size={24} color="#FF6B00" />
          <Text style={styles.paymentText}>Orange Money</Text>
        </View>
        {selectedPayment === 'orange' && (
          <Ionicons name="checkmark" size={24} color="#F59E0B" />
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.paymentOption,
          selectedPayment === 'areeba' && styles.selectedPayment,
        ]}
        onPress={() => handlePaymentSelect('areeba')}
      >
        <View style={styles.paymentLeft}>
          <Ionicons name="card" size={24} color="#00457C" />
          <Text style={styles.paymentText}>Areeba</Text>
        </View>
        {selectedPayment === 'areeba' && (
          <Ionicons name="checkmark" size={24} color="#F59E0B" />
        )}
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#F59E0B" />
      </SafeAreaView>
    );
  }

  if (!cart) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Votre panier est vide</Text>
          <TouchableOpacity
            style={styles.shopButton}
            onPress={() => router.push("/produits")}
          >
            <Text style={styles.shopButtonText}>Continuer mes achats</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

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
        {renderAddressSection()}

        {/* Récapitulatif de la commande */}
        <View style={styles.orderSummary}>
          <Text style={styles.sectionTitle}>Récapitulatif de la commande</Text>
          <View style={styles.summaryContent}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Articles</Text>
              <Text style={styles.summaryValue}>{cart?.items?.length || 0}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Sous-total</Text>
              <Text style={styles.summaryValue}>{cart?.subtotal?.toFixed(2) || '0.00'} €</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Réduction</Text>
              <Text style={styles.summaryValue}>{cart?.discount?.toFixed(2) || '0.00'} €</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Frais de livraison</Text>
              <Text style={styles.summaryValue}>{cart?.shipping_fee?.toFixed(2) || '0.00'} €</Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>{cart?.total?.toFixed(2) || '0.00'} €</Text>
            </View>
          </View>
        </View>

        {/* Options de paiement */}
        {renderPaymentSection()}
      </ScrollView>

      {/* Bouton de validation */}
      <TouchableOpacity 
        style={[
          styles.verifyButton,
          processingPayment && styles.verifyButtonDisabled
        ]}
        onPress={handleVerify}
        disabled={processingPayment}
      >
        {processingPayment ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.verifyButtonText}>Valider la commande</Text>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: "#666",
    marginBottom: 20,
  },
  shopButton: {
    backgroundColor: "#F59E0B",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  shopButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    marginBottom: 16,
  },
  addressCard: {
    backgroundColor: "#F5F5F5",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  selectedAddress: {
    backgroundColor: "#FEF3C7",
    borderWidth: 2,
    borderColor: "#F59E0B",
  },
  addressText: {
    fontSize: 16,
    color: "#000",
    marginBottom: 4,
  },
  defaultAddressText: {
    fontSize: 14,
    color: "#F59E0B",
    marginTop: 4,
  },
  addAddressButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    marginTop: 8,
  },
  addAddressText: {
    fontSize: 16,
    color: "#F59E0B",
    marginLeft: 8,
    fontWeight: "500",
  },
  newAddressForm: {
    marginTop: 16,
    padding: 16,
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 16,
    color: "#000",
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
  verifyButton: {
    backgroundColor: "#F59E0B",
    margin: 16,
    padding: 16,
    borderRadius: 30,
    alignItems: "center",
  },
  verifyButtonDisabled: {
    opacity: 0.7,
  },
  verifyButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "600",
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  deleteButton: {
    marginLeft: 8,
    padding: 8,
  },
});
