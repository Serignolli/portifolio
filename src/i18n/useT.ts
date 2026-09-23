import { useContext } from 'react';
import { LanguageContext, type Lang } from './LanguageContext';
import type { Localized } from '../data/projects';

export function useLanguage() {
  const value = useContext(LanguageContext);
  if (!value) throw new Error('useLanguage precisa estar dentro de <LanguageProvider>');
  return value;
}

/** Traduz qualquer objeto `{ pt, en }` para o idioma ativo. */
export function useT(): (text: Localized) => string {
  const { lang } = useLanguage();
  return (text: Localized) => text[lang];
}

export type { Lang };
