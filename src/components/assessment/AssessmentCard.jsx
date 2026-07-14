import { Link } from 'react-router-dom';
import { Clock, ArrowRight } from 'lucide-react';

export default function AssessmentCard({ assessment }) {
  const isLarge = assessment.size === 'lg';

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

      <Link
        to={`/self-assessment/${assessment.id}`}
        className={`flex items-center justify-center gap-2 rounded-lg py-3 text-sm font-semibold transition-colors ${
          assessment.outlined
            ? 'border border-dash-primary text-dash-primary'
            : 'bg-dash-primary text-white'
        }`}
      >
        {assessment.buttonLabel}
        {!assessment.outlined && <ArrowRight size={14} />}
      </Link>
    </div>
  );
}
