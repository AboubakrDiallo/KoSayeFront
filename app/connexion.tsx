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

// Écran de Connexion
export default function EcranConnexion() {
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [seSouvenir, setSeSouvenir] = useState(false);

  const handleLogin = () => {
    console.log("Tentative de connexion:", { email, motDePasse, seSouvenir });
    // TODO: Implémenter la logique de connexion réelle (API call)
    // Si la connexion réussit:
    router.replace("/confirmation_succes"); // Utilise replace pour ne pas pouvoir revenir à la connexion
  };

  const handleGoogleLogin = () => {
    console.log("Connexion avec Google");
    // TODO: Implémenter la connexion Google
  };

  const handleAppleLogin = () => {
    console.log("Connexion avec Apple");
    // TODO: Implémenter la connexion Apple
  };

  const handleMotDePasseOublie = () => {
    // Naviguer vers l'écran de récupération
    router.push("/mot_de_passe_oublie");
    // console.log("Mot de passe oublié");
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
          <Text style={styles.titrePrincipal}>Veuillez vous connecter</Text>
          <Text style={styles.sousTitreIntro}>
            Connectez-vous à votre compte
          </Text>
          <Text style={styles.description}>
            entrez votre email pour vous connecter à l'application
          </Text>

          {/* Champs de saisie */}
          <TextInput
            style={styles.input}
            placeholder="email@domain.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="mot de passe"
            value={motDePasse}
            onChangeText={setMotDePasse}
            secureTextEntry
          />

          {/* Bouton Continuer */}
          <TouchableOpacity
            style={styles.boutonContinuer}
            onPress={handleLogin}
          >
            <Text style={styles.texteBoutonContinuer}>Continuer</Text>
          </TouchableOpacity>

          {/* Options Se Souvenir / Mot de passe oublié */}
          <View style={styles.optionsLigne}>
            <TouchableOpacity
              style={styles.checkboxConteneur}
              onPress={() => setSeSouvenir(!seSouvenir)}
            >
              {/* Placeholder simple pour la checkbox */}
              <View
                style={[styles.checkbox, seSouvenir && styles.checkboxChecked]}
              >
                {seSouvenir && <Text style={styles.checkboxCheckmark}>✓</Text>}
              </View>
              <Text style={styles.texteOption}>Se souvenir</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleMotDePasseOublie}>
              <Text style={styles.texteLien}>Mot de passe oublié ?</Text>
            </TouchableOpacity>
          </View>

          {/* Séparateur "ou" */}
          <View style={styles.separateurConteneur}>
            <View style={styles.ligneSeparateur} />
            <Text style={styles.texteSeparateur}>ou</Text>
            <View style={styles.ligneSeparateur} />
          </View>

          {/* Connexion Sociale */}
          <TouchableOpacity
            style={styles.boutonSocial}
            onPress={handleGoogleLogin}
          >
            {/* Placeholder pour l'icône Google */}
            <Text style={styles.iconeSocial}>G</Text>
            <Text style={styles.texteBoutonSocial}>Continuer avec Google</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.boutonSocial}
            onPress={handleAppleLogin}
          >
            {/* Placeholder pour l'icône Apple */}
            <Text style={styles.iconeSocial}></Text>
            <Text style={styles.texteBoutonSocial}>Continuer avec Apple</Text>
          </TouchableOpacity>

          {/* Conditions d'utilisation */}
          <Text style={styles.texteConditions}>
            En cliquant sur continuer, vous acceptez nos conditions
            d'utilisation et notre politique de confidentialité.
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
    paddingBottom: 20, // Espace en bas
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
    fontWeight: "bold",
    color: "#000000",
    textAlign: "center",
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: "#666666",
    textAlign: "center",
    marginBottom: 30,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 15,
    color: "#000",
  },
  boutonContinuer: {
    backgroundColor: "#000000",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  texteBoutonContinuer: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  optionsLigne: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },
  checkboxConteneur: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "#000000",
    borderRadius: 4,
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: "#000000",
  },
  checkboxCheckmark: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  texteOption: {
    fontSize: 14,
    color: "#000000",
  },
  texteLien: {
    fontSize: 14,
    color: "#000000",
    fontWeight: "bold",
  },
  separateurConteneur: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  ligneSeparateur: {
    flex: 1,
    height: 1,
    backgroundColor: "#E0E0E0",
  },
  texteSeparateur: {
    marginHorizontal: 10,
    color: "#666666",
    fontSize: 14,
  },
  boutonSocial: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F0F0F0",
    paddingVertical: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  iconeSocial: {
    fontSize: 18,
    marginRight: 10,
    // Styles spécifiques pour chaque icône pourraient être ajoutés ici
  },
  texteBoutonSocial: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "500",
  },
  texteConditions: {
    fontSize: 12,
    color: "#666666",
    textAlign: "center",
    marginTop: 20,
  },
});
