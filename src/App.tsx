import { useMemo } from 'react';
import { AllProjectsCta } from './components/AllProjectsCta';
import { Contact } from './components/Contact';
import { Curriculum } from './components/Curriculum';
import { Footer } from './components/Footer';
import { Freelance } from './components/Freelance';
import { FromBanner } from './components/FromBanner';
import { Header } from './components/Header';
import { HeroArt } from './components/HeroArt';
import { LanguageToggle } from './components/LanguageToggle';
import { ProjectGroup } from './components/ProjectGroup';
import { Sidebar, type NavItem } from './components/Sidebar';
import { CATALOG_URL, content, curriculum } from './data/content';
import { projects, type Category, type Project } from './data/projects';

/** Âncoras das seções, usadas pelo trilho lateral. */
const SECTION_ID: Record<Category, string> = {
  tool: 'tools',
  lab: 'lab',
  client: 'freelance',
};

/** Ordem das seções na principal: o freelance fica entre as ferramentas e os jogos. */
const HOME_ORDER: Category[] = ['tool', 'client', 'lab'];

/**
 * Lê `?from=` e valida contra os ids conhecidos. Um valor desconhecido é ignorado
 * por completo, o valor cru nunca chega a ser renderizado.
 */
function readFromProject(): Project | null {
  const raw = new URLSearchParams(window.location.search).get('from');
  if (!raw) return null;
  return projects.find((project) => project.id === raw) ?? null;
}

/**
 * A principal mostra só os exemplos (`featured`) de cada categoria; o resto fica no
 * catálogo. O projeto de origem do `?from=` entra sempre, na primeira posição do
 * próprio grupo, mesmo que não seja um dos exemplos.
 */
function groupProjects(from: Project | null): Record<Category, Project[]> {
  const groups = {} as Record<Category, Project[]>;
  for (const category of HOME_ORDER) {
    const list = projects.filter(
      (project) => project.category === category && project.featured && project.id !== from?.id,
    );
    groups[category] = from?.category === category ? [from, ...list] : list;
  }
  return groups;
}

export default function App() {
  const fromProject = useMemo(readFromProject, []);
  const groups = useMemo(() => groupProjects(fromProject), [fromProject]);

  // Só a primeira imagem da página carrega com prioridade.
  const priorityId = useMemo(() => {
    const first = HOME_ORDER.map((category) => groups[category][0]).find(Boolean);
    return first?.id ?? null;
  }, [groups]);

  // O trilho não anuncia seção que não existe: grupo vazio não vira link.
  // Catálogo e currículo são outras páginas, então o link leva direto até elas.
  const navItems = useMemo<NavItem[]>(() => {
    const items: NavItem[] = [];
    if (groups.tool.length) items.push({ href: `#${SECTION_ID.tool}`, label: content.nav.tool });
    items.push({ href: '#freelance', label: content.nav.freelance });
    if (groups.lab.length) items.push({ href: `#${SECTION_ID.lab}`, label: content.nav.lab });
    items.push({ href: CATALOG_URL, label: content.nav.all });
    items.push({ href: curriculum.url, label: content.nav.curriculum });
    items.push({ href: '#contact', label: content.nav.contact });
    return items;
  }, [groups]);

  return (
    <div className="layout" id="top">
      {/* Enfeite e toggle ficam no nível do layout, não dentro da coluna de conteúdo:
          é o que deixa os dois alcançarem a borda direita da tela. */}
      <LanguageToggle />
      <Sidebar items={navItems} />
      <div className="page">
        <Header />
        <main>
          {/* O banner fica no topo da área de projetos, qualquer que seja o grupo de origem. */}
          {fromProject && <FromBanner project={fromProject} />}
          <ProjectGroup
            category="tool"
            projects={groups.tool}
            fromProject={fromProject}
            priorityId={priorityId}
            sectionId={SECTION_ID.tool}
          />
          <Freelance
            examples={groups.client}
            fromProject={fromProject}
            priorityId={priorityId}
          />
          <ProjectGroup
            category="lab"
            projects={groups.lab}
            fromProject={fromProject}
            priorityId={priorityId}
            sectionId={SECTION_ID.lab}
          />
          <AllProjectsCta />
          <Curriculum />
          <Contact />
        </main>
        <Footer />
        {/* Fecha o que o hero abriu, no fim do documento de verdade. */}
        <div className="code-block code-block--end" aria-hidden="true">
          <span className="code-tag code-tag--indent">&lt;/body&gt;</span>
          <span className="code-tag">&lt;/html&gt;</span>
        </div>
      </div>
      {/* Por último no DOM: é enfeite, não deve ser a primeira parada do Tab.
          O z-index negativo mantém ele atrás do conteúdo de qualquer jeito. */}
      <HeroArt />
    </div>
  );
}
