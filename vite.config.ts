import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Três páginas estáticas, sem router: a principal, o catálogo e o currículo. Cada uma tem seu HTML
// (título, descrição e canonical próprios) e divide o resto do código com as outras.
// Caminhos relativos à raiz do projeto, de onde os scripts do npm rodam.
// O build com --ssr só gera o src/entry-prerender.tsx, usado pelo scripts/prerender.mjs.
export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react()],
  build: isSsrBuild
    ? {}
    : {
        rollupOptions: {
          input: {
            main: 'index.html',
            curriculo: 'curriculo.html',
            projetos: 'projetos.html',
          },
        },
      },
}));
