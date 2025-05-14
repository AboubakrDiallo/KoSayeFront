import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export default function ChatbotScreen() {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");

  // Questions courantes
  const quickQuestions = [
    "Où est ma commande ?",
    "Quels sont les moyens de paiement ?",
    "Comment modifier mon adresse de livraison ?",
    "Comment contacter le support ?",
    "Comment obtenir une facture ?",
  ];

  const handleSend = () => {
    if (inputText.trim() === "") return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setInputText("");

    // Simuler une réponse du chatbot
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: t("chatbot_response"),
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 1000);
  };

  const handleQuickQuestion = (question: string) => {
    setInputText(question);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.botIconLarge}>
          <Ionicons name="robot" size={32} color="#F59E0B" />
        </View>
        <Text style={styles.headerTitle}>Assistant Virtuel</Text>
      </View>

      {/* Questions courantes */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.quickQuestionsContainer}
        contentContainerStyle={styles.quickQuestionsContent}
      >
        {quickQuestions.map((q, idx) => (
          <TouchableOpacity
            key={idx}
            style={styles.quickQuestionButton}
            onPress={() => handleQuickQuestion(q)}
            activeOpacity={0.8}
          >
            <Text style={styles.quickQuestionText}>{q}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Messages */}
      <ScrollView
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
      >
        {messages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageBubble,
              message.isUser ? styles.userBubble : styles.botBubble,
            ]}
          >
            {!message.isUser && (
              <View style={styles.botAvatarLarge}>
                <Ionicons name="robot" size={22} color="#F59E0B" />
              </View>
            )}
            <Text
              style={[
                styles.messageText,
                message.isUser ? styles.userText : styles.botText,
              ]}
            >
              {message.text}
            </Text>
          </View>
        ))}
      </ScrollView>

      {/* Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder={t("type_message")}
          placeholderTextColor="#666"
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={handleSend}
          disabled={inputText.trim() === ""}
        >
          <Ionicons
            name="send"
            size={24}
            color={inputText.trim() === "" ? "#999" : "#F59E0B"}
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFDF8",
  },
  header: {
    flexDirection: "column",
    alignItems: "center",
    paddingTop: 28,
    paddingBottom: 10,
    backgroundColor: "#FFF8E1",
    borderBottomWidth: 1,
    borderBottomColor: "#f3e6c4",
  },
  botIconLarge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#FFF5E6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    shadowColor: "#F59E0B",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#F59E0B",
    letterSpacing: 0.2,
  },
  quickQuestionsContainer: {
    maxHeight: 54,
    backgroundColor: "#FFFDF8",
    borderBottomWidth: 1,
    borderBottomColor: "#f3e6c4",
  },
  quickQuestionsContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  quickQuestionButton: {
    backgroundColor: "#FFF8E1",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#F59E0B",
    shadowColor: "#F59E0B",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  quickQuestionText: {
    color: "#F59E0B",
    fontWeight: "600",
    fontSize: 15,
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: "#FFFDF8",
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 32,
  },
  messageBubble: {
    maxWidth: "80%",
    padding: 14,
    borderRadius: 20,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "flex-start",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  userBubble: {
    backgroundColor: "#F59E0B",
    alignSelf: "flex-end",
  },
  botBubble: {
    backgroundColor: "#F5F5F5",
    alignSelf: "flex-start",
  },
  botAvatarLarge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#FFF5E6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    marginTop: 2,
  },
  messageText: {
    fontSize: 16,
    flex: 1,
  },
  userText: {
    color: "#fff",
  },
  botText: {
    color: "#333",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    height: 48,
    backgroundColor: "#F5F5F5",
    borderRadius: 24,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
});
