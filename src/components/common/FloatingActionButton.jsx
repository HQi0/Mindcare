import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';

const VARIANTS = {
  primary: 'bg-dash-primary hover:bg-dash-primary/90',
  danger: 'bg-dash-danger hover:bg-dash-danger/90',
};

/**
 * Tombol aksi mengambang di pojok kanan bawah. Reusable, tinggal
 * pass `to` dan `label` untuk konteks halaman yang berbeda.
 */
export default function FloatingActionButton({ to, label, icon: Icon = Plus, variant = 'primary' }) {
  return (
    <Link
      to={to}
      className={`group fixed bottom-8 right-8 z-40 flex items-center justify-center size-14 rounded-full text-white shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] transition-colors ${VARIANTS[variant]}`}
    >
      <Icon size={22} />
      {label && (
        <span className="absolute right-16 whitespace-nowrap bg-[#2d3133] text-white text-[13px] px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          {label}
        </span>
      )}
    </Link>
  );
}
