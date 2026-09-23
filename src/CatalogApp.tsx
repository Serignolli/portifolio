import { useMemo } from 'react';
import { CatalogRow } from './components/CatalogRow';
import { Footer } from './components/Footer';
import { ArrowIcon } from './components/icons';
import { LanguageToggle } from './components/LanguageToggle';
import { Sidebar, type NavItem } from './components/Sidebar';
import { content, curriculum } from './data/content';
import { CATEGORY_ORDER, projects, type Category } from './data/projects';
import { useT } from './i18n/useT';

/** Rótulos curtos pro trilho, que é estreito; a tarja da faixa usa o nome inteiro. */
const NAV_LABEL: Record<Category, NavItem['label']> = {
  tool: content.nav.tool,
  client: { pt: 'Para clientes', en: 'For clients' },
  lab: content.nav.lab,
};

const NAV_ITEMS: NavItem[] = [
  { href: '/', label: content.nav.home },
  ...CATEGORY_ORDER.map((category) => ({
    href: `#faixa-${category}`,
    label: NAV_LABEL[category],
  })),
  { href: curriculum.url, label: content.nav.curriculum },
  { href: '/#contact', label: content.nav.contact },
];

/**
 * A página /projetos: todos os projetos, em faixas por categoria. É o catálogo
 * completo; a principal mostra só os exemplos.
 */
export default function CatalogApp() {
  const t = useT();
  // Categoria sem projeto não vira faixa vazia.
  const rows = useMemo(
    () =>
      CATEGORY_ORDER.map((category) => ({
        category,
        projects: projects.filter((project) => project.category === category),
      })).filter((row) => row.projects.length > 0),
    [],
  );

  return (
    <div className="layout" id="top">
      <LanguageToggle />
      <Sidebar items={NAV_ITEMS} markHref="/" />
      <div className="page page--wide">
        <header className="hero hero--resume">
          <div className="code-block" aria-hidden="true">
            <span className="code-tag">&lt;html&gt;</span>
            <span className="code-tag code-tag--indent">&lt;body&gt;</span>
          </div>
          <div className="hero__content">
            <span className="code-tag" aria-hidden="true">
              &lt;h1&gt;
            </span>
            <h1 className="hero__name catalog__title">{t(content.catalog.heading)}</h1>
            <span className="code-tag" aria-hidden="true">
              &lt;/h1&gt;
            </span>
            <span className="code-tag code-tag--spaced" aria-hidden="true">
              &lt;p&gt;
            </span>
            <p className="hero__tagline">{t(content.catalog.intro)}</p>
            <span className="code-tag" aria-hidden="true">
              &lt;/p&gt;
            </span>
          </div>
        </header>

        <main>
          {rows.map((row) => (
            <CatalogRow key={row.category} category={row.category} projects={row.projects} />
          ))}

          <section className="section" aria-labelledby="catalog-cta-heading">
            <h2 id="catalog-cta-heading">{t(content.catalog.cta.heading)}</h2>
            <p>{t(content.catalog.cta.text)}</p>
            <a className="curriculum__link" href="/#contact">
              {t(content.catalog.cta.action)}
              <ArrowIcon size={16} />
            </a>
          </section>
        </main>
        <Footer />
        <div className="code-block code-block--end" aria-hidden="true">
          <span className="code-tag code-tag--indent">&lt;/body&gt;</span>
          <span className="code-tag">&lt;/html&gt;</span>
        </div>
      </div>
    </div>
  );
}
