export type Localized = { readonly pt: string; readonly en: string };

/**
 * `tool`   → ferramentas úteis e abertas
 * `lab`    → jogos, brincadeiras e experimentos
 * `client` → trabalho sob encomenda; na principal aparece dentro da seção de freelance
 */
export type Category = 'tool' | 'lab' | 'client';

/** Ordem das faixas no catálogo (/projetos). Na principal a ordem é a das seções. */
export const CATEGORY_ORDER: Category[] = ['tool', 'client', 'lab'];

export type Project = {
  /** Slug estável, é o valor aceito pelo parâmetro `?from=`. Não mudar depois de
   *  publicado: os modais dos sites individuais apontam para ele. */
  id: string;
  name: string;
  /** Define em que seção e em que faixa o projeto cai. Mudar aqui move o projeto. */
  category: Category;
  /** Site do projeto. */
  url?: string;
  /** Repositório público. Projeto só com repositório (ex.: app desktop) é
   *  aberto por ele. Repositório privado simplesmente não entra aqui. */
  repo?: string;
  /** Caminho em /shots/. Proporção 16:10. */
  shot: string;
  /** 'soon' = ainda sem endereço: card sem link, com o selo "em breve". */
  status?: 'live' | 'soon';
  /** Aparece como exemplo na página principal. O catálogo mostra todos. */
  featured?: boolean;
  /** Tecnologias, viram as etiquetas do card. */
  tags: string[];
  /** UMA linha, máx ~90 caracteres. Em `client`, descreve o PROBLEMA RESOLVIDO,
   *  não a ferramenta. */
  description: Localized;
  /** Alt do print: descreve o que o projeto faz, não "screenshot do X". */
  alt: Localized;
};

/** Para onde o card leva: o site, ou o repositório quando não houver site. */
export function projectHref(project: Project): string | undefined {
  if (project.status === 'soon') return undefined;
  return project.url ?? project.repo;
}

export const projects: Project[] = [
  // ---------- Ferramentas ----------
  {
    id: 'sfx-forge',
    name: 'SFX Forge',
    category: 'tool',
    url: 'https://sfx-forge.serignolli.com/',
    featured: true,
    tags: ['Web Audio'],
    shot: '/shots/sfx-forge.webp',
    description: {
      pt: 'Sintetizador web para criar e exportar efeitos sonoros.',
      en: 'A web synthesizer to create and export sound effects.',
    },
    alt: {
      pt: 'SFX Forge com a forma de onda de um som de moeda e a lista de efeitos por categoria.',
      en: 'SFX Forge showing the waveform of a coin sound and the list of effects by category.',
    },
  },
  {
    id: 'moire',
    name: 'Moiré',
    category: 'tool',
    url: 'https://moire.serignolli.com/',
    featured: true,
    tags: ['React', 'TypeScript', 'SVG'],
    shot: '/shots/moire.webp',
    description: {
      pt: 'Gira uma forma no mesmo centro e cria padrões moiré. O desenho do topo da home sai dele.',
      en: 'Spins one shape around one center into moiré patterns. The art atop the home page comes from it.',
    },
    alt: {
      pt: 'Moiré com dezesseis elipses giradas formando uma malha em azul e violeta, ao lado dos controles.',
      en: 'Moiré with sixteen rotated ellipses forming a blue and violet mesh, next to the controls.',
    },
  },
  {
    id: 'portwatch',
    name: 'Port Watch',
    category: 'tool',
    repo: 'https://github.com/Serignolli/port-watch',
    tags: ['Go', 'HTML'],
    shot: '/shots/portwatch.webp',
    description: {
      pt: 'Mostra as portas de rede abertas no computador e encerra o processo com um clique.',
      en: 'Shows the network ports open on your computer and kills the process in one click.',
    },
    alt: {
      pt: 'Tabela do Port Watch listando portas, protocolos, estados e processos.',
      en: 'Port Watch table listing ports, protocols, states and processes.',
    },
  },
  {
    id: 'ai-code-reviewer',
    name: 'AI Code Reviewer',
    category: 'tool',
    url: 'https://ai-code-reviewer-and-explainer.onrender.com/',
    repo: 'https://github.com/Serignolli/Gradio_OpenRouter',
    tags: ['Python', 'Gradio', 'OpenRouter'],
    shot: '/shots/ai-code-reviewer.webp',
    description: {
      pt: 'Cole um trecho de código e receba explicação, revisão e sugestões de melhoria por IA.',
      en: 'Paste a code snippet and get an AI explanation, review and improvement ideas.',
    },
    alt: {
      pt: 'Tela do AI Code Reviewer com o editor de código e o painel de análise.',
      en: 'AI Code Reviewer screen with the code editor and the analysis panel.',
    },
  },
  {
    id: 'pedal-calculator',
    name: 'Calculadora do Pedal',
    category: 'tool',
    url: 'https://bike-calculator-pied.vercel.app/',
    repo: 'https://github.com/Serignolli/bike_calculator',
    tags: ['React', 'TypeScript', 'Tailwind'],
    shot: '/shots/pedal-calculator.webp',
    description: {
      pt: 'Quanto você ganha trocando carro, moto ou ônibus pela bike: no bolso, no tempo e no clima.',
      en: 'How much you gain by swapping car, motorcycle or bus for a bicycle: in money, time and climate.',
    },
    alt: {
      pt: 'Calculadora do Pedal com os dados do trajeto e a economia por mês, CO₂ evitado e tempo.',
      en: 'Pedal Calculator with route inputs and the monthly savings, CO₂ avoided and time.',
    },
  },

  // ---------- Para clientes ----------
  {
    id: 'hand-solve',
    name: 'Hand Solv',
    category: 'client',
    url: 'https://hand-solve.vercel.app/',
    featured: true,
    tags: ['React', 'Tailwind'],
    shot: '/shots/hand-solve.webp',
    description: {
      pt: 'Deu a uma linha de desengraxantes uma vitrine própria, com pedido direto pelo WhatsApp.',
      en: 'Gave a degreaser product line its own showcase, with ordering straight through WhatsApp.',
    },
    alt: {
      pt: 'Página da Hand Solv apresentando pastas desengraxantes biodegradáveis.',
      en: 'Hand Solv page presenting biodegradable degreasing pastes.',
    },
  },
  {
    id: 'lendas-forjadas',
    name: 'Lendas Forjadas',
    category: 'client',
    url: 'https://lendasforjadas.serignolli.com/',
    featured: true,
    tags: ['React', 'TypeScript', 'Tailwind'],
    shot: '/shots/lendas-forjadas.webp',
    description: {
      pt: 'Transformou pedidos de miniaturas de RPG sob encomenda em uma página que recebe encomendas sem servidor.',
      en: 'Turned custom RPG miniature orders into a page that takes requests without a server.',
    },
    alt: {
      pt: 'Página da Lendas Forjadas com miniaturas de RPG pintadas à mão.',
      en: 'Lendas Forjadas page showing hand-painted RPG miniatures.',
    },
  },

  // ---------- Jogos e brincadeiras ----------
  {
    id: 'numixy',
    name: 'Numixy',
    category: 'lab',
    url: 'https://numixy.com',
    featured: true,
    tags: ['Angular', 'TypeScript'],
    shot: '/shots/numixy.webp',
    description: {
      pt: 'Jogo de quebra-cabeça numérico jogável direto no navegador.',
      en: 'A number puzzle game you can play straight in the browser.',
    },
    alt: {
      pt: 'Tela do Numixy com o número alvo do dia e a calculadora do desafio.',
      en: "Numixy screen with the day's target number and the challenge calculator.",
    },
  },
  {
    id: 'ritual-esquecimento',
    name: 'Ritual de Esquecimento',
    category: 'lab',
    url: 'https://ritual-esquecimento.vercel.app/',
    repo: 'https://github.com/Serignolli/ritual-esquecimento',
    featured: true,
    tags: ['React', 'TypeScript', 'Tailwind'],
    shot: '/shots/ritual-esquecimento.webp',
    description: {
      pt: 'Um ritual digital, meio místico, pra se despedir de uma lembrança que já não serve.',
      en: "A slightly mystical digital ritual to let go of a memory that no longer serves you.",
    },
    alt: {
      pt: 'Tela inicial do Ritual de Esquecimento, com um símbolo geométrico sobre céu estrelado.',
      en: 'Ritual of Forgetting start screen, with a geometric sigil over a starry sky.',
    },
  },
  {
    id: 'karaoke',
    name: 'Catálogo de Karaokê',
    category: 'lab',
    url: 'https://catalogo-karaoke.serignolli.com/',
    tags: [],
    shot: '/shots/karaoke.webp',
    description: {
      pt: 'Busca e sorteio de músicas no catálogo do aparelho de karaokê.',
      en: 'Search and shuffle songs from a karaoke machine catalog.',
    },
    alt: {
      pt: 'Catálogo de Karaokê sugerindo cinco músicas sorteadas, com código e trecho da letra.',
      en: 'Karaoke catalog suggesting five shuffled songs, with code and a lyric snippet.',
    },
  },
];
