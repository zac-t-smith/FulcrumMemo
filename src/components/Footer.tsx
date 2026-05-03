import { Link } from 'react-router-dom';

/**
 * Sitewide footer — Phase 4E-3 cream / Economist treatment.
 * Hairline rules over cream paper, Georgia serif brand line, small-caps
 * Helvetica nav.
 */
const Footer = () => {
  return (
    <footer
      className="py-10"
      style={{ background: '#f7f5f0', borderTop: '1px solid #d9d4c7' }}
    >
      <div className="max-w-[1080px] mx-auto px-7">
        <div className="flex flex-col md:flex-row items-baseline justify-between gap-6">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-1.5">
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: '#c8102e' }}
                aria-hidden="true"
              />
              <span
                className="text-[14px] font-bold tracking-tight text-[#1a1a1a]"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                The Fulcrum Memo
              </span>
            </Link>
            <p
              className="text-[11px] text-[#4a4a4a] tracking-[0.04em]"
              style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif' }}
            >
              Independent credit research · Restructuring & special situations
            </p>
          </div>

          <div
            className="flex items-center gap-4 text-[10.5px] tracking-[0.18em] uppercase font-semibold"
            style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif' }}
          >
            <Link to="/memos" className="text-[#4a4a4a] hover:text-[#1a1a1a] transition-colors">
              Memos
            </Link>
            <span className="text-[#c8102e]" aria-hidden="true">●</span>
            <Link to="/fulcrum-index" className="text-[#4a4a4a] hover:text-[#1a1a1a] transition-colors">
              Fulcrum Index
            </Link>
            <span className="text-[#c8102e]" aria-hidden="true">●</span>
            <a
              href="mailto:zac.t.smith@outlook.com"
              className="text-[#4a4a4a] hover:text-[#c8102e] transition-colors"
            >
              Contact
            </a>
          </div>
        </div>

        <div
          className="mt-6 pt-4 text-center"
          style={{ borderTop: '1px solid #d9d4c7' }}
        >
          <p
            className="text-[10.5px] text-[#4a4a4a] tracking-[0.06em] italic"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            © {new Date().getFullYear()} Zachary Smith
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
