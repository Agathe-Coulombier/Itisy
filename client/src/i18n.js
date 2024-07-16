import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import frTranslation from "./translations/fr.json";

i18n
    .use(initReactI18next) // initializes i18next with react-i18next
    .init({
    resources: {
        fr: { translation: frTranslation },
    },
    lng: 'en', // default language
    interpolation: {
      escapeValue: false, // This ensures raw HTML in translations (if needed)
    },
    fallbackLng: "en", // if language isn't detected, use this by default
    detection: {
        order: ["localStorage", "navigator"],
        caches: ["localStorage"], // saves preferences
    },
});
export default i18n;