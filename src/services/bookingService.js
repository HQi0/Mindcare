const mockDelay = (data, ms = 300) =>
  new Promise((resolve) => setTimeout(() => resolve({ data }), ms));

const DUMMY_COUNSELORS = [
  {
    id: 'sarah-wijaya',
    name: 'Dr. Sarah Wijaya',
    role: 'Psikolog Klinis (S2)',
    rating: 4.9,
    reviews: 124,
    tags: ['Anxiety', 'Academic Stress', '+2 More'],
    mode: null,
  },
  {
    id: 'andi-pratama',
    name: 'Bpk. Andi Pratama',
    role: 'Konselor Akademik',
    rating: 4.8,
    reviews: 89,
    tags: ['Career Path', 'Motivation'],
    mode: 'Online Saja',
    selected: true,
  },
];

const DUMMY_TIME_SLOTS = [
  { id: 't1', time: '09:00 - 10:00', status: 'available' },
  { id: 't2', time: '10:30 - 11:30', status: 'selected' },
  { id: 't3', time: '13:00 - 14:00', status: 'available' },
  { id: 't4', time: '14:30 - 15:30', status: 'full' },
  { id: 't5', time: '16:00 - 17:00', status: 'available' },
  { id: 't6', time: '19:00 - 20:00', status: 'available' },
];

const DUMMY_SUMMARY = {
  counselor: 'Bpk. Andi Pratama',
  date: 'Rabu, 4 Oktober 2023',
  time: '10:30 - 11:30 WIB',
  method: 'Online via MindCare Meet',
  cost: 'Ditanggung Universitas (Gratis)',
};

export async function getCounselors() {
  const res = await mockDelay(DUMMY_COUNSELORS);
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

export async function confirmBooking(payload) {
  // const res = await api.post('/bookings', payload);
  const res = await mockDelay({ success: true, ...payload });
  return res.data;
}
