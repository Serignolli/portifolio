import { groupContent } from '../data/content';
import type { Category, Project } from '../data/projects';
import { useT } from '../i18n/useT';
import { ProjectCard } from './ProjectCard';

type ProjectGroupProps = {
  category: Category;
  projects: Project[];
  fromProject: Project | null;
  /** Id do único card que carrega a imagem com prioridade (o primeiro da página). */
  priorityId: string | null;
  /** 2 nas seções de topo, 3 dentro da seção de freelance. */
  level?: 2 | 3;
  /** Só existe quando o grupo é uma seção de primeiro nível. */
  sectionId?: string;
};

/**
 * Grupo vazio não renderiza nada: nem título, nem placeholder, nem "em breve".
 */
export function ProjectGroup({
  category,
  projects,
  fromProject,
  priorityId,
  level = 2,
  sectionId,
}: ProjectGroupProps) {
  const t = useT();

  if (projects.length === 0) return null;

  const { heading, subtitle } = groupContent[category];
  const headingId = `group-${category}-heading`;
  const Heading = level === 2 ? 'h2' : 'h3';
  const Wrapper = level === 2 ? 'section' : 'div';

  return (
    <Wrapper
      className={`section group group--${category}`}
      id={sectionId}
      aria-labelledby={headingId}
    >
      <Heading id={headingId} className="group__heading">
        {t(heading)}
      </Heading>
      {subtitle && <p className="group__subtitle">{t(subtitle)}</p>}
      <div className={`grid grid--${category}`}>
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            priority={project.id === priorityId}
            isFrom={project.id === fromProject?.id}
            nameLevel={level === 2 ? 3 : 4}
          />
        ))}
      </div>
    </Wrapper>
  );
}
