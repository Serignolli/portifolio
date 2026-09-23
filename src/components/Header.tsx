import { content } from '../data/content';
import { useT } from '../i18n/useT';

/**
 * Tags decorativas de código, puro enfeite: ficam fora da árvore de acessibilidade.
 * Abrem aqui e fecham no fim da página, depois do rodapé, como no documento de verdade.
 */
function CodeTag({ children, indent }: { children: string; indent?: boolean }) {
  return <span className={`code-tag${indent ? ' code-tag--indent' : ''}`}>{children}</span>;
}

export function Header() {
  const t = useT();
  const { first, last } = content.header.nameParts;

  return (
    <header className="hero">
      <div className="code-block" aria-hidden="true">
        <CodeTag>&lt;html&gt;</CodeTag>
        <CodeTag indent>&lt;body&gt;</CodeTag>
      </div>

      <div className="hero__content">
        <span className="code-tag" aria-hidden="true">
          &lt;h1&gt;
        </span>
        {/* O h1 carrega só o nome. */}
        <h1 className="hero__name">
          {first},
          <br />
          <span className="hero__name-accent">{last}</span>
        </h1>
        <span className="code-tag" aria-hidden="true">
          &lt;/h1&gt;
        </span>

        <span className="code-tag code-tag--spaced" aria-hidden="true">
          &lt;p&gt;
        </span>
        <p className="hero__tagline">{t(content.header.tagline)}</p>
        <span className="code-tag" aria-hidden="true">
          &lt;/p&gt;
        </span>

        <a className="hero__cta" href="#contact">
          {t(content.header.cta)}
        </a>
      </div>

      <p className="hero__scroll" aria-hidden="true">
        {t(content.header.scroll)}
      </p>
    </header>
  );
}
