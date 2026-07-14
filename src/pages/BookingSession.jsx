import { useState } from 'react';
import useFetch from '../hooks/useFetch.js';
import { getCounselors, getTimeSlots, getBookingSummary, confirmBooking } from '../services/bookingService.js';
import { BookingStepper, CounselorCard } from '../components/booking/BookingCards.jsx';
import { CalendarCard, BookingSummaryCard } from '../components/booking/BookingCalendar.jsx';

export default function BookingSession() {
  const { data: counselors } = useFetch(getCounselors, []);
  const { data: slots } = useFetch(getTimeSlots, []);
  const { data: summary } = useFetch(getBookingSummary, []);

  const [selectedCounselor, setSelectedCounselor] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState('t2');
  const [confirmed, setConfirmed] = useState(false);

  const handleConfirm = async () => {
    await confirmBooking({ counselor: selectedCounselor, slot: selectedSlot });
    setConfirmed(true);
  };

  return (
    <div className="flex flex-col gap-8">
      <BookingStepper step={2} />

      {confirmed ? (
        <div className="bg-white border border-auth-card rounded-xl p-10 text-center flex flex-col items-center gap-2">
          <p className="text-2xl font-semibold text-dash-text">Sesi Berhasil Dijadwalkan 🎉</p>
          <p className="text-dash-muted text-sm">
            Konfirmasi telah dikirim. Anda akan menerima tautan sesi 15 menit sebelum jadwal dimulai.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-8 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h2 className="text-[22px] leading-8 font-semibold tracking-[-0.22px] text-dash-primary">
                Temukan Konselor Anda
              </h2>
              <span className="flex items-center gap-1.5 rounded-full bg-[#e6e8ea] px-3 py-1 text-[11px] text-dash-muted">
                <span className="size-2 rounded-full bg-dash-success" /> Tersedia Sekarang
              </span>
            </div>
            <div className="flex gap-4">
              {counselors?.map((c) => (
                <CounselorCard key={c.id} counselor={c} selected={selectedCounselor} onSelect={setSelectedCounselor} />
              ))}
            </div>
            <CalendarCard slots={slots} selectedSlot={selectedSlot} onSelectSlot={setSelectedSlot} />
          </div>
          <div className="md:col-span-4">
            <BookingSummaryCard summary={summary} onConfirm={handleConfirm} />
          </div>
        </div>
      )}
    </div>
  );
}
