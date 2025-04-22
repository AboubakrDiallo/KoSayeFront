import React, { useEffect } from "react";
import { StyleSheet, View, Text, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

// Écran Splash initial de l'application
export default function EcranSplash() {
  // Redirige vers l'écran principal (index) après un délai
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/"); // Navigue vers l'écran index.tsx
    }, 3000); // Délai de 3 secondes

    return () => clearTimeout(timer); // Nettoyage au démontage
  }, []);

  return (
    <SafeAreaView style={styles.conteneur}>
      <StatusBar barStyle="light-content" backgroundColor="#F59E0B" />
      <View style={styles.contenuCentral}>
        <Text style={styles.titre}>KO SAYE</Text>
        <Text style={styles.sousTitre}>Achats et livraisons securisés</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  conteneur: {
    flex: 1,
    backgroundColor: "#F59E0B",
  },
  contenuCentral: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  titre: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 10,
    textAlign: "center",
  },
  sousTitre: {
    fontSize: 18,
    color: "#FFFFFF",
    textAlign: "center",
  },
});
