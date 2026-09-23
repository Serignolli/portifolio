import { CATALOG_URL } from '../data/content';
import { RESUME_PDF, resumeContent } from '../data/resume';
import { useT } from '../i18n/useT';

/**
 * Hero do currículo. Mesmas tags decorativas do hero principal, que também fecham só
 * no fim da página; mais baixo que ele, porque aqui o conteúdo é o texto logo abaixo.
 */
export function ResumeHeader() {
  const t = useT();
  const { fullName, greeting, subtitle, download, viewWork } = resumeContent.header;
  // Nome completo em duas linhas: o sobrenome final leva o destaque, como no hero principal.
  const lastSpace = fullName.lastIndexOf(' ');
  const first = fullName.slice(0, lastSpace);
  const last = fullName.slice(lastSpace + 1);

  return (
    <header className="hero hero--resume">
      <div className="code-block" aria-hidden="true">
        <span className="code-tag">&lt;html&gt;</span>
        <span className="code-tag code-tag--indent">&lt;body&gt;</span>
      </div>

      <div className="hero__content">
        <p className="hero__greeting">{t(greeting)}</p>
        <span className="code-tag" aria-hidden="true">
          &lt;h1&gt;
        </span>
        <h1 className="hero__name">
          {first}
          <br />
          <span className="hero__name-accent">{last}</span>
        </h1>
        <span className="code-tag" aria-hidden="true">
          &lt;/h1&gt;
        </span>

        <span className="code-tag code-tag--spaced" aria-hidden="true">
          &lt;p&gt;
        </span>
        <p className="hero__tagline">{t(subtitle)}</p>
        <span className="code-tag" aria-hidden="true">
          &lt;/p&gt;
        </span>

        <div className="hero__actions">
          <a className="hero__cta" href={RESUME_PDF} download="Gabriel_Serignolli_Curriculo.pdf">
            {t(download)}
          </a>
          <a className="hero__cta hero__cta--ghost" href={CATALOG_URL}>
            {t(viewWork)}
          </a>
        </div>
      </div>
    </header>
  );
}
