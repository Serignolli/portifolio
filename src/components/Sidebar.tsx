import { content, EMAIL, GITHUB_URL, LINKEDIN_URL } from '../data/content';
import type { Localized } from '../data/projects';
import { useT } from '../i18n/useT';
import { GithubIcon } from './icons';

/** `href` é âncora (`#tools`) para seção da mesma página ou caminho (`/curriculo`) para outra. */
export type NavItem = { href: string; label: Localized };

type SidebarProps = {
  items: NavItem[];
  /** Destino das iniciais: o topo da página atual, ou a principal quando estiver em outra. */
  markHref?: string;
};

/**
 * Trilho lateral: só existe no desktop (display: none no mobile), porque barra fixa
 * em tela pequena come área útil.
 */
export function Sidebar({ items, markHref = '#top' }: SidebarProps) {
  const t = useT();
  const { first, last } = content.header.nameParts;

  return (
    <div className="rail">
      <a className="rail__mark" href={markHref}>
        <span className="rail__initials">
          {first[0]}
          <span className="rail__initials-accent">{last[0]}</span>
        </span>
        <span className="rail__role">{t(content.header.role)}</span>
      </a>

      <nav className="rail__nav" aria-label={t(content.nav.label)}>
        {items.map((item) => (
          <a key={item.href} className="rail__link" href={item.href}>
            {t(item.label)}
          </a>
        ))}
      </nav>

      <div className="rail__social">
        <a
          className="rail__icon"
          href={LINKEDIN_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
            <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.05c.53-.95 1.83-1.95 3.77-1.95C21.6 8.75 23 10.9 23 14.1V21h-4v-6.1c0-1.45-.03-3.32-2.05-3.32-2.05 0-2.37 1.58-2.37 3.21V21h-4V9Z" />
          </svg>
        </a>
        <a
          className="rail__icon"
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
        >
          <GithubIcon size={18} />
        </a>
        <a className="rail__icon" href={`mailto:${EMAIL}`} aria-label={t(content.contact.heading)}>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
            <path d="M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm1.6 2L12 12.3 19.4 7H4.6ZM20 8.9l-7.4 5.3a1 1 0 0 1-1.2 0L4 8.9V17h16V8.9Z" />
          </svg>
        </a>
      </div>
    </div>
  );
}
