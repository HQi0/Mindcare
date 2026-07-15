import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  AlertTriangle, 
  PhoneCall, 
  ShieldAlert, 
  MessageSquareHeart, 
  Wind, 
  ShieldCheck, 
  Heart, 
  MapPin, 
  Navigation, 
  Phone, 
  Play, 
  Pause, 
  CheckCircle2 
} from 'lucide-react';

const COLOR_BG = { red: 'bg-[#fef2f2]', blue: 'bg-[#eff6ff]', purple: 'bg-[#faf5ff]' };
const COLOR_ICON = { red: PhoneCall, blue: ShieldAlert, purple: MessageSquareHeart };

export function EmergencyBannerHeader() {
  return (
    <div className="bg-[#fef2f2] border border-dash-danger/20 rounded-xl p-6 flex items-center justify-between shadow-sm">
      <div className="max-w-2xl flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <AlertTriangle size={18} className="text-dash-danger" />
          <h2 className="text-[22px] leading-8 font-semibold tracking-[-0.22px] text-dash-text">Anda Tidak Sendirian.</h2>
        </div>
        <p className="text-[15px] text-dash-muted">
          Jika Anda merasa dalam bahaya segera atau membutuhkan bantuan mendesak, gunakan tombol panggil cepat di bawah
          ini. Kami di sini untuk mendukung Anda.
        </p>
      </div>
      <a
        href="tel:119"
        className="flex items-center gap-3 rounded-lg bg-dash-danger hover:bg-red-700 px-8 py-4 text-white font-bold shadow-lg shrink-0 transition-colors"
      >
        <PhoneCall size={18} /> Hubungi 119
      </a>
    </div>
  );
}

export function QuickCallList({ contacts }) {
  if (!contacts?.length) return null;
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm font-semibold tracking-wider text-dash-linkMuted uppercase px-1">Kontak Cepat</p>
      {contacts.map((c) => {
        const Icon = COLOR_ICON[c.color] || PhoneCall;
        const isChat = c.phone.toLowerCase() === 'chat';

        return (
          <div key={c.id} className="bg-white border border-dash-border rounded-xl p-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-4">
              <span className={`size-10 rounded-full flex items-center justify-center shrink-0 ${COLOR_BG[c.color]}`}>
                <Icon size={18} className="text-dash-danger" />
              </span>
              <div>
                <p className="text-base font-bold text-dash-text">{c.name}</p>
                <p className="text-xs text-dash-linkMuted">{c.note}</p>
              </div>
            </div>
            {isChat ? (
              <Link
                to="/counselor-chat"
                className="rounded-lg bg-dash-primary hover:bg-primary-light text-white text-xs font-bold px-4 py-2 transition-colors"
              >
                Chat
              </Link>
            ) : (
              <a
                href={`tel:${c.phone.replace(/[^0-9]/g, '')}`}
                className="rounded-lg bg-[#eceef0] hover:bg-dash-border/40 text-dash-text text-xs font-bold px-4 py-2 transition-colors flex items-center gap-1"
              >
                <Phone size={12} /> {c.phone}
              </a>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function BreathingExercise() {
  const [stage, setStage] = useState('tarik'); // 'tarik', 'tahan', 'hembus'
  const [seconds, setSeconds] = useState(4);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (!isActive) return;
    const interval = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isActive]);

  useEffect(() => {
    if (seconds <= 0) {
      setSeconds(4);
      setStage((curr) => {
        if (curr === 'tarik') return 'tahan';
        if (curr === 'tahan') return 'hembus';
        return 'tarik';
      });
    }
  }, [seconds]);

  const stageConfig = {
    tarik: { 
      label: 'Tarik Napas', 
      desc: 'Hirup udara melalui hidung secara perlahan', 
      style: 'scale-110 bg-dash-primary/10 border-dash-primary/40 text-dash-primary' 
    },
    tahan: { 
      label: 'Tahan Napas', 
      desc: 'Tahan udara di paru-paru Anda', 
      style: 'scale-110 bg-dash-amber/10 border-dash-amber/40 text-dash-amber shadow-lg shadow-dash-amber/10' 
    },
    hembus: { 
      label: 'Hembuskan', 
      desc: 'Keluarkan udara perlahan dari mulut', 
      style: 'scale-90 bg-dash-success/10 border-dash-success/40 text-dash-success' 
    }
  };

  const config = stageConfig[stage];

  return (
    <div className="bg-white border border-dash-border rounded-xl p-8 flex flex-col items-center gap-6 relative overflow-hidden shadow-sm h-full justify-between">
      <div className="self-start flex flex-col gap-1 w-full">
        <div className="flex items-center justify-between">
          <p className="flex items-center gap-2 text-sm font-semibold tracking-widest text-dash-primary uppercase">
            <Wind size={16} /> Latihan Pernapasan (4-4-4)
          </p>
          <button
            type="button"
            onClick={() => setIsActive(!isActive)}
            className="text-xs font-semibold text-dash-primary flex items-center gap-1 border border-auth-card hover:bg-surface-tint rounded-lg px-2.5 py-1 transition-colors"
          >
            {isActive ? <><Pause size={12} /> Jeda</> : <><Play size={12} /> Mulai</>}
          </button>
        </div>
        <p className="text-[13px] text-dash-linkMuted">{t => 'Ikuti lingkaran untuk menenangkan diri'}</p>
      </div>

      <div className="flex flex-col items-center gap-4 my-4">
        <div className={`size-44 rounded-full border-4 flex flex-col items-center justify-center transition-all duration-1000 ease-in-out ${config.style}`}>
          <span className="text-sm font-bold uppercase tracking-wider">{config.label}</span>
          <span className="text-3xl font-extrabold mt-1">{seconds}</span>
        </div>
        <p className="text-xs text-dash-muted text-center h-4 max-w-sm px-4 italic">{config.desc}</p>
      </div>

      <div className="flex gap-8 border-t border-dash-border/50 pt-4 w-full justify-center">
        {[
          { step: 'Langkah 1', label: '4 Detik Tarik', active: stage === 'tarik' },
          { step: 'Langkah 2', label: '4 Detik Tahan', active: stage === 'tahan' },
          { step: 'Langkah 3', label: '4 Detik Buang', active: stage === 'hembus' },
        ].map((item) => (
          <div key={item.step} className={`flex flex-col items-center gap-0.5 transition-opacity ${item.active ? 'opacity-100' : 'opacity-40'}`}>
            <span className="text-[10px] font-bold text-dash-linkMuted uppercase">{item.step}</span>
            <span className="text-xs font-bold text-dash-text">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function GroundingExercise({ steps }) {
  const [completed, setCompleted] = useState([]);

  const handleToggle = (label) => {
    setCompleted((prev) => 
      prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label]
    );
  };

  if (!steps?.length) return null;

  return (
    <div className="bg-white border border-dash-border rounded-xl p-6 flex flex-col gap-6 shadow-sm">
      <div className="flex justify-between items-center">
        <p className="flex items-center gap-3 text-sm font-semibold text-dash-text">
          <Heart size={18} className="text-dash-danger" /> Metode Grounding 5-4-3-2-1
        </p>
        <span className="text-xs text-dash-muted">
          Klik kotak untuk menandai selesai
        </span>
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        {steps.map((s) => {
          const isDone = completed.includes(s.label);
          return (
            <button
              key={s.label}
              type="button"
              onClick={() => handleToggle(s.label)}
              className={`flex-1 border rounded-lg p-4 flex flex-col gap-1 text-center transition-all cursor-pointer select-none ${
                isDone 
                  ? 'border-dash-success bg-green-50/50 shadow-sm opacity-90 scale-98' 
                  : 'border-dash-border bg-white hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-center gap-1.5 self-center">
                <span className={`text-[22px] font-extrabold tracking-tight ${isDone ? 'text-dash-success' : 'text-dash-primary'}`}>
                  {s.count}
                </span>
                {isDone && <CheckCircle2 size={16} className="text-dash-success" />}
              </div>
              <span className="text-[10px] font-bold uppercase text-dash-linkMuted">{s.label}</span>
              <span className="text-xs text-dash-text leading-tight">{s.description}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function SafetyTipsCard({ tips }) {
  if (!tips?.length) return null;
  return (
    <div className="bg-white border border-dash-border rounded-xl p-6 flex flex-col gap-3 shadow-sm">
      <p className="flex items-center gap-2 text-sm font-semibold text-dash-text">
        <ShieldCheck size={16} className="text-dash-success" /> Langkah Keselamatan
      </p>
      <ul className="flex flex-col gap-2">
        {tips.map((tip) => (
          <li key={tip} className="flex gap-2 text-[13px] text-dash-muted">
            <span className="text-dash-muted">•</span> {tip}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function AffirmationsCard({ affirmations }) {
  if (!affirmations?.length) return null;
  return (
    <div className="bg-white border border-dash-border rounded-xl p-6 flex flex-col gap-3 shadow-sm">
      <p className="flex items-center gap-2 text-sm font-semibold text-dash-text">
        <MessageSquareHeart size={16} className="text-dash-primary" /> Afirmasi Menenangkan
      </p>
      <ul className="flex flex-col gap-2">
        {affirmations.map((a) => (
          <li key={a} className="text-[13px] italic text-dash-muted leading-relaxed">&ldquo;{a}&rdquo;</li>
        ))}
      </ul>
    </div>
  );
}

export function ProfessionalHelpCard() {
  return (
    <div className="rounded-xl p-6 flex flex-col gap-3 border border-dash-primary/20 bg-gradient-to-br from-dash-primary/5 to-white shadow-sm">
      <p className="flex items-center gap-2 text-sm font-semibold text-dash-primary">
        <MessageSquareHeart size={16} /> Bantuan Profesional
      </p>
      <p className="text-[13px] text-dash-muted leading-relaxed">
        Butuh teman bicara non-darurat? Konselor kami tersedia untuk janji temu segera.
      </p>
      <Link
        to="/schedule-session"
        className="rounded-lg bg-dash-primary hover:bg-primary-light text-white text-[11px] font-bold uppercase tracking-wide text-center py-2 transition-colors"
      >
        Jadwalkan Konsultasi
      </Link>
    </div>
  );
}

const CANDIDATE_HOSPITALS = [
  {
    name: 'RSUP Persahabatan',
    address: 'Jl. Persahabatan Raya No. 1, Rawamangun, Jakarta Timur',
    phone: '(021) 4891708',
    lat: -6.2023,
    lng: 106.8856
  },
  {
    name: 'RS Universitas Indonesia',
    address: 'Jl. Prof. Dr. Bahder Djohan, Depok',
    phone: '(021) 50829292',
    lat: -6.3686,
    lng: 106.8286
  },
  {
    name: 'RSUD Budhi Asih',
    address: 'Jl. Raya Cawang No. 272, Kramat Jati, Jakarta Timur',
    phone: '(021) 8090282',
    lat: -6.2505,
    lng: 106.8631
  },
  {
    name: 'RSCM (Rumah Sakit Cipto Mangunkusumo)',
    address: 'Jl. Diponegoro No. 71, Senen, Jakarta Pusat',
    phone: '(021) 1500135',
    lat: -6.1974,
    lng: 106.8488
  },
  {
    name: 'RS Fatmawati',
    address: 'Jl. RS. Fatmawati Raya, Cilandak, Jakarta Selatan',
    phone: '(021) 7501524',
    lat: -6.2949,
    lng: 106.7971
  }
];

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in km
}

export function NearestHospitalCard({ hospital: defaultHospital }) {
  const [currentHospital, setCurrentHospital] = useState(defaultHospital);
  const [userCoords, setUserCoords] = useState(null);

  useEffect(() => {
    if (defaultHospital) {
      setCurrentHospital(defaultHospital);
    }
  }, [defaultHospital]);

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserCoords({ latitude, longitude });

        let closest = null;
        let minDistance = Infinity;

        CANDIDATE_HOSPITALS.forEach((h) => {
          const dist = calculateDistance(latitude, longitude, h.lat, h.lng);
          if (dist < minDistance) {
            minDistance = dist;
            closest = h;
          }
        });

        if (closest) {
          setCurrentHospital({
            ...closest,
            distance: `${minDistance.toFixed(1)} KM`,
          });
        }
      },
      (err) => {
        console.warn("Geolocation failed, using default hospital:", err);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, []);

  if (!currentHospital) return null;

  const destinationAddress = currentHospital.name + ' ' + currentHospital.address;
  
  // Use directions mode inside the iframe if coordinates are available to show both user and destination
  const mapsEmbedUrl = userCoords 
    ? `https://maps.google.com/maps?q=from:${userCoords.latitude},${userCoords.longitude}+to:${encodeURIComponent(destinationAddress)}&t=&z=14&ie=UTF8&iwloc=&output=embed`
    : `https://maps.google.com/maps?q=${encodeURIComponent(destinationAddress)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  const routeUrl = userCoords
    ? `https://www.google.com/maps/dir/?api=1&origin=${userCoords.latitude},${userCoords.longitude}&destination=${encodeURIComponent(destinationAddress)}`
    : `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destinationAddress)}`;

  return (
    <div className="bg-white border border-dash-border rounded-xl overflow-hidden shadow-sm">
      <div className="bg-[#eceef0] border-b border-dash-border px-4 py-4 flex items-center justify-between">
        <p className="flex items-center gap-2 text-sm font-semibold text-dash-text">
          <MapPin size={18} className="text-dash-danger" /> Rumah Sakit Terdekat (IGD)
        </p>
        <span className="rounded-full bg-dash-success/10 px-2 py-0.5 text-[11px] font-bold text-dash-success">
          {currentHospital.distance}
        </span>
      </div>
      <div className="h-48 w-full bg-slate-100 relative">
        <iframe
          title="Nearest Hospital IGD Map"
          src={mapsEmbedUrl}
          className="w-full h-full border-0"
          allowFullScreen
          loading="lazy"
        />
      </div>
      <div className="p-4 flex flex-col gap-3">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-base font-bold text-dash-text">{currentHospital.name}</p>
            <p className="text-xs text-dash-linkMuted">{currentHospital.address}</p>
          </div>
          <a
            href={routeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="size-10 rounded-full bg-dash-primary hover:bg-primary-light flex items-center justify-center shrink-0 transition-colors shadow-md"
            title="Navigasi Arah"
          >
            <Navigation size={18} className="text-white" />
          </a>
        </div>
        <div className="border-t border-dash-border pt-3 flex items-center gap-3">
          <Phone size={13.5} className="text-dash-muted" />
          <a href={`tel:${currentHospital.phone.replace(/[^0-9]/g, '')}`} className="text-[13px] text-dash-text hover:underline">
            {currentHospital.phone}
          </a>
        </div>
      </div>
    </div>
  );
}
