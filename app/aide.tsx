import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

const FAQ = [
  {
    id: 1,
    questionKey: "faq_q1",
    answerKey: "faq_a1",
  },
  {
    id: 2,
    questionKey: "faq_q2",
    answerKey: "faq_a2",
  },
];

export default function EcranAide() {
  const router = useRouter();
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t("help_center")}</Text>
      </View>
      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>{t("faq")}</Text>
        <View style={styles.faqContainer}>
          {FAQ.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.faqItem}
              onPress={() => setExpanded(expanded === item.id ? null : item.id)}
            >
              <View style={styles.faqHeader}>
                <Text style={styles.faqQuestion}>{t(item.questionKey)}</Text>
                <Ionicons
                  name={expanded === item.id ? "chevron-up" : "chevron-down"}
                  size={24}
                  color="#666"
                />
              </View>
              {expanded === item.id && (
                <Text style={styles.faqAnswer}>{t(item.answerKey)}</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.sectionTitle}>{t("contact_support")}</Text>
        <View style={styles.contactOptions}>
          <Text style={styles.contactText}>
            {t("contact_email")}: support@kosaye.com
          </Text>
          <Text style={styles.contactText}>
            {t("contact_phone")}: +221 77 123 45 67
          </Text>
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
    flex: 1,
    padding: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    color: "#000",
  },
  faqContainer: {
    gap: 12,
    marginBottom: 24,
  },
  faqItem: {
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    padding: 16,
  },
  faqHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  faqQuestion: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
    marginRight: 16,
  },
  faqAnswer: {
    fontSize: 14,
    color: "#666",
    marginTop: 12,
    lineHeight: 20,
  },
  contactOptions: {
    gap: 8,
    marginTop: 8,
  },
  contactText: {
    fontSize: 16,
    color: "#000",
  },
});
