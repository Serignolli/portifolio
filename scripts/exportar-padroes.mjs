/**
 * Exporta exemplos dos padrões do hero para `exemplos/padroes/`.
 *
 *   npm run padroes            // ano atual
 *   npm run padroes -- 2027    // outro ano, pras datas móveis
 *
 * Gera um SVG por data especial, mais um index.html que põe tudo lado a lado com
 * duas semanas de dias comuns, pra conferir a forma de cada feriado e o quanto um dia
 * difere do outro num arquivo só.
 *
 * Roda em Node 24 (TypeScript direto, sem passo de build). Os padrões são funções
 * puras, então o script importa exatamente o mesmo código que a página usa: o que
 * sair aqui é o que aparece no site.
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { artFor, strokePath, VIEWBOX } from '../src/data/artPatterns.ts';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const DESTINO = join(RAIZ, 'exemplos', 'padroes');
const ano = Number(process.argv[2]) || new Date().getFullYear();

/**
 * As cores vivem em tokens.css como variáveis; um SVG solto no disco não enxerga
 * variável de CSS, então aqui elas são resolvidas pro valor literal. Ler o arquivo em
 * vez de copiar os hex à mão é o que mantém os exemplos em dia com a paleta.
 */
function lerTokens() {
  const css = readFileSync(join(RAIZ, 'src/styles/tokens.css'), 'utf8');
  const tokens = {};
  for (const [, nome, valor] of css.matchAll(/(--[\w-]+):\s*([^;]+);/g)) {
    tokens[nome] = valor.trim();
  }
  return tokens;
}

const tokens = lerTokens();
const cor = (nome) => tokens[nome] ?? '#FFFFFF';

function svg(art, { fundo = true } = {}) {
  const p = art.pattern;
  const id = `g-${art.seed}-${p.id}`;
  const [a, b, c, d] = p.palette;

  const tracos = Array.from({ length: p.strokes }, (_, i) =>
    `    <path d="${strokePath(p, i)}" stroke-width="${(1.5 - i * 0.09).toFixed(2)}" opacity="${(0.72 - i * 0.045).toFixed(2)}"/>`,
  ).join('\n');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${VIEWBOX} ${VIEWBOX}" width="${VIEWBOX}" height="${VIEWBOX}">
  <defs>
    <linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${cor(a)}"/>
      <stop offset="45%" stop-color="${cor(b)}"/>
      <stop offset="78%" stop-color="${cor(c)}"/>
      <stop offset="100%" stop-color="${cor(d)}"/>
    </linearGradient>
  </defs>
${fundo ? `  <rect width="${VIEWBOX}" height="${VIEWBOX}" fill="${cor('--bg')}"/>\n` : ''}  <g fill="none" stroke="url(#${id})" stroke-linejoin="round" transform="rotate(${p.rotation} ${VIEWBOX / 2} ${VIEWBOX / 2})">
${tracos}
  </g>
</svg>
`;
}

/** Varre o ano inteiro e guarda a primeira data de cada tema. */
function datasEspeciais(ano) {
  const achadas = new Map();
  const dia = new Date(ano, 0, 1);
  while (dia.getFullYear() === ano) {
    const art = artFor(dia);
    if (art.holiday && !achadas.has(art.holiday)) achadas.set(art.holiday, new Date(dia));
    dia.setDate(dia.getDate() + 1);
  }
  return achadas;
}

const dataBR = (d) => d.toLocaleDateString('pt-BR');

mkdirSync(DESTINO, { recursive: true });

// 1. Um arquivo por data especial.
const especiais = [];
for (const [tema, data] of datasEspeciais(ano)) {
  const art = artFor(data);
  writeFileSync(join(DESTINO, `${tema}.svg`), svg(art));
  especiais.push({ art, data, titulo: `${tema} · ${dataBR(data)}` });
}

// 2. Duas semanas de dias comuns, pra conferir a deriva de um dia pro outro.
const comuns = [];
const hoje = new Date();
for (let i = 0; comuns.length < 14 && i < 60; i++) {
  const data = new Date(hoje);
  data.setDate(data.getDate() + i);
  const art = artFor(data);
  if (art.holiday) continue;
  comuns.push({ art, data, titulo: `${dataBR(data)} · ${art.pattern.kind}` });
}

// 3. A folha de contato: um arquivo só pra ver tudo.
const cartao = ({ art, titulo }) =>
  `<figure>${svg(art, { fundo: false })}<figcaption>${titulo}</figcaption></figure>`;

writeFileSync(
  join(DESTINO, 'index.html'),
  `<!doctype html>
<html lang="pt-BR">
<meta charset="utf-8">
<title>Padrões do hero · ${ano}</title>
<style>
  body { margin: 0; padding: 24px; background: ${cor('--bg')}; color: ${cor('--text-muted')};
         font: 14px/1.5 system-ui, sans-serif; }
  h1 { color: ${cor('--text')}; font-size: 1.25rem; margin: 0 0 4px; }
  h2 { color: ${cor('--text')}; font-size: 1rem; margin: 32px 0 12px; font-weight: 600; }
  p { margin: 0; }
  main { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 12px; }
  figure { margin: 0; text-align: center; }
  svg { width: 100%; height: auto; display: block; background: ${cor('--bg-2')};
        border: 1px solid ${cor('--border')}; border-radius: 10px; }
  figcaption { padding-top: 6px; font-size: 12px; }
</style>
<h1>Padrões do hero</h1>
<p>Gerado por <code>npm run padroes</code>. As datas móveis são de ${ano}.</p>

<h2>Datas especiais</h2>
<main>${especiais.map(cartao).join('')}</main>

<h2>Dias comuns, em sequência</h2>
<p>Cada dia sorteia família, frequências e pétalas de novo: dois dias seguidos são duas peças diferentes.</p>
<main>${comuns.map(cartao).join('')}</main>
</html>
`,
);

console.log(`${especiais.length} datas especiais + ${comuns.length} dias comuns`);
console.log(`em exemplos/padroes/ (abra o index.html pra ver tudo junto)`);
