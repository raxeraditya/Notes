import type { Difficulty } from '../types';

const config: Record<Difficulty, { label: string; classes: string; dot: string }> = {
  beginner: { label: 'Beginner', classes: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30', dot: 'bg-emerald-400' },
  intermediate: { label: 'Intermediate', classes: 'bg-amber-500/15 text-amber-300 border-amber-500/30', dot: 'bg-amber-400' },
  advanced: { label: 'Advanced', classes: 'bg-rose-500/15 text-rose-300 border-rose-500/30', dot: 'bg-rose-400' },
};

export function DifficultyBadge({ level }: { level: Difficulty }) {
  const c = config[level];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium border ${c.classes}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}
