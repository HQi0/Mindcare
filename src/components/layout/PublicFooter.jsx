import { HeartHandshake } from 'lucide-react';

const FOOTER_LINKS = [
  {
    title: 'Produk',
    links: ['Fitur', 'Cara Kerja', 'Harga'],
  },
  {
    title: 'Dukungan',
    links: ['FAQ', 'Bantuan Darurat', 'Hubungi Kami'],
  },
  {
    title: 'Perusahaan',
    links: ['Tentang Kami', 'Kebijakan Privasi', 'Syarat Layanan'],
  },
];

/**
 * Footer publik untuk Landing Page. Ditambahkan karena alasan
 * teknis yang sama dengan PublicNavbar (tidak ada di frame Figma).
 */
export default function PublicFooter() {
  return (
    <footer className="bg-ink text-white/70">
      <div className="max-w-content mx-auto px-6 md:px-10 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-2 font-semibold text-white mb-3">
            <span className="flex items-center justify-center size-8 rounded-lg bg-primary text-white">
              <HeartHandshake size={18} />
            </span>
            MindCare
          </div>
          <p className="text-sm leading-6">
            Ruang aman, anonim, dan hemat data untuk kesehatan mental mahasiswa Indonesia.
          </p>
        </div>

        {FOOTER_LINKS.map((group) => (
          <div key={group.title}>
            <h4 className="text-white font-semibold text-sm mb-4">{group.title}</h4>
            <ul className="flex flex-col gap-3">
              {group.links.map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm hover:text-white transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10 py-6 text-center text-xs">
        © {new Date().getFullYear()} MindCare. Seluruh hak cipta dilindungi.
      </div>
    </footer>
  );
}
