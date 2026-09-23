import { content } from '../data/content';
import type { Project } from '../data/projects';
import { useT } from '../i18n/useT';

/**
 * O nome vem sempre do objeto Project validado, nunca do valor cru da query string.
 */
export function FromBanner({ project }: { project: Project }) {
  const t = useT();
  const [before, after] = t(content.projects.fromBanner).split('{name}');

  return (
    <p className="from-banner">
      {before}
      <strong>{project.name}</strong>
      {after}
    </p>
  );
}
