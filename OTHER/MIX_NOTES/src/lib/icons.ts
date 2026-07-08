import { FileCode2, Cpu, Boxes, Braces, Library, Zap, Grid3x3, Table2, LineChart, BarChart3, Atom, Sparkles, Database, type LucideIcon } from 'lucide-react';

const map: Record<string, LucideIcon> = {
  FileCode2,
  Cpu,
  Boxes,
  Braces,
  Library,
  Zap,
  Grid3x3,
  Table2,
  LineChart,
  BarChart3,
  Atom,
  Sparkles,
  Database,
};

export function getLibraryIcon(name: string): LucideIcon {
  return map[name] ?? FileCode2;
}
