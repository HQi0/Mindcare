import MoodHero from '../components/dashboard/MoodHero.jsx';
import StatsGrid from '../components/dashboard/StatsGrid.jsx';
import MoodHistoryChart from '../components/dashboard/MoodHistoryChart.jsx';
import RecentActivity from '../components/dashboard/RecentActivity.jsx';
import EmergencyBanner from '../components/dashboard/EmergencyBanner.jsx';
import RecommendedResources from '../components/dashboard/RecommendedResources.jsx';

export default function Dashboard() {
  return (
    <>
      <MoodHero />
      <StatsGrid />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        <MoodHistoryChart />
        <RecentActivity />
      </div>

      <EmergencyBanner />
      <RecommendedResources />
    </>
  );
}
