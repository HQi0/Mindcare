import useFetch from '../../hooks/useFetch.js';
import { getDailyQuote } from '../../services/moodTrackerService.js';

export default function MoodQuoteCard() {
  const { data: quote } = useFetch(getDailyQuote, []);

  return (
    <div className="bg-auth-input border-l-4 border-dash-primary rounded-xl2 py-4 pl-5 pr-4">
      <p className="text-[13px] italic leading-[18px] text-dash-muted">
        &ldquo;{quote?.text}&rdquo;
      </p>
    </div>
  );
}
