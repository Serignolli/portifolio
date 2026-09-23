import { useCallback, useMemo, useState } from 'react';
import { content } from '../data/content';
import { artFor, strokePath, VIEWBOX, type ArtPattern } from '../data/artPatterns';
import { useT } from '../i18n/useT';
import { ArtModal } from './ArtModal';

/**
 * Enfeite do hero, em SVG inline: nenhuma imagem, nenhuma biblioteca.
 *
 * O traço é uma curva de dois pêndulos (harmonógrafa), uma roseta ou um coração,
 * conforme o padrão do dia. O mesmo traço é repetido com um atraso de fase mínimo, e é
 * o atraso que dá o efeito de fita líquida: as curvas quase se sobrepõem, se cruzam, e
 * o feixe parece escorrer. A forma inteira vem de `data/artPatterns.ts`.
 *
 * Clicar abre o modal que credita o gerador.
 */
export function HeroArt() {
  const t = useT();
  const [open, setOpen] = useState(false);

  // Uma vez por montagem: o padrão é do dia e não muda enquanto a aba está aberta.
  const today = useMemo(() => artFor(new Date()), []);
  // Identidade estável: o modal usa isso como ouvinte de evento do DOM.
  const close = useCallback(() => setOpen(false), []);

  return (
    <>
      <button
        type="button"
        className="hero-art"
        onClick={() => setOpen(true)}
        aria-label={t(content.art.openLabel)}
      >
        <Drawing pattern={today.pattern} />
      </button>
      <ArtModal art={today} open={open} onClose={close} />
    </>
  );
}

function Drawing({ pattern }: { pattern: ArtPattern }) {
  const [a, b, c, d] = pattern.palette;

  return (
    <svg
      className="hero-art__svg"
      viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`}
      width={VIEWBOX}
      height={VIEWBOX}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        {/* Lê os tokens de cor direto: mudou a paleta, mudou o desenho. */}
        <linearGradient id="hero-art-stroke" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={`var(${a})`} />
          <stop offset="45%" stopColor={`var(${b})`} />
          <stop offset="78%" stopColor={`var(${c})`} />
          <stop offset="100%" stopColor={`var(${d})`} />
        </linearGradient>
      </defs>
      <g
        fill="none"
        stroke="url(#hero-art-stroke)"
        strokeLinejoin="round"
        transform={`rotate(${pattern.rotation} ${VIEWBOX / 2} ${VIEWBOX / 2})`}
      >
        {Array.from({ length: pattern.strokes }, (_, i) => (
          <path
            key={i}
            d={strokePath(pattern, i)}
            // Traço mais grosso e opaco na frente do feixe, fino e apagado no fundo:
            // é o que dá profundidade sem precisar de sombra.
            strokeWidth={(1.5 - i * 0.09).toFixed(2)}
            opacity={(0.72 - i * 0.045).toFixed(2)}
          />
        ))}
      </g>
    </svg>
  );
}
