import { useEffect, useRef, useState } from 'react';
import {
  Bookmark, BookmarkCheck, CheckCircle2, Circle, BookOpen, Lightbulb,
  Code2, ArrowRight, StickyNote, ChevronRight, Check,
} from 'lucide-react';
import type { Library, Topic } from '../types';
import { CodeBlock } from './CodeBlock';
import { DifficultyBadge } from './DifficultyBadge';
import type { RevisionData } from '../lib/useRevisionData';

interface Props {
  library: Library;
  topic: Topic;
  data: RevisionData;
  onNavigate: (libraryId: string, topicId: string) => void;
}

export function TopicDetail({ library, topic, data, onNavigate }: Props) {
  const bookmarked = data.isBookmarked(library.id, topic.id);
  const progress = data.getProgress(library.id, topic.id);
  const noteContent = data.getNote(library.id, topic.id);
  const [noteDraft, setNoteDraft] = useState(noteContent);
  const [noteSaved, setNoteSaved] = useState(false);
  const noteTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setNoteDraft(noteContent);
  }, [noteContent, topic.id]);

  // Log a review on first mount of a topic (once per day).
  useEffect(() => {
    data.logReview(library.id, topic.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [library.id, topic.id]);

  function handleNoteChange(value: string) {
    setNoteDraft(value);
    setNoteSaved(false);
    if (noteTimer.current) clearTimeout(noteTimer.current);
    noteTimer.current = setTimeout(async () => {
      await data.saveNote(library.id, topic.id, value);
      setNoteSaved(true);
    }, 800);
  }

  const learned = progress === 'learned';

  return (
    <div className="animate-fade-in">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-ink-400 mb-4">
        <span className="text-ink-300">{library.name}</span>
        <ChevronRight size={13} className="text-ink-600" />
        <span>{topic.category}</span>
        <ChevronRight size={13} className="text-ink-600" />
        <span className="text-ink-100">{topic.title}</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <DifficultyBadge level={topic.difficulty} />
            <span className="text-xs text-ink-400">{topic.category}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-ink-50 leading-tight">{topic.title}</h1>
          <p className="mt-2 text-ink-300 text-sm leading-relaxed">{topic.summary}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => data.toggleBookmark(library.id, topic.id, topic.title)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
              bookmarked
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 hover:bg-amber-500/25'
                : 'border-ink-700/60 text-ink-300 hover:bg-ink-700/40 hover:text-ink-100'
            }`}
          >
            {bookmarked ? <BookmarkCheck size={15} /> : <Bookmark size={15} />}
            {bookmarked ? 'Bookmarked' : 'Bookmark'}
          </button>
          <button
            onClick={() => data.setProgress(library.id, topic.id, learned ? 'learning' : 'learned')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
              learned
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/25'
                : 'border-ink-700/60 text-ink-300 hover:bg-ink-700/40 hover:text-ink-100'
            }`}
          >
            {learned ? <CheckCircle2 size={15} /> : <Circle size={15} />}
            {learned ? 'Learned' : 'Mark learned'}
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        {/* Main column */}
        <div className="min-w-0 space-y-6">
          {/* Definition */}
          <section className="rounded-xl border border-ink-700/50 bg-ink-850/50 p-5">
            <SectionTitle icon={<BookOpen size={15} />} color={library.accent}>Definition</SectionTitle>
            <p className="text-ink-200 leading-relaxed text-[15px]">{topic.definition}</p>
          </section>

          {/* Syntax */}
          {topic.syntax && (
            <section className="rounded-xl border border-ink-700/50 bg-ink-850/50 p-5">
              <SectionTitle icon={<Code2 size={15} />} color={library.accent}>Syntax</SectionTitle>
              <CodeBlock code={topic.syntax} title="syntax" language={library.language} />
            </section>
          )}

          {/* Parameters */}
          {topic.parameters && topic.parameters.length > 0 && (
            <section className="rounded-xl border border-ink-700/50 bg-ink-850/50 p-5">
              <SectionTitle icon={<Code2 size={15} />} color={library.accent}>Parameters</SectionTitle>
              <div className="space-y-2.5">
                {topic.parameters.map((p) => (
                  <div key={p.name} className="grid sm:grid-cols-[140px_120px_1fr] gap-2 text-sm">
                    <code className="text-sky-300 font-mono text-[13px]">{p.name}</code>
                    <span className="text-ink-400 font-mono text-[12px] italic">{p.type}</span>
                    <span className="text-ink-300">{p.description}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Returns */}
          {topic.returns && (
            <section className="rounded-xl border border-ink-700/50 bg-ink-850/50 p-5">
              <SectionTitle icon={<ArrowRight size={15} />} color={library.accent}>Returns</SectionTitle>
              <p className="text-ink-200 leading-relaxed text-[15px]">{topic.returns}</p>
            </section>
          )}

          {/* Key points */}
          <section className="rounded-xl border border-ink-700/50 bg-ink-850/50 p-5">
            <SectionTitle icon={<Lightbulb size={15} />} color={library.accent}>Key Points</SectionTitle>
            <ul className="space-y-2.5">
              {topic.keyPoints.map((kp, i) => (
                <li key={i} className="flex items-start gap-2.5 text-[15px] text-ink-200 leading-relaxed">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: library.accent }} />
                  <span>{kp}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Examples */}
          <section className="space-y-5">
            <div className="flex items-center gap-2">
              <Code2 size={18} style={{ color: library.accent }} />
              <h2 className="text-lg font-semibold text-ink-50">Code Examples</h2>
              <span className="text-xs text-ink-500">— copy into your compiler</span>
            </div>
            {topic.examples.map((ex, i) => (
              <div key={i} className="space-y-2.5">
                <div>
                  <h3 className="text-[15px] font-semibold text-ink-100">{ex.title}</h3>
                  <p className="text-sm text-ink-400 mt-0.5">{ex.description}</p>
                </div>
                <CodeBlock code={ex.code} title={ex.title} language={ex.language ?? library.language} />
              </div>
            ))}
          </section>

          {/* Related */}
          {topic.related && topic.related.length > 0 && (
            <section className="rounded-xl border border-ink-700/50 bg-ink-850/50 p-5">
              <SectionTitle icon={<ArrowRight size={15} />} color={library.accent}>Related Topics</SectionTitle>
              <div className="flex flex-wrap gap-2">
                {topic.related.map((rid) => {
                  const rel = library.topics.find((t) => t.id === rid);
                  if (!rel) return null;
                  return (
                    <button
                      key={rid}
                      onClick={() => onNavigate(library.id, rel.id)}
                      className="px-3 py-1.5 rounded-lg text-sm border border-ink-700/60 text-ink-300 hover:bg-ink-700/40 hover:text-ink-100 transition-colors"
                    >
                      {rel.title}
                    </button>
                  );
                })}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar: personal notes */}
        <aside className="lg:sticky lg:top-6 self-start space-y-4">
          <div className="rounded-xl border border-ink-700/50 bg-ink-850/50 p-4">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2 text-sm font-semibold text-ink-100">
                <StickyNote size={15} className="text-amber-400" />
                My Notes
              </div>
              {noteSaved && (
                <span className="flex items-center gap-1 text-[11px] text-emerald-400 animate-fade-in">
                  <Check size={12} /> Saved
                </span>
              )}
            </div>
            <textarea
              value={noteDraft}
              onChange={(e) => handleNoteChange(e.target.value)}
              placeholder="Write your own notes here. Auto-saves as you type…"
              className="w-full h-44 bg-ink-950/60 border border-ink-700/40 rounded-lg p-3 text-sm text-ink-100 placeholder:text-ink-500 outline-none focus:border-ink-600 resize-y"
            />
            <div className="flex items-center justify-between mt-2 text-[11px] text-ink-500">
              <span>{noteDraft.length} chars</span>
              <span className="flex items-center gap-1">
                <Check size={11} /> auto-saved
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-ink-700/50 bg-ink-850/50 p-4 text-xs text-ink-400 space-y-1.5">
            <div className="flex justify-between"><span>Section</span><span className="text-ink-200">{library.name}</span></div>
            <div className="flex justify-between"><span>Category</span><span className="text-ink-200">{topic.category}</span></div>
            <div className="flex justify-between"><span>Difficulty</span><span className="text-ink-200 capitalize">{topic.difficulty}</span></div>
            <div className="flex justify-between"><span>Examples</span><span className="text-ink-200">{topic.examples.length}</span></div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function SectionTitle({ icon, color, children }: { icon: React.ReactNode; color: string; children: React.ReactNode }) {
  return (
    <h2 className="flex items-center gap-2 text-sm font-semibold text-ink-100 mb-3">
      <span style={{ color }}>{icon}</span>
      {children}
    </h2>
  );
}
