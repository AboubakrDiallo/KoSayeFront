import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";

import fr from "./locales/fr.json";
import en from "./locales/en.json";
import ar from "./locales/ar.json";
import zh from "./locales/zh.json";

i18n.use(initReactI18next).init({
  compatibilityJSON: "v3",
  lng: Localization.locale.split("-")[0], // Détection automatique
  fallbackLng: "fr",
  resources: {
    fr: { translation: fr },
    en: { translation: en },
    ar: { translation: ar },
    zh: { translation: zh },
  },
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
