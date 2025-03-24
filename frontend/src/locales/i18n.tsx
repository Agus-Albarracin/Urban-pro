import { createContext, useState, ReactNode } from "react";
import { IntlProvider } from "react-intl";
import messagesEn from "./en.json";
import messagesEs from "./es.json";

const messages: Record<string, Record<string, string>> = {
  en: messagesEn as Record<string, string>,
  es: messagesEs as Record<string, string>,
};

// Definir el tipo del contexto
interface LanguageContextType {
  locale: string;
  switchLanguage: (lang: string) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [locale, setLocale] = useState<string>("en"); 

  const switchLanguage = (lang: string) => {
    setLocale(lang);
  };

  return (
    <LanguageContext.Provider value={{ locale, switchLanguage }}>
      <IntlProvider locale={locale} messages={messages[locale]}>
        {children}
      </IntlProvider>
    </LanguageContext.Provider>
  );
};

export default LanguageContext;
