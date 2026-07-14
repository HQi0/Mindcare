import { Search, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DashboardTopbar() {
  return (
    <header className="fixed top-0 left-[220px] right-0 h-14 bg-dash-sidebar border-b border-dash-border flex items-center justify-between px-6 z-30">
      <div className="flex-1 max-w-[256px]">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-dash-muted" />
          <input
            type="text"
            placeholder="Cari sumber daya..."
            className="w-full bg-white rounded-full pl-10 pr-4 py-1.5 text-[13px] text-dash-muted placeholder:text-dash-muted border border-transparent focus:outline-none focus:border-dash-primary/30"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Link
          to="/emergency-help"
          className="bg-dash-primary text-white text-sm font-semibold rounded-full px-4 py-1.5"
        >
          Bantuan Darurat
        </Link>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="relative p-2 rounded-full hover:bg-dash-border/40 transition-colors"
            aria-label="Notifikasi"
          >
            <Bell size={16} className="text-dash-muted" />
            <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-dash-danger" />
          </button>

          <Link
            to="/profile"
            className="size-8 rounded-full bg-dash-primary/10 text-dash-primary flex items-center justify-center text-xs font-bold border border-dash-border"
          >
            AD
          </Link>
        </div>
      </div>
    </header>
  );
}
