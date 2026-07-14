import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar.jsx';
import DashboardTopbar from '../components/layout/DashboardTopbar.jsx';

/**
 * Layout bersama untuk seluruh halaman setelah login (Dashboard,
 * Pelacak Mood, Sumber Daya, dst). Sidebar & Topbar fixed, konten
 * discroll di area kanan dengan padding menyesuaikan lebar sidebar.
 */
export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-[#f7f9fb]">
      <Sidebar />
      <DashboardTopbar />
      <main className="pl-[220px] pt-14">
        <div className="max-w-[1152px] mx-auto p-6 flex flex-col gap-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
