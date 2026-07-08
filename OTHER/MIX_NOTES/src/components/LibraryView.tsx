import { useState } from 'react';
import { Search, ChevronRight, CheckCircle2 } from 'lucide-react';
import type { Library, Topic } from '../types';
import { DifficultyBadge } from './DifficultyBadge';
import { getLibraryIcon } from '../lib/icons';
import type { RevisionData } from '../lib/useRevisionData';

interface Props {
  library: Library;
  data: RevisionData;
  onSelect: (topicId: string) => void;
}

export function LibraryView({ library, data, onSelect }: Props) {
  const [query, setQuery] = useState('');
  const [activeCat, setActiveCat] = useState<string>('all');

  const Icon = getLibraryIcon(library.icon);

  const cats = ['all', ...library.categories];
  const filtered = library.topics.filter((t) => {
    const matchesCat = activeCat === 'all' || t.category === activeCat;
    const q = query.trim().toLowerCase();
    const matchesQuery =
      !q ||
      t.title.toLowerCase().includes(q) ||
      t.summary.toLowerCase().includes(q) ||
      t.definition.toLowerCase().includes(q);
    return matchesCat && matchesQuery;
  });

  const learnedCount = library.topics.filter((t) => data.getProgress(library.id, t.id) === 'learned').length;
  const pct = Math.round((learnedCount / library.topics.length) * 100);

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <div className={`relative overflow-hidden rounded-2xl border border-ink-700/50 p-6 mb-6 bg-gradient-to-br ${library.color}`}>
        <div className="absolute inset-0 grid-texture opacity-20" />
        <div className="absolute -right-8 -top-8 opacity-20">
          <Icon size={160} strokeWidth={1} />
        </div>
        <div className="relative">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center text-white">
              <Icon size={22} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{library.name}</h1>
              <p className="text-white/80 text-sm">{library.tagline}</p>
            </div>
          </div>
          <p className="text-white/90 text-sm leading-relaxed max-w-2xl mt-3">{library.description}</p>

          {/* progress */}
          <div className="mt-4 flex items-center gap-3 max-w-sm">
            <div className="flex-1 h-2 rounded-full bg-white/25 overflow-hidden">
              <div className="h-full bg-white rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
            </div>
            <span className="text-xs text-white font-medium tabular-nums">{learnedCount}/{library.topics.length}</span>
          </div>
        </div>
      </div>

      {/* Search + filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${library.name} topics…`}
            className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-ink-850/60 border border-ink-700/50 text-sm text-ink-100 placeholder:text-ink-500 outline-none focus:border-ink-600 transition-colors"
          />
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {cats.map((c) => (
            <button
              key={c}
              onClick={() => setActiveCat(c)}
              className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap border transition-colors ${
                activeCat === c
                  ? 'bg-ink-700/70 border-ink-600 text-ink-50'
                  : 'border-ink-700/40 text-ink-400 hover:text-ink-200 hover:bg-ink-800/50'
              }`}
            >
              {c === 'all' ? 'All topics' : c}
            </button>
          ))}
        </div>
      </div>

      {/* Topic grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-ink-500 text-sm">No topics match your search.</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filtered.map((topic) => (
            <TopicCard
              key={topic.id}
              topic={topic}
              library={library}
              learned={data.getProgress(library.id, topic.id) === 'learned'}
              bookmarked={data.isBookmarked(library.id, topic.id)}
              onClick={() => onSelect(topic.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function TopicCard({
  topic, library, learned, bookmarked, onClick,
}: {
  topic: Topic; library: Library; learned: boolean; bookmarked: boolean; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group text-left rounded-xl border border-ink-700/50 bg-ink-850/50 hover:bg-ink-800/60 hover:border-ink-600/70 p-4 transition-all hover:-translate-y-0.5 hover:shadow-card"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <DifficultyBadge level={topic.difficulty} />
        <div className="flex items-center gap-1.5">
          {learned && <CheckCircle2 size={14} className="text-emerald-400" />}
          {bookmarked && <span className="w-2 h-2 rounded-full bg-amber-400" />}
        </div>
      </div>
      <h3 className="font-semibold text-ink-50 text-[15px] leading-snug group-hover:text-white">{topic.title}</h3>
      <p className="text-sm text-ink-400 mt-1.5 line-clamp-2 leading-relaxed">{topic.summary}</p>
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-ink-700/40">
        <span className="text-[11px] text-ink-500">{topic.examples.length} examples</span>
        <span className="flex items-center gap-0.5 text-xs font-medium transition-colors" style={{ color: library.accent }}>
          Read <ChevronRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
        </span>
      </div>
    </button>
  );
}
