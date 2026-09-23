import { content } from '../data/content';

export function Footer() {
  return (
    <div className="footer-block">
      <span className="code-tag code-tag--indent-2" aria-hidden="true">
        &lt;footer&gt;
      </span>
      <footer className="footer">
        <p>
          © {new Date().getFullYear()} {content.header.name}
        </p>
      </footer>
      <span className="code-tag code-tag--indent-2" aria-hidden="true">
        &lt;/footer&gt;
      </span>
    </div>
  );
}
