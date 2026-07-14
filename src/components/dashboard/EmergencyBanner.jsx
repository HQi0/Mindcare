import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

export default function EmergencyBanner() {
  return (
    <div className="bg-dash-dangerBg border border-dash-danger/10 rounded-xl2 p-[17px] flex items-center justify-between gap-4 flex-wrap">
      <div className="flex items-center gap-4">
        <span className="flex items-center justify-center size-10 rounded-full bg-dash-danger/10 text-dash-danger shrink-0">
          <AlertTriangle size={18} />
        </span>
        <div>
          <h4 className="text-sm font-semibold text-dash-danger">Butuh bantuan segera?</h4>
          <p className="text-[13px] text-dash-muted">
            Tim krisis kami tersedia 24/7 untuk mendukungmu.
          </p>
        </div>
      </div>

      <Link
        to="/emergency-help"
        className="bg-dash-danger text-white text-sm font-semibold rounded-lg px-6 py-2 whitespace-nowrap"
      >
        Hubungi Sekarang
      </Link>
    </div>
  );
}
