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
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import axios from "axios";
import { API_URL } from "../config";

export default function Inscription() {
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [confirmerMotDePasse, setConfirmerMotDePasse] = useState("");
  const [telephone, setTelephone] = useState("");
  const [adresse, setAdresse] = useState("");
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    if (
      !prenom ||
      !nom ||
      !email ||
      !motDePasse ||
      !confirmerMotDePasse ||
      !telephone ||
      !adresse
    ) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs");
      return false;
    }

    if (motDePasse !== confirmerMotDePasse) {
      Alert.alert("Erreur", "Les mots de passe ne correspondent pas");
      return false;
    }

    if (motDePasse.length < 8) {
      Alert.alert(
        "Erreur",
        "Le mot de passe doit contenir au moins 8 caractères"
      );
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Erreur", "Veuillez entrer une adresse email valide");
      return false;
    }

    return true;
  };

  const handleInscription = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/v1/user/register`, {
        email: email,
        password: motDePasse,
        firstname: prenom,
        lastname: nom,
        phone: telephone,
        adress: adresse,
      });

      if (response.status === 200 || response.status === 201) {
        Alert.alert("Succès", "Inscription réussie !");
        router.replace("/confirmation_succes");
      }
    } catch (error: any) {
      console.error("Erreur inscription:", error);
      if (error.response) {
        Alert.alert(
          "Erreur",
          error.response.data.message ||
            "Une erreur est survenue lors de l'inscription"
        );
      } else {
        Alert.alert("Erreur", "Impossible de contacter le serveur");
      }
    } finally {
      setLoading(false);
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
          {/* Titres */}
          <Text style={styles.titrePrincipal}>Inscription</Text>
          <Text style={styles.sousTitreIntro}>
            Inscrivez-vous à l'application Ko saye !
          </Text>

          {/* Champs de saisie */}
          <TextInput
            style={styles.input}
            placeholder="Entrez votre prénom"
            value={prenom}
            onChangeText={setPrenom}
            autoCapitalize="words"
            editable={!loading}
          />
          <TextInput
            style={styles.input}
            placeholder="Nom de famille"
            value={nom}
            onChangeText={setNom}
            autoCapitalize="words"
            editable={!loading}
          />
          <TextInput
            style={styles.input}
            placeholder="Adresse email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!loading}
          />
          <TextInput
            style={styles.input}
            placeholder="Numéro de téléphone"
            value={telephone}
            onChangeText={setTelephone}
            keyboardType="phone-pad"
            editable={!loading}
          />
          <TextInput
            style={styles.input}
            placeholder="Adresse"
            value={adresse}
            onChangeText={setAdresse}
            editable={!loading}
          />
          <TextInput
            style={styles.input}
            placeholder="Mot de passe"
            value={motDePasse}
            onChangeText={setMotDePasse}
            secureTextEntry
            editable={!loading}
          />
          <TextInput
            style={styles.input}
            placeholder="Confirmez le mot de passe"
            value={confirmerMotDePasse}
            onChangeText={setConfirmerMotDePasse}
            secureTextEntry
            editable={!loading}
          />

          {/* Bouton S'inscrire */}
          <TouchableOpacity
            style={[styles.boutonInscrire, loading && styles.buttonDisabled]}
            onPress={handleInscription}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.texteBoutonInscrire}>S'inscrire</Text>
            )}
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
  },
  boutonInscrire: {
    backgroundColor: "#F59E0B",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 15,
    marginBottom: 25,
  },
  buttonDisabled: {
    opacity: 0.7,
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
