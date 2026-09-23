/**
 * Os padrões do desenho do hero.
 *
 * Regras: o padrão vale por um dia. Em data especial ele tem tema (forma + cores que
 * lembram a data); em dia comum é sorteado, mas sempre na paleta do site, pra a
 * identidade não mudar de cara todo dia.
 *
 * O sorteio é determinístico a partir da data: todo mundo que abrir a página no mesmo
 * dia vê o mesmo desenho, e ele troca sozinho na virada. Nada é guardado, nada é pedido
 * ao servidor.
 *
 * Adicionar uma data nova = um `id` em `HOLIDAYS`, um padrão em `THEMES` e o rótulo em
 * `content.artDates`. Nenhum componente é tocado.
 */

/** Nomes de variáveis de tokens.css. Nenhuma cor literal aqui. */
export type ArtPalette = readonly [string, string, string, string];

type Base = {
  /** 'daily' ou o id da data especial. */
  id: string;
  /** Traços do feixe. Mais traços = fita mais densa. */
  strokes: number;
  /** Atraso de fase acumulado entre um traço e o seguinte, em radianos. */
  phaseStep: number;
  /** Giro do conjunto, em graus. Só em formas limitadas por raio (ver `rotation`). */
  rotation: number;
  palette: ArtPalette;
};

export type ArtPattern =
  | (Base & {
      kind: 'harmonograph';
      /** Frequências dos dois pêndulos em cada eixo. */
      freq: { x1: number; x2: number; y1: number; y2: number };
      /** Amplitudes. A segunda harmônica é o que enruga a curva. */
      ampl: { x1: number; x2: number; y1: number; y2: number };
    })
  | (Base & {
      kind: 'rose';
      /** Pétalas: ímpar dá k pétalas, par dá 2k. */
      k: number;
      /** 0 = roseta pura (pétalas). 1 = contorno fechado, só ondulado. */
      base: number;
      amp: number;
      stretchX: number;
      stretchY: number;
      /** Segunda harmônica, opcional: recorta os lados do contorno em degraus
       *  (é o que faz os galhos da árvore de Natal). */
      k2?: number;
      amp2?: number;
    })
  | (Base & { kind: 'heart'; scale: number })
  | (Base & {
      kind: 'flame';
      /** Quanto mais alto, mais afilada a ponta da gota. */
      taper: number;
      /** Ondulação da borda e quantas ondas dão a volta. */
      ripple: number;
      ripples: number;
      /** Largura da chama em relação à altura. */
      width: number;
    });

export const VIEWBOX = 600;
const CENTER = VIEWBOX / 2;
/** Raio máximo. Sobra margem pro traço não encostar na borda do viewBox. */
const RADIUS = 250;
/** Pontos por traço: denso o bastante pra não aparecer segmento reto. */
const SAMPLES = 360;

const SITE: ArtPalette = ['--accent-hover', '--accent', '--accent-blue', '--accent-deep'];

/* ---------- Desenho ---------- */

/** Um traço do feixe, já escrito como atributo `d` de um path. */
export function strokePath(pattern: ArtPattern, index: number): string {
  const phase = index * pattern.phaseStep;
  // Cada traço um tico menor que o anterior: é o que dá o aninhamento da fita.
  const shrink = 1 - index * 0.022;
  let d = '';

  for (let i = 0; i <= SAMPLES; i++) {
    const t = (i / SAMPLES) * Math.PI * 2;
    const [x, y] = point(pattern, t, phase, shrink);
    d += `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`;
  }

  return `${d}Z`;
}

function point(
  pattern: ArtPattern,
  t: number,
  phase: number,
  shrink: number,
): [number, number] {
  if (pattern.kind === 'harmonograph') {
    const { freq, ampl } = pattern;
    return [
      CENTER +
        shrink *
          (ampl.x1 * Math.sin(freq.x1 * t + phase) +
            ampl.x2 * Math.sin(freq.x2 * t + phase * 2.4)),
      CENTER +
        shrink *
          (ampl.y1 * Math.sin(freq.y1 * t + 0.6) +
            ampl.y2 * Math.cos(freq.y2 * t + phase * 3.1)),
    ];
  }

  if (pattern.kind === 'rose') {
    const { k, base, amp, stretchX, stretchY, k2 = 0, amp2 = 0 } = pattern;
    // Normaliza pelo raio máximo possível, pra qualquer roseta caber igual no quadro.
    const bruto =
      base + amp * Math.cos(k * t + phase) + amp2 * Math.cos(k2 * t + phase);
    const r = (bruto / (base + amp + amp2)) * RADIUS * shrink;
    return [CENTER + r * Math.cos(t) * stretchX, CENTER + r * Math.sin(t) * stretchY];
  }

  if (pattern.kind === 'flame') {
    // Curva da gota: ponta em t = 0, parte redonda do lado oposto. Fica deitada, e o
    // `rotation` do padrão é que a põe de pé. A ondulação é o que faz lamber.
    const { taper, ripple, ripples, width } = pattern;
    const wobble = 1 + ripple * Math.cos(ripples * t + phase * 2.5);
    const s = RADIUS * shrink * wobble;
    return [
      CENTER + Math.cos(t) * s,
      CENTER + Math.sin(t) * Math.sin(t / 2) ** taper * s * width,
    ];
  }

  // Coração: a paramétrica clássica. O y é invertido porque no SVG ele cresce pra baixo.
  const s = (pattern.scale * RADIUS * shrink) / 17;
  const x = 16 * Math.sin(t) ** 3;
  const y =
    13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
  return [CENTER + x * s + Math.sin(phase) * 6, CENTER - y * s];
}

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

/** Valores sorteados a cada dia. São eles que fazem o desenho virar outro de manhã. */
const FREQ_X = [2, 3, 4, 5, 6] as const;
const FREQ_Y = [3, 4, 5, 6, 7] as const;
const FREQ_X2 = [5, 7, 8, 9, 11] as const;
const FREQ_Y2 = [4, 6, 7, 8, 10] as const;
/** Pétalas possíveis da roseta. Mudar `k` é a diferença mais visível que existe aqui. */
const ROSE_K = [3, 4, 5, 6, 7, 8, 9, 12] as const;

/**
 * O padrão de um dia comum.
 *
 * O peso está no sorteio do dia: família da curva, frequências e número de pétalas são
 * escolhidos de novo toda manhã, e são justamente os parâmetros que mais mudam a cara do
 * desenho. Quem abre a página dois dias seguidos vê duas peças diferentes, não a mesma
 * respirando.
 *
 * Por baixo continua uma onda lenta sobre o número do dia, mas só como viés das
 * amplitudes e do giro: ela dá uma maré à sequência ao longo das semanas sem segurar o
 * desenho preso ao de ontem.
 *
 * A paleta não entra no sorteio: a cor é a assinatura do site, e trocar ela todo dia
 * faria a página parecer outra.
 */
function dailyPattern(seed: string, day: number): ArtPattern {
  const rnd = random(hash(seed));
  /** Sorteio do dia. É o que domina. */
  const pick = <T,>(list: readonly T[]): T => list[Math.floor(rnd() * list.length)];
  const spread = (amount: number) => (rnd() - 0.5) * 2 * amount;
  /** Maré lenta do calendário, entra só como viés. */
  const wave = (period: number, offset = 0) => Math.sin(day / period + offset);

  const strokes = 6 + Math.floor(rnd() * 7);
  const phaseStep = 0.06 + rnd() * 0.14;

  if (rnd() < 0.45) {
    return {
      id: 'daily',
      kind: 'rose',
      k: pick(ROSE_K),
      // Uma vez a cada quatro dias, mais ou menos, a roseta abre em pétalas soltas em
      // vez de contorno fechado. É a virada mais brusca do conjunto, e é de propósito.
      base: rnd() < 0.25 ? 0 : 1,
      amp: 0.22 + rnd() * 0.38,
      stretchX: 1 + wave(13, 0.6) * 0.05 + spread(0.1),
      stretchY: 1 - wave(13, 0.6) * 0.05 + spread(0.1),
      strokes,
      phaseStep,
      rotation: wave(19, 0.3) * 15 + spread(30),
      palette: SITE,
    };
  }

  const x1 = pick(FREQ_X);
  const y1 = pick(FREQ_Y.filter((f) => f !== x1));

  return {
    id: 'daily',
    kind: 'harmonograph',
    freq: { x1, y1, x2: pick(FREQ_X2), y2: pick(FREQ_Y2) },
    // Os tetos somados ficam abaixo de 300, o meio do viewBox: assim a curva nunca
    // encosta na borda do quadro, em nenhuma combinação possível.
    ampl: {
      x1: 190 + wave(8, 0.2) * 8 + spread(18),
      x2: 54 + wave(10, 1.5) * 8 + spread(18),
      y1: 185 + wave(12, 0.9) * 8 + spread(18),
      y2: 52 + wave(9, 2.1) * 8 + spread(16),
    },
    strokes,
    phaseStep,
    // Harmonógrafa não gira: o desenho dela não cabe num círculo, e girar poria uma
    // ponta pra fora do quadro. Roseta e coração cabem, esses giram à vontade.
    rotation: 0,
    palette: SITE,
  };
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
 * Estrela, trevo, ovo, coração, teia: tudo sai da mesma roseta, mudando `k` e `amp`.
 */
const THEMES: Record<string, ArtPattern> = {
  'ano-novo': {
    // Fogos: muitas pontas finas, feixe bem aberto.
    id: 'ano-novo',
    kind: 'rose',
    k: 12,
    base: 1,
    amp: 0.42,
    stretchX: 1,
    stretchY: 1,
    strokes: 11,
    phaseStep: 0.19,
    rotation: 0,
    palette: ['--art-gold', '--art-pink', '--accent', '--accent-deep'],
  },
  carnaval: {
    // Serpentina: harmonógrafa nervosa, a mais embaralhada do conjunto.
    id: 'carnaval',
    kind: 'harmonograph',
    freq: { x1: 5, x2: 9, y1: 4, y2: 7 },
    ampl: { x1: 200, x2: 70, y1: 195, y2: 65 },
    strokes: 10,
    phaseStep: 0.17,
    rotation: 0,
    palette: ['--art-pink', '--art-gold', '--accent', '--accent-blue'],
  },
  pascoa: {
    // Ovo: k=1 desloca o raio pra um lado só, que é o que faz a ponta. O giro de 90°
    // põe a parte larga embaixo, como um ovo em pé.
    id: 'pascoa',
    kind: 'rose',
    k: 1,
    base: 1,
    amp: 0.28,
    // Com o giro de 90°, o stretchX vira a altura e o stretchY a largura: ovo em pé.
    stretchX: 1.06,
    stretchY: 0.88,
    strokes: 9,
    phaseStep: 0.12,
    rotation: 90,
    palette: ['--art-teal', '--art-pink', '--accent', '--accent-blue'],
  },
  'sao-joao': {
    // Fogueira: chama de verdade, gota afilada de pé com a borda lambendo. Cada traço
    // do feixe desloca a ondulação, então o conjunto parece fogo se mexendo.
    id: 'sao-joao',
    kind: 'flame',
    taper: 3,
    ripple: 0.07,
    ripples: 9,
    width: 1.5,
    strokes: 10,
    phaseStep: 0.26,
    rotation: -90,
    palette: ['--art-amber', '--art-orange', '--art-red', '--accent-deep'],
  },
  valentines: {
    id: 'valentines',
    kind: 'heart',
    scale: 0.94,
    strokes: 9,
    phaseStep: 0.16,
    rotation: 0,
    palette: ['--art-pink', '--art-red', '--accent', '--accent-deep'],
  },
  namorados: {
    id: 'namorados',
    kind: 'heart',
    scale: 0.94,
    strokes: 9,
    phaseStep: 0.16,
    rotation: 0,
    palette: ['--art-pink', '--art-red', '--accent', '--accent-deep'],
  },
  'st-patricks': {
    // Trevo de quatro folhas: roseta de k par dá 2k pétalas, então k = 2.
    id: 'st-patricks',
    kind: 'rose',
    k: 2,
    base: 0,
    amp: 1,
    stretchX: 1,
    stretchY: 1,
    strokes: 8,
    phaseStep: 0.14,
    rotation: -18,
    palette: ['--art-green-soft', '--art-green', '--art-teal', '--accent-deep'],
  },
  halloween: {
    // Teia: muitas pontas curtas e um feixe apertado, que adensa o miolo.
    id: 'halloween',
    kind: 'rose',
    k: 8,
    base: 1,
    amp: 0.3,
    stretchX: 1,
    stretchY: 1,
    strokes: 12,
    phaseStep: 0.07,
    rotation: 22,
    palette: ['--art-orange', '--art-amber', '--accent', '--accent-deep'],
  },
  thanksgiving: {
    // Folha: uma pétala só, bem pontuda de um lado, esticada e inclinada.
    id: 'thanksgiving',
    kind: 'rose',
    k: 1,
    base: 1,
    amp: 0.8,
    stretchX: 1.12,
    stretchY: 0.82,
    strokes: 9,
    phaseStep: 0.13,
    rotation: -24,
    palette: ['--art-amber', '--art-orange', '--art-red', '--accent-deep'],
  },
  maes: {
    // Flor: seis lóbulos arredondados.
    id: 'maes',
    kind: 'rose',
    k: 6,
    base: 1,
    amp: 0.5,
    stretchX: 1,
    stretchY: 1,
    strokes: 9,
    phaseStep: 0.12,
    rotation: 0,
    palette: ['--art-pink', '--art-teal', '--accent', '--accent-deep'],
  },
  pais: {
    // Escudo: três lóbulos com a ponta pra baixo.
    id: 'pais',
    kind: 'rose',
    k: 3,
    base: 1,
    amp: 0.55,
    stretchX: 1,
    stretchY: 1.04,
    strokes: 9,
    phaseStep: 0.11,
    rotation: 180,
    palette: ['--art-teal', '--accent-blue', '--accent', '--accent-deep'],
  },
  independencia: {
    // Losango, como o da bandeira: quatro lóbulos girados 45°.
    id: 'independencia',
    kind: 'rose',
    k: 4,
    base: 1,
    amp: 0.5,
    // Girado 45°, o losango ocupa menos quadro que as outras formas; o esticão
    // uniforme devolve a ele o mesmo tamanho aparente.
    stretchX: 1.25,
    stretchY: 1.25,
    strokes: 9,
    phaseStep: 0.1,
    rotation: 45,
    palette: ['--art-green-soft', '--art-gold', '--art-green', '--accent-deep'],
  },
  criancas: {
    // Cata-vento: cinco pontas tortas, feixe bem girado.
    id: 'criancas',
    kind: 'rose',
    k: 5,
    base: 1,
    amp: 0.45,
    stretchX: 1.06,
    stretchY: 0.94,
    strokes: 10,
    phaseStep: 0.2,
    rotation: 28,
    palette: ['--art-gold', '--art-pink', '--art-teal', '--accent'],
  },
  natal: {
    // Árvore: triângulo de ponta pra cima (k = 3 girado -90°) com uma segunda
    // harmônica de k = 9 recortando três degraus em cada lado, que são os galhos.
    id: 'natal',
    kind: 'rose',
    k: 3,
    base: 1,
    amp: 0.62,
    k2: 9,
    amp2: 0.16,
    stretchX: 1.12,
    stretchY: 0.9,
    strokes: 9,
    phaseStep: 0.1,
    rotation: -90,
    palette: ['--art-gold', '--art-green', '--art-green-soft', '--accent-deep'],
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

/**
 * Os parâmetros do padrão em forma de query string, pro gerador abrir já mostrando
 * este mesmo desenho.
 *
 * TODO Gabriel: conferir os nomes com o gerador quando ele existir. `seed` e `theme`
 * sozinhos já bastam se o gerador usar este mesmo algoritmo; o resto vai junto pra ele
 * conseguir reconstruir o desenho sem compartilhar código.
 */
export function artQuery({ pattern, holiday, seed }: TodayArt): string {
  const round = (value: number) => value.toFixed(3).replace(/\.?0+$/, '');
  const params: Record<string, string> = {
    seed,
    kind: pattern.kind,
    strokes: String(pattern.strokes),
    phase: round(pattern.phaseStep),
    rot: round(pattern.rotation),
  };

  if (holiday) params.theme = holiday;

  if (pattern.kind === 'harmonograph') {
    params.fx = `${pattern.freq.x1},${pattern.freq.x2}`;
    params.fy = `${pattern.freq.y1},${pattern.freq.y2}`;
    params.ax = `${round(pattern.ampl.x1)},${round(pattern.ampl.x2)}`;
    params.ay = `${round(pattern.ampl.y1)},${round(pattern.ampl.y2)}`;
  } else if (pattern.kind === 'rose') {
    params.k = String(pattern.k);
    params.base = round(pattern.base);
    params.amp = round(pattern.amp);
    params.stretch = `${round(pattern.stretchX)},${round(pattern.stretchY)}`;
    if (pattern.amp2) params.harm2 = `${pattern.k2},${round(pattern.amp2)}`;
  } else if (pattern.kind === 'flame') {
    params.taper = String(pattern.taper);
    params.ripple = `${round(pattern.ripple)},${pattern.ripples}`;
    params.width = round(pattern.width);
  } else {
    params.scale = round(pattern.scale);
  }

  return new URLSearchParams(params).toString();
}
