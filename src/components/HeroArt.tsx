import { useCallback, useMemo, useState } from 'react';
import { content } from '../data/content';
import { artFor, type ArtPattern } from '../data/artPatterns';
import {
  bounds,
  f,
  GRAD_STOPS,
  gradCoords,
  opAt,
  polyPts,
  scaleAt,
  type MoireParams,
} from '../data/moire';
import { useT } from '../i18n/useT';
import { ArtModal } from './ArtModal';

/**
 * Enfeite do hero, em SVG inline: nenhuma imagem, nenhuma biblioteca.
 *
 * É um desenho do Moiré: uma forma repetida em torno do mesmo centro, cada cópia girando
 * um pouco mais, e a malha aparece onde as bordas se cruzam. O padrão do dia vem de
 * `data/artPatterns.ts` e a geometria de `data/moire.ts`, a mesma do gerador, pra o link
 * do modal abrir lá o mesmo desenho.
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
  const p = pattern.params;
  const box = bounds(p);
  const grad = gradCoords(p, box);

  return (
    <svg
      className="hero-art__svg"
      viewBox={`${box.x} ${box.y} ${box.w} ${box.h}`}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        {/* Lê os tokens de cor direto: mudou a paleta, mudou o desenho. */}
        <linearGradient
          id="hero-art-stroke"
          gradientUnits="userSpaceOnUse"
          x1={grad.x1}
          y1={grad.y1}
          x2={grad.x2}
          y2={grad.y2}
        >
          {pattern.palette.map((token, i) => (
            <stop key={token} offset={GRAD_STOPS[i]} stopColor={`var(${token})`} />
          ))}
        </linearGradient>
      </defs>
      <g
        fill="none"
        stroke="url(#hero-art-stroke)"
        strokeWidth={p.strokeW}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {Array.from({ length: p.n }, (_, i) => (
          <Copy key={i} p={p} i={i} />
        ))}
      </g>
    </svg>
  );
}

/** Uma cópia da forma. Mesmas contas do `shapeEl` do Moiré. */
function Copy({ p, i }: { p: MoireParams; i: number }) {
  const sc = scaleAt(p, i);
  const w = p.w * sc;
  const h = p.h * sc;
  const angle = f(p.step * i);
  const op = opAt(p, i);
  const common = {
    transform: angle ? `rotate(${angle})` : undefined,
    opacity: op < 1 ? f(op) : undefined,
  };

  switch (p.shape) {
    case 'ellipse':
      return <ellipse rx={f(w / 2)} ry={f(h / 2)} {...common} />;
    case 'circle':
      return <circle r={f(w / 2)} {...common} />;
    case 'rect':
      return (
        <rect
          x={f(-w / 2)}
          y={f(-h / 2)}
          width={f(w)}
          height={f(h)}
          rx={f(Math.min(p.radius * sc, w / 2, h / 2))}
          {...common}
        />
      );
    case 'line':
      return <line x1={f(-w / 2)} x2={f(w / 2)} {...common} />;
    default:
      return <polygon points={polyPts(p, sc)} {...common} />;
  }
}
