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
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useProfile } from "../contexts/ProfileContext";
import * as ImagePicker from "expo-image-picker";

export default function DetailProfilScreen() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const { profileImage, setProfileImage } = useProfile();
  const [userInfo, setUserInfo] = useState({
    firstName: "Aboubacar",
    lastName: "Diallo",
    email: "aladji.diallo.7509@gmail.com",
    phone: "+221 77 123 45 67",
    address: "123 Rue Principale, Dakar",
    birthDate: "15/03/1995",
  });

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert(
        "Désolé, nous avons besoin de la permission d'accéder à votre galerie pour changer la photo de profil."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleSave = () => {
    setIsEditing(false);
    console.log("Saving profile changes:", userInfo);
  };

  interface InfoFieldProps {
    label: string;
    value: string;
    field: keyof typeof userInfo;
  }

  const InfoField: React.FC<InfoFieldProps> = ({ label, value, field }) => {
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
            keyboardType={field === "phone" ? "phone-pad" : "default"}
          />
        ) : (
          <Text style={styles.fieldValue}>{value}</Text>
        )}
      </View>
    );
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

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoiding}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <ScrollView
          style={styles.scrollView}
          keyboardShouldPersistTaps="always"
        >
          <View style={styles.profileImageSection}>
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
            {isEditing && (
              <TouchableOpacity
                style={styles.changePhotoButton}
                onPress={pickImage}
              >
                <Text style={styles.changePhotoText}>Changer la photo</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Informations Personnelles</Text>
            <View style={styles.infoContainer}>
              <InfoField
                label="Prénom"
                value={userInfo.firstName}
                field="firstName"
              />
              <InfoField
                label="Nom"
                value={userInfo.lastName}
                field="lastName"
              />
              <InfoField label="Email" value={userInfo.email} field="email" />
              <InfoField
                label="Téléphone"
                value={userInfo.phone}
                field="phone"
              />
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

          <View style={styles.securitySection}>
            <Text style={styles.sectionTitle}>Sécurité</Text>
            <TouchableOpacity
              style={styles.securityButton}
              onPress={() => router.push("/changer_mot_de_passe")}
            >
              <Ionicons name="lock-closed" size={24} color="#F59E0B" />
              <Text style={styles.securityButtonText}>
                Changer le mot de passe
              </Text>
              <Ionicons name="chevron-forward" size={24} color="#000" />
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
