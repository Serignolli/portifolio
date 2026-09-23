import { CATALOG_URL, content } from '../data/content';
import { projects } from '../data/projects';
import { useT } from '../i18n/useT';
import { ArrowIcon } from './icons';

/** Chamada da principal para o catálogo: os exemplos acabaram, o resto está lá. */
export function AllProjectsCta() {
  const t = useT();
  const { heading, text, action } = content.allProjects;

  return (
    <section className="section all-cta" aria-labelledby="all-cta-heading">
      <h2 id="all-cta-heading">{t(heading)}</h2>
      <p>{t(text)}</p>
      <a className="curriculum__link" href={CATALOG_URL}>
        {t(action)}
        <span className="all-cta__count">{projects.length}</span>
        <ArrowIcon size={16} />
      </a>
    </section>
  );
}
