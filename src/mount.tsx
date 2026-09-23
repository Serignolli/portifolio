import { StrictMode, type ComponentType } from 'react';
import { createRoot } from 'react-dom/client';
import { LanguageProvider } from './i18n/LanguageContext';
import './styles/tokens.css';
import './styles/global.css';
import './styles/components.css';

/** Ponto de partida comum às páginas do site: estilos, idioma e o #root. */
export function mount(Page: ComponentType) {
  const rootElement = document.getElementById('root');
  if (!rootElement) throw new Error('Elemento #root não encontrado no HTML da página');

  createRoot(rootElement).render(
    <StrictMode>
      <LanguageProvider>
        <Page />
      </LanguageProvider>
    </StrictMode>,
  );
}
