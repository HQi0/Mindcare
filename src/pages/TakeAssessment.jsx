import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ASSESSMENTS_DATA, saveAssessment } from '../services/selfAssessmentService.js';
import { ArrowLeft, CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react';

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
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-6 animate-in fade-in zoom-in duration-500">
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

        <button
          onClick={() => navigate('/self-assessment')}
          className="mt-6 bg-dash-primary text-white rounded-xl px-8 py-4 text-[15px] font-semibold hover:bg-[#004ac6] transition-colors shadow-md"
        >
          Kembali ke Perpustakaan
        </button>
      </div>
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
        Kembali ke Perpustakaan
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
