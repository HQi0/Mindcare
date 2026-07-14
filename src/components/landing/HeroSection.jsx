import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Button from '../common/Button.jsx';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden px-6 md:px-10 py-16 md:py-32">
      <div className="max-w-content mx-auto px-6 flex flex-col md:flex-row gap-12 items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex-1 flex flex-col items-start gap-6 min-w-0"
        >
          <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary-soft text-[#004084] text-sm font-medium tracking-[0.14px]">
            #MentalHealthMatters
          </span>

          <h1 className="text-[36px] md:text-[48px] leading-[1.15] md:leading-[60px] font-bold tracking-[-0.96px] text-ink">
            Ruang Aman untuk
            <br />
            Kesehatan Mental
            <br />
            Mahasiswa
          </h1>

          <p className="text-lg leading-7 text-ink-muted max-w-xl">
            Akses dukungan profesional secara anonim. Privasi Anda adalah prioritas utama kami
            dalam membantu perjalanan kesejahteraan mental Anda.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <Button as={Link} to="/register" variant="primary" size="lg">
              Mulai Sekarang
            </Button>
            <Button as="a" href="#fitur" variant="secondary" size="lg">
              Pelajari Lebih Lanjut
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="flex-1 relative flex items-center justify-center w-full max-w-[512px]"
        >
          <div className="absolute inset-[-10%] rounded-full bg-primary-light/10 blur-3xl" />
          <div className="relative w-full aspect-[512/343] rounded-2xl overflow-hidden shadow-[0px_25px_25px_0px_rgba(0,0,0,0.15)] bg-primary-soft/40 flex items-center justify-center">
            {/* Placeholder ilustrasi — ganti dengan asset akhir dari tim desain */}
            <span className="text-primary/40 text-sm">Ilustrasi Hero</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
