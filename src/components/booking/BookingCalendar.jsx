import { Calendar, Clock } from 'lucide-react';

export function CalendarCard({
  dates = [],
  monthLabel = '',
  selectedDate = null,
  onPreviousMonth,
  onNextMonth,
  canGoPrevious = false,
  canGoNext = false,
  onSelectDate,
  slots = [],
  selectedSlot = '',
  onSelectSlot,
  todayDateId = '',
  selectedDateId = '',
}) {
  
  const firstDateWeekday = dates.length > 0 ? dates[0].weekdayIndex : 0;
  const emptySpacesBeforeFirstDay = Array.from({ length: firstDateWeekday });

  return (
    <div className="bg-white border border-auth-card rounded-xl p-6 shadow-sm flex flex-col gap-6">
      {/* Bagian Pemilih Tanggal */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-dash-text flex items-center gap-2">
            <Calendar size={16} className="text-dash-primary" /> Pilih Tanggal
          </p>
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={!canGoPrevious}
              onClick={onPreviousMonth}
              className="p-1.5 rounded-lg border border-auth-card hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-dash-muted"
            >
              &larr;
            </button>
            <span className="text-xs font-bold text-dash-text px-2 min-w-[100px] text-center">
              {monthLabel}
            </span>
            <button
              type="button"
              disabled={!canGoNext}
              onClick={onNextMonth}
              className="p-1.5 rounded-lg border border-auth-card hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-dash-muted"
            >
              &rarr;
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 text-center">
          {/* Header Nama Hari */}
          {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((day) => (
            <span key={day} className="text-[11px] font-bold uppercase tracking-wider text-dash-linkMuted py-1">
              {day}
            </span>
          ))}

          {/* Render elemen kosong */}
          {emptySpacesBeforeFirstDay.map((_, index) => (
            <div key={`empty-${index}`} className="h-10" />
          ))}

          {/* Render Angka Tanggal */}
          {dates.map((date) => {
            const isSelected = selectedDateId === date.id;
            const isToday = todayDateId === date.id;
            const isPast = date.id < todayDateId;

            return (
              <button
                key={date.id}
                type="button"
                disabled={isPast}
                onClick={() => onSelectDate(date.id)}
                className={`h-10 rounded-lg text-xs font-semibold flex flex-col items-center justify-center transition-all relative ${
                  isPast
                    ? 'text-slate-300 cursor-not-allowed bg-slate-50/50'
                    : isSelected
                    ? 'bg-dash-primary text-white shadow'
                    : 'text-dash-text hover:bg-slate-50 border border-transparent hover:border-auth-card'
                }`}
              >
                {date.day}
                {isToday && !isSelected && (
                  <span className="absolute bottom-1 size-1 rounded-full bg-dash-primary" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <hr className="border-auth-card" />

      {/* Bagian Pemilih Jam Slot Waktu */}
      <div className="flex flex-col gap-3">
        <p className="text-sm font-semibold text-dash-text flex items-center gap-2">
          <Clock size={16} className="text-dash-primary" /> Pilih Waktu Konseling
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {slots.map((slot) => {
            // Memeriksa status slot
            const isPastTime = slot.status === 'past';
            const isBooked = slot.status === 'booked';
            const isDisabled = isPastTime || isBooked;
            const isSelected = selectedSlot === slot.id && !isDisabled;

            return (
              <button
                key={slot.id}
                type="button"
                disabled={isDisabled} 
                onClick={() => onSelectSlot(slot.id)}
                className={`py-3 px-4 rounded-xl text-xs font-semibold text-center transition-all border flex flex-col items-center justify-center gap-1 relative ${
                  isDisabled
                    ? 'bg-slate-100 border-slate-200 text-slate-400 line-through cursor-not-allowed opacity-50 font-normal'
                    : isSelected
                    ? 'bg-dash-primary text-white border-dash-primary shadow-md scale-[1.02]'
                    : 'bg-white text-dash-text border-auth-card hover:bg-slate-50 hover:border-slate-300'
                }`}
                title={isPastTime ? "Waktu sudah terlewat" : isBooked ? "Sudah dibooking" : ""}
              >
                <span>{slot.time}</span>
                
                {/* Overlay transparan tipis untuk mempertegas tombol mati */}
                {isDisabled && (
                  <span className="absolute inset-0 bg-slate-900/[0.03] rounded-xl pointer-events-none" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function BookingSummaryCard({ summary, onConfirm, loading, error }) {
  return (
    <div className="bg-white border border-auth-card rounded-xl p-6 shadow-sm flex flex-col gap-4 sticky top-20">
      <h3 className="text-sm font-bold text-dash-text border-b border-auth-card pb-3">Ringkasan Pendaftaran</h3>
      
      <div className="flex flex-col gap-3 text-xs">
        <div className="flex flex-col gap-0.5">
          <span className="text-dash-muted">Konselor Pilihan:</span>
          <span className="font-semibold text-dash-text">{summary.counselor || 'Belum dipilih'}</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-dash-muted">Jadwal Sesi:</span>
          <span className="font-semibold text-dash-text">{summary.date} · {summary.time}</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-dash-muted">Metode Pertemuan:</span>
          <span className="font-semibold text-dash-text">{summary.method || 'Online'}</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-dash-muted">Biaya Layanan:</span>
          <span className="font-bold text-dash-success">{summary.cost}</span>
        </div>
      </div>

      {error && (
        <div className="text-[11px] text-dash-danger bg-red-50 p-2.5 rounded-lg border border-red-100 leading-relaxed">
          {error}
        </div>
      )}

      <button
        type="button"
        disabled={loading || summary.time === 'Belum dipilih'}
        onClick={onConfirm}
        className="w-full mt-2 bg-dash-primary hover:bg-blue-700 disabled:bg-slate-200 text-white disabled:text-dash-linkMuted py-2.5 rounded-xl text-xs font-semibold shadow transition-colors disabled:cursor-not-allowed"
      >
        {loading ? 'Memproses Jadwal...' : 'Konfirmasi Booking'}
      </button>
    </div>
  );
}