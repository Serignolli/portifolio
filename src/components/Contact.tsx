import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { content, EMAIL, GITHUB_URL, LINKEDIN_URL } from '../data/content';
import { useT } from '../i18n/useT';

/** Se a Clipboard API não existir, o botão simplesmente não é renderizado. */
function clipboardAvailable() {
  return typeof navigator !== 'undefined' && typeof navigator.clipboard?.writeText === 'function';
}

type ContactProps = {
  /** Título da seção. Sem ele, o de contato da página principal. */
  heading?: string;
  /** Parágrafo opcional entre o título e o e-mail. */
  intro?: ReactNode;
};

export function Contact({ heading, intro }: ContactProps) {
  const t = useT();
  const [canCopy, setCanCopy] = useState(false);
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<number | undefined>(undefined);

  // Só depois da montagem: mantém o markup estável e evita tocar em navigator na avaliação do módulo.
  useEffect(() => {
    setCanCopy(clipboardAvailable());
    return () => window.clearTimeout(timeoutRef.current);
  }, []);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(EMAIL);
    } catch {
      // Falha pontual (permissão negada, documento sem foco). Não mostrar "copiado",
      // mas manter o botão: esconder de vez impediria a segunda tentativa, que
      // costuma funcionar. O e-mail ao lado continua selecionável de qualquer forma.
      return;
    }
    setCopied(true);
    window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <section className="section" id="contact" aria-labelledby="contact-heading">
      <h2 id="contact-heading">{heading ?? t(content.contact.heading)}</h2>
      {intro && <p>{intro}</p>}
      <div className="contact__row">
        <a className="contact__email" href={`mailto:${EMAIL}`}>
          {EMAIL}
        </a>
        {canCopy && (
          <button
            type="button"
            className="contact__copy"
            onClick={handleCopy}
            aria-label={t(content.contact.copyLabel)}
          >
            {copied ? t(content.contact.copied) : t(content.contact.copy)}
          </button>
        )}
      </div>
      <p className="contact__linkedin">
        <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">
          {t(content.contact.linkedin)}
        </a>{' '}
        <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
          {t(content.contact.github)}
        </a>
      </p>
    </section>
  );
}
