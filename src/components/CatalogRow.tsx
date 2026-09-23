import { useCallback, useEffect, useRef, useState } from 'react';
import { categoryLabel, content } from '../data/content';
import type { Category, Project } from '../data/projects';
import { useT } from '../i18n/useT';
import { ArrowIcon } from './icons';
import { CatalogCard } from './CatalogCard';

type CatalogRowProps = {
  category: Category;
  projects: Project[];
};

/**
 * Uma faixa do catálogo: o nome da categoria numa tarja e, embaixo, os projetos em
 * fila horizontal, como estante de loja de jogos. No celular a fila rola com o dedo;
 * no desktop as setas andam uma tela por vez e somem do caminho quando não há mais pra
 * onde ir.
 */
export function CatalogRow({ category, projects }: CatalogRowProps) {
  const t = useT();
  const listRef = useRef<HTMLUListElement>(null);
  const [edges, setEdges] = useState({ start: true, end: true });

  const measure = useCallback(() => {
    const list = listRef.current;
    if (!list) return;
    // Folga de 2px: rolagem fracionária nunca bate exato no fim.
    const start = list.scrollLeft <= 2;
    const end = list.scrollLeft + list.clientWidth >= list.scrollWidth - 2;
    // Mesmo objeto quando nada mudou: o onScroll dispara a cada pixel.
    setEdges((prev) => (prev.start === start && prev.end === end ? prev : { start, end }));
  }, []);

  // Remede quando a fila muda e quando a janela muda de tamanho.
  useEffect(() => {
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [measure, projects]);

  function page(direction: 1 | -1) {
    const list = listRef.current;
    if (!list) return;
    list.scrollBy({ left: direction * list.clientWidth * 0.9, behavior: 'smooth' });
  }

  const headingId = `row-${category}-heading`;
  const count = projects.length;
  const scrollable = !(edges.start && edges.end);

  return (
    <section className="catalog-row" id={`faixa-${category}`} aria-labelledby={headingId}>
      <div className="catalog-row__band">
        <h2 id={headingId} className="catalog-row__title">
          {t(categoryLabel[category])}
        </h2>
        <span className="catalog-row__count">
          {count} {t(count === 1 ? content.catalog.count.singular : content.catalog.count.plural)}
        </span>
        {scrollable && (
          <div className="catalog-row__arrows">
            <button
              type="button"
              className="catalog-row__arrow"
              onClick={() => page(-1)}
              disabled={edges.start}
              aria-label={t(content.catalog.prev)}
            >
              <ArrowIcon size={16} back />
            </button>
            <button
              type="button"
              className="catalog-row__arrow"
              onClick={() => page(1)}
              disabled={edges.end}
              aria-label={t(content.catalog.next)}
            >
              <ArrowIcon size={16} />
            </button>
          </div>
        )}
      </div>
      <ul className="catalog-row__list" ref={listRef} onScroll={measure}>
        {projects.map((project) => (
          <li key={project.id} className="catalog-row__item">
            <CatalogCard project={project} />
          </li>
        ))}
      </ul>
    </section>
  );
}
