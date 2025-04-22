import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

const { width } = Dimensions.get("window");

// Écran d'authentification (connexion / inscription)
export default function EcranAuthentification() {
  const handleConnexion = () => {
    // Naviguer vers l'écran de connexion
    router.push("/connexion");
    // console.log("Navigation vers Connexion");
  };

  const handleInscription = () => {
    // Naviguer vers l'écran d'inscription
    router.push("/inscription");
    // console.log("Navigation vers Inscription");
  };

  return (
    <SafeAreaView style={styles.conteneur}>
      <StatusBar barStyle="dark-content" backgroundColor="#F59E0B" />

      {/* Section Illustration */}
      <View style={styles.zoneIllustration}>
        {/* Placeholder pour l'image - Remplacez ceci par votre <Image> */}
        <View style={styles.imagePlaceholder}>
          <Text style={{ color: "#ccc" }}>Illustration ici</Text>
        </View>
      </View>

      {/* Section Texte */}
      <View style={styles.zoneTexte}>
        <Text style={styles.titre}>
          Achetez et vendez rapidement avec l'application Ko Saye
        </Text>
        <Text style={styles.sousTitre}>
          Remises et offres massives lorsque vous magasinez.
        </Text>
      </View>

      {/* Section Boutons */}
      <View style={styles.zoneBoutons}>
        <TouchableOpacity style={styles.boutonBlanc} onPress={handleConnexion}>
          <Text style={styles.texteBoutonNoir}>Se connecter</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.boutonOrange}
          onPress={handleInscription}
        >
          <Text style={styles.texteBoutonBlanc}>S'inscrire</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  conteneur: {
    flex: 1,
    backgroundColor: "#F59E0B",
    alignItems: "center",
  },
  zoneIllustration: {
    flex: 0.45, // Prend environ 45% de la hauteur
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  imagePlaceholder: {
    width: width * 0.8, // 80% de la largeur
    height: "80%", // 80% de la zone illustration
    backgroundColor: "#e0e0e0", // Gris clair pour le placeholder
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  zoneTexte: {
    flex: 0.2, // Prend environ 20% de la hauteur
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
    width: "100%",
  },
  titre: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 15,
  },
  sousTitre: {
    fontSize: 14, // Légèrement plus petit
    color: "#FFFFFF",
    textAlign: "center",
  },
  zoneBoutons: {
    flex: 0.35, // Prend environ 35% de la hauteur
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 30,
    paddingTop: 20, // Espace au dessus des boutons
  },
  boutonBlanc: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 15,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginBottom: 15, // Espace entre les boutons
    elevation: 3, // Ombre légère (Android)
    shadowColor: "#000", // Ombre (iOS)
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  texteBoutonNoir: {
    color: "#000000",
    fontSize: 18,
    fontWeight: "bold",
  },
  boutonOrange: {
    backgroundColor: "#F59E0B", // Même que le fond
    paddingVertical: 15,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#000000", // Bordure noire
  },
  texteBoutonBlanc: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});
