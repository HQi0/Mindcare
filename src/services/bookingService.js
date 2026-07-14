import { supabase } from '../lib/supabaseClient';
import { getCurrentDatabaseUser } from './authService.js';

const mockDelay = (data, ms = 300) =>
  new Promise((resolve) => setTimeout(() => resolve({ data }), ms));

function mapCounselor(row) {
  const specialization = (row.specialization || '').trim();

  return {
    id: row.id,
    name: row.full_name,
    role: specialization || 'Konselor Online',
    rating: 5,
    reviews: 0,
    tags: specialization ? specialization.split(',').map((tag) => tag.trim()).filter(Boolean) : ['Online'],
    mode: 'Online Saja',
    available: row.is_available !== false,
    avatarUrl: row.avatar_url,
  };
}

function mapBooking(row) {
  const counselor = row.counselor || {};
  const scheduledAt = row.scheduled_at ? new Date(row.scheduled_at) : null;

  return {
    id: row.id,
    counselorId: row.counselor_id,
    counselorName: counselor.full_name || 'Konselor',
    counselorSpecialization: counselor.specialization || 'Konselor Online',
    counselorAvatarUrl: counselor.avatar_url || null,
    sessionType: row.session_type || 'online',
    status: row.status || 'menunggu',
    scheduledAt,
    scheduledLabel: scheduledAt
      ? new Intl.DateTimeFormat('id-ID', {
          dateStyle: 'full',
          timeStyle: 'short',
        }).format(scheduledAt)
      : '-',
    createdAt: row.created_at ? new Date(row.created_at) : null,
  };
}

const DUMMY_TIME_SLOTS = [
  { id: 't1', time: '09:00 - 10:00', status: 'available', scheduledAt: '2026-10-04T09:00:00+07:00' },
  { id: 't2', time: '10:30 - 11:30', status: 'selected', scheduledAt: '2026-10-04T10:30:00+07:00' },
  { id: 't3', time: '13:00 - 14:00', status: 'available', scheduledAt: '2026-10-04T13:00:00+07:00' },
  { id: 't4', time: '14:30 - 15:30', status: 'available', scheduledAt: '2026-10-04T14:30:00+07:00' },
  { id: 't5', time: '16:00 - 17:00', status: 'available', scheduledAt: '2026-10-04T16:00:00+07:00' },
  { id: 't6', time: '19:00 - 20:00', status: 'available', scheduledAt: '2026-10-04T19:00:00+07:00' },
];

const DUMMY_SUMMARY = {
  counselor: 'Bpk. Andi Pratama',
  date: 'Minggu, 4 Oktober 2026',
  time: '10:30 - 11:30 WIB',
  method: 'Online via MindCare Meet',
  cost: 'Ditanggung Universitas (Gratis)',
};

function getSlotById(slotId) {
  return DUMMY_TIME_SLOTS.find((slot) => slot.id === slotId) || null;
}

export async function getCounselors() {
  const { data, error } = await supabase
    .from('counselors')
    .select('id, full_name, specialization, avatar_url, is_available')
    .order('full_name', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  const res = await mockDelay((data || []).map(mapCounselor));
  return res.data;
}

export async function getTimeSlots(_date) {
  const res = await mockDelay(DUMMY_TIME_SLOTS);
  return res.data;
}

export async function getBookingSummary() {
  const res = await mockDelay(DUMMY_SUMMARY);
  return res.data;
}

export async function getMyBookings() {
  const currentUser = await getCurrentDatabaseUser();

  if (!currentUser?.id) {
    return [];
  }

  const { data, error } = await supabase
    .from('bookings')
    .select('id, counselor_id, session_type, scheduled_at, status, created_at, counselor:counselors(id, full_name, specialization, avatar_url)')
    .eq('user_id', currentUser.id)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  const res = await mockDelay((data || []).map(mapBooking));
  return res.data;
}

export async function confirmBooking(payload) {
  const currentUser = await getCurrentDatabaseUser();

  if (!currentUser?.id) {
    throw new Error('Silakan login terlebih dahulu untuk melakukan booking.');
  }

  const selectedSlot = getSlotById(payload.slot);
  const scheduledAt = payload.scheduledAt || selectedSlot?.scheduledAt;

  if (!scheduledAt) {
    throw new Error('Slot jadwal tidak ditemukan.');
  }

  const { error } = await supabase.from('bookings').insert({
    user_id: currentUser.id,
    counselor_id: payload.counselor,
    session_type: 'online',
    scheduled_at: scheduledAt,
    status: 'menunggu',
  });

  if (error) {
    throw new Error(error.message);
  }

  const res = await mockDelay({ success: true, counselor: payload.counselor, slot: payload.slot });
  return res.data;
}

export async function deleteBooking(bookingId) {
  const currentUser = await getCurrentDatabaseUser();

  if (!currentUser?.id) {
    throw new Error('Silakan login terlebih dahulu untuk menghapus booking.');
  }

  const { error } = await supabase
    .from('bookings')
    .delete()
    .eq('id', bookingId)
    .eq('user_id', currentUser.id);

  if (error) {
    throw new Error(error.message);
  }

  const res = await mockDelay({ success: true, bookingId });
  return res.data;
}
