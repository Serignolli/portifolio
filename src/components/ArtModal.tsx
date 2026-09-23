import { useEffect, useRef } from 'react';
import { artGenerator, content } from '../data/content';
import { artQuery, type TodayArt } from '../data/artPatterns';
import { useT } from '../i18n/useT';

type ArtModalProps = {
  art: TodayArt;
  open: boolean;
  onClose: () => void;
};

/**
 * Crédito do gerador do padrão. Usa o <dialog> nativo: foco preso, Esc fechando e
 * leitura correta por leitor de tela sem uma linha de JS pra isso.
 */
export function ArtModal({ art, open, onClose }: ArtModalProps) {
  const t = useT();
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  // O evento `close` do <dialog> é ouvido no DOM, não pelo onClose do React: o React
  // não o entrega de forma confiável (ele não borbulha), e sem isso o Esc fecharia o
  // modal deixando o estado em aberto, o que trava a segunda abertura.
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    dialog.addEventListener('close', onClose);
    return () => dialog.removeEventListener('close', onClose);
  }, [onClose]);

  const themeLabel = art.holiday ? content.artDates[art.holiday] : undefined;
  const hasLink = artGenerator.url !== '';

  // O nome vem da constante, nunca da URL da página.
  const [beforeName, afterName] = t(content.art.by).split('{name}');
  const [beforeTheme, afterTheme] = t(content.art.theme).split('{theme}');

  return (
    <dialog
      className="art-modal"
      ref={ref}
      // Clique no fundo fecha: o backdrop é o próprio <dialog>, então basta checar
      // se o alvo não foi nenhum filho.
      onClick={(event) => {
        if (event.target === ref.current) onClose();
      }}
      aria-labelledby="art-modal-heading"
    >
      <button
        type="button"
        className="art-modal__x"
        onClick={onClose}
        aria-label={t(content.art.close)}
      >
        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
          <path
            d="M6 6l12 12M18 6L6 18"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>

      <h2 id="art-modal-heading" className="art-modal__heading">
        {t(content.art.heading)}
      </h2>

      <p className="art-modal__text">
        {artGenerator.name ? (
          <>
            {beforeName}
            <strong>{artGenerator.name}</strong>
            {afterName}
          </>
        ) : (
          t(content.art.bySoon)
        )}
      </p>

      <p className="art-modal__text">
        {themeLabel ? (
          <>
            {beforeTheme}
            <strong>{t(themeLabel)}</strong>
            {afterTheme}
          </>
        ) : (
          t(content.art.daily)
        )}
      </p>

      {/* O único botão do corpo é o de ir pro gerador. Fechar é o × no canto.
          Sem URL ainda, nenhum botão aparece: o modal nunca aponta pra link que não
          existe, e volta a aparecer sozinho quando `artGenerator.url` for preenchida. */}
      {hasLink && (
        <a
          className="art-modal__visit"
          href={`${artGenerator.url}?${artQuery(art)}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {t(content.art.visit)}
        </a>
      )}

      <p className="art-modal__later">{t(content.art.later)}</p>
    </dialog>
  );
}
