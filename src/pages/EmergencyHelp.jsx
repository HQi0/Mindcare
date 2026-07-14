import useFetch from '../hooks/useFetch.js';
import {
  getQuickContacts,
  getGroundingSteps,
  getSafetyTips,
  getAffirmations,
  getNearestHospital,
} from '../services/emergencyService.js';
import {
  EmergencyBannerHeader,
  QuickCallList,
  BreathingExercise,
  GroundingExercise,
  SafetyTipsCard,
  AffirmationsCard,
  ProfessionalHelpCard,
  NearestHospitalCard,
} from '../components/emergency/EmergencySections.jsx';

export default function EmergencyHelp() {
  const { data: contacts } = useFetch(getQuickContacts, []);
  const { data: groundingSteps } = useFetch(getGroundingSteps, []);
  const { data: safetyTips } = useFetch(getSafetyTips, []);
  const { data: affirmations } = useFetch(getAffirmations, []);
  const { data: hospital } = useFetch(getNearestHospital, []);

  return (
    <div className="flex flex-col gap-6">
      <EmergencyBannerHeader />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-4">
          <QuickCallList contacts={contacts} />
        </div>
        <div className="md:col-span-8">
          <BreathingExercise />
        </div>

        <div className="md:col-span-7">
          <GroundingExercise steps={groundingSteps} />
        </div>
        <div className="md:col-span-5">
          <NearestHospitalCard hospital={hospital} />
        </div>

        <div className="md:col-span-4"><SafetyTipsCard tips={safetyTips} /></div>
        <div className="md:col-span-4"><AffirmationsCard affirmations={affirmations} /></div>
        <div className="md:col-span-4"><ProfessionalHelpCard /></div>
      </div>
    </div>
  );
}
