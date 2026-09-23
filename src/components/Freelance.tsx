import { content } from '../data/content';
import type { Project } from '../data/projects';
import { useT } from '../i18n/useT';
import { ProjectGroup } from './ProjectGroup';

type FreelanceProps = {
  /** Projetos `client`, a prova de que sistemas sob encomenda ficam de pé. */
  examples: Project[];
  fromProject: Project | null;
  priorityId: string | null;
};

export function Freelance({ examples, fromProject, priorityId }: FreelanceProps) {
  const t = useT();

  return (
    <section className="section" id="freelance" aria-labelledby="freelance-heading">
      <h2 id="freelance-heading">{t(content.freelance.heading)}</h2>
      <p>{t(content.freelance.intro)}</p>
      <p>{t(content.freelance.casesIntro)}</p>
      <ul className="cases">
        {content.freelance.cases.map((item) => (
          <li key={item.en}>{t(item)}</li>
        ))}
      </ul>
      {/* Sem projetos `client` no array, o bloco inteiro some. */}
      <ProjectGroup
        category="client"
        projects={examples}
        fromProject={fromProject}
        priorityId={priorityId}
        level={3}
      />
      <p>{t(content.freelance.closing)}</p>
      <p>{t(content.freelance.pricing)}</p>
    </section>
  );
}
