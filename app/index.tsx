import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function EcranSplash() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/home");
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>KO SAYE</Text>
      <Text style={styles.subtitle}>Achats et livraisons sécurisés</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#D67C09",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: "#fff",
    fontSize: 48,
    fontWeight: "bold",
    marginBottom: 12,
  },
  subtitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "400",
  },
});
