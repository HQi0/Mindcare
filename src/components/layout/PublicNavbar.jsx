import { Link } from 'react-router-dom';
import { HeartHandshake, Menu, X } from 'lucide-react';
import { useState } from 'react';
import Button from '../common/Button.jsx';

const NAV_LINKS = [
  { label: 'Fitur', href: '#fitur' },
  { label: 'Cara Kerja', href: '#cara-kerja' },
  { label: 'Testimoni', href: '#testimoni' },
  { label: 'FAQ', href: '#faq' },
];

/**
 * Navbar publik untuk Landing Page. Ditambahkan karena desain Figma
 * tidak menyertakan navbar khusus di frame "Main Content Canvas" —
 * elemen ini diperlukan secara teknis agar pengguna bisa bernavigasi
 * dan mengakses Login/Register.
 */
export default function PublicNavbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-border">
      <div className="max-w-content mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-semibold text-ink">
          <span className="flex items-center justify-center size-8 rounded-lg bg-primary text-white">
            <HeartHandshake size={18} />
          </span>
          MindCare
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-ink-muted hover:text-primary transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Button as={Link} to="/login" variant="secondary" size="md" className="!px-6 !py-2.5">
            Masuk
          </Button>
          <Button as={Link} to="/register" variant="primary" size="md" className="!px-6 !py-2.5">
            Daftar
          </Button>
        </div>

        <button
          className="md:hidden text-ink"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Buka menu navigasi"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border px-6 py-4 flex flex-col gap-4 bg-white">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-ink-muted"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <div className="flex gap-3 pt-2">
            <Button as={Link} to="/login" variant="secondary" className="flex-1 !px-4">
              Masuk
            </Button>
            <Button as={Link} to="/register" variant="primary" className="flex-1 !px-4">
              Daftar
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
