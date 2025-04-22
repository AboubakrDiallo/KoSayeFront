import { Stack } from "expo-router";
import React from "react";

// Layout racine de l'application
// Utilise Stack pour la navigation de base
export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        // Option pour masquer l'en-tête par défaut pour tous les écrans
        // Vous pouvez surcharger ceci par écran si nécessaire
        headerShown: false,
      }}
    >
      {/* Définit l'écran splash initial */}
      <Stack.Screen name="splash" />
      {/* Définit l'écran d'authentification (index) */}
      <Stack.Screen name="index" />
      {/* Définit l'écran de connexion */}
      <Stack.Screen
        name="connexion"
        options={
          {
            // Option spécifique pour l'écran de connexion, si besoin
            // Par exemple, pour afficher un titre:
            // headerShown: true,
            // title: 'Connexion'
          }
        }
      />
      {/* Définit l'écran d'inscription */}
      <Stack.Screen
        name="inscription"
        options={
          {
            // Option spécifique pour l'écran d'inscription, si besoin
            // headerShown: true,
            // title: 'Inscription'
          }
        }
      />
      {/* Définit l'écran Mot de passe oublié */}
      <Stack.Screen
        name="mot_de_passe_oublie"
        options={{
          headerShown: true, // Affiche l'en-tête
          title: "Mot de passe oublié", // Titre de l'en-tête
          headerBackTitle: "Retour", // Texte du bouton retour (iOS)
          // Vous pouvez personnaliser davantage l'en-tête ici si nécessaire
          // headerStyle: { backgroundColor: '#f4511e' },
          // headerTintColor: '#fff',
          // headerTitleStyle: { fontWeight: 'bold' },
        }}
      />
      {/* Définit l'écran de Confirmation de succès */}
      <Stack.Screen
        name="confirmation_succes"
        options={{ headerShown: false }} // Pas d'en-tête pour cet écran
      />
      {/* Définit l'écran de la liste des produits */}
      <Stack.Screen
        name="produits" // -> app/produits.tsx
        options={{
          headerShown: true,
          title: "Products",
          headerBackTitle: "Retour",
          // Style de l'en-tête si besoin
          // headerStyle: { backgroundColor: 'white' },
          // headerTintColor: 'black',
        }}
      />
      {/* Définit l'écran de détail d'un produit */}
      <Stack.Screen
        name="detail_produit"
        options={{
          headerShown: false, // On cache l'en-tête car on a notre propre bouton retour
        }}
      />
      {/* Écran du panier */}
      <Stack.Screen
        name="panier"
        options={{
          headerShown: false, // On cache l'en-tête car on a notre propre en-tête
        }}
      />
      {/* Définit le groupe d'onglets principal (sera géré par son propre layout) */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      {/* Vous pouvez ajouter d'autres écrans ici */}
      {/* Exemple: <Stack.Screen name="inscription" options={{ title: 'Inscription' }} /> */}
    </Stack>
  );
}
