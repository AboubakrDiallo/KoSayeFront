import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function DetailProfilScreen() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({
    firstName: "Aboubacar",
    lastName: "Diallo",
    email: "aladji.diallo.7509@gmail.com",
    phone: "+221 77 123 45 67",
    address: "123 Rue Principale, Dakar",
    birthDate: "15/03/1995",
  });

  const handleSave = () => {
    setIsEditing(false);
    // Ici, vous pouvez ajouter la logique pour sauvegarder les modifications
    console.log("Saving profile changes:", userInfo);
  };

  const InfoField = ({ label, value, field }) => {
    return (
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>{label}</Text>
        {isEditing ? (
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={(text) =>
              setUserInfo((prev) => ({ ...prev, [field]: text }))
            }
          />
        ) : (
          <Text style={styles.fieldValue}>{value}</Text>
        )}
      </View>
    );
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
        <Text style={styles.headerTitle}>Mon Profil</Text>
        <TouchableOpacity
          onPress={() => (isEditing ? handleSave() : setIsEditing(true))}
          style={styles.editButton}
        >
          <Text style={styles.editButtonText}>
            {isEditing ? "Enregistrer" : "Modifier"}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Photo de profil */}
        <View style={styles.profileImageSection}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1531384441138-2736e62e0919?q=80&w=200&h=200&auto=format&fit=crop",
            }}
            style={styles.profileImage}
          />
          {isEditing && (
            <TouchableOpacity style={styles.changePhotoButton}>
              <Text style={styles.changePhotoText}>Changer la photo</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Informations personnelles */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Informations Personnelles</Text>
          <View style={styles.infoContainer}>
            <InfoField
              label="Prénom"
              value={userInfo.firstName}
              field="firstName"
            />
            <InfoField label="Nom" value={userInfo.lastName} field="lastName" />
            <InfoField label="Email" value={userInfo.email} field="email" />
            <InfoField label="Téléphone" value={userInfo.phone} field="phone" />
            <InfoField
              label="Adresse"
              value={userInfo.address}
              field="address"
            />
            <InfoField
              label="Date de naissance"
              value={userInfo.birthDate}
              field="birthDate"
            />
          </View>
        </View>

        {/* Options de sécurité */}
        <View style={styles.securitySection}>
          <Text style={styles.sectionTitle}>Sécurité</Text>
          <TouchableOpacity style={styles.securityButton}>
            <Ionicons name="lock-closed" size={24} color="#F59E0B" />
            <Text style={styles.securityButtonText}>
              Changer le mot de passe
            </Text>
            <Ionicons name="chevron-forward" size={24} color="#000" />
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
  editButton: {
    padding: 8,
  },
  editButtonText: {
    color: "#F59E0B",
    fontSize: 16,
    fontWeight: "600",
  },
  scrollView: {
    flex: 1,
  },
  profileImageSection: {
    alignItems: "center",
    padding: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  changePhotoButton: {
    padding: 8,
  },
  changePhotoText: {
    color: "#F59E0B",
    fontSize: 16,
  },
  infoSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
    color: "#000",
  },
  infoContainer: {
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    padding: 16,
    gap: 16,
  },
  fieldContainer: {
    gap: 8,
  },
  fieldLabel: {
    fontSize: 14,
    color: "#666",
  },
  fieldValue: {
    fontSize: 16,
    color: "#000",
  },
  input: {
    fontSize: 16,
    color: "#000",
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  securitySection: {
    padding: 16,
  },
  securityButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    padding: 16,
    borderRadius: 12,
  },
  securityButtonText: {
    flex: 1,
    fontSize: 16,
    color: "#000",
    marginLeft: 12,
  },
});
