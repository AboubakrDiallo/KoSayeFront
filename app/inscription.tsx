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
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import api from "../app/api/api";

export default function EcranInscription() {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [adress, setAdress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 8 && password.length <= 32;
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^\+?\d{9,15}$/;
    return phoneRegex.test(phone);
  };

  const handleInscription = async () => {
    // Validation côté client
    if (!firstname || !lastname || !email || !phone || !adress || !password || !confirmPassword) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs.");
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert("Erreur", "Veuillez entrer un email valide.");
      return;
    }

    if (!validatePassword(password)) {
      Alert.alert("Erreur", "Le mot de passe doit contenir entre 8 et 32 caractères.");
      return;
    }

    if (!validatePhone(phone)) {
      Alert.alert("Erreur", "Veuillez entrer un numéro de téléphone valide (9 à 15 chiffres).");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Erreur", "Les mots de passe ne correspondent pas.");
      return;
    }

    setIsLoading(true);
    try {
      console.log("Envoi de la requête à : /user/register");
      const response = await api.post("/user/register", {
        firstname,
        lastname,
        email,
        password,
        phone,
        adress,
      });

      console.log("Données de la réponse :", response.data);
      Alert.alert("Succès", response.data.message || "Inscription réussie ! Veuillez vous connecter.");
      router.replace("/connexion");
    } catch (error) {
      console.error("Erreur de connexion avec l'API :", error);
      let errorMessage = "Erreur lors de l'inscription.";
      // if (error) {
      //   // Erreurs renvoyées par le serveur (par exemple, validation)
      //   errorMessage = error.response.data.message || Object.values(error.response.data.errors || {})
      //     .flat()
      //     .join("\n");
      // } else if (error.request) {
      //   // Aucune réponse reçue (par exemple, ERR_CONNECTION_REFUSED)
      //   errorMessage = "Impossible de se connecter au serveur. Vérifiez que le serveur est en cours d'exécution et accessible.";
      // }
      Alert.alert("Erreur", errorMessage);
    } finally {
      setIsLoading(false);
    }
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
          <Text style={styles.titrePrincipal}>Inscription</Text>
          <Text style={styles.sousTitreIntro}>
            Inscrivez-vous à l'application Ko saye !
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Prénom"
            value={firstname}
            onChangeText={setFirstname}
            autoCapitalize="words"
          />
          <TextInput
            style={styles.input}
            placeholder="Nom de famille"
            value={lastname}
            onChangeText={setLastname}
            autoCapitalize="words"
          />
          <TextInput
            style={styles.input}
            placeholder="E-mail"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Numéro de téléphone"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
          <TextInput
            style={styles.input}
            placeholder="Adresse"
            value={adress}
            onChangeText={setAdress}
            autoCapitalize="sentences"
          />
          <TextInput
            style={styles.input}
            placeholder="Mot de passe"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TextInput
            style={styles.input}
            placeholder="Confirmez le mot de passe"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />

          <TouchableOpacity
            style={[styles.boutonInscrire, isLoading && styles.boutonDisabled]}
            onPress={handleInscription}
            disabled={isLoading}
          >
            <Text style={styles.texteBoutonInscrire}>
              {isLoading ? "Inscription..." : "S'inscrire"}
            </Text>
          </TouchableOpacity>

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
    paddingVertical: 20,
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
    color: "#333333",
    textAlign: "center",
    marginBottom: 30,
  },
  input: {
    backgroundColor: "#F0F0F0",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 15,
    color: "#000",
    borderWidth: 0,
  },
  boutonInscrire: {
    backgroundColor: "#F59E0B",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 15,
    marginBottom: 25,
  },
  boutonDisabled: {
    backgroundColor: "#F59E0B80",
  },
  texteBoutonInscrire: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  texteConditions: {
    fontSize: 12,
    color: "#666666",
    textAlign: "center",
    marginTop: 10,
  },
});