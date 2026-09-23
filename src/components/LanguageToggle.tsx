import { content } from '../data/content';
import { useLanguage, useT } from '../i18n/useT';

export function LanguageToggle() {
  const { lang, setLang } = useLanguage();
  const t = useT();

  return (
    <button
      type="button"
      className="lang-toggle"
      onClick={() => setLang(lang === 'pt' ? 'en' : 'pt')}
      aria-label={t(content.language.toggleLabel)}
      aria-pressed={lang === 'en'}
    >
      <span className={lang === 'pt' ? 'lang-toggle__on' : 'lang-toggle__off'}>PT</span>
      <span aria-hidden="true" className="lang-toggle__sep">
        /
      </span>
      <span className={lang === 'en' ? 'lang-toggle__on' : 'lang-toggle__off'}>EN</span>
    </button>
  );
}
