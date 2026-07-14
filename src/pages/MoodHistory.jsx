import { Calendar, Download } from 'lucide-react';
import MoodCalendar from '../components/moodhistory/MoodCalendar.jsx';
import MoodTrendChart from '../components/moodhistory/MoodTrendChart.jsx';
import { MostFrequentMoodCard, ImprovementCard } from '../components/moodhistory/StatCards.jsx';
import WeeklyTrendCard from '../components/moodhistory/WeeklyTrendCard.jsx';
import TimelineEntries from '../components/moodhistory/TimelineEntries.jsx';
import FloatingActionButton from '../components/common/FloatingActionButton.jsx';

export default function MoodHistory() {
  return (
    <>
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-[22px] leading-8 font-semibold tracking-[-0.22px] text-dash-text">
            Riwayat Suasana Hati
          </h2>
          <p className="text-[13.5px] text-dash-linkMuted">
            Analisis perjalanan emosional Anda selama bulan ini
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            className="flex items-center gap-2 bg-white border border-auth-card rounded-lg px-3.5 py-2 text-[13px] text-dash-muted"
          >
            <Calendar size={14} />
            {new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
          </button>
          <button
            type="button"
            className="flex items-center gap-2 bg-dash-primary text-white rounded-lg px-3 py-2 text-[13px]"
          >
            <Download size={14} />
            Ekspor PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        <MoodCalendar />
        <MoodTrendChart />

        <div className="col-span-1 md:col-span-4 flex flex-col gap-6">
          <MostFrequentMoodCard />
          <ImprovementCard />
          <WeeklyTrendCard />
        </div>
        <TimelineEntries />
      </div>

      <FloatingActionButton to="/mood-tracker" label="Catat Suasana Baru" />
    </>
  );
}
