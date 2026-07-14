import { ChevronLeft, ChevronRight, User, Video, Wallet, CalendarCheck2, HelpCircle } from 'lucide-react';

const DAY_LABELS = ['MIN', 'SEN', 'SEL', 'RAB', 'KAM', 'JUM', 'SAB'];

export function CalendarCard({ slots, selectedSlot, onSelectSlot }) {
  return (
    <div className="bg-white border border-auth-card rounded-xl overflow-hidden shadow-sm">
      <div className="flex items-center justify-between px-4 py-4 border-b border-auth-card">
        <p className="text-sm font-semibold text-dash-text">Pilih Tanggal & Waktu</p>
        <div className="flex items-center gap-4">
          <button type="button" className="p-1 rounded"><ChevronLeft size={12} className="text-dash-muted" /></button>
          <span className="text-[13.5px] font-bold text-dash-text">Oktober 2023</span>
          <button type="button" className="p-1 rounded"><ChevronRight size={12} className="text-dash-muted" /></button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 px-4 py-4 border-b border-auth-card">
        {DAY_LABELS.map((d) => (
          <div key={d} className="text-center text-[11px] font-medium text-dash-linkMuted py-2">{d}</div>
        ))}
        {[26, 27, 28, 29, 30].map((d) => (
          <div key={`prev-${d}`} className="text-center text-[16px] text-dash-linkMuted opacity-30 py-3">{d}</div>
        ))}
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => (
          <div
            key={d}
            className={`text-center text-[16px] py-3 rounded-lg relative ${
              d === 4 ? 'bg-dash-primary text-white font-bold' : 'text-dash-text'
            }`}
          >
            {d}
            {d === 4 && <span className="absolute left-1/2 -translate-x-1/2 bottom-1 size-1 rounded-full bg-white" />}
          </div>
        ))}
      </div>
      <div className="p-6 flex flex-col gap-4">
        <p className="text-xs text-dash-muted">
          Slot Tersedia untuk <span className="font-bold text-dash-text">Rabu, 4 Oktober</span>
        </p>
        <div className="grid grid-cols-4 gap-3">
          {slots?.map((slot) => {
            const isSelected = selectedSlot === slot.id;
            const isFull = slot.status === 'full';
            return (
              <button
                key={slot.id}
                type="button"
                disabled={isFull}
                onClick={() => onSelectSlot(slot.id)}
                className={`rounded-lg py-2.5 text-[13px] text-center border ${
                  isFull
                    ? 'bg-[#eceef0] border-auth-card text-dash-muted opacity-50 line-through'
                    : isSelected
                    ? 'bg-[#b4c5ff] border-2 border-dash-primary text-dash-primary font-bold'
                    : 'border-auth-card text-dash-text'
                }`}
              >
                {slot.time}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function BookingSummaryCard({ summary, onConfirm }) {
  if (!summary) return null;
  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white border border-auth-card rounded-xl overflow-hidden shadow-lg">
        <div className="bg-dash-primary px-4 py-4">
          <p className="text-white text-sm font-semibold">Ringkasan Sesi</p>
        </div>
        <div className="p-6 flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <span className="size-12 rounded-full bg-[#eceef0]" />
            <div>
              <p className="text-[11px] uppercase tracking-wide text-dash-linkMuted">Konselor</p>
              <p className="text-[13.5px] font-bold text-dash-text">{summary.counselor}</p>
            </div>
          </div>
          <div className="border-t border-auth-card pt-3 flex flex-col gap-3">
            <div className="flex gap-3">
              <CalendarCheck2 size={15} className="text-dash-muted mt-0.5" />
              <div>
                <p className="text-[11px] text-dash-linkMuted">Tanggal & Waktu</p>
                <p className="text-[13px] text-dash-text">{summary.date}</p>
                <p className="text-[13px] text-dash-text">{summary.time}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Video size={14} className="text-dash-muted mt-0.5" />
              <div>
                <p className="text-[11px] text-dash-linkMuted">Metode Sesi</p>
                <p className="text-[13px] text-dash-text">{summary.method}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Wallet size={14} className="text-dash-muted mt-0.5" />
              <div>
                <p className="text-[11px] text-dash-linkMuted">Biaya</p>
                <p className="text-[13px] text-dash-text">{summary.cost}</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2 pt-2">
            <label className="text-[13px] font-bold text-dash-text">Catatan untuk Konselor (Opsional)</label>
            <textarea
              rows={3}
              placeholder="Apa yang ingin Anda bicarakan? (Misal: Kecemasan tugas akhir)"
              className="w-full rounded-lg border border-auth-card p-3 text-[13px] text-dash-muted focus:outline-none"
            />
          </div>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-xl bg-dash-primary text-white py-3 text-sm font-semibold shadow flex items-center justify-center gap-2"
          >
            Konfirmasi & Booking Sesi
          </button>
          <p className="text-[11px] text-center text-dash-linkMuted">
            Dengan mengonfirmasi, Anda menyetujui <span className="text-dash-primary underline">Kebijakan Privasi</span> kami.
          </p>
        </div>
      </div>
      <div className="bg-[#d8e2ff] border border-auth-card rounded-xl p-4 flex flex-col gap-2">
        <p className="flex items-center gap-2 text-sm font-semibold text-[#0051b1]">
          <HelpCircle size={18} /> Butuh Bantuan?
        </p>
        <p className="text-xs text-[#004395]">
          Hubungi tim dukungan kami jika Anda kesulitan menentukan jadwal atau konselor yang tepat.
        </p>
        <span className="text-[13px] font-bold text-[#0051b1]">Chat Support →</span>
      </div>
    </div>
  );
}

export const CounselorIcon = User;
