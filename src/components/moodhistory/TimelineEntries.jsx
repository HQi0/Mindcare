import { useState } from 'react';
import { Smile, Meh, Frown, AlertCircle } from 'lucide-react';
import useFetch from '../../hooks/useFetch.js';
import { getTimelineEntries } from '../../services/moodHistoryService.js';
import { MOOD_COLORS } from '../../utils/moodColors.js';

const MOOD_ICON = {
  senang: Smile,
  netral: Meh,
  cemas: AlertCircle,
  sedih: Frown,
};

export default function TimelineEntries() {
  const { data: entries, loading } = useFetch(getTimelineEntries, []);
  const [selectedFilter, setSelectedFilter] = useState('semua');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter logic
  const filteredEntries = entries?.filter((entry) => {
    if (selectedFilter === 'semua') return true;
    return entry.mood === selectedFilter;
  }) || [];

  // Limit to show on screen (max 10)
  const displayEntries = filteredEntries.slice(0, 10);

  return (
    <>
      <div className="col-span-1 md:col-span-8 bg-white border border-auth-card rounded-xl2 overflow-hidden shadow-sm flex flex-col">
        <div className="border-b border-auth-card px-4 py-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-dash-text">Timeline Catatan Harian</h3>
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="bg-auth-input rounded-lg px-3 py-1 text-[11px] font-bold text-dash-muted border-none focus:outline-none cursor-pointer"
          >
            <option value="semua">Semua Mood</option>
            <option value="senang">Senang</option>
            <option value="netral">Netral</option>
            <option value="cemas">Cemas</option>
            <option value="sedih">Sedih</option>
          </select>
        </div>

        <div className="max-h-[420px] overflow-y-auto">
          {loading &&
            [1, 2, 3].map((n) => (
              <div key={n} className="h-20 mx-4 my-3 rounded-lg bg-auth-input animate-pulse" />
            ))}

          {!loading && displayEntries.length === 0 ? (
            <div className="p-12 text-center text-dash-muted text-sm font-medium flex flex-col items-center justify-center gap-2">
              <Frown size={32} className="text-dash-border" />
              <span>Tidak ada catatan harian untuk mood ini.</span>
            </div>
          ) : (
            displayEntries.map((entry, index) => {
              const Icon = MOOD_ICON[entry.mood] ?? Meh;
              const colors = MOOD_COLORS[entry.mood] || { bg: 'bg-gray-100', text: 'text-gray-600' };
              const isLast = index === displayEntries.length - 1;
              return (
                <div
                  key={entry.id}
                  className={`flex gap-4 px-4 py-4 ${!isLast ? 'border-b border-auth-card/50' : ''}`}
                >
                  <div className="flex flex-col items-center gap-1 shrink-0">
                    <span className="text-[11px] font-bold uppercase text-dash-linkMuted">
                      {entry.date}
                    </span>
                    <span className={`flex items-center justify-center size-10 rounded-full ${colors.bg} ${colors.text}`}>
                      <Icon size={18} />
                    </span>
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col gap-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-[13.5px] font-bold text-dash-text">{entry.title}</p>
                      <span className="text-[11px] text-dash-linkMuted whitespace-nowrap">
                        {entry.time}
                      </span>
                    </div>
                    <p className="text-[13px] leading-[18px] text-dash-muted">{entry.note}</p>
                    <div className="flex gap-2 pt-1 flex-wrap">
                      {entry.tags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-auth-input text-dash-linkMuted text-[11px] px-2 py-0.5 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="bg-auth-input text-dash-primary text-[13px] font-bold py-3.5 hover:bg-auth-input/70 transition-colors cursor-pointer"
        >
          Lihat Lebih Banyak Catatan
        </button>
      </div>

      {/* Scrollable Popup Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in duration-200">
          <div className="bg-white rounded-xl2 p-6 max-w-2xl w-full mx-4 shadow-2xl border border-dash-border flex flex-col h-[75vh] animate-in zoom-in-95 duration-200 text-left">
            {/* Header Modal */}
            <div className="flex items-center justify-between border-b border-auth-card pb-4 mb-4">
              <div>
                <h3 className="text-lg font-bold text-dash-text">Semua Catatan Harian</h3>
                <p className="text-xs text-dash-muted mt-1">
                  Menampilkan {filteredEntries.length} catatan ({selectedFilter === 'semua' ? 'Semua Mood' : `Filter: ${selectedFilter.charAt(0).toUpperCase() + selectedFilter.slice(1)}`})
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-dash-muted hover:text-dash-primary text-xl font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Scrollable List */}
            <div className="flex-1 overflow-y-auto pr-1 flex flex-col">
              {filteredEntries.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-dash-muted">
                  <Frown size={48} className="mb-2 text-dash-border" />
                  <p className="text-sm font-semibold">Tidak ada catatan untuk mood ini.</p>
                </div>
              ) : (
                filteredEntries.map((entry, index) => {
                  const Icon = MOOD_ICON[entry.mood] ?? Meh;
                  const colors = MOOD_COLORS[entry.mood] || { bg: 'bg-gray-100', text: 'text-gray-600' };
                  const isLast = index === filteredEntries.length - 1;
                  return (
                    <div
                      key={entry.id}
                      className={`flex gap-4 py-4 ${!isLast ? 'border-b border-auth-card/50' : ''}`}
                    >
                      <div className="flex flex-col items-center gap-1 shrink-0">
                        <span className="text-[11px] font-bold uppercase text-dash-linkMuted">
                          {entry.date}
                        </span>
                        <span className={`flex items-center justify-center size-10 rounded-full ${colors.bg} ${colors.text}`}>
                          <Icon size={18} />
                        </span>
                      </div>

                      <div className="flex-1 min-w-0 flex flex-col gap-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-[13.5px] font-bold text-dash-text">{entry.title}</p>
                          <span className="text-[11px] text-dash-linkMuted whitespace-nowrap">
                            {entry.time}
                          </span>
                        </div>
                        <p className="text-[13px] leading-[18px] text-dash-muted">{entry.note}</p>
                        <div className="flex gap-2 pt-1 flex-wrap">
                          {entry.tags.map((tag) => (
                            <span
                              key={tag}
                              className="bg-auth-input text-dash-linkMuted text-[11px] px-2 py-0.5 rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer Modal */}
            <div className="border-t border-auth-card pt-4 mt-4 text-right">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-dash-primary text-white text-xs font-semibold rounded-lg px-6 py-2.5 hover:bg-[#004ac6] transition-colors shadow cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
