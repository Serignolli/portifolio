// Pré-renderização: grava dentro do <div id="root"> de cada HTML do build o conteúdo que o
// React renderiza. Robôs de IA (ChatGPT, Claude, Perplexity) não rodam JavaScript e, sem
// isso, recebiam a página vazia. No navegador nada muda: o React renderiza por cima.
import { readFile, rm, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const OUT_DIR = resolve('dist');
const SERVER_DIR = resolve('dist-prerender');
const EMPTY_ROOT = '<div id="root"></div>';

process.env.NODE_ENV = 'production';
// O HTML pré-renderizado sai sempre em português, o idioma padrão do site.
Object.defineProperty(globalThis, 'navigator', { value: { language: 'pt-BR' }, configurable: true });

try {
  const { render, files } = await import(pathToFileURL(resolve(SERVER_DIR, 'entry-prerender.js')).href);
  for (const file of files) {
    const path = resolve(OUT_DIR, file);
    const html = await readFile(path, 'utf8');
    if (!html.includes(EMPTY_ROOT)) throw new Error(`${file}: ${EMPTY_ROOT} não encontrado`);
    await writeFile(path, html.replace(EMPTY_ROOT, `<div id="root">${render(file)}</div>`));
    console.log(`pré-renderizado: ${file}`);
  }
} finally {
  await rm(SERVER_DIR, { recursive: true, force: true });
}
