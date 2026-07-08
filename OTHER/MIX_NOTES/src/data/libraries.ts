import type { Library } from '../types';
import { basicsTopics } from './basics';
import { pointersTopics } from './pointers';
import { oopTopics } from './oop';
import { templatesTopics } from './templates';
import { stlTopics } from './stl';
import { modernTopics } from './modern';
import { numpyTopics } from './numpy';
import { pandasTopics } from './pandas';
import { matplotlibTopics } from './matplotlib';
import { seabornTopics } from './seaborn';
import { scipyTopics } from './scipy';
import { plotlyTopics } from './plotly';
import { sqliteTopics } from './sqlite';

export const libraries: Library[] = [
  // ---- C++ ----
  {
    id: 'basics',
    name: 'C++ Language Basics',
    tagline: 'Syntax, types, control flow & functions',
    description:
      'The foundation of C++: program structure, data types, operators, control flow, functions, I/O, and strings. Start here if you are new to C++ or brushing up on the core syntax every C++ programmer uses daily.',
    color: 'from-sky-500 to-blue-600',
    accent: '#38bdf8',
    icon: 'FileCode2',
    language: 'cpp',
    categories: Array.from(new Set(basicsTopics.map((t) => t.category))),
    topics: basicsTopics,
  },
  {
    id: 'pointers',
    name: 'C++ Pointers & Memory',
    tagline: 'Address, ownership, and resource management',
    description:
      'Pointers, references, dynamic memory, and RAII — the parts of C++ that give it power and demand discipline. Covers raw pointers, references, new/delete, smart pointers, RAII, and the stack/heap/static memory model.',
    color: 'from-amber-500 to-orange-600',
    accent: '#fbbf24',
    icon: 'Cpu',
    language: 'cpp',
    categories: Array.from(new Set(pointersTopics.map((t) => t.category))),
    topics: pointersTopics,
  },
  {
    id: 'oop',
    name: 'C++ OOP',
    tagline: 'Classes, inheritance & polymorphism',
    description:
      'Model your domain with classes and objects. Covers classes, constructors, encapsulation, inheritance, virtual functions, the Rule of Five/Zero, and operator overloading.',
    color: 'from-emerald-500 to-teal-600',
    accent: '#34d399',
    icon: 'Boxes',
    language: 'cpp',
    categories: Array.from(new Set(oopTopics.map((t) => t.category))),
    topics: oopTopics,
  },
  {
    id: 'templates',
    name: 'C++ Templates & Metaprogramming',
    tagline: 'Generic code and compile-time computation',
    description:
      'Write code that works for any type. Covers function and class templates, specialisation, C++20 concepts, variadic templates, fold expressions, type traits, and constexpr/consteval.',
    color: 'from-rose-500 to-pink-600',
    accent: '#fb7185',
    icon: 'Braces',
    language: 'cpp',
    categories: Array.from(new Set(templatesTopics.map((t) => t.category))),
    topics: templatesTopics,
  },
  {
    id: 'stl',
    name: 'C++ Standard Library',
    tagline: 'Containers, iterators & algorithms',
    description:
      'The C++ Standard Template Library — your built-in toolbox. Covers vector, iterators, algorithms, maps, strings, lambdas, and how to choose the right container.',
    color: 'from-indigo-500 to-violet-600',
    accent: '#818cf8',
    icon: 'Library',
    language: 'cpp',
    categories: Array.from(new Set(stlTopics.map((t) => t.category))),
    topics: stlTopics,
  },
  {
    id: 'modern',
    name: 'Modern C++ & Concurrency',
    tagline: 'Move semantics, exceptions & threads',
    description:
      'Modern C++ (C++11 through C++20): move semantics, auto/decltype, smart pointers deep dive, exceptions, noexcept, threads, mutexes, async/futures, and the C++20 Ranges library.',
    color: 'from-cyan-500 to-sky-600',
    accent: '#22d3ee',
    icon: 'Zap',
    language: 'cpp',
    categories: Array.from(new Set(modernTopics.map((t) => t.category))),
    topics: modernTopics,
  },
  // ---- Python ----
  {
    id: 'numpy',
    name: 'NumPy',
    tagline: 'Numerical computing with arrays',
    description:
      'NumPy is the foundation library for numerical computing in Python. It provides a high-performance multidimensional array object, vectorised operations, broadcasting, and linear algebra — used across the entire scientific Python stack.',
    color: 'from-sky-500 to-blue-600',
    accent: '#38bdf8',
    icon: 'Grid3x3',
    language: 'python',
    categories: Array.from(new Set(numpyTopics.map((t) => t.category))),
    topics: numpyTopics,
  },
  {
    id: 'pandas',
    name: 'Pandas',
    tagline: 'Data analysis & manipulation',
    description:
      'Pandas is the de-facto standard for data analysis in Python. It provides the Series (1D) and DataFrame (2D), plus tools for reading, cleaning, transforming, merging, aggregating, and exporting tabular data.',
    color: 'from-emerald-500 to-teal-600',
    accent: '#34d399',
    icon: 'Table2',
    language: 'python',
    categories: Array.from(new Set(pandasTopics.map((t) => t.category))),
    topics: pandasTopics,
  },
  {
    id: 'matplotlib',
    name: 'Matplotlib',
    tagline: 'Publication-quality plotting',
    description:
      'Matplotlib is the original Python plotting library and the engine underpinning much of the scientific stack. Full control over every element of a figure, from line styles to axes ticks, with output to many formats.',
    color: 'from-indigo-500 to-violet-600',
    accent: '#818cf8',
    icon: 'LineChart',
    language: 'python',
    categories: Array.from(new Set(matplotlibTopics.map((t) => t.category))),
    topics: matplotlibTopics,
  },
  {
    id: 'seaborn',
    name: 'Seaborn',
    tagline: 'Statistical data visualisation',
    description:
      'Seaborn is a high-level interface built on Matplotlib for statistical graphics. Attractive defaults, built-in datasets, and functions for distributions, categorical data, and regression — all in one call.',
    color: 'from-rose-500 to-pink-600',
    accent: '#fb7185',
    icon: 'BarChart3',
    language: 'python',
    categories: Array.from(new Set(seabornTopics.map((t) => t.category))),
    topics: seabornTopics,
  },
  {
    id: 'scipy',
    name: 'SciPy',
    tagline: 'Scientific & technical computing',
    description:
      'SciPy extends NumPy with numerical algorithms for optimisation, integration, interpolation, linear algebra, signal & image processing, statistics, sparse matrices, and FFTs.',
    color: 'from-amber-500 to-orange-600',
    accent: '#fbbf24',
    icon: 'Atom',
    language: 'python',
    categories: Array.from(new Set(scipyTopics.map((t) => t.category))),
    topics: scipyTopics,
  },
  {
    id: 'plotly',
    name: 'Plotly',
    tagline: 'Interactive & web-ready plots',
    description:
      'Plotly produces interactive, browser-based graphs with zoom, pan, hover tooltips, and export. The express API builds full figures in one call; the Graph Objects API exposes every property.',
    color: 'from-cyan-500 to-sky-600',
    accent: '#22d3ee',
    icon: 'Sparkles',
    language: 'python',
    categories: Array.from(new Set(plotlyTopics.map((t) => t.category))),
    topics: plotlyTopics,
  },
  // ---- SQL ----
  {
    id: 'sqlite',
    name: 'SQLite & SQL',
    tagline: 'Queries, schema & the Python sqlite3 module',
    description:
      'SQLite is a self-contained, serverless SQL database engine built into Python. Covers DDL (CREATE, ALTER, DROP), DML (INSERT, UPDATE, DELETE), joins, aggregates, subqueries, transactions, PRAGMAs, and the Python sqlite3 module with parameterized queries and pandas integration.',
    color: 'from-violet-500 to-purple-600',
    accent: '#a78bfa',
    icon: 'Database',
    language: 'sql',
    categories: Array.from(new Set(sqliteTopics.map((t) => t.category))),
    topics: sqliteTopics,
  },
];

export function getLibrary(id: string) {
  return libraries.find((l) => l.id === id);
}

export function getTopic(libraryId: string, topicId: string) {
  return getLibrary(libraryId)?.topics.find((t) => t.id === topicId);
}

export function totalTopics() {
  return libraries.reduce((sum, l) => sum + l.topics.length, 0);
}

export interface LanguageGroup {
  label: string;
  libraryIds: string[];
}

export const languageGroups: LanguageGroup[] = [
  { label: 'C++', libraryIds: ['basics', 'pointers', 'oop', 'templates', 'stl', 'modern'] },
  { label: 'Python', libraryIds: ['numpy', 'pandas', 'matplotlib', 'seaborn', 'scipy', 'plotly'] },
  { label: 'SQL', libraryIds: ['sqlite'] },
];
