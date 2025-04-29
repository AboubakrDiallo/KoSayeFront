import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Alert,
  Platform,
  Animated,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import { Ionicons } from '@expo/vector-icons';
import api from './api/api';

interface Variant {
  id?: number;
  name: string;
  price: number | string;
  stock: number;
  image: string | null;
}

interface Property {
  id: number;
  name: string;
}

interface PropertyValue {
  property_id: number;
  value: string;
  property?: Property;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number | string;
  stock: number;
  image: string | null;
  categoryId: number;
  is_active: boolean;
  status: 'en_ligne' | 'rupture';
  category: { id: number; name: string };
  propertyValues: PropertyValue[];
  variants?: Variant[];
}

const ProductDetail = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { productId, id } = route.params as { productId?: number | string; id?: number | string };
  const finalProductId = productId || id;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [cartButtonScale] = useState(new Animated.Value(1));
  const [wishlistButtonScale] = useState(new Animated.Value(1));

  useEffect(() => {
    const fetchProduct = async () => {
      if (!finalProductId) {
        Alert.alert('Erreur', 'ID du produit non fourni');
        setLoading(false);
        return;
      }

      try {
        let token: string | null = null;
        if (Platform.OS !== 'web') {
          token = await SecureStore.getItemAsync('authToken');
        } else {
          token = localStorage.getItem('authToken');
        }
        console.log('Token utilisé pour ProductDetail:', token);
        console.log('Requête pour productId:', finalProductId);

        const response = await api.get(`/products/${finalProductId}`);
        console.log('Réponse API complète:', JSON.stringify(response.data, null, 2));
        const fetchedProduct: Product = response.data.data;

        if (!fetchedProduct || !fetchedProduct.id || !fetchedProduct.name) {
          throw new Error('Données du produit invalides');
        }

        fetchedProduct.variants = Array.isArray(fetchedProduct.variants) ? fetchedProduct.variants : [];
        fetchedProduct.propertyValues = Array.isArray(fetchedProduct.propertyValues)
          ? fetchedProduct.propertyValues
          : [];

        console.log('PropertyValues:', JSON.stringify(fetchedProduct.propertyValues, null, 2));

        setProduct(fetchedProduct);
        setSelectedVariant(fetchedProduct.variants[0] || null);
        console.log('Produit chargé:', JSON.stringify(fetchedProduct, null, 2));
        console.log('Variante sélectionnée:', JSON.stringify(fetchedProduct.variants[0] || null, null, 2));
        setLoading(false);
      } catch (error: any) {
        console.error('Erreur lors de la récupération du produit:', error);
        console.log('Détails erreur:', JSON.stringify(error.response?.data, null, 2));
        console.log('Statut HTTP:', error.response?.status);
        Alert.alert(
          'Erreur',
          error.response?.status === 400
            ? 'Produit non trouvé ou données invalides. Veuillez réessayer.'
            : error.response?.data?.message || error.message || 'Impossible de charger le produit'
        );
        setProduct(null);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [finalProductId]);

  const handleAddToCart = () => {
    if (product) {
      console.log(`Ajouter au panier: ${product.name}, variante: ${selectedVariant?.name}`);
      Animated.sequence([
        Animated.timing(cartButtonScale, {
          toValue: 0.95,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(cartButtonScale, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const handleAddToWishlist = () => {
    if (product) {
      console.log(`Ajouter à la liste de souhaits: ${product.name}`);
      Animated.sequence([
        Animated.timing(wishlistButtonScale, {
          toValue: 0.95,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(wishlistButtonScale, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const formatPrice = (price: number | string | undefined): string => {
    if (price == null) return '0.00';
    const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
    return isNaN(numericPrice) ? '0.00' : numericPrice.toFixed(2);
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#1E3A8A" />
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.centered}>
        <Ionicons name="alert-circle-outline" size={48} color="#DC2626" />
        <Text style={styles.errorText}>Produit indisponible</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Retour à l'accueil</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Image
        source={{
          uri: selectedVariant?.image || product.image || 'https://placehold.co/400x400',
        }}
        style={styles.productImage}
        resizeMode="cover"
      />
      <View style={styles.contentContainer}>
        <View style={styles.headerCard}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.categoryName}>{product.category?.name || 'Catégorie inconnue'}</Text>
        </View>

        {product.variants && product.variants.length > 0 && (
          <View style={styles.variantsCard}>
            <Text style={styles.sectionTitle}>Choisir une variante</Text>
            <View style={styles.variantsContainer}>
              {product.variants.map((variant) => (
                <TouchableOpacity
                  key={variant.name}
                  onPress={() => setSelectedVariant(variant)}
                  style={[
                    styles.variantImageContainer,
                    selectedVariant?.name === variant.name && styles.selectedVariant,
                  ]}
                >
                  <Image
                    source={{
                      uri: variant.image || product.image || 'https://placehold.co/60x60',
                    }}
                    style={styles.variantImage}
                    resizeMode="cover"
                  />
                  <Text style={styles.variantName}>{variant.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        <View style={styles.priceCard}>
          <Text style={styles.price}>
            {formatPrice(selectedVariant?.price || product.price)} €
          </Text>
          <Text
            style={[
              styles.status,
              product.status === 'en_ligne' ? styles.statusOnline : styles.statusOutOfStock,
            ]}
          >
            {product.status === 'en_ligne' ? 'En stock' : 'Rupture de stock'}
          </Text>
        </View>

        <Text style={styles.stock}>
          Stock disponible : {selectedVariant?.stock || product.stock || 0}
        </Text>

        <View style={styles.descriptionCard}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>
            {product.description || 'Aucune description disponible'}
          </Text>
        </View>

        {product.propertyValues && product.propertyValues.length > 0 && (
          <View style={styles.propertiesCard}>
            <Text style={styles.sectionTitle}>Caractéristiques</Text>
            {product.propertyValues.map((prop, index) => (
              <Text key={index} style={styles.property}>
                • {prop.property?.name || 'Propriété inconnue'} : {prop.value}
              </Text>
            ))}
          </View>
        )}

        <View style={styles.actionsContainer}>
          <Animated.View style={{ transform: [{ scale: cartButtonScale }] }}>
            <TouchableOpacity
              style={[
                styles.actionButton,
                styles.cartButton,
                product.status === 'rupture' && styles.disabledButton,
              ]}
              onPress={handleAddToCart}
              disabled={product.status === 'rupture'}
            >
              <Ionicons name="cart-outline" size={20} color="#FFF" style={styles.buttonIcon} />
              <Text style={styles.actionButtonText}>Ajouter au panier</Text>
            </TouchableOpacity>
          </Animated.View>
          <Animated.View style={{ transform: [{ scale: wishlistButtonScale }] }}>
            <TouchableOpacity
              style={[styles.actionButton, styles.wishlistButton]}
            
            >
              <Ionicons name="heart-outline" size={20} color="#FFF" style={styles.buttonIcon} />
              <Text style={styles.actionButtonText}>Ajouter aux favoris</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={20} color="#1E3A8A" style={styles.buttonIcon} />
        <Text style={styles.backButtonText}>Retour</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  productImage: {
    width: '100%',
    height: 350,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  headerCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginTop: -24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  productName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
  },
  variantsCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  variantsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  variantImageContainer: {
    alignItems: 'center',
    padding: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
  },
  selectedVariant: {
    borderColor: '#1E3A8A',
    borderWidth: 2,
    backgroundColor: '#EFF6FF',
  },
  variantImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginBottom: 4,
  },
  variantName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  priceCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  price: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E3A8A',
  },
  status: {
    fontSize: 16,
    fontWeight: '600',
  },
  statusOnline: {
    color: '#10B981',
  },
  statusOutOfStock: {
    color: '#DC2626',
  },
  stock: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  descriptionCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  description: {
    fontSize: 16,
    fontWeight: '400',
    color: '#374151',
    lineHeight: 24,
  },
  propertiesCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  property: {
    fontSize: 16,
    fontWeight: '400',
    color: '#374151',
    marginVertical: 4,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cartButton: {
    backgroundColor: '#1E3A8A',
  },
  wishlistButton: {
    backgroundColor: '#F59E0B',
  },
  disabledButton: {
    backgroundColor: '#D1D5DB',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
    marginLeft: 8,
  },
  buttonIcon: {
    marginRight: 4,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    marginBottom: 24,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E3A8A',
    marginLeft: 4,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#DC2626',
    marginTop: 12,
    marginBottom: 24,
    textAlign: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
    marginTop: 12,
  },
});

export default ProductDetail;