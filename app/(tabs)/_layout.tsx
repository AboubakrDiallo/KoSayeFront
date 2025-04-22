import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons"; // Utilisation d'une librairie d'icônes
// import Colors from "@/constants/Colors"; // Supposons que ce fichier n'existe pas encore

const TINT_COLOR = "#6A1B9A"; // Exemple de couleur (violet)

// Layout pour la navigation par onglets principale
export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: TINT_COLOR, // Couleur de l'icône active
        tabBarInactiveTintColor: "gray", // Couleur de l'icône inactive
        tabBarStyle: {
          // Styles pour la barre d'onglets si nécessaire
          backgroundColor: "white",
          paddingTop: 5, // Petit espace au dessus des icônes
          height: 60, // Hauteur standard
          borderTopWidth: 1, // Ligne de séparation en haut
          borderTopColor: "#eee",
        },
        headerShown: false, // Masque l'en-tête par défaut pour les écrans d'onglets
      }}
    >
      <Tabs.Screen
        name="accueil" // Nom du fichier -> app/(tabs)/accueil.tsx
        options={{
          title: "Accueil", // Titre affiché (peut être masqué si showLabel: false)
          tabBarShowLabel: false, // Masque le texte sous l'icône
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="recherche" // Nom du fichier -> app/(tabs)/recherche.tsx
        options={{
          title: "Recherche",
          tabBarShowLabel: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="panier" // Nom du fichier -> app/(tabs)/panier.tsx
        options={{
          title: "Panier",
          tabBarShowLabel: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="basket" size={size} color={color} /> // Ou 'cart'
          ),
        }}
      />
      <Tabs.Screen
        name="profil" // Nom du fichier -> app/(tabs)/profil.tsx
        options={{
          title: "Profil",
          tabBarShowLabel: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-circle" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
