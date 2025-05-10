import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { SymbolView } from "expo-symbols"; // Utilisation de expo-symbols pour l'icône

// Écran de Confirmation de succès (après connexion/inscription)
export default function EcranConfirmationSucces() {
  const handleContinuer = () => {
    console.log("Navigation vers l'accueil de l'application...");
    // Navigue vers la section principale de l'app (Tabs)
    router.replace("/(tabs)/accueil");
    // Pour l'instant, retour à l'écran d'authentification initial pour démonstration
    // router.replace('/');
  };

  return (
    <SafeAreaView style={styles.conteneur}>
      <StatusBar barStyle="light-content" backgroundColor="#F59E0B" />
      <View style={styles.contenuCentral}>
        {/* Icône Checkmark */}
        <SymbolView
          name="checkmark"
          size={80}
          type="monochrome"
          tintColor="#FFFFFF"
          style={styles.icone}
        />

        {/* Texte de confirmation */}
        <Text style={styles.texteConfirmation}>Votre connexion a réussi</Text>

        {/* Lien pour continuer */}
        <TouchableOpacity onPress={handleContinuer}>
          <Text style={styles.lienContinuer}>Continuer vers l'accueil</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  conteneur: {
    flex: 1,
    backgroundColor: "#F59E0B", // Fond orange
  },
  contenuCentral: {
    flex: 1,
    justifyContent: "center", // Centre verticalement
    alignItems: "center", // Centre horizontalement
    paddingHorizontal: 20,
  },
  icone: {
    marginBottom: 30,
  },
  texteConfirmation: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFFFFF", // Texte blanc
    textAlign: "center",
    marginBottom: 40,
  },
  lienContinuer: {
    fontSize: 18,
    color: "#FFFFFF", // Texte blanc
    textAlign: "center",
    textDecorationLine: "underline", // Souligné
  },
});
