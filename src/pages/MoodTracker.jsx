import useFetch from '../hooks/useFetch.js';
import { getCurrentUser } from '../services/dashboardService.js';
import MoodTrackerForm from '../components/mood/MoodTrackerForm.jsx';
import DailyInsightCard from '../components/mood/DailyInsightCard.jsx';
import MoodHistoryPreview from '../components/mood/MoodHistoryPreview.jsx';
import MoodQuoteCard from '../components/mood/MoodQuoteCard.jsx';

export default function MoodTracker() {
  const { data: user } = useFetch(getCurrentUser, []);

  return (
    <>
      <div className="flex flex-col gap-1">
        <h2 className="text-[22px] leading-8 font-semibold tracking-[-0.22px] text-dash-text">
          Apa kabar hari ini, {user?.name?.toLowerCase() ?? '...'}?
        </h2>
        <p className="text-[15px] leading-[22px] text-dash-muted">
          Luangkan waktu sejenak untuk mengenali perasaanmu.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
        <MoodTrackerForm />
        <div className="md:col-span-4 flex flex-col gap-3">
          <DailyInsightCard />
          <MoodHistoryPreview />
          <MoodQuoteCard />
        </div>
      </div>
    </>
  );
}
