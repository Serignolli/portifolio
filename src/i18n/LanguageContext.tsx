import { createContext, useCallback, useEffect, useState, type ReactNode } from 'react';

export type Lang = 'pt' | 'en';

const STORAGE_KEY = 'lang';

/** Valor do atributo lang do <html> por idioma. */
export const HTML_LANG: Record<Lang, string> = { pt: 'pt-BR', en: 'en' };

export type LanguageValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
};

export const LanguageContext = createContext<LanguageValue | null>(null);

function isLang(value: unknown): value is Lang {
  return value === 'pt' || value === 'en';
}

/** localStorage lança em alguns modos privados, nunca deixar isso quebrar a página. */
function readStoredLang(): Lang | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return isLang(stored) ? stored : null;
  } catch {
    return null;
  }
}

function detectLang(): Lang {
  const navigatorLang = navigator.language ?? '';
  return navigatorLang.toLowerCase().startsWith('pt') ? 'pt' : 'en';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  // A escolha manual salva sempre ganha da detecção automática.
  const [lang, setLangState] = useState<Lang>(() => readStoredLang() ?? detectLang());

  useEffect(() => {
    document.documentElement.lang = HTML_LANG[lang];
  }, [lang]);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Sem persistência neste navegador; a troca na sessão atual continua valendo.
    }
  }, []);

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>{children}</LanguageContext.Provider>
  );
}
