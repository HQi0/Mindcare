import { CheckCircle2, Zap, TrendingUp } from 'lucide-react';

const INFO_ITEMS = [
  {
    icon: CheckCircle2,
    title: 'Validasi Klinis',
    description:
      'Semua instrumen yang tersedia di perpustakaan MindCare telah divalidasi secara ilmiah dan digunakan secara luas dalam praktik klinis psikologi dan psikiatri.',
  },
  {
    icon: Zap,
    title: 'Hasil Instan',
    description:
      'Dapatkan interpretasi skor segera setelah menyelesaikan kuesioner, lengkap dengan rekomendasi langkah selanjutnya yang dipersonalisasi untuk Anda.',
  },
  {
    icon: TrendingUp,
    title: 'Lacak Kemajuan',
    description:
      'Hasil Anda disimpan dalam riwayat pribadi untuk memungkinkan Anda melihat perubahan kondisi kesehatan mental Anda dari waktu ke waktu.',
  },
];

export default function AboutAssessmentSection() {
  return (
    <section className="flex flex-col gap-6 pt-4">
      <h3 className="text-[22px] leading-8 font-semibold tracking-[-0.22px] text-dash-text">
        Tentang Penilaian Ini
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {INFO_ITEMS.map((item) => (
          <div key={item.title} className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <item.icon size={16} className="text-dash-primary" />
              <h4 className="text-sm font-semibold text-dash-primary">{item.title}</h4>
            </div>
            <p className="text-[13px] leading-[21px] text-dash-muted">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
