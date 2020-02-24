import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import Backend from 'i18next-xhr-backend'
import LanguageDetector from 'i18next-browser-languagedetector'

const missingKeys = [] as any[]

i18n
  .use(LanguageDetector)
  .use(Backend)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: false,//process.env.NODE_ENV === "development",

    nsSeparator: "::",

    interpolation: {
      escapeValue: false
    },

    backend: {
      loadPath: process.env.PUBLIC_URL + '/locales/{{lng}}.json',
    },

    react: {
      useSuspense: false
    },

    saveMissing: true,
    missingKeyHandler: function () {
      missingKeys.push(Array.from(arguments))
    }
  })

const global = window as any
global.i18n = i18n
global.missingKeys = missingKeys

export default i18n
