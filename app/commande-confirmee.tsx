import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import api from './api/api';
import { getToken } from './utils/auth';

interface OrderDetails {
  id: string;
  reference: string;
  totalAmount: number;
  status: string;
  paymentMethod: string;
  transactionId: string;
  createdAt: string;
}

export default function CommandeConfirmeeScreen() {
  const { orderId, amount, paymentMethod, transactionId } = useLocalSearchParams<{
    orderId: string;
    amount: string;
    paymentMethod: string;
    transactionId: string;
  }>();

  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const token = await getToken();
        if (!token) {
          router.replace('/connexion');
          return;
        }

        const response = await api.get(`/orders/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.success) {
          setOrder(response.data.data);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des détails de la commande:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#F59E0B" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.successContainer}>
          <Ionicons name="checkmark-circle" size={80} color="#4CAF50" />
          <Text style={styles.successTitle}>Commande confirmée !</Text>
          <Text style={styles.successMessage}>
            Votre commande a été traitée avec succès.
          </Text>
        </View>

        <View style={styles.detailsContainer}>
          <Text style={styles.sectionTitle}>Détails de la commande</Text>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Référence :</Text>
            <Text style={styles.detailValue}>{order?.reference || 'N/A'}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Montant :</Text>
            <Text style={styles.detailValue}>{amount} FCFA</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Méthode de paiement :</Text>
            <Text style={styles.detailValue}>
              {paymentMethod === 'orange' ? 'Orange Money' : 'Areeba'}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Transaction ID :</Text>
            <Text style={styles.detailValue}>{transactionId}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Statut :</Text>
            <Text style={[styles.detailValue, styles.statusSuccess]}>Confirmée</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.replace('/(tabs)/accueil')}
        >
          <Text style={styles.buttonText}>Retour à l'accueil</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
  },
  successContainer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
  },
  successMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
  },
  detailsContainer: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 20,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  detailLabel: {
    fontSize: 16,
    color: '#666',
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  statusSuccess: {
    color: '#4CAF50',
  },
  button: {
    backgroundColor: '#F59E0B',
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 