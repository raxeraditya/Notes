import type { Topic } from '../types';

export const pandasTopics: Topic[] = [
  {
    id: 'pd-series-basics',
    title: 'Series — The 1-D Data Structure',
    category: 'Core Objects',
    difficulty: 'beginner',
    summary: 'A Series is a labelled, one-dimensional array — the building block of pandas.',
    definition:
      'A `Series` is a one-dimensional array-like object that holds data of any type along with an associated array of labels called the **index**. You can think of it as a dictionary that preserves insertion order and allows vectorised operations.',
    syntax: 'pd.Series(data, index=None, dtype=None, name=None)',
    parameters: [
      { name: 'data', type: 'array-like, dict, or scalar', description: 'The values stored in the Series.' },
      { name: 'index', type: 'array-like', description: 'Labels for the values. Defaults to RangeIndex 0..n-1.' },
      { name: 'dtype', type: 'numpy dtype', description: 'Forces a data type for the values.' },
      { name: 'name', type: 'str', description: 'A name for the Series, shown in repr and used as a column label.' },
    ],
    returns: 'A pd.Series object.',
    keyPoints: [
      'Every Series has .values (the data) and .index (the labels).',
      'Arithmetic between Series aligns on index labels, not position.',
      'dtype is inferred from the data; use dtype= to force it.',
      'A Series created from a dict uses the dict keys as its index.',
    ],
    examples: [
      {
        title: 'Create Series from a list and dict',
        description: 'Compare default and custom indices.',
        code: `import pandas as pd

s1 = pd.Series([10, 20, 30, 40])
print("default index:\\n", s1)

s2 = pd.Series({"a": 1, "b": 2, "c": 3}, name="counts")
print("\\nnamed series:\\n", s2)
print("values:", s2.values, "index:", list(s2.index))`,
        language: 'python',
      },
      {
        title: 'Index alignment',
        description: 'Operations line up by label, filling gaps with NaN.',
        code: `import pandas as pd
a = pd.Series({"x": 1, "y": 2, "z": 3})
b = pd.Series({"y": 20, "z": 30, "w": 40})
print("a + b (aligned):\\n", a + b)`,
        language: 'python',
      },
    ],
    related: ['pd-dataframe-basics', 'pd-indexing'],
  },
  {
    id: 'pd-dataframe-basics',
    title: 'DataFrame — The 2-D Data Structure',
    category: 'Core Objects',
    difficulty: 'beginner',
    summary: 'A DataFrame is a labelled, 2-D table of columns, each a Series.',
    definition:
      'A `DataFrame` is a two-dimensional, size-mutable, potentially heterogeneous tabular data structure with labelled rows (index) and columns. Each column is a Series. It is the pandas equivalent of a spreadsheet or SQL table.',
    syntax: 'pd.DataFrame(data, index=None, columns=None)',
    parameters: [
      { name: 'data', type: 'ndarray, dict, or DataFrame', description: 'The 2-D data to populate the frame.' },
      { name: 'index', type: 'array-like', description: 'Row labels.' },
      { name: 'columns', type: 'array-like', description: 'Column labels.' },
    ],
    returns: 'A pd.DataFrame.',
    keyPoints: [
      'A dict of lists becomes a DataFrame with dict keys as columns.',
      'A list of dicts becomes a DataFrame with dict keys as columns.',
      'Use .head(n) / .tail(n) to peek; default n is 5.',
      'dtypes, shape, columns, index, and info() describe a frame.',
    ],
    examples: [
      {
        title: 'Build a DataFrame',
        description: 'Create from a dict of lists and inspect it.',
        code: `import pandas as pd
df = pd.DataFrame({
    "name": ["Ada", "Linus", "Grace"],
    "age": [36, 54, 85],
    "lang": ["C", "C", "COBOL"],
})
print(df)
print("\\nshape:", df.shape)
print("columns:", list(df.columns))
print("\\ndtypes:\\n", df.dtypes)`,
        language: 'python',
      },
      {
        title: 'From a list of records',
        description: 'Each dict is a row.',
        code: `import pandas as pd
rows = [
    {"city": "Tokyo", "pop": 13.9},
    {"city": "Delhi", "pop": 30.2},
    {"city": "Shanghai", "pop": 27.0},
]
df = pd.DataFrame(rows)
print(df)
print("\\nsummary:\\n", df.describe())`,
        language: 'python',
      },
    ],
    related: ['pd-series-basics', 'pd-indexing', 'pd-io-read-write'],
  },
  {
    id: 'pd-indexing',
    title: 'Selecting Data (loc, iloc, [])',
    category: 'Accessing Data',
    difficulty: 'beginner',
    summary: 'loc is label-based, iloc is position-based — never confuse them.',
    definition:
      'pandas provides three main selection paths: `[]` for column selection by label, `.loc[]` for label-based row/column access, and `.iloc[]` for integer-position-based access. `at` / `iat` are the scalar equivalents for single values.',
    syntax: 'df["col"] | df.loc[row_labels, col_labels] | df.iloc[row_pos, col_pos]',
    returns: 'A Series (single column/row) or DataFrame (multiple selections).',
    keyPoints: [
      'loc uses LABELS and is inclusive of the end label in slices.',
      'iloc uses POSITIONS and is exclusive of the end position (like Python slices).',
      'Boolean indexing works in all of them: df[df.age > 30].',
      'Use .loc for assignment to avoid SettingWithCopyWarning.',
    ],
    examples: [
      {
        title: 'loc vs iloc',
        description: 'Select rows by label and by position.',
        code: `import pandas as pd
df = pd.DataFrame(
    {"age": [25, 30, 35, 40]},
    index=["ada", "linus", "grace", "dennis"]
)
print("loc['linus':'grace']:\\n", df.loc["linus":"grace"])
print("\\niloc[1:3]:\\n", df.iloc[1:3])
print("\\nvalue at label 'ada':", df.at["ada", "age"])`,
        language: 'python',
      },
      {
        title: 'Boolean filtering',
        description: 'Select rows that match a condition.',
        code: `import pandas as pd
df = pd.DataFrame({"name": ["A","B","C","D"], "score": [80, 55, 90, 45]})
high = df[df["score"] >= 80]
print("high scores:\\n", high)
# multiple conditions
mid = df[(df["score"] >= 50) & (df["score"] < 90)]
print("\\nmid scores:\\n", mid)`,
        language: 'python',
      },
      {
        title: 'Select & add columns',
        description: 'Pick columns and create a new one.',
        code: `import pandas as pd
df = pd.DataFrame({"a": [1,2,3], "b": [4,5,6], "c": [7,8,9]})
print(df[["a", "c"]])
df["sum"] = df["a"] + df["b"]
print("\\nwith sum:\\n", df)`,
        language: 'python',
      },
    ],
    related: ['pd-dataframe-basics', 'pd-missing-data'],
  },
  {
    id: 'pd-io-read-write',
    title: 'Reading & Writing Files',
    category: 'I/O',
    difficulty: 'beginner',
    summary: 'read_csv, to_csv, read_excel, read_json — get data in and out.',
    definition:
      'pandas has a family of `read_*` and `to_*` functions for every common format. `read_csv` is the most used; it parses delimited text into a DataFrame and supports specifying headers, dtypes, index columns, and parsing dates.',
    syntax: 'pd.read_csv(filepath, sep=",", index_col=None, parse_dates=None)',
    returns: 'A DataFrame parsed from the file (or string buffer).',
    keyPoints: [
      'read_csv accepts a file path OR a URL OR a file-like buffer (e.g. io.StringIO).',
      'Use dtype= to force column types and parse_dates= to make date columns.',
      'to_csv(index=False) avoids writing the row index as an extra column.',
      'Other readers: read_excel, read_json, read_html, read_sql.',
    ],
    examples: [
      {
        title: 'Read CSV from a string',
        description: 'Parse CSV text with io.StringIO.',
        code: `import pandas as pd
import io
csv = "name,age,city\\nAda,36,London\\nLinus,54,Helsinki\\nGrace,85,New York"
df = pd.read_csv(io.StringIO(csv))
print(df)
print("\\nages only:\\n", df["age"])`,
        language: 'python',
      },
      {
        title: 'Write CSV to a string',
        description: 'Serialise a DataFrame without saving to disk.',
        code: `import pandas as pd
df = pd.DataFrame({"x": [1,2,3], "y": [4,5,6]})
out = df.to_csv(index=False)
print(out)`,
        language: 'python',
      },
      {
        title: 'Force dtypes and dates',
        description: 'Control column types while reading.',
        code: `import pandas as pd
import io
csv = "id,joined,price\\n1,2024-01-05,9.99\\n2,2024-02-10,19.99"
df = pd.read_csv(io.StringIO(csv), dtype={"id": "int32"}, parse_dates=["joined"])
print(df.dtypes)
print(df)`,
        language: 'python',
      },
    ],
    related: ['pd-dataframe-basics', 'pd-cleaning-data'],
  },
  {
    id: 'pd-missing-data',
    title: 'Handling Missing Data',
    category: 'Cleaning',
    difficulty: 'intermediate',
    summary: 'isna, fillna, dropna — find, fill, and remove NaN values.',
    definition:
      'Real-world data has gaps. pandas marks missing values as `NaN` (float), `NaT` (datetime), or `<NA>` (nullable types). `isna`/`notna` detect them, `fillna` replaces them, and `dropna` removes rows or columns containing them.',
    syntax: 'df.isna() | df.fillna(value) | df.dropna(axis=0, how="any")',
    returns: 'Boolean frame (isna) or a cleaned frame (fillna/dropna).',
    keyPoints: [
      'NaN propagates through most math — use skipna=True (default) or fillna first.',
      'fillna(method="ffill"/"bfill") carries the last/next valid value forward.',
      'dropna(how="all") drops only rows where every value is missing.',
      'interpolate() fills gaps with linear (or other) interpolation.',
    ],
    examples: [
      {
        title: 'Detect and fill',
        description: 'Find NaNs and replace them with a constant.',
        code: `import pandas as pd
import numpy as np
df = pd.DataFrame({"a": [1, np.nan, 3], "b": [np.nan, 2, np.nan]})
print("isna:\\n", df.isna())
print("\\nfilled:\\n", df.fillna(0))`,
        language: 'python',
      },
      {
        title: 'Forward fill & drop',
        description: 'Propagate values and drop incomplete rows.',
        code: `import pandas as pd
import numpy as np
s = pd.Series([1, np.nan, np.nan, 4, 5])
print("ffill:", s.ffill().tolist())
df = pd.DataFrame({"x": [1, np.nan, 3], "y": [4, 5, np.nan]})
print("\\ndropna how=any:\\n", df.dropna())`,
        language: 'python',
      },
    ],
    related: ['pd-indexing', 'pd-transforming'],
  },
  {
    id: 'pd-transforming',
    title: 'Transforming Data (apply, map, assign)',
    category: 'Transformations',
    difficulty: 'intermediate',
    summary: 'Row- and element-wise transformations with apply, map, and assign.',
    definition:
      '`apply` runs a function along an axis of a DataFrame or over a Series; `map` applies a function element-wise on a Series; `assign` returns a new DataFrame with added or replaced columns — perfect for chaining.',
    syntax: 'df.apply(func, axis=0) | s.map(func) | df.assign(newcol=expr)',
    returns: 'A Series, DataFrame, or transformed copy depending on the method.',
    keyPoints: [
      'axis=0 applies the function to each column; axis=1 to each row.',
      'map is for element-wise Series transforms (dict or function).',
      'assign always returns a new frame — it never mutates in place.',
      'Lambda functions are the common pattern: df.assign(km=df["miles"]*1.609).',
    ],
    examples: [
      {
        title: 'apply on rows',
        description: 'Compute a value across columns for each row.',
        code: `import pandas as pd
df = pd.DataFrame({"a": [1,2,3], "b": [4,5,6]})
df["sum"] = df.apply(lambda row: row["a"] + row["b"], axis=1)
print(df)
print("\\ncolumn maxes:", df[["a","b"]].apply(max))`,
        language: 'python',
      },
      {
        title: 'map & assign chain',
        description: 'Element-wise transform and add a column.',
        code: `import pandas as pd
df = pd.DataFrame({"temp_c": [0, 20, 37, 100]})
out = (
    df.assign(temp_f=lambda d: d["temp_c"] * 9/5 + 32)
      .assign(label=lambda d: d["temp_c"].map(lambda c: "hot" if c > 30 else "cold"))
)
print(out)`,
        language: 'python',
      },
    ],
    related: ['pd-groupby-aggregation', 'pd-indexing'],
  },
  {
    id: 'pd-groupby-aggregation',
    title: 'GroupBy & Aggregation',
    category: 'Analysis',
    difficulty: 'intermediate',
    summary: 'Split-apply-combine: group rows by key and summarise each group.',
    definition:
      '`groupby` implements the split-apply-combine pattern: it splits the DataFrame into groups by one or more keys, applies an aggregation/transformation/filter to each group, and combines the results. It is the workhorse of summarisation.',
    syntax: 'df.groupby(by)[cols].agg(func)',
    returns: 'A Series or DataFrame indexed by the group keys.',
    keyPoints: [
      'groupby returns a lazy GroupBy object — nothing runs until you aggregate.',
      'Common aggregations: sum, mean, count, min, max, std, median, nunique.',
      'Pass a dict to agg() to apply different functions per column.',
      'as_index=False keeps the group keys as regular columns.',
    ],
    examples: [
      {
        title: 'Mean per group',
        description: 'Average a column within each category.',
        code: `import pandas as pd
df = pd.DataFrame({
    "dept": ["eng","eng","sales","sales","eng"],
    "salary": [90, 110, 70, 80, 95],
})
print(df.groupby("dept")["salary"].mean())`,
        language: 'python',
      },
      {
        title: 'Multiple aggregations',
        description: 'Apply several functions at once.',
        code: `import pandas as pd
df = pd.DataFrame({
    "team": ["A","A","B","B","B"],
    "points": [10, 20, 30, 5, 15],
    "wins": [1, 2, 3, 0, 1],
})
print(df.groupby("team").agg(
    total_points=("points", "sum"),
    avg_points=("points", "mean"),
    wins=("wins", "sum"),
))`,
        language: 'python',
      },
      {
        title: 'Group by multiple keys',
        description: 'Nest grouping by two columns.',
        code: `import pandas as pd
df = pd.DataFrame({
    "region": ["EU","EU","US","US"],
    "prod": ["A","B","A","B"],
    "sales": [100, 50, 200, 80],
})
print(df.groupby(["region", "prod"])["sales"].sum())`,
        language: 'python',
      },
    ],
    related: ['pd-transforming', 'pd-merging-joining'],
  },
  {
    id: 'pd-merging-joining',
    title: 'Merging, Joining & Concatenating',
    category: 'Combining Data',
    difficulty: 'intermediate',
    summary: 'Combine multiple frames with SQL-like joins and vertical/horizontal concat.',
    definition:
      '`merge` performs SQL-style joins on shared columns; `join` merges on the index; `concat` stacks frames vertically or horizontally. Choose the method by how your data relates.',
    syntax: 'pd.merge(left, right, on="key", how="inner") | pd.concat([a, b], axis=0)',
    parameters: [
      { name: 'how', type: 'str', description: 'inner, outer, left, or right join semantics.' },
      { name: 'on', type: 'label or list', description: 'Column(s) to join on. Must exist in both frames.' },
    ],
    returns: 'A new merged/concatenated DataFrame.',
    keyPoints: [
      'how="inner" keeps only matching keys (the default).',
      'how="outer" keeps all keys, filling missing with NaN.',
      'concat axis=0 stacks rows; axis=1 adds columns side by side.',
      'Use validate="one_to_one" etc. to catch data-quality issues.',
    ],
    examples: [
      {
        title: 'Inner merge',
        description: 'Join two frames on a shared key.',
        code: `import pandas as pd
left = pd.DataFrame({"id": [1,2,3], "name": ["Ada","Linus","Grace"]})
right = pd.DataFrame({"id": [1,2,4], "score": [90, 75, 88]})
print(pd.merge(left, right, on="id", how="inner"))`,
        language: 'python',
      },
      {
        title: 'Left & outer joins',
        description: 'Keep all keys from one or both sides.',
        code: `import pandas as pd
left = pd.DataFrame({"id": [1,2,3], "name": ["Ada","Linus","Grace"]})
right = pd.DataFrame({"id": [1,2,4], "score": [90, 75, 88]})
print("left join:\\n", pd.merge(left, right, on="id", how="left"))
print("\\nouter join:\\n", pd.merge(left, right, on="id", how="outer"))`,
        language: 'python',
      },
      {
        title: 'Concatenate frames',
        description: 'Stack rows and add columns.',
        code: `import pandas as pd
a = pd.DataFrame({"x": [1,2]})
b = pd.DataFrame({"x": [3,4]})
print("rows:\\n", pd.concat([a, b], ignore_index=True))
c = pd.DataFrame({"y": [10,20]})
print("\\ncols:\\n", pd.concat([a, c], axis=1))`,
        language: 'python',
      },
    ],
    related: ['pd-groupby-aggregation', 'pd-dataframe-basics'],
  },
  {
    id: 'pd-timeseries',
    title: 'Time Series & Datetime',
    category: 'Time Series',
    difficulty: 'advanced',
    summary: 'date_range, resample, and dt accessor for temporal analysis.',
    definition:
      'pandas has first-class time-series support. `to_datetime` converts strings to Timestamps, `date_range` generates fixed-frequency indices, `resample` is group-by for time (e.g. monthly means), and the `.dt` accessor exposes datetime components.',
    syntax: 'pd.to_datetime(s) | df.resample("M").mean() | s.dt.month',
    returns: 'DatetimeIndex / resampled DataFrame / Series of integer components.',
    keyPoints: [
      'resample requires a DatetimeIndex and a frequency alias (D, W, M, Y, H).',
      'The .dt accessor gives year, month, day, hour, weekday, is_month_start, etc.',
      'Use shift() to lag a series and pct_change() for period returns.',
      'rolling(window=n).mean() computes moving averages.',
    ],
    examples: [
      {
        title: 'Create a date range',
        description: 'Generate daily timestamps.',
        code: `import pandas as pd
idx = pd.date_range("2024-01-01", periods=6, freq="D")
s = pd.Series([10, 12, 9, 14, 13, 15], index=idx)
print(s)
print("\\nweekday names:", s.index.day_name().tolist())`,
        language: 'python',
      },
      {
        title: 'Resample to monthly',
        description: 'Downsample daily data to month-end mean.',
        code: `import pandas as pd
idx = pd.date_range("2024-01-01", periods=90, freq="D")
s = pd.Series(range(90), index=idx)
monthly = s.resample("ME").mean()
print(monthly)`,
        language: 'python',
      },
      {
        title: 'Rolling average & lag',
        description: 'Smooth a series and compare to the previous period.',
        code: `import pandas as pd
s = pd.Series([1, 2, 3, 4, 5, 6])
print("rolling-3 mean:", s.rolling(window=3).mean().tolist())
print("shift(1):", s.shift(1).tolist())
print("pct_change:", s.pct_change().tolist())`,
        language: 'python',
      },
    ],
    related: ['pd-groupby-aggregation', 'pd-io-read-write'],
  },
  {
    id: 'pd-string-methods',
    title: 'String Methods (.str accessor)',
    category: 'Transformations',
    difficulty: 'intermediate',
    summary: 'Vectorised string operations on object columns via .str.',
    definition:
      'The `.str` accessor exposes vectorised string methods on object-dtype Series: lower, upper, strip, contains, replace, split, extract, and more. They avoid slow Python loops and handle NaN gracefully.',
    syntax: 'df["col"].str.lower() | df["col"].str.contains("pat", regex=True)',
    returns: 'A Series of transformed strings or boolean masks.',
    keyPoints: [
      'NaN inputs stay NaN — no exceptions.',
      'str.extract uses regex capture groups to pull substrings.',
      'str.split returns lists; expand=True turns them into columns.',
      'Chain .str operations: s.str.strip().str.lower().',
    ],
    examples: [
      {
        title: 'Clean and filter text',
        description: 'Standardise case and filter by a substring.',
        code: `import pandas as pd
s = pd.Series(["  Alice ", "BOB", "  carol ", None])
clean = s.str.strip().str.lower()
print("cleaned:", clean.tolist())
print("contains 'li':", s.str.lower().str.contains("li", na=False).tolist())`,
        language: 'python',
      },
      {
        title: 'Extract with regex',
        description: 'Pull a captured group into a new column.',
        code: `import pandas as pd
s = pd.Series(["order_123", "order_456", "refund_789"])
nums = s.str.extract(r"(\\d+)")
print(nums[0].tolist())`,
        language: 'python',
      },
    ],
    related: ['pd-transforming', 'pd-indexing'],
  },
  {
    id: 'pd-pivot-melt',
    title: 'Reshaping (pivot, melt, pivot_table)',
    category: 'Reshaping',
    difficulty: 'advanced',
    summary: 'Reshape between long and wide formats for tidy analysis.',
    definition:
      '`pivot` widens data from long to wide using unique values as new columns; `melt` does the reverse, gathering columns into key/value pairs; `pivot_table` is pivot with aggregation (like a 2-D groupby).',
    syntax: 'df.pivot(index="a", columns="b", values="c") | df.melt(id_vars=["a"])',
    returns: 'A reshaped DataFrame.',
    keyPoints: [
      'pivot fails on duplicate index/column pairs — use pivot_table with aggfunc instead.',
      'melt is the standard way to make data "tidy" (one row per observation).',
      'pivot_table aggfunc defaults to mean; pass sum, count, etc.',
      'stack/unstack move between row and column indices hierarchically.',
    ],
    examples: [
      {
        title: 'pivot_table with aggregation',
        description: 'Summarise values across two categorical axes.',
        code: `import pandas as pd
df = pd.DataFrame({
    "city": ["A","A","B","B","A"],
    "month": ["Jan","Feb","Jan","Feb","Jan"],
    "sales": [100, 120, 90, 80, 60],
})
print(df.pivot_table(index="city", columns="month", values="sales", aggfunc="sum"))`,
        language: 'python',
      },
      {
        title: 'melt to long format',
        description: 'Gather wide columns into key/value rows.',
        code: `import pandas as pd
wide = pd.DataFrame({"id":[1,2], "Jan":[10,20], "Feb":[30,40]})
long = wide.melt(id_vars=["id"], var_name="month", value_name="sales")
print(long)`,
        language: 'python',
      },
    ],
    related: ['pd-groupby-aggregation', 'pd-transforming'],
  },
];
