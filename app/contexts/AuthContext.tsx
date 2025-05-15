import { router } from 'expo-router';
import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/api';
import { getToken, removeToken, setToken } from '../utils/auth';

interface User {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  adress: string;
  profilePicture: string | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
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
  updateUser: (userData: Partial<User>) => void;
  checkAuth: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuth = async () => {
    try {
      console.log('=== VÉRIFICATION AUTHENTIFICATION ===');
      const token = await getToken();
      
      if (!token) {
        console.log('Aucun token trouvé');
        setIsAuthenticated(false);
        setUser(null);
        return false;
      }

      // Configurer le token dans les headers de l'API
      api.defaults.headers.common['Authorization'] = token;
      
      const response = await api.get('/api/v1/user/profile');
      console.log('Profil utilisateur récupéré:', response.data);
      
      if (response.data.data) {
        setUser(response.data.data);
        setIsAuthenticated(true);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'authentification:', error);
      setIsAuthenticated(false);
      setUser(null);
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log('=== DÉBUT CONNEXION ===');
      console.log('Email de connexion:', email);
      
      const response = await api.post('/api/v1/user/login', { email, password });
      console.log('=== RÉPONSE CONNEXION ===');
      console.log('Message:', response.data.message);
      
      if (response.data.message === "Connexion réussie") {
        if (!response.data.token?.token) {
          throw new Error('Token manquant dans la réponse du serveur');
        }

        const token = response.data.token.token;
        await setToken(token);
        
        // Configurer le token dans les headers de l'API
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        const userResponse = await api.get('/api/v1/user/profile');
        
        if (!userResponse.data.data) {
          throw new Error('Données utilisateur manquantes dans la réponse');
        }
        
        const userData = userResponse.data.data;
        setUser(userData);
        setIsAuthenticated(true);
        
        router.push('/(tabs)/accueil');
        return;
      }
      
      throw new Error('Réponse inattendue du serveur');
    } catch (error: any) {
      console.error('=== ERREUR DE CONNEXION ===');
      console.error('Message:', error.message);
      console.error('Réponse API:', error.response?.data);
      throw new Error(error.response?.data?.message || 'Une erreur est survenue lors de la connexion');
    }
  };

  const logout = async () => {
    try {
      await removeToken();
      setUser(null);
      setIsAuthenticated(false);
      delete api.defaults.headers.common['Authorization'];
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
            adress: userResponse.data.data.adress,
            profilePicture: userResponse.data.data.profilePicture
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

  const updateUser = (userData: Partial<User>) => {
    console.log('=== MISE À JOUR UTILISATEUR ===');
    console.log('Données reçues:', userData);
    
    setUser(prev => {
      if (!prev) return null;
      
      // Si une nouvelle photo de profil est fournie, construire l'URL complète
      if (userData.profilePicture) {
        const baseUrl = 'http://192.168.1.144:3333';
        // Vérifier si l'URL est déjà complète
        if (!userData.profilePicture.startsWith('http')) {
          // Si le chemin commence par /uploads, on l'utilise tel quel
          if (userData.profilePicture.startsWith('/uploads')) {
            userData.profilePicture = `${baseUrl}${userData.profilePicture}`;
          } else {
            // Sinon, on ajoute le chemin /uploads/users/
            userData.profilePicture = `${baseUrl}/uploads/users/${userData.profilePicture}`;
          }
        }
        console.log('URL de la photo de profil construite:', userData.profilePicture);
      }
      
      const updatedUser = { ...prev, ...userData };
      console.log('Utilisateur mis à jour:', updatedUser);
      return updatedUser;
    });
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        isAuthenticated,
        login, 
        logout, 
        register, 
        updateUser,
        checkAuth 
      }}
    >
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