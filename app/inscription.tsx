import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

// Écran d'Inscription
export default function EcranInscription() {
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [emailOuTel, setEmailOuTel] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [confirmerMotDePasse, setConfirmerMotDePasse] = useState("");

  const handleInscription = () => {
    // TODO: Ajouter la validation des champs
    if (motDePasse !== confirmerMotDePasse) {
      alert("Les mots de passe ne correspondent pas.");
      return;
    }
    console.log("Tentative d'inscription:", {
      prenom,
      nom,
      emailOuTel,
      motDePasse,
    });
    // TODO: Implémenter la logique d'inscription (appel API, etc.)
    // Si l'inscription réussit:
    router.replace("/confirmation_succes"); // Utilise replace pour ne pas pouvoir revenir à l'inscription
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoiding}
      >
        <ScrollView
          contentContainerStyle={styles.conteneurScroll}
          keyboardShouldPersistTaps="handled"
        >
          {/* Titres */}
          <Text style={styles.titrePrincipal}>Inscription</Text>
          <Text style={styles.sousTitreIntro}>
            Inscrivez-vous à l'application Ko saye !
          </Text>

          {/* Champs de saisie */}
          <TextInput
            style={styles.input}
            placeholder="Entrez votre prenom"
            value={prenom}
            onChangeText={setPrenom}
            autoCapitalize="words"
          />
          <TextInput
            style={styles.input}
            placeholder="Nom de famille"
            value={nom}
            onChangeText={setNom}
            autoCapitalize="words"
          />
          <TextInput
            style={styles.input}
            placeholder="E-mail/numéro de téléphone"
            value={emailOuTel}
            onChangeText={setEmailOuTel}
            keyboardType="email-address" // Ou phone-pad selon validation future
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Mot de passe"
            value={motDePasse}
            onChangeText={setMotDePasse}
            secureTextEntry
          />
          <TextInput
            style={styles.input}
            placeholder="Confirmez le mot de passe"
            value={confirmerMotDePasse}
            onChangeText={setConfirmerMotDePasse}
            secureTextEntry
          />

          {/* Bouton S'inscrire */}
          <TouchableOpacity
            style={styles.boutonInscrire}
            onPress={handleInscription}
          >
            <Text style={styles.texteBoutonInscrire}>S'inscrire</Text>
          </TouchableOpacity>

          {/* Conditions d'utilisation */}
          <Text style={styles.texteConditions}>
            En cliquant sur « s'inscrire », vous acceptez les Conditions
            d'utilisation et la Politique de confidentialité de l'application Ko
            saye.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  keyboardAvoiding: {
    flex: 1,
  },
  conteneurScroll: {
    flexGrow: 1,
    paddingHorizontal: 25,
    paddingVertical: 20, // Espace vertical
    justifyContent: "center",
  },
  titrePrincipal: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000000",
    textAlign: "center",
    marginBottom: 10,
  },
  sousTitreIntro: {
    fontSize: 18,
    color: "#333333", // Un peu plus clair que le titre
    textAlign: "center",
    marginBottom: 30,
  },
  input: {
    backgroundColor: "#F0F0F0", // Fond gris clair pour les inputs
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 14, // Légèrement plus haut
    fontSize: 16,
    marginBottom: 15,
    color: "#000",
    borderWidth: 0, // Pas de bordure visible explicitement
  },
  boutonInscrire: {
    backgroundColor: "#F59E0B", // Couleur orange
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 15, // Espace au-dessus du bouton
    marginBottom: 25, // Espace en dessous
  },
  texteBoutonInscrire: {
    color: "#FFFFFF",
    fontSize: 18, // Texte un peu plus grand
    fontWeight: "bold",
  },
  texteConditions: {
    fontSize: 12,
    color: "#666666",
    textAlign: "center",
    marginTop: 10,
  },
});
