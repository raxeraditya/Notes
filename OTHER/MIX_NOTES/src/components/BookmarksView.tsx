import { Bookmark, Trash2, ChevronRight } from 'lucide-react';
import { libraries } from '../data/libraries';
import { getLibraryIcon } from '../lib/icons';
import type { RevisionData } from '../lib/useRevisionData';

interface Props {
  data: RevisionData;
  onSelectTopic: (libraryId: string, topicId: string) => void;
}

export function BookmarksView({ data, onSelectTopic }: Props) {
  if (data.bookmarks.length === 0) {
    return (
      <div className="animate-fade-in text-center py-24">
        <div className="w-14 h-14 rounded-2xl bg-ink-850 border border-ink-700/50 flex items-center justify-center mx-auto mb-4">
          <Bookmark size={24} className="text-ink-500" />
        </div>
        <h2 className="text-lg font-semibold text-ink-100">No bookmarks yet</h2>
        <p className="text-sm text-ink-400 mt-1">Bookmark topics from the library to find them here quickly.</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold text-ink-50 mb-1">Bookmarks</h1>
      <p className="text-sm text-ink-400 mb-5">{data.bookmarks.length} saved topics</p>
      <div className="space-y-2.5">
        {data.bookmarks.map((bm) => {
          const lib = libraries.find((l) => l.id === bm.library);
          if (!lib) return null;
          const Icon = getLibraryIcon(lib.icon);
          return (
            <div
              key={`${bm.library}-${bm.topicId}`}
              className="group flex items-center gap-3 rounded-xl border border-ink-700/50 bg-ink-850/50 hover:bg-ink-800/60 hover:border-ink-600/70 p-3.5 transition-all"
            >
              <button onClick={() => onSelectTopic(bm.library, bm.topicId)} className="flex items-center gap-3 flex-1 min-w-0 text-left">
                <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${lib.color} flex items-center justify-center text-white shrink-0`}>
                  <Icon size={16} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[11px] text-ink-500">{lib.name}</div>
                  <div className="text-sm font-medium text-ink-100 truncate">{bm.title}</div>
                </div>
                <ChevronRight size={16} className="text-ink-600 group-hover:text-ink-300 group-hover:translate-x-0.5 transition-all shrink-0" />
              </button>
              <button
                onClick={() => data.toggleBookmark(bm.library, bm.topicId, bm.title)}
                className="p-2 rounded-lg text-ink-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors opacity-0 group-hover:opacity-100"
                title="Remove bookmark"
              >
                <Trash2 size={15} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
