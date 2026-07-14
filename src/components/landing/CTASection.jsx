import { Link } from 'react-router-dom';
import Button from '../common/Button.jsx';

export default function CTASection() {
  return (
    <section className="px-6 md:px-10 py-12">
      <div className="max-w-content mx-auto relative bg-primary rounded-3xl2 overflow-hidden p-10 md:p-16 flex flex-col items-center gap-6 text-center">
        <div className="absolute -top-32 -right-32 size-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 size-64 rounded-full bg-primary-soft/20 blur-3xl" />

        <h2 className="relative text-[32px] md:text-[48px] leading-[1.2] md:leading-[56px] font-bold tracking-[-0.96px] text-white">
          Siap untuk Mulai Berbagi?
        </h2>
        <p className="relative text-lg leading-7 text-white/90 max-w-2xl">
          Ribuan mahasiswa telah menemukan ketenangan mereka kembali. Jadilah bagian dari mereka
          hari ini.
        </p>

        <div className="relative flex flex-wrap justify-center gap-4 pt-2">
          <Button as={Link} to="/register" variant="onDark" size="lg">
            Daftar Sekarang
          </Button>
          <Button as="a" href="#bantuan" variant="outlineOnDark" size="lg">
            Hubungi Customer Support
          </Button>
        </div>
      </div>
    </section>
  );
}
