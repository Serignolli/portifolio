import { content } from '../data/content';
import { projectHref, type Project } from '../data/projects';
import { useT } from '../i18n/useT';

/** Prints são 16:10. Largura/altura explícitas + aspect-ratio no CSS = zero layout shift. */
const SHOT_WIDTH = 1200;
const SHOT_HEIGHT = 750;

type ProjectCardProps = {
  project: Project;
  /** Só o primeiro card da página carrega com prioridade; o resto é lazy. */
  priority: boolean;
  isFrom: boolean;
  /** Um nível abaixo do título do grupo, pra não pular degrau na hierarquia. */
  nameLevel: 3 | 4;
};

export function ProjectCard({ project, priority, isFrom, nameLevel }: ProjectCardProps) {
  const t = useT();
  const Name = nameLevel === 3 ? 'h3' : 'h4';
  const href = projectHref(project);
  const isSoon = !href;

  const shot = (
    <img
      className="card__shot"
      src={project.shot}
      alt={t(project.alt)}
      width={SHOT_WIDTH}
      height={SHOT_HEIGHT}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : undefined}
      decoding="async"
    />
  );

  const body = (
    <div className="card__body">
      <Name className="card__name">
        {project.name}
        {isSoon && <span className="badge badge--soon">{t(content.badges.soon)}</span>}
      </Name>
      <p className="card__description">{t(project.description)}</p>
    </div>
  );

  // A categoria escolhe o formato do card: tool grande, lab compacto, client horizontal.
  const className = [
    'card',
    `card--${project.category}`,
    isFrom ? 'card--from' : '',
    isSoon ? 'card--soon' : '',
  ]
    .filter(Boolean)
    .join(' ');

  // Sem URL não existe destino: vira <article>, não <a>.
  if (isSoon) {
    return (
      <article className={className}>
        {isFrom && <span className="badge badge--from">{t(content.badges.from)}</span>}
        {shot}
        {body}
      </article>
    );
  }

  return (
    <a className={className} href={href} target="_blank" rel="noopener noreferrer">
      {isFrom && <span className="badge badge--from">{t(content.badges.from)}</span>}
      {shot}
      {body}
    </a>
  );
}
