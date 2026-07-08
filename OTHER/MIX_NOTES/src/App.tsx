import { useEffect, useMemo, useState } from 'react';
import {
  Home, Search, Bookmark as BookmarkIcon, Flame, X, Menu, BookOpen, Check,
} from 'lucide-react';
import { libraries, getLibrary, getTopic, languageGroups, totalTopics } from './data/libraries';
import { getLibraryIcon } from './lib/icons';
import { useRevisionData } from './lib/useRevisionData';
import { Dashboard } from './components/Dashboard';
import { LibraryView } from './components/LibraryView';
import { TopicDetail } from './components/TopicDetail';
import { BookmarksView } from './components/BookmarksView';

type Route =
  | { name: 'dashboard' }
  | { name: 'library'; libraryId: string }
  | { name: 'topic'; libraryId: string; topicId: string }
  | { name: 'bookmarks' };

export default function App() {
  const data = useRevisionData();
  const [route, setRoute] = useState<Route>({ name: 'dashboard' });
  const [searchOpen, setSearchOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Keyboard: cmd/ctrl + k opens search
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((o) => !o);
      }
      if (e.key === 'Escape') setSearchOpen(false);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  function navigate(libraryId: string, topicId: string) {
    setRoute({ name: 'topic', libraryId, topicId });
    setSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function openLibrary(id: string) {
    setRoute({ name: 'library', libraryId: id });
    setSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function openDashboard() {
    setRoute({ name: 'dashboard' });
    setSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function openBookmarks() {
    setRoute({ name: 'bookmarks' });
    setSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className="app-bg min-h-screen text-ink-200">
      <div className="flex">
        {/* Sidebar */}
        <Sidebar
          route={route}
          data={data}
          onDashboard={openDashboard}
          onLibrary={openLibrary}
          onBookmarks={openBookmarks}
          onTopic={navigate}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main */}
        <div className="flex-1 min-w-0 lg:pl-[260px]">
          {/* Top bar */}
          <header className="sticky top-0 z-30 backdrop-blur-md bg-ink-950/70 border-b border-ink-800/60">
            <div className="flex items-center gap-3 px-4 sm:px-6 h-14">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 -ml-2 rounded-lg text-ink-300 hover:bg-ink-800/60"
              >
                <Menu size={18} />
              </button>
              {/* Mobile brand */}
              <button
                onClick={openDashboard}
                className="lg:hidden flex items-center gap-2 shrink-0"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-sky-500 to-emerald-500 flex items-center justify-center">
                  <BookOpen size={15} className="text-white" />
                </div>
                <span className="text-sm font-bold text-ink-50">Aditya Notes</span>
              </button>
              <button
                onClick={() => setSearchOpen(true)}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-ink-850/70 border border-ink-700/50 text-sm text-ink-500 hover:bg-ink-800/70 hover:text-ink-300 transition-colors flex-1 max-w-md"
              >
                <Search size={15} />
                <span>Search topics…</span>
                <kbd className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-ink-800 border border-ink-700 text-ink-400 font-mono">⌘K</kbd>
              </button>
              <button
                onClick={() => setSearchOpen(true)}
                className="sm:hidden p-2 rounded-lg text-ink-400 hover:bg-ink-800/60 hover:text-ink-200 transition-colors"
              >
                <Search size={18} />
              </button>
              <div className="ml-auto flex items-center gap-2">
                <button
                  onClick={openBookmarks}
                  className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-ink-850/70 border border-ink-700/50 text-ink-300 hover:bg-ink-800/70 hover:text-ink-100 transition-colors"
                >
                  <BookmarkIcon size={14} />
                  <span className="text-xs font-semibold tabular-nums">{data.bookmarks.length}</span>
                </button>
                {/* streak chip */}
                <div className="hidden xs:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-ink-850/70 border border-ink-700/50">
                  <Flame size={14} className={data.streakDays > 0 ? 'text-amber-400' : 'text-ink-600'} />
                  <span className="text-xs font-semibold text-ink-200 tabular-nums">{data.streakDays}</span>
                  <span className="hidden sm:inline text-[10px] text-ink-500">day{data.streakDays === 1 ? '' : 's'}</span>
                </div>
              </div>
            </div>
          </header>

          {/* Content */}
          <main className="px-4 sm:px-6 py-6 max-w-6xl mx-auto">
            {data.loading && route.name === 'dashboard' ? (
              <LoadingState />
            ) : (
              <Content
                route={route}
                data={data}
                onLibrary={openLibrary}
                onTopic={navigate}
              />
            )}
          </main>

          <footer className="mt-8 border-t border-ink-800/60 bg-ink-950/40">
            <div className="px-4 sm:px-6 py-8 sm:py-10">
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {/* Brand */}
                <div className="sm:col-span-2 lg:col-span-2">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-500 to-emerald-500 flex items-center justify-center">
                      <BookOpen size={16} className="text-white" />
                    </div>
                    <span className="text-base font-bold text-ink-50">Aditya Notes</span>
                  </div>
                  <p className="text-sm text-ink-400 leading-relaxed max-w-sm">
                    Daily-use revision notes for C++, Python data-science libraries, and SQLite/SQL.
                    Definitions, syntax, and worked examples — all saved locally in your browser.
                  </p>
                  <div className="flex items-center gap-3 mt-4 text-[11px] text-ink-600">
                    <span className="flex items-center gap-1"><Check size={11} className="text-emerald-500" /> No account needed</span>
                    <span className="flex items-center gap-1"><Check size={11} className="text-emerald-500" /> Works offline</span>
                  </div>
                </div>

                {/* Sections */}
                <div>
                  <h4 className="text-xs font-semibold text-ink-200 uppercase tracking-wider mb-3">Sections</h4>
                  <ul className="space-y-2 text-sm">
                    {libraries.slice(0, 6).map((lib) => (
                      <li key={lib.id}>
                        <button onClick={() => openLibrary(lib.id)} className="text-ink-400 hover:text-sky-400 transition-colors text-left">
                          {lib.name}
                        </button>
                      </li>
                    ))}
                    {libraries.length > 6 && (
                      <li className="text-[11px] text-ink-600 pt-1">+ {libraries.length - 6} more</li>
                    )}
                  </ul>
                </div>

                {/* Your data */}
                <div>
                  <h4 className="text-xs font-semibold text-ink-200 uppercase tracking-wider mb-3">Your data</h4>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <button onClick={openBookmarks} className="text-ink-400 hover:text-amber-400 transition-colors">
                        Bookmarks ({data.bookmarks.length})
                      </button>
                    </li>
                    <li>
                      <button onClick={openDashboard} className="text-ink-400 hover:text-emerald-400 transition-colors">
                        Progress &amp; streaks
                      </button>
                    </li>
                    <li className="flex items-center gap-1.5 text-ink-400">
                      <Flame size={13} className={data.streakDays > 0 ? 'text-amber-400' : 'text-ink-600'} />
                      <span>{data.streakDays}-day streak</span>
                    </li>
                    <li className="text-ink-400">{data.progress.filter((p) => p.status === 'learned').length} topics learned</li>
                  </ul>
                </div>
              </div>

              {/* Bottom bar */}
              <div className="mt-8 pt-5 border-t border-ink-800/50 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-ink-600">
                <p>© {new Date().getFullYear()} Aditya Notes. Built with React, Tailwind &amp; localStorage.</p>
                <p className="flex items-center gap-1.5">
                  <BookOpen size={12} /> C++ · Python · SQL — {totalTopics()} topics
                </p>
              </div>
            </div>
          </footer>
        </div>
      </div>

      {/* Search palette */}
      {searchOpen && <SearchPalette onClose={() => setSearchOpen(false)} onTopic={navigate} />}
    </div>
  );
}

function Content({
  route, data, onLibrary, onTopic,
}: {
  route: Route;
  data: ReturnType<typeof useRevisionData>;
  onLibrary: (id: string) => void;
  onTopic: (libId: string, topicId: string) => void;
}) {
  if (route.name === 'dashboard') {
    return <Dashboard data={data} onSelectLibrary={onLibrary} onSelectTopic={onTopic} />;
  }
  if (route.name === 'bookmarks') {
    return <BookmarksView data={data} onSelectTopic={onTopic} />;
  }
  if (route.name === 'library') {
    const lib = getLibrary(route.libraryId);
    if (!lib) return <NotFound />;
    return <LibraryView library={lib} data={data} onSelect={(tid) => onTopic(lib.id, tid)} />;
  }
  if (route.name === 'topic') {
    const lib = getLibrary(route.libraryId);
    const topic = getTopic(route.libraryId, route.topicId);
    if (!lib || !topic) return <NotFound />;
    return <TopicDetail library={lib} topic={topic} data={data} onNavigate={onTopic} />;
  }
  return <NotFound />;
}

function Sidebar({
  route, data, onDashboard, onLibrary, onBookmarks, onTopic, open, onClose,
}: {
  route: Route;
  data: ReturnType<typeof useRevisionData>;
  onDashboard: () => void;
  onLibrary: (id: string) => void;
  onBookmarks: () => void;
  onTopic: (lib: string, topic: string) => void;
  open: boolean;
  onClose: () => void;
}) {
  return (
    <>
      {/* Mobile overlay */}
      {open && <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={onClose} />}

      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-[260px] border-r border-ink-800/60 bg-ink-900/95 backdrop-blur-xl flex flex-col transition-transform lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-4 h-14 border-b border-ink-800/60 shrink-0">
          <button onClick={onDashboard} className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-500 to-emerald-500 flex items-center justify-center">
              <BookOpen size={17} className="text-white" />
            </div>
            <div className="text-left">
              <div className="text-sm font-bold text-ink-50 leading-none">Aditya Notes</div>
              <div className="text-[10px] text-ink-500 mt-0.5">C++ · Python · SQL</div>
            </div>
          </button>
          <button onClick={onClose} className="lg:hidden p-1.5 rounded-lg text-ink-400 hover:bg-ink-800/60">
            <X size={16} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          <NavButton icon={<Home size={16} />} label="Dashboard" active={route.name === 'dashboard'} onClick={onDashboard} />
          <NavButton
            icon={<BookmarkIcon size={16} />}
            label="Bookmarks"
            badge={data.bookmarks.length}
            active={route.name === 'bookmarks'}
            onClick={onBookmarks}
          />

          {languageGroups.map((group) => (
            <div key={group.label}>
              <div className="pt-4 pb-1.5 px-2 text-[10px] uppercase tracking-wider text-ink-600 font-semibold">{group.label}</div>
              {group.libraryIds.map((libId) => {
                const lib = libraries.find((l) => l.id === libId)!;
                const Icon = getLibraryIcon(lib.icon);
                const learned = data.progress.filter((p) => p.library === lib.id && p.status === 'learned').length;
                const isActive =
                  (route.name === 'library' && route.libraryId === lib.id) ||
                  (route.name === 'topic' && route.libraryId === lib.id);
                return (
                  <div key={lib.id}>
                    <button
                      onClick={() => onLibrary(lib.id)}
                      className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-colors ${
                        isActive ? 'bg-ink-800/70 text-ink-50' : 'text-ink-300 hover:bg-ink-800/50 hover:text-ink-100'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-md bg-gradient-to-br ${lib.color} flex items-center justify-center text-white shrink-0`}>
                        <Icon size={13} />
                      </div>
                      <span className="flex-1 text-left font-medium truncate">{lib.name}</span>
                      <span className="text-[10px] text-ink-500 tabular-nums shrink-0">{learned}/{lib.topics.length}</span>
                    </button>

                    {/* Expand topics when active library is selected */}
                    {isActive && route.name === 'topic' && (
                      <div className="ml-4 mt-1 mb-2 border-l border-ink-700/50 pl-2 space-y-0.5 max-h-64 overflow-y-auto animate-slide-in">
                        {lib.topics.map((t) => (
                          <button
                            key={t.id}
                            onClick={() => onTopic(lib.id, t.id)}
                            className={`w-full text-left px-2 py-1.5 rounded-md text-xs transition-colors ${
                              route.name === 'topic' && route.topicId === t.id
                                ? 'text-ink-50 font-medium bg-ink-800/60'
                                : 'text-ink-400 hover:text-ink-200 hover:bg-ink-800/40'
                            }`}
                          >
                            {t.title}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-ink-800/60 shrink-0">
          <a
            href="https://en.cppreference.com"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-ink-500 hover:text-ink-300 hover:bg-ink-800/50 transition-colors"
          >
            <BookOpen size={14} />
            Reference: cppreference
          </a>
        </div>
      </aside>
    </>
  );
}

function NavButton({ icon, label, active, onClick, badge }: { icon: React.ReactNode; label: string; active: boolean; onClick: () => void; badge?: number }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-colors ${
        active ? 'bg-ink-800/70 text-ink-50 font-medium' : 'text-ink-300 hover:bg-ink-800/50 hover:text-ink-100'
      }`}
    >
      <span className={active ? 'text-sky-400' : ''}>{icon}</span>
      <span className="flex-1 text-left">{label}</span>
      {badge !== undefined && badge > 0 && (
        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-ink-700/70 text-ink-300 tabular-nums">{badge}</span>
      )}
    </button>
  );
}

function SearchPalette({ onClose, onTopic }: { onClose: () => void; onTopic: (lib: string, topic: string) => void }) {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const all: { libId: string; libName: string; topicId: string; title: string; summary: string; category: string; accent: string }[] = [];
    for (const lib of libraries) {
      for (const t of lib.topics) {
        all.push({ libId: lib.id, libName: lib.name, topicId: t.id, title: t.title, summary: t.summary, category: t.category, accent: lib.accent });
      }
    }
    if (!q) return all.slice(0, 8);
    return all
      .filter((r) => r.title.toLowerCase().includes(q) || r.summary.toLowerCase().includes(q) || r.category.toLowerCase().includes(q) || r.libName.toLowerCase().includes(q))
      .slice(0, 12);
  }, [query]);

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center pt-[12vh] px-4 animate-fade-in" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-xl rounded-2xl border border-ink-700/60 bg-ink-900 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2.5 px-4 h-13 border-b border-ink-800/60">
          <Search size={17} className="text-ink-500" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search all topics across all libraries…"
            className="flex-1 bg-transparent outline-none text-sm text-ink-100 placeholder:text-ink-500 py-3.5"
          />
          <button onClick={onClose} className="p-1.5 rounded-lg text-ink-500 hover:bg-ink-800/60 hover:text-ink-300">
            <X size={16} />
          </button>
        </div>
        <div className="max-h-[50vh] overflow-y-auto p-2">
          {results.length === 0 ? (
            <div className="px-3 py-8 text-center text-sm text-ink-500">No results for "{query}"</div>
          ) : (
            results.map((r) => (
              <button
                key={`${r.libId}-${r.topicId}`}
                onClick={() => { onTopic(r.libId, r.topicId); onClose(); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-ink-800/70 transition-colors text-left group"
              >
                <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: r.accent }} />
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium text-ink-100 truncate">{r.title}</div>
                  <div className="text-xs text-ink-500 truncate">{r.libName} · {r.category}</div>
                </div>
              </button>
            ))
          )}
        </div>
        <div className="px-4 py-2.5 border-t border-ink-800/60 text-[11px] text-ink-600 flex items-center justify-between">
          <span>{results.length} results</span>
          <span><kbd className="px-1 py-0.5 rounded bg-ink-800 font-mono">esc</kbd> to close</span>
        </div>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-40 rounded-2xl bg-ink-850/50 shimmer" />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[0, 1, 2, 3].map((i) => <div key={i} className="h-24 rounded-xl bg-ink-850/50 shimmer" />)}
      </div>
      <div className="h-48 rounded-xl bg-ink-850/50 shimmer" />
    </div>
  );
}

function NotFound() {
  return (
    <div className="text-center py-24 text-ink-400">
      <p className="text-lg">Topic not found.</p>
    </div>
  );
}
