import { useState, useMemo } from 'react';
import { Copy, Check, Code2 } from 'lucide-react';
import type { Language } from '../types';

interface Props {
  code: string;
  title?: string;
  language?: Language;
}

const LANG_LABEL: Record<Language, string> = {
  cpp: 'C++',
  python: 'Python',
  sql: 'SQL',
};

export function CodeBlock({ code, title, language = 'cpp' }: Props) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable */
    }
  }

  const html = useMemo(() => highlight(code, language), [code, language]);
  const lineCount = code.split('\n').length;

  return (
    <div className="rounded-xl border border-ink-700/60 bg-ink-950/70 overflow-hidden shadow-card">
      <div className="flex items-center justify-between px-3 py-2 border-b border-ink-700/50 bg-ink-850/60">
        <div className="flex items-center gap-2 text-ink-300 text-xs font-mono">
          <Code2 size={14} className="text-sky-400" />
          <span>{title ?? LANG_LABEL[language]}</span>
          <span className="text-ink-600">· {lineCount} lines</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-1 rounded-md text-xs text-ink-400 hover:text-ink-100 hover:bg-ink-700/50 transition-colors"
          title="Copy code"
        >
          {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="code-block overflow-x-auto p-3.5 leading-relaxed">
        <code dangerouslySetInnerHTML={{ __html: html }} />
      </pre>
    </div>
  );
}

function highlight(code: string, language: Language): string {
  if (language === 'python') return highlightPython(code);
  if (language === 'sql') return highlightSql(code);
  return highlightCpp(code);
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/* ------------------------------------------------------------------ */
/* C++ highlighter                                                     */
/* ------------------------------------------------------------------ */

const CPP_KEYWORDS = new Set([
  'alignas', 'alignof', 'auto', 'bool', 'break', 'case', 'catch', 'char', 'char8_t',
  'char16_t', 'char32_t', 'class', 'concept', 'const', 'consteval', 'constexpr', 'constinit',
  'const_cast', 'continue', 'co_await', 'co_return', 'co_yield', 'decltype', 'default', 'delete',
  'do', 'double', 'dynamic_cast', 'else', 'enum', 'explicit', 'export', 'extern', 'false', 'final',
  'float', 'for', 'friend', 'goto', 'if', 'inline', 'int', 'long', 'mutable', 'namespace', 'new',
  'noexcept', 'nullptr', 'operator', 'override', 'private', 'protected', 'public', 'register',
  'reinterpret_cast', 'requires', 'return', 'short', 'signed', 'sizeof', 'static', 'static_assert',
  'static_cast', 'struct', 'switch', 'template', 'this', 'thread_local', 'throw', 'true', 'try',
  'typedef', 'typeid', 'typename', 'union', 'unsigned', 'using', 'virtual', 'void', 'volatile',
  'wchar_t', 'while',
]);

const CPP_STDTYPES = new Set([
  'string', 'vector', 'map', 'unordered_map', 'set', 'unordered_set', 'list', 'deque', 'array',
  'pair', 'tuple', 'unique_ptr', 'shared_ptr', 'weak_ptr', 'thread', 'mutex', 'future', 'promise',
  'function', 'move', 'forward', 'make_unique', 'make_shared', 'ostream', 'istream', 'iostream',
  'ostringstream', 'istringstream', 'stringstream', 'size_t', 'int8_t', 'int16_t', 'int32_t',
  'int64_t', 'uint8_t', 'uint16_t', 'uint32_t', 'uint64_t', 'exception', 'runtime_error',
  'invalid_argument', 'out_of_range', 'bad_alloc', 'lock_guard', 'unique_lock', 'scoped_lock',
  'views', 'ranges',
]);

function highlightCpp(code: string): string {
  let out = '';
  let i = 0;
  const n = code.length;
  while (i < n) {
    const ch = code[i], next = code[i + 1];
    if (ch === '/' && next === '/') { let e = code.indexOf('\n', i); if (e === -1) e = n; out += span('comment', code.slice(i, e)); i = e; continue; }
    if (ch === '/' && next === '*') { let e = code.indexOf('*/', i + 2); e = e === -1 ? n : e + 2; out += span('comment', code.slice(i, e)); i = e; continue; }
    if (ch === '#' && (i === 0 || code[i - 1] === '\n')) { let e = i + 1; while (e < n && code[e] !== '\n') { if (code[e] === '\\' && code[e + 1] === '\n') e += 2; else e++; } out += span('preproc', code.slice(i, e)); i = e; continue; }
    if (ch === '"') { let e = i + 1; while (e < n && code[e] !== '"') { if (code[e] === '\\') e++; e++; } out += span('string', code.slice(i, e + 1)); i = e + 1; continue; }
    if (ch === "'") { let e = i + 1; while (e < n && code[e] !== "'") { if (code[e] === '\\') e++; e++; } out += span('string', code.slice(i, e + 1)); i = e + 1; continue; }
    if (/[0-9]/.test(ch) || (ch === '.' && /[0-9]/.test(next ?? ''))) { let e = i; if (ch === '0' && (next === 'x' || next === 'X' || next === 'b' || next === 'B')) { e = i + 2; while (e < n && /[0-9a-fA-F']/.test(code[e])) e++; } else { while (e < n && /[0-9.'a-zA-Z]/.test(code[e])) e++; } out += span('number', code.slice(i, e)); i = e; continue; }
    if (/[a-zA-Z_]/.test(ch)) { let e = i; while (e < n && /[a-zA-Z0-9_]/.test(code[e])) e++; const w = code.slice(i, e); const after = code.slice(e).match(/^\s*(\()/); if (w === 'std' && code[e] === ':') { out += span('ns', w); i = e; continue; } if (CPP_KEYWORDS.has(w)) out += span('keyword', w); else if (CPP_STDTYPES.has(w)) out += span('type', w); else if (after) out += span('fn', w); else out += escapeHtml(w); i = e; continue; }
    if (/[{}[\]();,]/.test(ch)) { out += span('punct', ch); i++; continue; }
    if (/[+\-*/%=<>!&|^~?:.]/.test(ch)) { out += span('op', ch); i++; continue; }
    out += escapeHtml(ch); i++;
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* Python highlighter                                                  */
/* ------------------------------------------------------------------ */

const PY_KEYWORDS = new Set([
  'False', 'None', 'True', 'and', 'as', 'assert', 'async', 'await', 'break', 'class',
  'continue', 'def', 'del', 'elif', 'else', 'except', 'finally', 'for', 'from', 'global',
  'if', 'import', 'in', 'is', 'lambda', 'nonlocal', 'not', 'or', 'pass', 'raise', 'return',
  'try', 'while', 'with', 'yield', 'match', 'case',
]);

const PY_BUILTINS = new Set([
  'abs', 'all', 'any', 'bin', 'bool', 'breakpoint', 'bytearray', 'bytes', 'callable', 'chr',
  'classmethod', 'compile', 'complex', 'delattr', 'dict', 'dir', 'divmod', 'enumerate', 'eval',
  'exec', 'filter', 'float', 'format', 'frozenset', 'getattr', 'globals', 'hasattr', 'hash',
  'help', 'hex', 'id', 'input', 'int', 'isinstance', 'issubclass', 'iter', 'len', 'list',
  'locals', 'map', 'max', 'memoryview', 'min', 'next', 'object', 'oct', 'open', 'ord', 'pow',
  'print', 'property', 'range', 'repr', 'reversed', 'round', 'set', 'setattr', 'slice', 'sorted',
  'staticmethod', 'str', 'sum', 'super', 'tuple', 'type', 'vars', 'zip', 'self', 'cls',
]);

const PY_LIBS = new Set([
  'np', 'pd', 'plt', 'sns', 'stats', 'optimize', 'integrate', 'interpolate', 'linalg', 'signal',
  'sparse', 'fft', 'px', 'go', 'io', 'sqlite3', 'conn', 'cursor', 'fig', 'ax',
]);

function highlightPython(code: string): string {
  let out = '';
  let i = 0;
  const n = code.length;
  while (i < n) {
    const ch = code[i], next = code[i + 1];
    if (ch === '#') { let e = code.indexOf('\n', i); if (e === -1) e = n; out += span('comment', code.slice(i, e)); i = e; continue; }
    if (ch === '"' || ch === "'") {
      let e = i + 1;
      while (e < n && code[e] !== ch) { if (code[e] === '\\') e++; e++; }
      out += span('string', code.slice(i, e + 1)); i = e + 1; continue;
    }
    if (ch === 'f' && (next === '"' || next === "'")) {
      let e = i + 2;
      const quote = next;
      while (e < n && code[e] !== quote) { if (code[e] === '\\') e++; e++; }
      out += span('string', code.slice(i, e + 1)); i = e + 1; continue;
    }
    if (/[0-9]/.test(ch) || (ch === '.' && /[0-9]/.test(next ?? ''))) { let e = i; while (e < n && /[0-9.ja-zA-Z_]/.test(code[e])) e++; out += span('number', code.slice(i, e)); i = e; continue; }
    if (ch === '@') { let e = i + 1; while (e < n && /[a-zA-Z0-9_]/.test(code[e])) e++; out += span('decorator', code.slice(i, e)); i = e; continue; }
    if (/[a-zA-Z_]/.test(ch)) { let e = i; while (e < n && /[a-zA-Z0-9_]/.test(code[e])) e++; const w = code.slice(i, e); const after = code.slice(e).match(/^\s*(\()/); if (PY_KEYWORDS.has(w)) out += span('keyword', w); else if (PY_BUILTINS.has(w)) out += span('type', w); else if (PY_LIBS.has(w)) out += span('ns', w); else if (after) out += span('fn', w); else out += escapeHtml(w); i = e; continue; }
    if (/[{}[\]();,]/.test(ch)) { out += span('punct', ch); i++; continue; }
    if (/[+\-*/%=<>!&|^~?:.]/.test(ch)) { out += span('op', ch); i++; continue; }
    out += escapeHtml(ch); i++;
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* SQL highlighter                                                     */
/* ------------------------------------------------------------------ */

const SQL_KEYWORDS = new Set([
  'SELECT', 'FROM', 'WHERE', 'INSERT', 'INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE',
  'CREATE', 'TABLE', 'ALTER', 'DROP', 'INDEX', 'VIEW', 'DATABASE', 'IF', 'EXISTS', 'NOT',
  'NULL', 'PRIMARY', 'KEY', 'FOREIGN', 'REFERENCES', 'UNIQUE', 'DEFAULT', 'CHECK', 'CONSTRAINT',
  'AUTOINCREMENT', 'JOIN', 'INNER', 'LEFT', 'RIGHT', 'OUTER', 'FULL', 'CROSS', 'ON', 'USING',
  'GROUP', 'BY', 'ORDER', 'HAVING', 'ASC', 'DESC', 'LIMIT', 'OFFSET', 'DISTINCT', 'AS',
  'UNION', 'ALL', 'INTERSECT', 'EXCEPT', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END', 'AND', 'OR',
  'IN', 'BETWEEN', 'LIKE', 'GLOB', 'IS', 'WITH', 'RECURSIVE', 'PRAGMA', 'BEGIN', 'COMMIT',
  'ROLLBACK', 'TRANSACTION', 'TRIGGER', 'BEFORE', 'AFTER', 'ATTACH', 'DETACH', 'VACUUM',
  'INTEGER', 'TEXT', 'REAL', 'BLOB', 'NUMERIC', 'BOOLEAN', 'DATE', 'DATETIME', 'VARCHAR',
]);

const SQL_FUNCS = new Set([
  'COUNT', 'SUM', 'AVG', 'MIN', 'MAX', 'TOTAL', 'ABS', 'ROUND', 'LENGTH', 'UPPER', 'LOWER',
  'SUBSTR', 'TRIM', 'LTRIM', 'RTRIM', 'COALESCE', 'IFNULL', 'NULLIF', 'RANDOM', 'REPLACE',
  'DATE', 'TIME', 'DATETIME', 'JULIANDAY', 'STRFTIME', 'GROUP_CONCAT', 'CAST', 'TYPEOF',
  'LAST_INSERT_ROWID', 'CHANGES', 'QUOTE', 'HEX', 'UNHEX',
]);

function highlightSql(code: string): string {
  let out = '';
  let i = 0;
  const n = code.length;
  while (i < n) {
    const ch = code[i], next = code[i + 1];
    if (ch === '-' && next === '-') { let e = code.indexOf('\n', i); if (e === -1) e = n; out += span('comment', code.slice(i, e)); i = e; continue; }
    if (ch === '/' && next === '*') { let e = code.indexOf('*/', i + 2); e = e === -1 ? n : e + 2; out += span('comment', code.slice(i, e)); i = e; continue; }
    if (ch === "'" || ch === '"') { let e = i + 1; while (e < n && code[e] !== ch) { if (code[e] === '\\') e++; e++; } out += span('string', code.slice(i, e + 1)); i = e + 1; continue; }
    if (/[0-9]/.test(ch)) { let e = i; while (e < n && /[0-9.]/.test(code[e])) e++; out += span('number', code.slice(i, e)); i = e; continue; }
    if (/[a-zA-Z_]/.test(ch)) { let e = i; while (e < n && /[a-zA-Z0-9_]/.test(code[e])) e++; const w = code.slice(i, e); const up = w.toUpperCase(); const after = code.slice(e).match(/^\s*(\()/); if (SQL_KEYWORDS.has(up)) out += span('keyword', w); else if (SQL_FUNCS.has(up)) out += span('fn', w); else if (after) out += span('type', w); else out += escapeHtml(w); i = e; continue; }
    if (/[();,]/.test(ch)) { out += span('punct', ch); i++; continue; }
    if (/[=<>!*\\/+%.\\-]/.test(ch)) { out += span('op', ch); i++; continue; }
    out += escapeHtml(ch); i++;
  }
  return out;
}

function span(cls: string, text: string): string {
  return `<span class="tok-${cls}">${escapeHtml(text)}</span>`;
}
