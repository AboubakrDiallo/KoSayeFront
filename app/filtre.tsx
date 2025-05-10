import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";

// Types pour les filtres
type Genre = "All" | "Hommes" | "Femmes";
type Marque = "Adidas" | "Puma" | "CR7" | "Nike" | "Yeezy" | "Supreme";
type Couleur = "Blanche" | "Noire" | "Grise" | "Jaune" | "Rouge" | "Verte";

export default function FilterScreen() {
  const router = useRouter();
  const [selectedGenre, setSelectedGenre] = useState<Genre>("All");
  const [selectedMarques, setSelectedMarques] = useState<Marque[]>([
    "Nike",
    "Puma",
    "Supreme",
  ]);
  const [priceRange, setPriceRange] = useState([16, 543]);
  const [selectedCouleurs, setSelectedCouleurs] = useState<Couleur[]>([
    "Noire",
    "Jaune",
    "Verte",
  ]);

  const genres: Genre[] = ["All", "Hommes", "Femmes"];
  const marques: Marque[] = [
    "Adidas",
    "Puma",
    "CR7",
    "Nike",
    "Yeezy",
    "Supreme",
  ];
  const couleurs: Couleur[] = [
    "Blanche",
    "Noire",
    "Grise",
    "Jaune",
    "Rouge",
    "Verte",
  ];

  const toggleMarque = (marque: Marque) => {
    setSelectedMarques((prev) =>
      prev.includes(marque)
        ? prev.filter((m) => m !== marque)
        : [...prev, marque]
    );
  };

  const toggleCouleur = (couleur: Couleur) => {
    setSelectedCouleurs((prev) =>
      prev.includes(couleur)
        ? prev.filter((c) => c !== couleur)
        : [...prev, couleur]
    );
  };

  const applyFilters = () => {
    // Implémenter la logique de filtrage ici
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Filtre</Text>
        </View>

        {/* Genre */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Genre</Text>
          <View style={styles.optionsContainer}>
            {genres.map((genre) => (
              <TouchableOpacity
                key={genre}
                style={[
                  styles.optionButton,
                  selectedGenre === genre && styles.selectedOption,
                ]}
                onPress={() => setSelectedGenre(genre)}
              >
                <Text
                  style={[
                    styles.optionText,
                    selectedGenre === genre && styles.selectedOptionText,
                  ]}
                >
                  {genre}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Marque */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Marque</Text>
          <View style={styles.optionsContainer}>
            {marques.map((marque) => (
              <TouchableOpacity
                key={marque}
                style={[
                  styles.optionButton,
                  selectedMarques.includes(marque) && styles.selectedOption,
                ]}
                onPress={() => toggleMarque(marque)}
              >
                <Text
                  style={[
                    styles.optionText,
                    selectedMarques.includes(marque) &&
                      styles.selectedOptionText,
                  ]}
                >
                  {marque}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Gamme de prix */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gamme de prix</Text>
          <View style={styles.priceContainer}>
            <Text style={styles.priceText}>${priceRange[0]}</Text>
            <Text style={styles.priceText}>${priceRange[1]}</Text>
          </View>
          <Slider
            style={styles.slider}
            minimumValue={16}
            maximumValue={543}
            value={priceRange[1]}
            minimumTrackTintColor="#F59E0B"
            maximumTrackTintColor="#E5E5E5"
            thumbTintColor="#F59E0B"
            onValueChange={(value) => setPriceRange([priceRange[0], value])}
          />
        </View>

        {/* Couleur */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Couleur</Text>
          <View style={styles.optionsContainer}>
            {couleurs.map((couleur) => (
              <TouchableOpacity
                key={couleur}
                style={[
                  styles.optionButton,
                  selectedCouleurs.includes(couleur) && styles.selectedOption,
                ]}
                onPress={() => toggleCouleur(couleur)}
              >
                <Text
                  style={[
                    styles.optionText,
                    selectedCouleurs.includes(couleur) &&
                      styles.selectedOptionText,
                  ]}
                >
                  {couleur}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Autres options */}
        <TouchableOpacity style={styles.moreOptionsButton}>
          <Text style={styles.moreOptionsText}>Une autre possibilité</Text>
          <Ionicons name="chevron-forward" size={24} color="#000" />
        </TouchableOpacity>
      </ScrollView>

      {/* Bouton Appliquer */}
      <TouchableOpacity style={styles.applyButton} onPress={applyFilters}>
        <Text style={styles.applyButtonText}>Appliquer le filtre</Text>
      </TouchableOpacity>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
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
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 16,
  },
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  optionButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    backgroundColor: "#F5F5F5",
  },
  selectedOption: {
    backgroundColor: "#F59E0B",
  },
  optionText: {
    fontSize: 16,
    color: "#666",
  },
  selectedOptionText: {
    color: "#FFF",
  },
  priceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  priceText: {
    fontSize: 16,
    color: "#666",
  },
  slider: {
    width: "100%",
    height: 40,
  },
  moreOptionsButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    marginTop: 8,
    backgroundColor: "#F5F5F5",
    marginHorizontal: 16,
    borderRadius: 12,
  },
  moreOptionsText: {
    fontSize: 16,
    color: "#000",
  },
  applyButton: {
    backgroundColor: "#F59E0B",
    margin: 16,
    padding: 16,
    borderRadius: 30,
    alignItems: "center",
  },
  applyButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "600",
  },
});
