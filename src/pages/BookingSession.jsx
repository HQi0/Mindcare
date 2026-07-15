import { useEffect, useMemo, useState } from 'react';
import useFetch from '../hooks/useFetch.js';
import { getCounselors, getTimeSlots, getBookingSummary, getMyBookings, confirmBooking, deleteBooking } from '../services/bookingService.js';
import { BookingStepper } from '../components/booking/BookingCards.jsx';
import { CalendarCard, BookingSummaryCard } from '../components/booking/BookingCalendar.jsx';
import { supabase } from '../lib/supabaseClient';

const CALENDAR_LABEL_FORMATTER = new Intl.DateTimeFormat('id-ID', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'Asia/Jakarta',
});

const CALENDAR_MAX_MONTH = 11;

function getJakartaDateParts(date = new Date()) {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  const parts = formatter.formatToParts(date).reduce((result, part) => {
    if (part.type !== 'literal') {
      result[part.type] = part.value;
    }
    return result;
  }, {});

  return {
    year: Number(parts.year),
    month: Number(parts.month) - 1,
    day: Number(parts.day),
  };
}

function buildMonthDates(year, monthIndex) {
  const totalDays = new Date(year, monthIndex + 1, 0).getDate();

  return Array.from({ length: totalDays }, (_, index) => {
    const day = index + 1;
    const dateId = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const localDate = new Date(year, monthIndex, day);

    return {
      id: dateId,
      day,
      label: CALENDAR_LABEL_FORMATTER.format(localDate),
      weekdayIndex: localDate.getDay(),
      monthIndex,
      year,
    };
  });
}

// Perbaikan: Pembentukan kalender lokal agar nama hari dan tanggalnya sejajar 100% akurat
function buildCalendarMonths() {
  const today = getJakartaDateParts();

  return Array.from({ length: CALENDAR_MAX_MONTH - today.month + 1 }, (_, index) => {
    const monthIndex = today.month + index;
    const monthDate = new Date(today.year, monthIndex, 1);

    return {
      id: `${today.year}-${String(monthIndex + 1).padStart(2, '0')}`,
      label: new Intl.DateTimeFormat('id-ID', {
        month: 'long',
        year: 'numeric',
        timeZone: 'Asia/Jakarta',
      }).format(monthDate),
      year: today.year,
      monthIndex,
      dates: buildMonthDates(today.year, monthIndex),
    };
  });
}

const CALENDAR_MONTHS = buildCalendarMonths();
const TODAY_JAKARTA = getJakartaDateParts();

function getInitials(name) {
  if (!name) return 'KC';
  return name.split(' ').filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase();
}

function formatBookingTime(slot) {
  return slot?.time || 'Belum dipilih';
}

function buildScheduledAt(dateId, slotTime) {
  if (!dateId || !slotTime) return null;
  const [startTime] = slotTime.split(' - ');
  const [hours, minutes] = startTime.split(':');
  if (!hours || !minutes) return null;
  return `${dateId}T${hours}:${minutes}:00+07:00`;
}

export default function BookingSession() {
  const { data: counselors, loading: loadingCounselors, error: counselorError } = useFetch(getCounselors, []);
  const { data: slots } = useFetch(getTimeSlots, []);
  const { data: summary } = useFetch(getBookingSummary, []);
  const { data: myBookings, loading: loadingBookings, error: bookingsError, refetch: refetchBookings } = useFetch(getMyBookings, []);

  const [selectedCounselor, setSelectedCounselor] = useState(null);
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState('t2');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [deletingBookingId, setDeletingBookingId] = useState(null);
  const [currentTime, setCurrentTime] = useState(() => Date.now());
  
  const [globalBookedStrings, setGlobalBookedStrings] = useState([]);

  const selectedMonth = CALENDAR_MONTHS[selectedMonthIndex] ?? CALENDAR_MONTHS[0];
  const currentMonthIsSelected = selectedMonth?.monthIndex === TODAY_JAKARTA.month && selectedMonth?.year === TODAY_JAKARTA.year;

  const [selectedDate, setSelectedDate] = useState(() => {
    const availableDate = selectedMonth?.dates.find((date) => {
      if (!currentMonthIsSelected) return true;
      return date.day >= TODAY_JAKARTA.day;
    });
    return availableDate ?? selectedMonth?.dates[0] ?? null;
  });

  const fetchGlobalBookings = async () => {
    try {
      if (!selectedCounselor) return;
      const { data, error } = await supabase
        .from('bookings')
        .select('scheduled_at')
        .eq('counselor_id', selectedCounselor);

      if (data) {
        const isoStrings = data.map(b => new Date(b.scheduled_at).toISOString());
        setGlobalBookedStrings(isoStrings);
      }
    } catch (err) {
      console.error('Gagal memuat jadwal global terbooking:', err.message);
    }
  };

  useEffect(() => {
    fetchGlobalBookings();
  }, [selectedCounselor]);

  useEffect(() => {
    if (!selectedCounselor && counselors?.length) {
      setSelectedCounselor(counselors[0].id);
    }
  }, [counselors, selectedCounselor]);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setCurrentTime(Date.now());
    }, 5000);
    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const nextAvailableDate = selectedMonth?.dates.find((date) => {
      if (!currentMonthIsSelected) return true;
      return date.day >= TODAY_JAKARTA.day;
    });

    if (!nextAvailableDate) {
      setSelectedDate(null);
      return;
    }

    const selectedStillVisible = selectedMonth?.dates.some((date) => date.id === selectedDate?.id);

    if (!selectedStillVisible || (currentMonthIsSelected && selectedDate && selectedDate.day < TODAY_JAKARTA.day)) {
      setSelectedDate(nextAvailableDate);
    }
  }, [selectedMonth, currentMonthIsSelected, selectedDate]);

  // Evaluasi dinamis: Menentukan status 'past' (jam lewat) atau 'booked' (sudah dipesan)
  const dynamicSlots = useMemo(() => {
    if (!slots || !selectedDate) return [];

    return slots.map((slot) => {
      const generatedIso = buildScheduledAt(selectedDate.id, slot.time);
      if (!generatedIso) return slot;

      const currentSlotDate = new Date(generatedIso);
      const slotStartTimestamp = currentSlotDate.getTime();

      // 1. Cek Jam Lewat (Mendapatkan prioritas override paling tinggi)
      if (slotStartTimestamp < currentTime) {
        return { ...slot, status: 'past' }; 
      }

      // 2. Cek database apakah sudah dibooking user lain
      const isAlreadyBooked = globalBookedStrings.includes(currentSlotDate.toISOString());
      if (isAlreadyBooked) {
        return { ...slot, status: 'booked' }; 
      }

      return slot;
    });
  }, [slots, selectedDate, globalBookedStrings, currentTime]);

  const selectedCounselorData = useMemo(
    () => counselors?.find((counselor) => counselor.id === selectedCounselor) ?? counselors?.[0] ?? null,
    [counselors, selectedCounselor]
  );

  const selectedSlotData = useMemo(
    () => dynamicSlots?.find((slot) => slot.id === selectedSlot) ?? null,
    [dynamicSlots, selectedSlot]
  );

  const bookingSummary = useMemo(
    () => ({
      ...summary,
      counselor: selectedCounselorData?.name ?? summary?.counselor,
      counselorAvatarUrl: selectedCounselorData?.avatarUrl ?? null,
      method: selectedCounselorData?.mode ?? summary?.method,
      date: selectedDate?.label ?? summary?.date,
      time: formatBookingTime(selectedSlotData) === 'Belum dipilih' || selectedSlotData?.status === 'past' || selectedSlotData?.status === 'booked' ? summary?.time : formatBookingTime(selectedSlotData),
    }),
    [summary, selectedCounselorData, selectedDate, selectedSlotData]
  );

  const visibleBookings = useMemo(() => {
    return (myBookings || [])
      .map((booking) => {
        if (!booking.scheduledAt) return booking;

        const sessionStart = booking.scheduledAt.getTime();
        const sessionEnd = sessionStart + (60 * 60 * 1000); 
        const now = currentTime;

        if (now >= sessionStart && now <= sessionEnd) {
          return { ...booking, displayStatus: 'aktif' };
        }
        return { ...booking, displayStatus: booking.status };
      })
      .filter((booking) => {
        if (!booking.scheduledAt) return false;
        const sessionEndTimestamp = booking.scheduledAt.getTime() + (60 * 60 * 1000);
        return currentTime <= sessionEndTimestamp;
      });
  }, [myBookings, currentTime]);

  const selectDate = (dateId) => {
    const nextDate = selectedMonth?.dates.find((date) => date.id === dateId) ?? null;
    if (!nextDate) return;
    if (currentMonthIsSelected && nextDate.day < TODAY_JAKARTA.day) return;
    setSelectedDate(nextDate);
  };

  const goToPreviousMonth = () => {
    setSelectedMonthIndex((currentIndex) => Math.max(0, currentIndex - 1));
  };

  const goToNextMonth = () => {
    setSelectedMonthIndex((currentIndex) => Math.min(CALENDAR_MONTHS.length - 1, currentIndex + 1));
  };

  const handleConfirm = async () => {
    const targetScheduledTime = buildScheduledAt(selectedDate?.id, selectedSlotData?.time);
    
    if (!targetScheduledTime || selectedSlotData?.status === 'booked' || selectedSlotData?.status === 'past') {
      alert('Maaf, slot waktu ini tidak tersedia atau sudah melewati batas jam booking.');
      return;
    }

    setSubmitting(true);
    setSubmitError(null);
    
    try {
      const isoTargetToCheck = new Date(targetScheduledTime).toISOString();

      const { data: duplicateCheck, error: checkError } = await supabase
        .from('bookings')
        .select('id, scheduled_at')
        .eq('counselor_id', selectedCounselor);

      if (checkError) throw checkError;

      const isConflictDetected = duplicateCheck?.some(
        b => new Date(b.scheduled_at).toISOString() === isoTargetToCheck
      );

      if (isConflictDetected) {
        alert('Gagal! Slot waktu baru saja diambil oleh mahasiswa lain beberapa saat lalu.');
        await fetchGlobalBookings(); 
        setSubmitting(false);
        return;
      }

      await confirmBooking({
        counselor: selectedCounselor,
        slot: selectedSlot,
        scheduledAt: targetScheduledTime,
        dateLabel: selectedDate?.label,
      });

      await refetchBookings();
      await fetchGlobalBookings(); 
    } catch (error) {
      setSubmitError(error.message || 'Booking gagal. Silakan coba lagi.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    const confirmed = window.confirm('Hapus booking ini?');
    if (!confirmed) return;

    setDeletingBookingId(bookingId);
    setSubmitError(null);

    try {
      await deleteBooking(bookingId);
      await refetchBookings();
      await fetchGlobalBookings();
    } catch (error) {
      setSubmitError(error.message || 'Booking gagal dihapus.');
    } finally {
      setDeletingBookingId(null);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <BookingStepper step={2} />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-8 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-[22px] leading-8 font-semibold tracking-[-0.22px] text-dash-primary">
              Temukan Konselor Online Anda
            </h2>
            <span className="flex items-center gap-1.5 rounded-full bg-[#e6e8ea] px-3 py-1 text-[11px] text-dash-muted">
              <span className="size-2 rounded-full bg-dash-success" /> Online Saja
            </span>
          </div>
          <div className="bg-white border border-auth-card rounded-xl overflow-hidden shadow-sm">
            <div className="flex items-center justify-between px-4 py-4 border-b border-auth-card">
              <p className="text-sm font-semibold text-dash-text">Tabel Konselor</p>
              <p className="text-[11px] text-dash-muted">Sumber: tabel <span className="font-semibold text-dash-text">counselors</span></p>
            </div>

            {loadingCounselors ? (
              <div className="p-6 text-sm text-dash-muted">Memuat data konselor...</div>
            ) : counselorError ? (
              <div className="p-6 text-sm text-dash-danger">Gagal memuat konselor: {counselorError.message}</div>
            ) : counselors?.length ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-auth-card">
                  <thead className="bg-[#f8fafc]">
                    <tr className="text-left text-[11px] uppercase tracking-[0.08em] text-dash-linkMuted">
                      <th className="px-4 py-3 font-semibold">Foto</th>
                      <th className="px-4 py-3 font-semibold">Nama</th>
                      <th className="px-4 py-3 font-semibold">Spesialisasi</th>
                      <th className="px-4 py-3 font-semibold">Status</th>
                      <th className="px-4 py-3 font-semibold">Mode</th>
                      <th className="px-4 py-3 font-semibold text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-auth-card bg-white">
                    {counselors.map((counselor) => {
                      const isSelected = selectedCounselor === counselor.id;
                      const isAvailable = counselor.available !== false;

                      return (
                        <tr key={counselor.id} className={`${isSelected ? 'bg-dash-primary/5' : ''} ${!isAvailable ? 'opacity-60' : ''}`}>
                          <td className="px-4 py-4 align-top">
                            <div className="size-12 rounded-full overflow-hidden bg-dash-primary/10 border border-auth-card flex items-center justify-center shrink-0">
                              {counselor.avatarUrl ? (
                                <img src={counselor.avatarUrl} alt={counselor.name} className="size-full object-cover" />
                              ) : null}
                              <span data-fallback className={`size-full items-center justify-center text-sm font-semibold text-dash-primary ${counselor.avatarUrl ? 'hidden' : 'flex'}`}>
                                {getInitials(counselor.name)}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex flex-col gap-1">
                              <span className="text-sm font-semibold text-dash-text">{counselor.name}</span>
                              <span className="text-[11px] text-dash-linkMuted">Rating {counselor.rating} · {counselor.reviews} ulasan</span>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-sm text-dash-muted">{counselor.role}</td>
                          <td className="px-4 py-4">
                            <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${isAvailable ? 'bg-dash-success/10 text-dash-success' : 'bg-[#eceef0] text-dash-linkMuted'}`}>
                              {isAvailable ? 'Tersedia' : 'Tidak tersedia'}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-sm text-dash-muted">{counselor.mode}</td>
                          <td className="px-4 py-4 text-right">
                            <button
                              type="button"
                              disabled={!isAvailable || submitting}
                              onClick={() => setSelectedCounselor(counselor.id)}
                              className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                                !isAvailable || submitting
                                  ? 'bg-[#eceef0] text-dash-linkMuted cursor-not-allowed'
                                  : isSelected
                                  ? 'bg-[#2563eb] text-[#eeefff]'
                                  : 'bg-dash-primary text-white'
                              }`}
                            >
                              {isSelected ? 'Terpilih' : 'Pilih'}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-6 text-sm text-dash-muted">Belum ada data konselor di database.</div>
            )}
          </div>
          
          <CalendarCard
            dates={selectedMonth?.dates ?? []}
            monthLabel={selectedMonth?.label}
            selectedDate={selectedDate}
            onPreviousMonth={goToPreviousMonth}
            onNextMonth={goToNextMonth}
            canGoPrevious={selectedMonthIndex > 0}
            canGoNext={selectedMonthIndex < CALENDAR_MONTHS.length - 1}
            onSelectDate={selectDate}
            slots={dynamicSlots} 
            selectedSlot={selectedSlot}
            onSelectSlot={setSelectedSlot}
            todayDateId={`${TODAY_JAKARTA.year}-${String(TODAY_JAKARTA.month + 1).padStart(2, '0')}-${String(TODAY_JAKARTA.day).padStart(2, '0')}`}
            selectedDateId={selectedDate?.id}
          />
        </div>
        <div className="md:col-span-4">
          <BookingSummaryCard summary={bookingSummary} onConfirm={handleConfirm} loading={submitting} error={submitError} />
        </div>
      </div>

      <section className="bg-white border border-auth-card rounded-xl overflow-hidden shadow-sm">
        <div className="px-4 py-4 border-b border-auth-card flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-dash-text">Booking Saya</p>
            <p className="text-[11px] text-dash-muted">Daftar sesi yang sudah tersimpan di tabel <span className="font-semibold text-dash-text">bookings</span></p>
          </div>
          {loadingBookings && <span className="text-[11px] text-dash-muted">Memuat booking...</span>}
        </div>

        {bookingsError ? (
          <div className="p-6 text-sm text-dash-danger">Gagal memuat booking: {bookingsError.message}</div>
        ) : visibleBookings?.length ? (
          <div className="divide-y divide-auth-card">
            {visibleBookings.map((booking) => (
              <div key={booking.id} className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-full overflow-hidden bg-dash-primary/10 border border-auth-card flex items-center justify-center shrink-0">
                    {booking.counselorAvatarUrl ? (
                      <img src={booking.counselorAvatarUrl} alt={booking.counselorName} className="size-full object-cover" />
                    ) : (
                      <span className="text-sm font-semibold text-dash-primary">{getInitials(booking.counselorName)}</span>
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-semibold text-dash-text">{booking.counselorName}</p>
                    <p className="text-xs text-dash-linkMuted">{booking.counselorSpecialization}</p>
                    <p className="text-[11px] text-dash-muted">{booking.scheduledLabel}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 md:justify-end">
                  <span className="rounded-full bg-dash-primary/10 px-3 py-1 text-[11px] font-semibold text-dash-primary">
                    {booking.sessionType === 'online' ? 'Online' : 'Tatap Muka'}
                  </span>
                  
                  <span className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider ${
                    booking.displayStatus === 'aktif' 
                      ? 'bg-red-100 text-red-600 border border-red-200 animate-pulse' 
                      : booking.displayStatus === 'dikonfirmasi' 
                      ? 'bg-dash-success/10 text-dash-success' 
                      : 'bg-blue-50 text-blue-600 border border-blue-100'
                  }`}>
                    {booking.displayStatus}
                  </span>
                  
                  <button
                    type="button"
                    onClick={() => handleDeleteBooking(booking.id)}
                    disabled={deletingBookingId === booking.id}
                    className="rounded-full border border-dash-danger px-3 py-1 text-[11px] font-semibold text-dash-danger transition-colors hover:bg-dash-danger hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deletingBookingId === booking.id ? 'Menghapus...' : 'Hapus'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-sm text-dash-muted">Belum ada booking yang tersimpan.</div>
        )}
      </section>
    </div>
  );
}