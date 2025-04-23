import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function ContactScreen() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [subject, setSubject] = useState("");

  const contactOptions = [
    {
      id: "phone",
      title: "Par téléphone",
      subtitle: "+221 77 123 45 67",
      icon: "call",
      color: "#F59E0B",
    },
    {
      id: "whatsapp",
      title: "WhatsApp",
      subtitle: "Chat en direct",
      icon: "logo-whatsapp",
      color: "#25D366",
    },
    {
      id: "email",
      title: "Email",
      subtitle: "support@kosaye.com",
      icon: "mail",
      color: "#F59E0B",
    },
  ];

  const handleContactOption = (id: string) => {
    switch (id) {
      case "phone":
        // Implémenter l'appel téléphonique
        console.log("Appeler le support");
        break;
      case "whatsapp":
        // Implémenter l'ouverture de WhatsApp
        console.log("Ouvrir WhatsApp");
        break;
      case "email":
        // Implémenter l'envoi d'email
        console.log("Envoyer un email");
        break;
    }
  };

  const handleSubmit = () => {
    if (!subject.trim() || !message.trim()) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs");
      return;
    }
    // Implémenter l'envoi du message
    console.log("Message envoyé:", { subject, message });
    Alert.alert("Succès", "Votre message a été envoyé avec succès");
    setSubject("");
    setMessage("");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Contact</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Section Contact Direct */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nous Contacter</Text>
          <Text style={styles.sectionSubtitle}>
            Choisissez votre moyen de contact préféré
          </Text>
          <View style={styles.contactOptions}>
            {contactOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={styles.contactCard}
                onPress={() => handleContactOption(option.id)}
              >
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: option.color + "20" },
                  ]}
                >
                  <Ionicons name={option.icon} size={24} color={option.color} />
                </View>
                <View style={styles.contactInfo}>
                  <Text style={styles.contactTitle}>{option.title}</Text>
                  <Text style={styles.contactSubtitle}>{option.subtitle}</Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color="#000" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Section Formulaire */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Envoyez-nous un message</Text>
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Sujet</Text>
              <TextInput
                style={styles.input}
                value={subject}
                onChangeText={setSubject}
                placeholder="Entrez le sujet de votre message"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Message</Text>
              <TextInput
                style={[styles.input, styles.messageInput]}
                value={message}
                onChangeText={setMessage}
                placeholder="Écrivez votre message ici"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>Envoyer</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Section FAQ */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Questions fréquentes</Text>
          <TouchableOpacity style={styles.faqButton}>
            <Text style={styles.faqButtonText}>Consulter la FAQ</Text>
            <Ionicons name="chevron-forward" size={24} color="#F59E0B" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
    color: "#000",
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },
  contactOptions: {
    gap: 12,
  },
  contactCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    padding: 16,
    borderRadius: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  contactInfo: {
    flex: 1,
    marginLeft: 12,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  contactSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  form: {
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    padding: 16,
    gap: 16,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    color: "#666",
  },
  input: {
    backgroundColor: "#FFF",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  messageInput: {
    height: 120,
    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: "#F59E0B",
    padding: 16,
    borderRadius: 25,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  faqButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F5F5F5",
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  faqButtonText: {
    fontSize: 16,
    color: "#F59E0B",
    fontWeight: "600",
  },
});
