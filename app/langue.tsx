import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n from "../i18n";

const LANGUAGES = [
  { code: "fr", label: "Français" },
  { code: "en", label: "English" },
  { code: "ar", label: "العربية" },
  { code: "zh", label: "中文 (Chinois)" },
];

const STORAGE_KEY = "@selected_language";

export default function EcranLangue() {
  const router = useRouter();
  const [selected, setSelected] = useState("fr");

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((lang) => {
      if (lang && LANGUAGES.some((l) => l.code === lang)) {
        setSelected(lang);
        i18n.changeLanguage(lang);
      }
    });
  }, []);

  const handleSelect = async (code: string) => {
    setSelected(code);
    await AsyncStorage.setItem(STORAGE_KEY, code);
    i18n.changeLanguage(code);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header avec retour */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{i18n.t("language")}</Text>
      </View>
      <View style={styles.content}>
        {LANGUAGES.map((lang) => (
          <TouchableOpacity
            key={lang.code}
            style={[
              styles.langButton,
              selected === lang.code && styles.selected,
            ]}
            onPress={() => handleSelect(lang.code)}
          >
            <Text style={styles.langLabel}>{lang.label}</Text>
            {selected === lang.code && (
              <Ionicons name="checkmark" size={20} color="#F59E0B" />
            )}
          </TouchableOpacity>
        ))}
      </View>
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
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "600",
    marginRight: 40,
  },
  content: {
    padding: 24,
    gap: 16,
  },
  langButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F5F5F5",
    padding: 16,
    borderRadius: 12,
  },
  selected: {
    borderWidth: 2,
    borderColor: "#F59E0B",
  },
  langLabel: {
    fontSize: 18,
    color: "#000",
  },
});
