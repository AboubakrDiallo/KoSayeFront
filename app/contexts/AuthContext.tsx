import React, { createContext, useContext, useState, useEffect } from 'react';
import { getToken, setToken, removeToken } from '../utils/auth';
import api from '../api/api';
import { router } from 'expo-router';

interface User {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  adress: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (userData: {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    phone: string;
    adress: string;
  }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = await getToken();
      if (token) {
        const response = await api.get('/user/profile');
        setUser(response.data.data);
      }
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'authentification:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      console.log('=== DÉBUT CONNEXION ===');
      console.log('Email de connexion:', email);
      
      const response = await api.post('/user/login', { email, password });
      console.log('=== RÉPONSE CONNEXION ===');
      console.log('Message:', response.data.message);
      console.log('Données utilisateur:', response.data.details.user);
      
      if (response.data.message === "Connexion réussie") {
        const token = response.data.token.token;
        await setToken(token);
        console.log('Token sauvegardé:', token);
        
        // Récupérer les données de l'utilisateur via le profil
        console.log('=== RÉCUPÉRATION DONNÉES UTILISATEUR ===');
        const userResponse = await api.get('/user/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        console.log('=== DONNÉES UTILISATEUR RÉCUPÉRÉES ===');
        console.log('Email attendu:', email);
        console.log('Email reçu:', userResponse.data.data.email);
        console.log('Données complètes:', JSON.stringify(userResponse.data.data, null, 2));
        
        if (userResponse.data.data.email !== email) {
          console.error('=== ERREUR D\'INCOHÉRENCE ===');
          console.error('Email de connexion:', email);
          console.error('Email récupéré:', userResponse.data.data.email);
          throw new Error('Les données utilisateur ne correspondent pas à l\'utilisateur connecté');
        }
        
        const userData = {
          id: userResponse.data.data.id,
          firstname: userResponse.data.data.firstname,
          lastname: userResponse.data.data.lastname,
          email: userResponse.data.data.email,
          phone: userResponse.data.data.phone,
          adress: userResponse.data.data.adress
        };
        
        console.log('=== DONNÉES UTILISATEUR FINALES ===');
        console.log(JSON.stringify(userData, null, 2));
        setUser(userData);
        
        router.replace("/(tabs)/accueil");
        return;
      }
      
      throw new Error('Réponse inattendue du serveur');
    } catch (error: any) {
      console.error('=== ERREUR DE CONNEXION ===');
      console.error('Message:', error.message);
      console.error('Réponse API:', error.response?.data);
      console.error('Stack:', error.stack);
      throw new Error(error.response?.data?.message || 'Une erreur est survenue lors de la connexion');
    }
  };

  const logout = async () => {
    try {
      await removeToken();
      setUser(null);
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      throw error;
    }
  };

  const register = async (userData: {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    phone: string;
    adress: string;
  }) => {
    try {
      console.log('=== DÉBUT INSCRIPTION ===');
      console.log('Données utilisateur:', userData);
      
      const response = await api.post('/user/register', userData);
      console.log('=== RÉPONSE INSCRIPTION ===');
      console.log('Message:', response.data.message);
      
      if (response.data.message === "Inscription réussie") {
        // Faire une requête de connexion pour obtenir le token
        const loginResponse = await api.post('/user/login', {
          email: userData.email,
          password: userData.password
        });
        
        console.log('=== RÉPONSE CONNEXION APRÈS INSCRIPTION ===');
        console.log('Message:', loginResponse.data.message);
        
        if (loginResponse.data.message === "Connexion réussie") {
          const token = loginResponse.data.token.token;
          await setToken(token);
          console.log('Token sauvegardé:', token);
          
          // Récupérer les données de l'utilisateur via le profil
          const userResponse = await api.get('/user/profile', {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          console.log('=== DONNÉES UTILISATEUR RÉCUPÉRÉES ===');
          console.log(JSON.stringify(userResponse.data.data, null, 2));
          
          setUser({
            id: userResponse.data.data.id,
            firstname: userResponse.data.data.firstname,
            lastname: userResponse.data.data.lastname,
            email: userResponse.data.data.email,
            phone: userResponse.data.data.phone,
            adress: userResponse.data.data.adress
          });
          
          router.replace("/(tabs)/accueil");
          return;
        }
      }
      
      throw new Error('Réponse inattendue du serveur');
    } catch (error: any) {
      console.error('=== ERREUR INSCRIPTION ===');
      console.error('Message:', error.message);
      console.error('Réponse API:', error.response?.data);
      
      if (error.response?.status === 422) {
        const validationErrors = error.response.data.errors;
        if (validationErrors) {
          // Vérifier si l'email est déjà utilisé
          const emailError = validationErrors.find((err: any) => 
            err.message.includes('email has already been taken')
          );
          if (emailError) {
            throw new Error('Cette adresse email est déjà utilisée. Veuillez utiliser une autre adresse email ou vous connecter.');
          }
          
          // Vérifier si le numéro de téléphone est déjà utilisé
          const phoneError = validationErrors.find((err: any) => 
            err.message.includes('phone has already been taken')
          );
          if (phoneError) {
            throw new Error('Ce numéro de téléphone est déjà utilisé. Veuillez utiliser un autre numéro.');
          }
          
          // Pour les autres erreurs de validation
          const errorMessage = validationErrors.map((err: any) => err.message).join('\n');
          throw new Error(errorMessage || 'Erreur de validation des données');
        }
      }
      
      throw new Error(error.response?.data?.message || 'Une erreur est survenue lors de l\'inscription');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthProvider; 