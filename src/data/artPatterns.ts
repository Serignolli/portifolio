/**
 * Os padrões do desenho do hero.
 *
 * Todo padrão é um desenho do Moiré (moire.serignolli.com): uma forma girada várias
 * vezes em torno do mesmo centro. A geometria mora em `moire.ts`; aqui só se decide
 * QUAL desenho sai em cada dia. Como os parâmetros são os do Moiré, o link do modal abre
 * lá exatamente o desenho que estava na página.
 *
 * Regras: o padrão vale por um dia. Em data especial ele tem tema (forma + cores que
 * lembram a data); em dia comum é sorteado, mas sempre na paleta do site, pra a
 * identidade não mudar de cara todo dia.
 *
 * O sorteio é determinístico a partir da data: todo mundo que abrir a página no mesmo
 * dia vê o mesmo desenho, e ele troca sozinho na virada. Nada é guardado, nada é pedido
 * ao servidor.
 *
 * Adicionar uma data nova = um `id` em `FIXED`, um padrão em `THEMES` e o rótulo em
 * `content.artDates`. Nenhum componente é tocado.
 */

import type { MoireParams } from './moire';

/** Nomes de variáveis de tokens.css, nas três paradas do degradê do Moiré. Nenhuma cor
 *  literal aqui. */
export type ArtPalette = readonly [string, string, string];

export type ArtPattern = {
  /** 'daily' ou o id da data especial. */
  id: string;
  params: MoireParams;
  palette: ArtPalette;
};

const SITE: ArtPalette = ['--accent-hover', '--accent', '--accent-blue'];

/** Valores que quase nenhum padrão muda. Cada padrão escreve só o que é dele. */
const PLAIN: MoireParams = {
  shape: 'ellipse',
  w: 250,
  h: 92,
  radius: 18,
  sides: 6,
  inner: 0.45,
  n: 16,
  step: 11.25,
  scalePct: 0,
  shrinkEvery: 0,
  shrinkPct: 6,
  opPeriod: 0,
  opMin: 0.35,
  strokeW: 1.2,
  gradAngle: 35,
};

const moire = (params: Partial<MoireParams>): MoireParams => ({ ...PLAIN, ...params });

/* ---------- Sorteio do dia ---------- */

/** Hash estável de string. Duas datas diferentes caem em sementes bem diferentes. */
function hash(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** mulberry32: gerador pequeno e determinístico, o suficiente pra escolher formas. */
function random(seed: number): () => number {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Formas do sorteio, com peso. O círculo fica de fora: girado no próprio centro ele
 *  não muda, e as cópias cairiam todas umas sobre as outras. */
const DAILY_SHAPES = [
  'ellipse',
  'ellipse',
  'ellipse',
  'rect',
  'polygon',
  'star',
  'line',
] as const;

/**
 * O padrão de um dia comum.
 *
 * Forma, número de cópias, passo do giro e as variações de escala e opacidade são
 * sorteados de novo toda manhã. Quem abre a página dois dias seguidos vê duas peças
 * diferentes, não a mesma respirando.
 *
 * Por baixo corre uma onda lenta sobre o número do dia, só como viés do ângulo do
 * degradê: dá uma maré à sequência ao longo das semanas sem prender o desenho ao de
 * ontem.
 *
 * A paleta não entra no sorteio: a cor é a assinatura do site, e trocar ela todo dia
 * faria a página parecer outra.
 */
function dailyPattern(seed: string, day: number): ArtPattern {
  const rnd = random(hash(seed));
  const pick = <T,>(list: readonly T[]): T => list[Math.floor(rnd() * list.length)];
  /** Inteiro entre `min` e `max`, os dois inclusos. */
  const int = (min: number, max: number) => min + Math.floor(rnd() * (max - min + 1));
  /** Decimal entre `min` e `max`, com duas casas: o link sai legível. */
  const num = (min: number, max: number) => +(min + rnd() * (max - min)).toFixed(2);

  const shape = pick(DAILY_SHAPES);
  // Variações que servem pra qualquer forma: uma cópia a cada tantas encolhe, e a
  // opacidade ondula ao longo das cópias. Cada uma aparece em mais ou menos metade dos
  // dias, pra nem todo desenho ter os mesmos enfeites.
  const common: Partial<MoireParams> = {
    shrinkEvery: rnd() < 0.5 ? int(3, 5) : 0,
    shrinkPct: int(4, 8),
    opPeriod: rnd() < 0.6 ? int(4, 7) : 0,
    opMin: num(0.3, 0.5),
    strokeW: num(1, 1.4),
    gradAngle: Math.round(35 + Math.sin(day / 11) * 30),
  };

  let params: Partial<MoireParams>;
  if (shape === 'ellipse') {
    const n = int(12, 28);
    // Metade das vezes fecha certinho em 180°; na outra, um passo solto que torce a
    // malha e deixa ela orgânica.
    params = { shape, w: 250, h: int(60, 130), n, step: rnd() < 0.5 ? +(180 / n).toFixed(2) : num(5, 14) };
  } else if (shape === 'rect') {
    const square = rnd() < 0.6;
    params = { shape, w: square ? 210 : 240, h: square ? 210 : int(130, 170), radius: int(8, 40), n: int(16, 28), step: num(3, 8) };
  } else if (shape === 'polygon') {
    params = { shape, w: 250, h: 250, sides: int(3, 8), n: int(14, 24), step: num(2, 6) };
  } else if (shape === 'star') {
    params = { shape, w: 250, h: 250, sides: int(5, 8), inner: num(0.35, 0.55), n: int(12, 20), step: num(2, 6) };
  } else {
    // Leque: linhas abrindo só até um pedaço da volta.
    params = { shape, w: 300, n: int(25, 45), step: num(2, 4) };
  }

  return { id: 'daily', params: moire({ ...common, ...params }), palette: SITE };
}

/* ---------- Datas especiais ---------- */

/** Domingo de Páscoa (algoritmo gregoriano anônimo). Base do Carnaval também. */
function easter(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

/** Enésima ocorrência de um dia da semana no mês. Thanksgiving: 4ª quinta de novembro. */
function nthWeekday(year: number, month: number, weekday: number, n: number): Date {
  const first = new Date(year, month, 1);
  const offset = (weekday - first.getDay() + 7) % 7;
  return new Date(year, month, 1 + offset + (n - 1) * 7);
}

function addDays(date: Date, days: number): Date {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy;
}

function sameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/** Datas de dia fixo, 'MM-DD'. As móveis são calculadas em `holidayFor`. */
const FIXED: Record<string, string> = {
  '01-01': 'ano-novo',
  '12-31': 'ano-novo',
  '02-14': 'valentines',
  '03-17': 'st-patricks',
  '06-12': 'namorados',
  '06-23': 'sao-joao',
  '06-24': 'sao-joao',
  '09-07': 'independencia',
  '10-12': 'criancas',
  '10-31': 'halloween',
  '12-24': 'natal',
  '12-25': 'natal',
};

/** O tema do dia, ou null num dia comum. */
export function holidayFor(date: Date): string | null {
  const year = date.getFullYear();
  const easterDay = easter(year);

  if (sameDay(date, easterDay) || sameDay(date, addDays(easterDay, -2))) return 'pascoa';
  if (sameDay(date, addDays(easterDay, -47)) || sameDay(date, addDays(easterDay, -48))) {
    return 'carnaval';
  }
  if (sameDay(date, nthWeekday(year, 10, 4, 4))) return 'thanksgiving';
  // Dia das Mães: 2º domingo de maio. Dia dos Pais: 2º domingo de agosto.
  if (sameDay(date, nthWeekday(year, 4, 0, 2))) return 'maes';
  if (sameDay(date, nthWeekday(year, 7, 0, 2))) return 'pais';

  const key = `${String(date.getMonth() + 1).padStart(2, '0')}-${String(
    date.getDate(),
  ).padStart(2, '0')}`;
  return FIXED[key] ?? null;
}

/**
 * Um padrão por data. A forma é que carrega o tema; a cor só reforça.
 * Tudo sai das formas do Moiré: repetir com giro, ou com passo 0 e escala acumulada,
 * que aninha as cópias umas dentro das outras.
 */
const THEMES: Record<string, ArtPattern> = {
  'ano-novo': {
    // Fogos: estrela de muitas pontas finas, girando pouco a cada cópia.
    id: 'ano-novo',
    params: moire({ shape: 'star', w: 260, h: 260, sides: 12, inner: 0.38, n: 10, step: 3, opPeriod: 5, opMin: 0.4, strokeW: 1 }),
    palette: ['--art-gold', '--art-pink', '--accent'],
  },
  carnaval: {
    // Serpentina: elipses finas com passo solto, a malha mais embaralhada do conjunto.
    id: 'carnaval',
    params: moire({ w: 270, h: 70, n: 36, step: 13, shrinkEvery: 5, shrinkPct: 8, opPeriod: 7, strokeW: 1 }),
    palette: ['--art-pink', '--art-gold', '--accent-blue'],
  },
  pascoa: {
    // Ovo: ovais em pé, aninhados, cada um um tico menor e mais torto.
    id: 'pascoa',
    params: moire({ w: 190, h: 250, n: 12, step: 2, scalePct: -5, opPeriod: 4, opMin: 0.45 }),
    palette: ['--art-teal', '--art-pink', '--accent'],
  },
  'sao-joao': {
    // Fogueira: triângulos de pé aninhados, girando de leve, como chama se mexendo.
    id: 'sao-joao',
    params: moire({ shape: 'polygon', w: 240, h: 270, sides: 3, n: 14, step: 2.5, scalePct: -4, opPeriod: 5, opMin: 0.4 }),
    palette: ['--art-amber', '--art-orange', '--art-red'],
  },
  valentines: {
    // O Moiré não desenha coração: fica uma flor de pétalas largas, nas cores da data.
    id: 'valentines',
    params: moire({ w: 250, h: 120, n: 8, step: 22.5, shrinkEvery: 2, shrinkPct: 10, opPeriod: 4, opMin: 0.45 }),
    palette: ['--art-pink', '--art-red', '--accent'],
  },
  namorados: {
    id: 'namorados',
    params: moire({ w: 250, h: 120, n: 8, step: 22.5, shrinkEvery: 2, shrinkPct: 10, opPeriod: 4, opMin: 0.45 }),
    palette: ['--art-pink', '--art-red', '--accent'],
  },
  'st-patricks': {
    // Trevo de quatro folhas: passo de quase 90° alterna deitada e em pé, e a escala
    // que encolhe põe as folhas umas dentro das outras.
    id: 'st-patricks',
    params: moire({ w: 250, h: 100, n: 12, step: 91.5, scalePct: -5 }),
    palette: ['--art-green-soft', '--art-green', '--art-teal'],
  },
  halloween: {
    // Teia: octógonos aninhados, sem giro, cada um menor que o anterior.
    id: 'halloween',
    params: moire({ shape: 'polygon', w: 260, h: 260, sides: 8, n: 14, step: 1.5, scalePct: -10, opPeriod: 3, opMin: 0.5 }),
    palette: ['--art-orange', '--art-amber', '--accent'],
  },
  thanksgiving: {
    // Folha: poucas elipses num leque curto, como nervuras.
    id: 'thanksgiving',
    params: moire({ w: 260, h: 110, n: 10, step: 4, shrinkEvery: 3, shrinkPct: 6, gradAngle: 60 }),
    palette: ['--art-amber', '--art-orange', '--art-red'],
  },
  maes: {
    // Flor: seis elipses a 30° dão doze pétalas.
    id: 'maes',
    params: moire({ w: 260, h: 80, n: 6, step: 30, strokeW: 1.4 }),
    palette: ['--art-pink', '--art-teal', '--accent'],
  },
  pais: {
    // Escudo: hexágonos girando devagar.
    id: 'pais',
    params: moire({ shape: 'polygon', w: 250, h: 250, sides: 6, n: 16, step: 3.75, shrinkEvery: 4, shrinkPct: 6, opPeriod: 5 }),
    palette: ['--art-teal', '--accent-blue', '--accent'],
  },
  independencia: {
    // Losango, como o da bandeira: losangos aninhados, sem giro.
    id: 'independencia',
    params: moire({ shape: 'polygon', w: 290, h: 190, sides: 4, n: 12, step: 0, scalePct: -8, opPeriod: 4, opMin: 0.45 }),
    palette: ['--art-green-soft', '--art-gold', '--art-green'],
  },
  criancas: {
    // Cata-vento: estrela de cinco pontas bem girada.
    id: 'criancas',
    params: moire({ shape: 'star', w: 250, h: 250, sides: 5, inner: 0.45, n: 14, step: 5, shrinkEvery: 3, shrinkPct: 6, strokeW: 1 }),
    palette: ['--art-gold', '--art-pink', '--art-teal'],
  },
  natal: {
    // Estrela de Belém: estrelas aninhadas, cada uma menor e um pouco girada.
    id: 'natal',
    params: moire({ shape: 'star', w: 260, h: 260, sides: 5, inner: 0.4, n: 10, step: 1.5, scalePct: -8, opPeriod: 4, opMin: 0.45 }),
    palette: ['--art-gold', '--art-green-soft', '--art-green'],
  },
};

/** Data do dia como 'AAAA-MM-DD' no fuso de quem está olhando. É a semente. */
export function seedFor(date: Date): string {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-');
}

export type TodayArt = {
  pattern: ArtPattern;
  /** Id da data especial, ou null. Vira rótulo no modal via `content.artDates`. */
  holiday: string | null;
  seed: string;
};

/** Número do dia no calendário. É o eixo do tempo da base que caminha. */
function dayNumber(date: Date): number {
  return Math.floor(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86400000,
  );
}

export function artFor(date: Date): TodayArt {
  const holiday = holidayFor(date);
  const seed = seedFor(date);
  return {
    pattern: (holiday && THEMES[holiday]) || dailyPattern(seed, dayNumber(date)),
    holiday,
    seed,
  };
}
