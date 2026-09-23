/**
 * A geometria do Moiré (moire.serignolli.com), portada de `moire/src/core/`.
 *
 * O desenho do hero é um desenho do Moiré: uma forma repetida N vezes em torno do mesmo
 * centro, cada cópia girando um pouco mais. As contas aqui precisam continuar iguais às
 * de lá (`geometry.ts` e `svg.ts`), senão o link "Quero visitar" abre um desenho diferente
 * do que estava na página. Os nomes dos campos são os mesmos da query string do Moiré.
 */

export type MoireShape = 'ellipse' | 'rect' | 'line' | 'circle' | 'polygon' | 'star';

export type MoireParams = {
  shape: MoireShape;
  /** Largura (diâmetro no círculo, comprimento na linha). */
  w: number;
  h: number;
  /** Cantos, só no retângulo. */
  radius: number;
  /** Lados do polígono, pontas da estrela. */
  sides: number;
  /** Raio interno relativo da estrela. */
  inner: number;
  /** Cópias. */
  n: number;
  /** Graus por cópia. Aqui é sempre explícito: o `auto` do Moiré vai desligado. */
  step: number;
  /** Escala acumulada, % por cópia. */
  scalePct: number;
  /** A cada quantas cópias uma encolhe (0 = nunca), e quanto. */
  shrinkEvery: number;
  shrinkPct: number;
  /** Ciclo de opacidade (0 ou 1 = sem ciclo) e a opacidade mínima dele. */
  opPeriod: number;
  opMin: number;
  strokeW: number;
  gradAngle: number;
};

export type Box = { x: number; y: number; w: number; h: number };

/** Arredondamento de tudo que vai pro markup, igual ao do Moiré. */
export const f = (x: number) => +(+x).toFixed(2);

export const scaleAt = (p: MoireParams, i: number) =>
  Math.pow(1 + p.scalePct / 100, i) *
  (p.shrinkEvery > 0 && i % p.shrinkEvery === p.shrinkEvery - 1 ? 1 - p.shrinkPct / 100 : 1);

export const opAt = (p: MoireParams, i: number) =>
  p.opPeriod > 1
    ? p.opMin + (1 - p.opMin) * (0.5 + 0.5 * Math.cos((2 * Math.PI * i) / p.opPeriod))
    : 1;

const hasH = (p: MoireParams) => p.shape !== 'line' && p.shape !== 'circle';

/** Raio varrido por uma cópia ao girar em torno do centro. */
function radiusOf(p: MoireParams, sc: number): number {
  const w = p.w * sc;
  const h = (hasH(p) ? p.h : p.w) * sc;
  if (p.shape === 'rect') return Math.hypot(w, h) / 2;
  if (p.shape === 'line') return w / 2;
  return Math.max(w, h) / 2;
}

/** viewBox automático: cabe o giro de toda cópia, mais o traço e 4% de margem. */
export function bounds(p: MoireParams): Box {
  let r = 0;
  for (let i = 0; i < p.n; i++) r = Math.max(r, radiusOf(p, scaleAt(p, i)));
  const pad = p.strokeW + 2 * r * 0.04;
  return { x: f(-r - pad), y: f(-r - pad), w: f(2 * r + 2 * pad), h: f(2 * r + 2 * pad) };
}

/** Vértices do polígono, ou da estrela (pontas alternando raio 1 e `inner`). */
export function polyPts(p: MoireParams, sc: number): string {
  const m = p.shape === 'star' ? p.sides * 2 : p.sides;
  const rx = (p.w / 2) * sc;
  const ry = (p.h / 2) * sc;
  const out: string[] = [];
  for (let k = 0; k < m; k++) {
    const a = ((-90 + (k * 360) / m) * Math.PI) / 180;
    const r = p.shape === 'star' && k % 2 ? p.inner : 1;
    out.push(`${f(Math.cos(a) * rx * r)},${f(Math.sin(a) * ry * r)}`);
  }
  return out.join(' ');
}

/** Linha do degradê: passa pelo centro na direção de `gradAngle`. */
export function gradCoords(p: MoireParams, b: Box) {
  const cx = b.x + b.w / 2;
  const cy = b.y + b.h / 2;
  const L = Math.hypot(b.w, b.h) / 2;
  const a = (p.gradAngle * Math.PI) / 180;
  return {
    x1: f(cx - Math.cos(a) * L),
    y1: f(cy - Math.sin(a) * L),
    x2: f(cx + Math.cos(a) * L),
    y2: f(cy + Math.sin(a) * L),
  };
}

/** Paradas do degradê de três cores do Moiré. */
export const GRAD_STOPS = [0, 0.55, 1] as const;

/**
 * Link que abre este mesmo desenho no Moiré. As cores chegam já resolvidas em hex
 * (`#RRGGBB`), porque o Moiré não conhece os tokens deste site. Cor que não for hex é
 * descartada lá, e o desenho abre com a cor padrão dele.
 */
export function moireURL(base: string, p: MoireParams, colors: readonly string[]): string {
  const query = new URLSearchParams({ v: '1' });
  for (const [key, value] of Object.entries(p)) query.set(key, String(value));
  query.set('auto', '0');
  query.set('colorMode', 'gradient');
  colors.forEach((color, i) => query.set(`c${i + 1}`, color.replace('#', '')));
  query.set('bgOn', '0');
  query.set('animate', '0');
  // Fundo escuro na prévia, como aqui.
  query.set('view', 'black');
  return `${base}?${query.toString()}`;
}
