import { Link } from 'react-router-dom';
import { Clock, ArrowRight, Download } from 'lucide-react';
import { ASSESSMENTS_DATA } from '../../services/selfAssessmentService.js';

export default function AssessmentCard({ assessment }) {
  const isLarge = assessment.size === 'lg';

  const handleDownloadLastResult = () => {
    const lastResult = assessment.lastResult;
    if (!lastResult) return;

    const config = ASSESSMENTS_DATA[assessment.id];
    if (!config) return;

    // Menghitung tingkat keparahan berdasarkan skor terakhir
    const severityText = config.getSeverity(lastResult.score).text;

    let report = `==================================================\n`;
    report += `        LAPORAN HASIL ASESMEN MANDIRI - MINDCARE\n`;
    report += `==================================================\n\n`;
    report += `Jenis Asesmen       : ${config.title}\n`;
    report += `Tanggal Pelaksanaan : ${new Date(lastResult.created_at).toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' })}\n`;
    report += `Total Skor          : ${lastResult.score}\n`;
    report += `Tingkat Keparahan   : ${severityText}\n\n`;
    report += `--------------------------------------------------\n`;
    report += `REKOMENDASI:\n`;
    report += `${lastResult.recommendation}\n`;
    report += `--------------------------------------------------\n\n`;
    report += `RINCIAN JAWABAN:\n`;
    
    config.questions.forEach((q, idx) => {
      const score = lastResult.answers[idx];
      const optionText = config.options.find(opt => opt.score === score)?.text || score;
      report += `${idx + 1}. ${q}\n   Jawaban: ${optionText} (Skor: ${score})\n\n`;
    });
    
    report += `==================================================\n`;
    report += `Catatan: Hasil skrining ini adalah alat bantu awal dan\n`;
    report += `bukan diagnosis klinis resmi. Silakan hubungi konselor\n`;
    report += `atau psikolog profesional di Mindcare jika Anda memerlukan\n`;
    report += `penanganan lebih lanjut.\n`;
    report += `==================================================\n`;

    const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Hasil_Asesmen_${config.type}_${new Date(lastResult.created_at).toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      className={`bg-white border border-auth-card rounded-xl2 p-6 flex flex-col justify-between ${
        isLarge ? 'md:col-span-7' : assessment.size === 'md' ? 'md:col-span-5' : 'md:col-span-6'
      }`}
    >
      <div className="flex items-start justify-between pb-4">
        <div>
          <p className={`text-[10px] font-semibold tracking-[0.8px] uppercase pb-1 ${assessment.categoryColor}`}>
            {assessment.category}
          </p>
          <h3 className="text-[22px] leading-8 font-semibold tracking-[-0.22px] text-dash-text">
            {assessment.title}
          </h3>
        </div>
        <span className="flex items-center gap-1 bg-auth-input rounded-full px-3 py-1 text-[11px] text-dash-muted whitespace-nowrap shrink-0">
          <Clock size={12} />
          {assessment.time}
        </span>
      </div>

      <p className="text-base leading-6 text-dash-muted pb-6">{assessment.description}</p>

      <div className="flex items-center justify-between text-xs text-dash-muted pb-2">
        <span>{assessment.questionCount}</span>
        <span className={assessment.statusColor}>{assessment.status}</span>
      </div>

      <div className="h-1.5 rounded-full bg-[#e6e8ea] overflow-hidden mb-4">
        {assessment.progress ? (
          <div
            className="h-full bg-dash-success rounded-full"
            style={{ width: `${assessment.progress}%` }}
          />
        ) : null}
      </div>

      <div className="flex gap-2">
        <Link
          to={`/self-assessment/${assessment.id}`}
          className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-3 text-sm font-semibold transition-colors ${
            assessment.outlined
              ? 'border border-dash-primary text-dash-primary hover:bg-dash-primary/5'
              : 'bg-dash-primary text-white hover:bg-[#004ac6]'
          }`}
        >
          {assessment.buttonLabel}
          {!assessment.outlined && <ArrowRight size={14} />}
        </Link>
        
        {/* Tombol Unduh Laporan Terakhir jika user sudah pernah mengambil asesmen */}
        {assessment.lastResult && (
          <button
            type="button"
            onClick={handleDownloadLastResult}
            className="flex items-center justify-center size-12 bg-dash-success/10 hover:bg-dash-success/20 text-dash-success rounded-lg border border-dash-success/20 transition-colors shrink-0 cursor-pointer"
            title="Unduh Laporan Hasil Terakhir"
          >
            <Download size={18} />
          </button>
        )}
      </div>
    </div>
  );
}
