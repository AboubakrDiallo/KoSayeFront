import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

export const getToken = async (): Promise<string | null> => {
  try {
    let token: string | null = null;
    
    if (Platform.OS !== 'web') {
      token = await SecureStore.getItemAsync('userToken');
    } else {
      token = localStorage.getItem('userToken');
    }
    
    if (!token) {
      console.log('auth.ts - getToken : Aucun token trouvé');
      return null;
    }
    
    // Vérifier que le token est bien formaté
    if (!token.startsWith('Bearer ')) {
      console.log('auth.ts - getToken : Formatage du token');
      return `Bearer ${token}`;
    }
    
    console.log('auth.ts - getToken : Token trouvé');
    return token;
  } catch (error) {
    console.error('auth.ts - Erreur lors de la récupération du token:', error);
    return null;
  }
};

export const setToken = async (token: string): Promise<void> => {
  try {
    // Supprimer le préfixe Bearer si présent
    const cleanToken = token.replace('Bearer ', '');
    
    if (Platform.OS !== 'web') {
      await SecureStore.setItemAsync('userToken', cleanToken);
    } else {
      localStorage.setItem('userToken', cleanToken);
    }
    
    console.log('auth.ts - Token sauvegardé');
  } catch (error) {
    console.error('auth.ts - Erreur lors de la sauvegarde du token:', error);
  }
};

export const removeToken = async (): Promise<void> => {
  try {
    if (Platform.OS !== 'web') {
      await SecureStore.deleteItemAsync('userToken');
    } else {
      localStorage.removeItem('userToken');
    }
    
    console.log('auth.ts - Token supprimé');
  } catch (error) {
    console.error('auth.ts - Erreur lors de la suppression du token:', error);
  }
};