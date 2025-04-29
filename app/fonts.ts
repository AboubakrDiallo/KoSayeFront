import * as Font from "expo-font";

export const loadFonts = async () => {
  try {
    await Font.loadAsync({
      SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    });
  } catch (error) {
    console.error("Erreur lors du chargement des polices:", error);
  }
};
