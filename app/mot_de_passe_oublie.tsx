import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router"; // Si besoin de naviguer ailleurs après l'envoi

// Écran Mot de passe oublié
export default function EcranMotDePasseOublie() {
  const [email, setEmail] = useState("");
  const [erreur, setErreur] = useState("");

  // Validation simple de l'email
  const validerEmail = (text: string) => {
    // Regex simple pour la forme d'un email
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (!text || reg.test(text) === false) {
      setErreur("Adresse e-mail invalide.");
      return false;
    } else {
      setErreur(""); // Efface l'erreur si valide
      return true;
    }
  };

  const handleSend = () => {
    if (validerEmail(email)) {
      console.log("Demande de réinitialisation pour:", email);
      // TODO: Implémenter l'appel API pour envoyer le lien
      // Potentiellement naviguer vers un écran de confirmation
      // router.push('/confirmation-email');
      alert("Un lien de réinitialisation a été envoyé (simulation).");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* La barre de statut est gérée par le layout car l'en-tête est visible */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoiding}
      >
        <View style={styles.conteneur}>
          {/* Texte d'instruction */}
          <Text style={styles.instruction}>
            Veuillez confirmer votre adresse e-mail. Vous recevrez un lien pour
            recréer un mot de passe.
          </Text>

          {/* Champ de saisie Email avec label et bouton effacer */}
          <View style={styles.inputConteneur}>
            <Text style={styles.inputLabel}>Email</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="email@domain.com"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (erreur) {
                    validerEmail(text); // Revalide si une erreur était affichée
                  }
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                onBlur={() => validerEmail(email)} // Valide quand on quitte le champ
              />
              {/* Bouton pour effacer le champ */}
              {email.length > 0 && (
                <TouchableOpacity
                  style={styles.boutonEffacer}
                  onPress={() => {
                    setEmail("");
                    setErreur("");
                  }}
                >
                  <Text style={styles.texteBoutonEffacer}>✕</Text>
                </TouchableOpacity>
              )}
            </View>
            {/* Affichage de l'erreur */}
            {erreur ? <Text style={styles.texteErreur}>{erreur}</Text> : null}
          </View>

          {/* Bouton Envoyer */}
          <TouchableOpacity style={styles.boutonEnvoyer} onPress={handleSend}>
            <Text style={styles.texteBoutonEnvoyer}>SEND</Text>
          </TouchableOpacity>
        </View>
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
  conteneur: {
    flex: 1,
    paddingHorizontal: 25,
    paddingTop: 20, // Espace sous l'en-tête
  },
  instruction: {
    fontSize: 16,
    color: "#333333",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 22,
  },
  inputConteneur: {
    marginBottom: 15,
  },
  inputLabel: {
    color: "#E53935", // Rouge pour le label "Email" comme dans l'image
    fontSize: 12,
    marginBottom: 5,
    marginLeft: 15, // Petit décalage pour aligner avec le padding de l'input
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F0F0",
    borderRadius: 8,
    paddingHorizontal: 15,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: "#000",
  },
  boutonEffacer: {
    padding: 5,
    marginLeft: 10,
  },
  texteBoutonEffacer: {
    color: "#E53935", // Icône "X" en rouge
    fontSize: 18,
    fontWeight: "bold",
  },
  texteErreur: {
    color: "#E53935", // Rouge pour le message d'erreur
    fontSize: 12,
    marginTop: 5,
    marginLeft: 15,
  },
  boutonEnvoyer: {
    backgroundColor: "#F59E0B", // Couleur orange
    paddingVertical: 15,
    borderRadius: 25, // Complètement arrondi
    alignItems: "center",
    marginTop: 25, // Espace au-dessus
  },
  texteBoutonEnvoyer: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
