import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function ChangerMotDePasseScreen() {
  const router = useRouter();
  const [ancienMotDePasse, setAncienMotDePasse] = useState("");
  const [nouveauMotDePasse, setNouveauMotDePasse] = useState("");
  const [confirmationMotDePasse, setConfirmationMotDePasse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangementMotDePasse = async () => {
    if (!ancienMotDePasse || !nouveauMotDePasse || !confirmationMotDePasse) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs");
      return;
    }

    if (nouveauMotDePasse !== confirmationMotDePasse) {
      Alert.alert("Erreur", "Les nouveaux mots de passe ne correspondent pas");
      return;
    }

    if (nouveauMotDePasse.length < 8) {
      Alert.alert(
        "Erreur",
        "Le mot de passe doit contenir au moins 8 caractères"
      );
      return;
    }

    setLoading(true);
    try {
      // TODO: Implémenter l'appel API
      console.log("Changement de mot de passe en cours...");
      Alert.alert("Succès", "Votre mot de passe a été changé avec succès");
      router.back();
    } catch (error) {
      Alert.alert(
        "Erreur",
        "Une erreur est survenue lors du changement de mot de passe"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Changer le mot de passe</Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoiding}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <ScrollView
          style={styles.scrollView}
          keyboardShouldPersistTaps="always"
        >
          <View style={styles.content}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Ancien mot de passe</Text>
              <TextInput
                style={styles.input}
                secureTextEntry
                value={ancienMotDePasse}
                onChangeText={setAncienMotDePasse}
                placeholder="Entrez votre ancien mot de passe"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Nouveau mot de passe</Text>
              <TextInput
                style={styles.input}
                secureTextEntry
                value={nouveauMotDePasse}
                onChangeText={setNouveauMotDePasse}
                placeholder="Entrez votre nouveau mot de passe"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                Confirmer le nouveau mot de passe
              </Text>
              <TextInput
                style={styles.input}
                secureTextEntry
                value={confirmationMotDePasse}
                onChangeText={setConfirmationMotDePasse}
                placeholder="Confirmez votre nouveau mot de passe"
              />
            </View>

            <TouchableOpacity
              style={styles.button}
              onPress={handleChangementMotDePasse}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? "Changement en cours..." : "Changer le mot de passe"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  keyboardAvoiding: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginLeft: 16,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  input: {
    fontSize: 16,
    color: "#000",
    backgroundColor: "#F5F5F5",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  button: {
    backgroundColor: "#F59E0B",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
