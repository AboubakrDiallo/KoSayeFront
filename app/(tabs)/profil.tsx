import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Modal,
  Dimensions,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useProfile } from "../../contexts/ProfileContext";
import * as ImagePicker from "expo-image-picker";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function ProfileScreen() {
  const router = useRouter();
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);
  const { profileImage, setProfileImage } = useProfile();

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

  const menuItems = [
    {
      id: "profil",
      title: "Profil",
      icon: "person",
      color: "#F59E0B",
    },
    {
      id: "parametre",
      title: "Paramètre",
      icon: "settings",
      color: "#F59E0B",
    },
    {
      id: "contact",
      title: "Contact",
      icon: "mail",
      color: "#F59E0B",
    },
    {
      id: "partager",
      title: "Partager l'application",
      icon: "share-social",
      color: "#F59E0B",
    },
    {
      id: "aide",
      title: "Aide",
      icon: "help-circle",
      color: "#F59E0B",
    },
  ];

  const handleMenuPress = (id: string) => {
    switch (id) {
      case "parametre":
        router.push("/parametre");
        break;
      case "profil":
        router.push("/detail-profil");
        break;
      case "contact":
        router.push("/contact");
        break;
      case "partager":
        router.push("/partage");
        break;
      case "aide":
        router.push("/aide");
        break;
      default:
        console.log("Menu pressed:", id);
    }
  };

  const handleLogout = () => {
    // Implémenter la logique de déconnexion
    router.push("/");
  };

  const toggleImageModal = () => {
    setIsImageModalVisible(!isImageModalVisible);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Photo de profil et informations */}
        <View style={styles.profileSection}>
          <TouchableOpacity onPress={pickImage}>
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
            <View style={styles.imageOverlay}>
              <Ionicons name="camera" size={24} color="#FFF" />
            </View>
          </TouchableOpacity>
          <Text style={styles.name}>Aboubacar Diallo</Text>
          <Text style={styles.email}>aladji.diallo.7509@gmail.com</Text>
        </View>

        {/* Menu items */}
        <View style={styles.menuContainer}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={() => handleMenuPress(item.id)}
            >
              <View style={styles.menuIconContainer}>
                <Ionicons name={item.icon} size={24} color={item.color} />
              </View>
              <Text style={styles.menuTitle}>{item.title}</Text>
              <Ionicons name="chevron-forward" size={24} color="#000" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Bouton de déconnexion */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Se déconnecter</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal pour afficher l'image en plein écran */}
      <Modal
        visible={isImageModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={toggleImageModal}
      >
        <View style={styles.modalContainer}>
          <StatusBar backgroundColor="#000000" barStyle="light-content" />
          <TouchableOpacity
            style={styles.closeButton}
            onPress={toggleImageModal}
          >
            <Ionicons name="close" size={28} color="#FFF" />
          </TouchableOpacity>
          <Image
            source={{ uri: profileImage }}
            style={styles.fullScreenImage}
            resizeMode="contain"
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    flex: 1,
  },
  profileSection: {
    alignItems: "center",
    padding: 20,
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  imageOverlay: {
    position: "absolute",
    right: 0,
    bottom: 16,
    backgroundColor: "rgba(0,0,0,0.5)",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  name: {
    fontSize: 24,
    fontWeight: "600",
    color: "#000",
    marginBottom: 8,
  },
  email: {
    fontSize: 16,
    color: "#666",
  },
  menuContainer: {
    paddingHorizontal: 16,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  menuTitle: {
    flex: 1,
    fontSize: 16,
    color: "#000",
    marginLeft: 12,
  },
  logoutButton: {
    margin: 16,
    padding: 16,
    alignItems: "center",
  },
  logoutText: {
    fontSize: 16,
    color: "#FF0000",
    fontWeight: "600",
  },
  // Styles pour le modal
  modalContainer: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  fullScreenImage: {
    width: screenWidth,
    height: screenHeight * 0.8,
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 1,
    padding: 8,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
  },
});
