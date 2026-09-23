import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { ArrowIcon } from './components/icons';
import { LanguageToggle } from './components/LanguageToggle';
import { ResumeHeader } from './components/ResumeHeader';
import { Sidebar, type NavItem } from './components/Sidebar';
import { CATALOG_URL, content } from './data/content';
import { CAREER_START, resumeContent, skills } from './data/resume';
import { useT } from './i18n/useT';

const NAV_ITEMS: NavItem[] = [
  { href: '/', label: resumeContent.nav.home },
  { href: CATALOG_URL, label: content.nav.all },
  { href: '#sobre', label: resumeContent.nav.about },
  { href: '#skills', label: resumeContent.nav.skills },
  { href: '#contact', label: resumeContent.nav.contact },
];

/**
 * A página /curriculo: quem é a pessoa por trás dos projetos. Mesmo layout, trilho e
 * estilo da principal, sem o enfeite do hero (o modal dele fala dos projetos, que
 * não estão aqui).
 */
export default function ResumeApp() {
  const t = useT();
  const years = new Date().getFullYear() - CAREER_START;

  return (
    <div className="layout" id="top">
      <LanguageToggle />
      <Sidebar items={NAV_ITEMS} markHref="/" />
      <div className="page">
        <ResumeHeader />
        <main>
          <section className="section" id="sobre" aria-labelledby="about-heading">
            <h2 id="about-heading">{t(resumeContent.about.heading)}</h2>
            <p className="group__subtitle">{t(resumeContent.about.subtitle)}</p>
            {resumeContent.about.paragraphs.map((paragraph) => (
              <p key={paragraph.en}>{t(paragraph)}</p>
            ))}
            <p className="highlight">
              <span className="highlight__number">{years}+</span>
              <span className="highlight__text">{t(resumeContent.about.experience)}</span>
            </p>
          </section>

          <section className="section" id="skills" aria-labelledby="skills-heading">
            <h2 id="skills-heading">{t(resumeContent.skills.heading)}</h2>
            <p className="group__subtitle">{t(resumeContent.skills.subtitle)}</p>
            <div className="skills">
              {skills.map((group) => (
                <div key={group.category.en} className="skills__group">
                  <h3 className="skills__heading">{t(group.category)}</h3>
                  <ul className="tags">
                    {group.skills.map((skill) => (
                      <li key={skill} className="tag">
                        {skill}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Ponte de volta pro lado de serviços: quem leu até aqui pode ser cliente. */}
          <section className="section" aria-labelledby="cta-heading">
            <h2 id="cta-heading">{t(resumeContent.cta.heading)}</h2>
            <p>{t(resumeContent.cta.text)}</p>
            <a className="curriculum__link" href="/#freelance">
              {t(resumeContent.cta.action)}
              <ArrowIcon size={16} />
            </a>
          </section>

          <Contact
            heading={t(resumeContent.contact.heading)}
            intro={t(resumeContent.contact.text)}
          />
        </main>
        <Footer />
        <div className="code-block code-block--end" aria-hidden="true">
          <span className="code-tag code-tag--indent">&lt;/body&gt;</span>
          <span className="code-tag">&lt;/html&gt;</span>
        </div>
      </div>
    </div>
  );
}
