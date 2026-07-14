import useFetch from '../hooks/useFetch.js';
import { getAssessments } from '../services/selfAssessmentService.js';
import AssessmentCard from '../components/assessment/AssessmentCard.jsx';
import PrivacyNotice from '../components/assessment/PrivacyNotice.jsx';
import AboutAssessmentSection from '../components/assessment/AboutAssessmentSection.jsx';
import FloatingActionButton from '../components/common/FloatingActionButton.jsx';
import { Siren } from 'lucide-react';

export default function SelfAssessment() {
  const { data: assessments, loading } = useFetch(getAssessments, []);

  return (
    <>
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-[28px] leading-[42px] text-dash-primary">
            Perpustakaan Penilaian Diri
          </h2>
          <p className="text-base leading-6 text-dash-muted">
            Lakukan pemeriksaan berkala untuk memahami kesehatan mental Anda dengan alat klinis
            standar.
          </p>
        </div>
        <div className="flex gap-2">
          <span className="flex items-center gap-1.5 bg-dash-primary/5 border border-dash-primary/10 text-dash-primary text-[11px] font-medium rounded-full pl-3 pr-4 py-1.5">
            <span className="size-1.5 rounded-full bg-dash-primary" />
            4 Penilaian Tersedia
          </span>
          <span className="flex items-center gap-1.5 bg-dash-success/5 border border-dash-success/10 text-dash-success text-[11px] font-medium rounded-full pl-3 pr-4 py-1.5">
            <span className="size-1.5 rounded-full bg-dash-success" />
            Data Terenkripsi &amp; Privat
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        {loading &&
          [1, 2, 3, 4].map((n) => (
            <div key={n} className="md:col-span-6 h-72 rounded-xl2 bg-white/60 animate-pulse" />
          ))}

        {assessments?.map((assessment) => (
          <AssessmentCard key={assessment.id} assessment={assessment} />
        ))}

        <PrivacyNotice />
      </div>

      <AboutAssessmentSection />

      <FloatingActionButton
        to="/emergency-help"
        label="Bantuan Krisis 24/7"
        icon={Siren}
        variant="danger"
      />
    </>
  );
}
