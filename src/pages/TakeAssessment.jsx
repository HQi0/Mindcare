import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ASSESSMENTS_DATA, saveAssessment } from '../services/selfAssessmentService.js';
import { ArrowLeft, CheckCircle2, ChevronRight, ChevronLeft, Download, Printer } from 'lucide-react';

export default function TakeAssessment() {
  const { assessmentId } = useParams();
  const navigate = useNavigate();
  const config = ASSESSMENTS_DATA[assessmentId];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [isFinished, setIsFinished] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (!config) {
      navigate('/self-assessment'); 
    } else {
      setAnswers(new Array(config.questions.length).fill(null));
    }
  }, [config, navigate]);

  if (!config) return null;

  const handleSelectOption = (score) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = score;
    setAnswers(newAnswers);

    // Auto next question after small delay for UX
    if (currentQuestion < config.questions.length - 1) {
      setTimeout(() => setCurrentQuestion(q => q + 1), 300);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) setCurrentQuestion(q => q - 1);
  };

  const handleSubmit = async () => {
    if (answers.includes(null)) return alert("Harap jawab semua pertanyaan sebelum menyimpan.");
    
    setIsSubmitting(true);
    try {
      const res = await saveAssessment(assessmentId, answers);
      setResult(res);
      setIsFinished(true);
    } catch (error) {
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isFinished && result) {
    const handleDownloadTxt = () => {
      let report = `==================================================\n`;
      report += `        LAPORAN HASIL ASESMEN MANDIRI - MINDCARE\n`;
      report += `==================================================\n\n`;
      report += `Jenis Asesmen       : ${config.title}\n`;
      report += `Tanggal Pelaksanaan : ${new Date().toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' })}\n`;
      report += `Total Skor          : ${result.result.score}\n`;
      report += `Tingkat Keparahan   : ${result.severityText}\n\n`;
      report += `--------------------------------------------------\n`;
      report += `REKOMENDASI:\n`;
      report += `${result.result.recommendation}\n`;
      report += `--------------------------------------------------\n\n`;
      report += `RINCIAN JAWABAN:\n`;
      
      config.questions.forEach((q, idx) => {
        const score = answers[idx];
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
      link.download = `Hasil_Asesmen_${config.type}_${new Date().toISOString().slice(0, 10)}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    const handlePrint = () => {
      window.print();
    };

    return (
      <>
        <style>{`
          @media print {
            body, html {
              background: #fff !important;
              color: #000 !important;
            }
            aside, nav, header, footer, .no-print {
              display: none !important;
            }
            main, .pl-\\[220px\\], .pt-14, .max-w-\\[1152px\\], .p-6 {
              padding: 0 !important;
              margin: 0 !important;
              max-width: 100% !important;
              background: transparent !important;
            }
          }
        `}</style>

        {/* On-screen view */}
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-6 animate-in fade-in zoom-in duration-500 print:hidden">
          <div className="size-24 bg-dash-success/10 text-dash-success rounded-full flex items-center justify-center mb-2">
            <CheckCircle2 size={48} />
          </div>
          <h2 className="text-[32px] font-bold text-dash-text tracking-tight">Asesmen Selesai!</h2>
          <p className="text-dash-muted text-base max-w-md">
            Terima kasih telah meluangkan waktu untuk mengecek kondisi Anda secara jujur. Data Anda telah diamankan.
          </p>
          
          <div className="bg-white border border-dash-border rounded-xl2 p-8 w-full max-w-2xl shadow-sm mt-4 flex flex-col gap-3">
            <p className="text-[12px] font-bold uppercase tracking-[1px] text-dash-primary">Hasil Analisis Anda</p>
            <h3 className="text-[36px] leading-[44px] font-extrabold text-dash-text mb-2">
              {result.severityText}
            </h3>
            <div className="p-4 rounded-xl bg-dash-primary/5 border border-dash-primary/10">
              <p className="text-[15px] leading-relaxed text-dash-muted">
                {result.result.recommendation}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
            <button
              onClick={handleDownloadTxt}
              className="flex items-center gap-2 bg-white border border-dash-border text-dash-text rounded-xl px-6 py-3.5 text-[14px] font-semibold hover:bg-dash-primary/5 hover:border-dash-primary/40 hover:text-dash-primary transition-all shadow-sm cursor-pointer"
            >
              <Download size={16} />
              Unduh Hasil (.txt)
            </button>
            
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 bg-dash-primary text-white rounded-xl px-6 py-3.5 text-[14px] font-semibold hover:bg-[#004ac6] transition-all shadow-md cursor-pointer"
            >
              <Printer size={16} />
              Cetak / Simpan PDF
            </button>
          </div>

          <button
            onClick={() => navigate('/self-assessment')}
            className="text-dash-muted hover:text-dash-primary text-[14px] font-medium transition-colors mt-2"
          >
            Kembali ke Halaman
          </button>
        </div>

        {/* Printable Report View (Hidden on screen, shown in print) */}
        <div className="hidden print:block p-8 bg-white text-left font-sans text-black">
          <div className="border-b-2 border-dash-primary pb-4 mb-6">
            <h1 className="text-2xl font-bold text-dash-primary">Mindcare</h1>
            <p className="text-sm text-gray-500">Laporan Resmi Hasil Asesmen Mandiri</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
            <div>
              <p className="font-semibold text-gray-700">Nama Asesmen:</p>
              <p className="text-gray-900 font-bold">{config.title}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-700">Tanggal Asesmen:</p>
              <p className="text-gray-900">{new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-700">Tingkat Keparahan:</p>
              <p className="text-gray-900 font-bold text-lg">{result.severityText}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-700">Total Skor:</p>
              <p className="text-gray-900 font-bold text-lg">{result.result.score}</p>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-800 mb-2">Rekomendasi Klinis:</h3>
            <p className="text-gray-700 leading-relaxed text-sm">
              {result.result.recommendation}
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 mb-4 pb-1 border-b border-gray-200">Rincian Jawaban:</h3>
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-gray-300 text-gray-600 font-semibold">
                  <th className="py-2 w-10">No</th>
                  <th className="py-2">Pertanyaan</th>
                  <th className="py-2 pr-4 text-right">Jawaban</th>
                  <th className="py-2 text-right">Skor</th>
                </tr>
              </thead>
              <tbody>
                {config.questions.map((q, idx) => {
                  const score = answers[idx];
                  const optionText = config.options.find(opt => opt.score === score)?.text || score;
                  return (
                    <tr key={idx} className="border-b border-gray-100">
                      <td className="py-3 font-medium text-gray-500">{idx + 1}</td>
                      <td className="py-3 text-gray-800 pr-4">{q}</td>
                      <td className="py-3 text-gray-800 text-right font-medium">{optionText}</td>
                      <td className="py-3 text-gray-800 text-right font-semibold">{score}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-12 pt-6 border-t border-gray-200 text-xs text-gray-500 text-center leading-relaxed">
            <p className="font-semibold text-gray-700 mb-1">Disclaimer Penting:</p>
            <p>Hasil asesmen mandiri ini didasarkan pada instrumen skrining klinis standar (PHQ-9 / GAD-7) dan bertujuan sebagai alat bantu awal untuk memantau kesehatan mental Anda. Hasil ini tidak menggantikan diagnosis medis resmi dari psikiater, psikolog, atau profesional medis lainnya.</p>
            <p className="mt-2 text-dash-primary font-medium">© {new Date().getFullYear()} Mindcare. Hak Cipta Dilindungi.</p>
          </div>
        </div>
      </>
    );
  }


  const progress = ((currentQuestion) / config.questions.length) * 100;
  const isLastQuestion = currentQuestion === config.questions.length - 1;
  const canSubmit = !answers.includes(null);

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-300">
      <button 
        onClick={() => navigate('/self-assessment')}
        className="flex items-center gap-2 text-[13px] text-dash-muted hover:text-dash-primary mb-8 transition-colors font-medium w-fit"
      >
        <ArrowLeft size={16} />
        Kembali ke Halaman
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Kolom Informasi & Progress */}
        <div className="lg:col-span-4 flex flex-col gap-6 lg:sticky lg:top-6">
          <div>
            <h1 className="text-[32px] leading-[44px] font-bold tracking-tight text-dash-primary mb-3">
              {config.title}
            </h1>
            <p className="text-[15px] leading-relaxed text-dash-muted">
              {config.description}
            </p>
          </div>
          
          <div className="bg-white rounded-xl2 p-6 border border-dash-border shadow-sm">
            <div className="flex justify-between items-center text-sm font-semibold text-dash-text mb-4">
              <span>Progress Asesmen</span>
              <span className="text-dash-primary">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-[#e6e8ea] h-2.5 rounded-full overflow-hidden">
              <div 
                className="bg-dash-primary h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="mt-5 flex justify-between items-center text-[13px] font-medium text-dash-muted">
              <span>Pertanyaan saat ini:</span>
              <span className="bg-dash-primary/10 text-dash-primary px-3 py-1 rounded-full">
                {currentQuestion + 1} / {config.questions.length}
              </span>
            </div>
          </div>
        </div>

        {/* Kolom Kuis */}
        <div className="lg:col-span-8 bg-white border border-dash-border rounded-xl2 p-8 md:p-10 shadow-sm flex flex-col min-h-[500px]">
          <h2 className="text-[24px] md:text-[28px] leading-9 md:leading-[42px] font-semibold text-dash-text mb-10">
            "{config.questions[currentQuestion]}"
          </h2>

          <div className="flex flex-col gap-4 flex-1">
            {config.options.map((opt, i) => {
              const isSelected = answers[currentQuestion] === opt.score;
              return (
                <button
                  key={i}
                  onClick={() => handleSelectOption(opt.score)}
                  className={`group flex items-center justify-between w-full p-5 rounded-xl border-2 text-left transition-all duration-200 ${
                    isSelected 
                      ? 'border-dash-primary bg-dash-primary/5 text-dash-primary shadow-sm' 
                      : 'border-dash-border hover:border-dash-primary/40 hover:bg-dash-primary/5 text-dash-text'
                  }`}
                >
                  <span className={`font-semibold text-[16px] ${isSelected ? 'text-dash-primary' : 'text-dash-text'}`}>
                    {opt.text}
                  </span>
                  <div className={`size-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                    isSelected ? 'border-dash-primary bg-dash-primary' : 'border-[#d4d6db] bg-white group-hover:border-dash-primary/40'
                  }`}>
                    {isSelected && <div className="size-2.5 bg-white rounded-full animate-in zoom-in" />}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex justify-between mt-12 pt-8 border-t border-dash-border">
            <button
              onClick={handleBack}
              disabled={currentQuestion === 0}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-[14px] transition-colors ${
                currentQuestion === 0 ? 'text-[#d4d6db] cursor-not-allowed' : 'text-dash-muted hover:bg-dash-primary/5 hover:text-dash-primary'
              }`}
            >
              <ChevronLeft size={18} />
              Sebelumnya
            </button>

            {isLastQuestion ? (
              <button
                onClick={handleSubmit}
                disabled={!canSubmit || isSubmitting}
                className={`flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-[14px] transition-all shadow-sm ${
                  (!canSubmit || isSubmitting) ? 'bg-[#d4d6db] text-white cursor-not-allowed' : 'bg-dash-primary text-white hover:bg-[#004ac6]'
                }`}
              >
                {isSubmitting ? 'Menyimpan...' : 'Selesai & Simpan'}
                <CheckCircle2 size={18} />
              </button>
            ) : (
              <button
                onClick={() => setCurrentQuestion(q => q + 1)}
                disabled={answers[currentQuestion] === null}
                className={`flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-[14px] transition-all shadow-sm ${
                  answers[currentQuestion] === null ? 'bg-[#d4d6db] text-white cursor-not-allowed' : 'bg-dash-primary text-white hover:bg-[#004ac6]'
                }`}
              >
                Selanjutnya
                <ChevronRight size={18} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
