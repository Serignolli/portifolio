import { StrictMode, type ComponentType } from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';
import CatalogApp from './CatalogApp';
import { LanguageProvider } from './i18n/LanguageContext';
import ResumeApp from './ResumeApp';

/**
 * Usado só no build (scripts/prerender.mjs): gera o HTML de cada página para que robôs que
 * não rodam JavaScript (ChatGPT, Claude, Perplexity) leiam o conteúdo. No navegador, o
 * mount.tsx renderiza tudo de novo por cima, igual a antes.
 */
const PAGES: Record<string, ComponentType> = {
  'index.html': App,
  'projetos.html': CatalogApp,
  'curriculo.html': ResumeApp,
};

export function render(file: string): string {
  const Page = PAGES[file];
  if (!Page) throw new Error(`Página sem pré-renderização: ${file}`);
  return renderToString(
    <StrictMode>
      <LanguageProvider>
        <Page />
      </LanguageProvider>
    </StrictMode>,
  );
}

export const files = Object.keys(PAGES);
