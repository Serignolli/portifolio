import { content, curriculum } from '../data/content';
import { useT } from '../i18n/useT';

/**
 * Ponte para o currículo, que vive no projeto de portfólio.
 *
 * O destino sai de `curriculum.url` em content.ts: se for endereço externo, abre em aba
 * nova com o rel de segurança; se for caminho do mesmo domínio, navega na própria aba.
 * Assim os dois projetos podem ser unidos sem tocar em JSX.
 */
export function Curriculum() {
  const t = useT();
  const external = /^https?:/i.test(curriculum.url);

  return (
    <section className="section" id="curriculo" aria-labelledby="curriculum-heading">
      <h2 id="curriculum-heading">{t(content.curriculum.heading)}</h2>
      <p>{t(content.curriculum.text)}</p>
      <a
        className="curriculum__link"
        href={curriculum.url}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {t(content.curriculum.action)}
        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
          <path
            d="M5 12h13M13 6l6 6-6 6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </a>
    </section>
  );
}
