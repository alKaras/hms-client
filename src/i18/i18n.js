import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
    .use(initReactI18next)
    .init({
        resources: {
            en: {
                translation: {
                    login: "Login",
                    eng: "English",
                    ua: "Ukrainian",
                    // Another translation
                },
            },
            uk: {
                translation: {
                    login: "Увійти",
                    eng: "Англійська",
                    ua: "Українська"
                },
            },
        },
        lng: "en",
        fallbackLng: "en",
        interpolation: {
            escapeValue: false,
        }
    });

export default i18n;