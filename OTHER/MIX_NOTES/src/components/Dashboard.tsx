import { Flame, BookMarked, TrendingUp, Target, Calendar, ArrowRight, Sparkles } from 'lucide-react';
import { libraries, totalTopics, getTopic } from '../data/libraries';
import { getLibraryIcon } from '../lib/icons';
import type { RevisionData } from '../lib/useRevisionData';

interface Props {
  data: RevisionData;
  onSelectLibrary: (id: string) => void;
  onSelectTopic: (libraryId: string, topicId: string) => void;
}

export function Dashboard({ data, onSelectLibrary, onSelectTopic }: Props) {
  const total = totalTopics();
  const learnedTotal = data.progress.filter((p) => p.status === 'learned').length;
  const overallPct = Math.round((learnedTotal / total) * 100);
  const continueTopics = pickContinueTopics(data, 4);

  return (
    <div className="animate-fade-in space-y-6">
      {/* Hero greeting */}
      <div className="relative overflow-hidden rounded-2xl border border-ink-700/50 bg-gradient-to-br from-ink-850 to-ink-900 p-6 sm:p-8">
        <div className="absolute inset-0 grid-texture opacity-30" />
        <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-sky-500/10 blur-3xl" />
        <div className="absolute -left-10 -top-10 w-56 h-56 rounded-full bg-emerald-500/8 blur-3xl" />
        <div className="relative">
          <div className="flex items-center gap-2 text-xs text-ink-400 mb-2">
            <Sparkles size={14} className="text-sky-400" />
            <span>{greeting()}, Aditya</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-ink-50 leading-tight">
            Master C++, Python &amp; SQL, <span className="text-sky-400">one topic at a time</span>
          </h1>
          <p className="mt-2 text-ink-300 text-sm max-w-xl leading-relaxed">
            Complete revision notes with definitions, syntax, and worked examples.
            C++ from basics to advanced, Python data-science libraries (NumPy, Pandas, Matplotlib,
            Seaborn, SciPy, Plotly), and SQLite/SQL.
          </p>

          {/* Stat row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            <StatCard icon={<Flame size={18} />} label="Day streak" value={data.streakDays} accent="text-amber-400" />
            <StatCard icon={<Target size={18} />} label="Topics learned" value={`${learnedTotal}/${total}`} accent="text-emerald-400" />
            <StatCard icon={<TrendingUp size={18} />} label="Reviews logged" value={data.topicsReviewedCount} accent="text-sky-400" />
            <StatCard icon={<BookMarked size={18} />} label="Bookmarks" value={data.bookmarks.length} accent="text-rose-400" />
          </div>
        </div>
      </div>

      {/* Overall progress bar */}
      <div className="rounded-xl border border-ink-700/50 bg-ink-850/50 p-5">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-semibold text-ink-100 flex items-center gap-2">
            <TrendingUp size={15} className="text-sky-400" /> Overall progress
          </h2>
          <span className="text-xs text-ink-400 tabular-nums">{overallPct}%</span>
        </div>
        <div className="h-2.5 rounded-full bg-ink-800 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-sky-500 to-emerald-500 rounded-full transition-all duration-700"
            style={{ width: `${overallPct}%` }}
          />
        </div>
      </div>

      {/* Continue where you left off */}
      {continueTopics.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-ink-100 mb-3">Continue revising</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {continueTopics.map(({ libraryId, topicId }) => {
              const lib = libraries.find((l) => l.id === libraryId)!;
              const topic = getTopic(libraryId, topicId)!;
              const Icon = getLibraryIcon(lib.icon);
              return (
                <button
                  key={`${libraryId}-${topicId}`}
                  onClick={() => onSelectTopic(libraryId, topicId)}
                  className="group flex items-center gap-3 rounded-xl border border-ink-700/50 bg-ink-850/50 hover:bg-ink-800/60 hover:border-ink-600/70 p-3.5 transition-all text-left"
                >
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${lib.color} flex items-center justify-center text-white shrink-0`}>
                    <Icon size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[11px] text-ink-500">{lib.name}</div>
                    <div className="text-sm font-medium text-ink-100 truncate">{topic.title}</div>
                  </div>
                  <ArrowRight size={16} className="text-ink-600 group-hover:text-ink-300 group-hover:translate-x-0.5 transition-all shrink-0" />
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* Library cards */}
      <section>
        <h2 className="text-sm font-semibold text-ink-100 mb-3">Libraries</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {libraries.map((lib) => {
            const Icon = getLibraryIcon(lib.icon);
            const learned = data.progress.filter((p) => p.library === lib.id && p.status === 'learned').length;
            const pct = Math.round((learned / lib.topics.length) * 100);
            return (
              <button
                key={lib.id}
                onClick={() => onSelectLibrary(lib.id)}
                className="group relative overflow-hidden rounded-xl border border-ink-700/50 bg-ink-850/50 hover:bg-ink-800/60 hover:border-ink-600/70 p-4 transition-all text-left"
              >
                <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full bg-gradient-to-br ${lib.color} opacity-10 blur-2xl group-hover:opacity-20 transition-opacity`} />
                <div className="relative">
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${lib.color} flex items-center justify-center text-white`}>
                      <Icon size={17} />
                    </div>
                    <div>
                      <div className="font-semibold text-ink-50 text-[15px]">{lib.name}</div>
                      <div className="text-[11px] text-ink-500">{lib.topics.length} topics</div>
                    </div>
                  </div>
                  <p className="text-xs text-ink-400 leading-relaxed line-clamp-2 mb-3">{lib.tagline}</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full bg-ink-800 overflow-hidden">
                      <div className={`h-full bg-gradient-to-r ${lib.color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-[10px] text-ink-500 tabular-nums">{pct}%</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Activity heatmap */}
      <section className="rounded-xl border border-ink-700/50 bg-ink-850/50 p-5">
        <h2 className="text-sm font-semibold text-ink-100 flex items-center gap-2 mb-3">
          <Calendar size={15} className="text-emerald-400" /> Revision activity
        </h2>
        <ActivityHeatmap dates={data.reviewDates} />
        <p className="text-xs text-ink-500 mt-3">
          {data.topicsReviewedCount} reviews across {data.reviewDates.length} days.
        </p>
      </section>
    </div>
  );
}

function StatCard({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: string | number; accent: string }) {
  return (
    <div className="rounded-xl border border-ink-700/50 bg-ink-900/60 p-3.5">
      <div className={`flex items-center gap-1.5 text-xs ${accent}`}>
        {icon}
        <span className="text-ink-400">{label}</span>
      </div>
      <div className="text-2xl font-bold text-ink-50 mt-1 tabular-nums">{value}</div>
    </div>
  );
}

/** Last ~24 weeks GitHub-style heatmap. */
function ActivityHeatmap({ dates }: { dates: string[] }) {
  const set = new Set(dates);
  const weeks = 24;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  // start from the Sunday of (today - weeks*7)
  const start = new Date(today);
  start.setDate(start.getDate() - (weeks * 7) + (6 - start.getDay()));

  const cells: { date: Date; key: string; active: boolean }[] = [];
  for (let i = 0; i < weeks * 7; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    if (d > today) break;
    cells.push({ date: d, key: d.toISOString().slice(0, 10), active: set.has(d.toISOString().slice(0, 10)) });
  }

  // group into weeks (columns)
  const columns: typeof cells[] = [];
  for (let i = 0; i < cells.length; i += 7) {
    columns.push(cells.slice(i, i + 7));
  }

  return (
    <div className="flex gap-[3px] overflow-x-auto pb-1">
      {columns.map((col, ci) => (
        <div key={ci} className="flex flex-col gap-[3px]">
          {col.map((c) => (
            <div
              key={c.key}
              title={`${c.key}${c.active ? ' — reviewed' : ''}`}
              className={`w-[11px] h-[11px] rounded-sm transition-colors ${
                c.active ? 'bg-emerald-500 hover:bg-emerald-400' : 'bg-ink-800/80 hover:bg-ink-700'
              }`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

/** Pick topics the user has started (learning) or recently reviewed to continue. */
function pickContinueTopics(data: RevisionData, n: number) {
  const seen = new Set<string>();
  const picks: { libraryId: string; topicId: string }[] = [];

  // Topics currently "learning"
  for (const p of data.progress.filter((p) => p.status === 'learning')) {
    const key = `${p.library}/${p.topicId}`;
    if (!seen.has(key)) {
      seen.add(key);
      picks.push({ libraryId: p.library, topicId: p.topicId });
    }
    if (picks.length >= n) break;
  }
  // Fill from recent reviews
  if (picks.length < n) {
    for (const r of [...data.reviewLog].reverse()) {
      const key = `${r.library}/${r.topicId}`;
      if (!seen.has(key)) {
        seen.add(key);
        picks.push({ libraryId: r.library, topicId: r.topicId });
      }
      if (picks.length >= n) break;
    }
  }
  // Fill with first topic of first library
  if (picks.length < n) {
    for (const lib of libraries) {
      for (const t of lib.topics) {
        const key = `${lib.id}/${t.id}`;
        if (!seen.has(key)) {
          seen.add(key);
          picks.push({ libraryId: lib.id, topicId: t.id });
        }
        if (picks.length >= n) return picks;
      }
    }
  }
  return picks;
}
