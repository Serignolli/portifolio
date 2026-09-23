import { content } from '../data/content';
import { projectHref, type Project } from '../data/projects';
import { useT } from '../i18n/useT';
import { GithubIcon } from './icons';

/** Prints são 16:10, como no resto do site. */
const SHOT_WIDTH = 1200;
const SHOT_HEIGHT = 750;

/**
 * Card do catálogo. O card inteiro abre o projeto, e quando há site e repositório o
 * código ganha um link próprio. Link dentro de link não é HTML válido, então o card é
 * um <article> e o link do nome se estica por cima dele (`::after`); o do código fica
 * acima dessa camada.
 */
export function CatalogCard({ project }: { project: Project }) {
  const t = useT();
  const href = projectHref(project);
  // Só vale um link separado pro código se o card já não levar até ele.
  const repoLink = project.repo && project.repo !== href ? project.repo : null;

  return (
    <article className={`card catalog-card${href ? '' : ' card--soon'}`}>
      <img
        className="card__shot"
        src={project.shot}
        alt={t(project.alt)}
        width={SHOT_WIDTH}
        height={SHOT_HEIGHT}
        loading="lazy"
        decoding="async"
      />
      <div className="card__body">
        <h3 className="card__name">
          {href ? (
            <a
              className="catalog-card__link"
              href={href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {project.name}
            </a>
          ) : (
            project.name
          )}
          {!href && <span className="badge badge--soon">{t(content.badges.soon)}</span>}
        </h3>
        <p className="card__description">{t(project.description)}</p>
        {project.tags.length > 0 && (
          <ul className="tags">
            {project.tags.map((tag) => (
              <li key={tag} className="tag">
                {tag}
              </li>
            ))}
          </ul>
        )}
        {repoLink && (
          <a
            className="catalog-card__repo"
            href={repoLink}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${t(content.catalog.repo)}: ${project.name}`}
          >
            <GithubIcon size={14} />
            {t(content.catalog.repo)}
          </a>
        )}
      </div>
    </article>
  );
}
