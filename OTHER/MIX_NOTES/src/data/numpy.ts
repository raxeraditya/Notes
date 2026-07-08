import type { Topic } from '../types';

export const numpyTopics: Topic[] = [
  {
    id: 'np-creating-arrays',
    title: 'Creating Arrays',
    category: 'Array Creation',
    difficulty: 'beginner',
    summary: 'The many ways to create ndarray objects — from lists, ranges, zeros, ones, and identity matrices.',
    definition:
      'NumPy arrays (`ndarray`) are the central data structure. They are homogeneous, fixed-size, n-dimensional containers of data. Unlike Python lists, array operations are vectorised and run in compiled C code, making them 10–100× faster for numeric work. Every ndarray has a shape, a dtype, and occupies one contiguous block of memory.',
    syntax: 'np.array(object, dtype=None, ndmin=0)',
    parameters: [
      { name: 'object', type: 'array-like', description: 'A list, tuple, or nested sequence to convert into an array.' },
      { name: 'dtype', type: 'data-type', description: 'The desired data type (e.g. np.float64). Inferred if omitted.' },
      { name: 'ndmin', type: 'int', description: 'Minimum number of dimensions the resulting array should have.' },
    ],
    returns: 'An ndarray of the given (or inferred) shape and dtype.',
    keyPoints: [
      'All elements must be the same type — NumPy will up-cast to a common dtype automatically.',
      'Use np.zeros, np.ones, np.empty for pre-allocated arrays (much faster than growing a list).',
      'np.arange is like range() but returns an array; np.linspace gives evenly spaced floats.',
      'Specify dtype explicitly when memory or precision matters (np.int32 vs np.float64).',
    ],
    examples: [
      {
        title: 'Create arrays from lists',
        description: 'Convert Python lists and nested lists into 1-D and 2-D arrays.',
        code: `import numpy as np

a = np.array([1, 2, 3, 4, 5])
b = np.array([[1, 2, 3], [4, 5, 6]])

print("1-D:", a, "shape:", a.shape, "dtype:", a.dtype)
print("2-D:\\n", b, "shape:", b.shape, "ndim:", b.ndim)`,
        language: 'python',
      },
      {
        title: 'Zeros, ones, and identity',
        description: 'Pre-allocate arrays filled with a known value.',
        code: `import numpy as np

z = np.zeros((2, 3), dtype=int)
o = np.ones(5)
e = np.empty((2, 2))           # uninitialized — fast but garbage values
i = np.eye(3)                  # 3x3 identity matrix

print("zeros:\\n", z)
print("ones:", o)
print("identity:\\n", i)`,
        language: 'python',
      },
      {
        title: 'Ranges and linspace',
        description: 'Create evenly spaced numeric sequences.',
        code: `import numpy as np

r = np.arange(0, 10, 2)        # [0 2 4 6 8]  — step-based
l = np.linspace(0, 1, 5)      # 5 points 0..1 inclusive

print("arange:", r)
print("linspace:", l)
print("linspace step:", l[1] - l[0])`,
        language: 'python',
      },
    ],
    related: ['np-array-attributes', 'np-dtype-basics'],
  },
  {
    id: 'np-array-attributes',
    title: 'Array Attributes',
    category: 'Array Basics',
    difficulty: 'beginner',
    summary: 'Inspect shape, size, ndim, dtype, and itemsize to understand an array.',
    definition:
      'Every ndarray carries metadata describing its structure: `shape` (dimensions), `ndim` (number of axes), `size` (total elements), `dtype` (element type), `itemsize` (bytes per element), and `nbytes` (total bytes). These attributes are read-only and let you introspect an array without copying data.',
    syntax: 'arr.shape | arr.ndim | arr.size | arr.dtype | arr.itemsize',
    returns: 'Read-only metadata describing the array.',
    keyPoints: [
      'shape is a tuple — one integer per axis. A 3×4 matrix has shape (3, 4).',
      'size is the product of all shape dimensions; it equals len(arr) only for 1-D arrays.',
      'dtype determines memory usage and precision; check itemsize to see bytes per element.',
      'These are attributes (no parentheses), not method calls.',
    ],
    examples: [
      {
        title: 'Inspect a 3-D array',
        description: 'Print every structural attribute of a small array.',
        code: `import numpy as np

a = np.arange(24).reshape(2, 3, 4)
print("array shape:", a.shape)
print("ndim:", a.ndim)
print("size:", a.size)
print("dtype:", a.dtype)
print("itemsize (bytes):", a.itemsize)
print("nbytes:", a.nbytes)
print("T (transposed) shape:", a.T.shape)`,
        language: 'python',
      },
    ],
    related: ['np-creating-arrays', 'np-dtype-basics', 'np-reshaping'],
  },
  {
    id: 'np-dtype-basics',
    title: 'Data Types (dtype)',
    category: 'Array Basics',
    difficulty: 'beginner',
    summary: 'NumPy supports far more numeric types than core Python — choose them deliberately.',
    definition:
      'A NumPy `dtype` (data-type object) describes how each byte in an array is interpreted: integer vs float, signed vs unsigned, byte width, and endianness. Explicit dtype choice controls memory footprint and numerical precision.',
    syntax: 'np.dtype("int32") | arr.astype(np.float64)',
    returns: 'A dtype object; astype returns a new array with the requested type.',
    keyPoints: [
      'int8/16/32/64 and uint8/16/32/64 differ only in bit width and sign.',
      'float16/32/64 trade precision for memory; default is float64.',
      'complex64/128 hold real + imaginary parts.',
      'Use astype() to copy-convert; the original array is unchanged.',
    ],
    examples: [
      {
        title: 'Compare dtypes and cast',
        description: 'Create arrays of different types and convert between them.',
        code: `import numpy as np

i32 = np.array([1, 2, 3], dtype=np.int32)
f64 = np.array([1.5, 2.5, 3.5], dtype=np.float64)

print("int32 itemsize:", i32.itemsize, "bytes")
print("float64 itemsize:", f64.itemsize, "bytes")

# cast int -> float
as_float = i32.astype(np.float64)
print("cast:", as_float, as_float.dtype)

# cast float -> int (truncates!)
as_int = f64.astype(np.int32)
print("truncated:", as_int)`,
        language: 'python',
      },
    ],
    related: ['np-creating-arrays', 'np-array-attributes'],
  },
  {
    id: 'np-reshaping',
    title: 'Reshaping & Transposing',
    category: 'Shape Manipulation',
    difficulty: 'beginner',
    summary: 'Change an array shape without changing its data using reshape, ravel, and T.',
    definition:
      'Reshaping reinterprets the same underlying data buffer with a new shape. `reshape` returns a new view (when possible), `ravel`/`flatten` collapse to 1-D, and `.T` transposes axes. The total number of elements must stay the same.',
    syntax: 'arr.reshape(d0, d1, ...) | arr.ravel() | arr.T | arr.transpose()',
    parameters: [
      { name: 'shape', type: 'tuple of ints', description: 'New dimensions. Use -1 to infer one axis automatically.' },
    ],
    returns: 'A new view when possible; a copy when the layout cannot be represented as a view.',
    keyPoints: [
      'reshape(-1) infers the missing dimension from the total size.',
      'ravel returns a view; flatten always returns a copy.',
      '.T is shorthand for transpose() — swaps the last two axes for 2-D arrays.',
      'Reshaping never changes element order (C order by default).',
    ],
    examples: [
      {
        title: 'Reshape with -1',
        description: 'Let NumPy infer one dimension automatically.',
        code: `import numpy as np

a = np.arange(12)
b = a.reshape(3, -1)
print("reshaped (3, -1):\\n", b)

# flatten back
print("ravel:", a.reshape(3, -1).ravel())

# transpose a 2x6 into 6x2
c = a.reshape(2, -1)
print("transposed:\\n", c.T)`,
        language: 'python',
      },
      {
        title: 'Transpose a matrix',
        description: 'Swap rows and columns of a 2-D array.',
        code: `import numpy as np
m = np.array([[1, 2, 3], [4, 5, 6]])
print("original:\\n", m, "shape", m.shape)
print("transposed:\\n", m.T, "shape", m.T.shape)`,
        language: 'python',
      },
    ],
    related: ['np-array-attributes', 'np-indexing-slicing'],
  },
  {
    id: 'np-indexing-slicing',
    title: 'Indexing & Slicing',
    category: 'Accessing Data',
    difficulty: 'beginner',
    summary: 'Access and modify elements with standard [start:stop:step] syntax on every axis.',
    definition:
      'NumPy extends Python slicing to n dimensions. Basic slicing with `start:stop:step` returns a view (no copy); integer-array and boolean indexing return copies. Slices can be assigned to, modifying the original array in place.',
    syntax: 'arr[start:stop:step, ...]  |  arr[boolean_mask]  |  arr[int_array]',
    returns: 'A view for basic slices; a copy for fancy/boolean indexing.',
    keyPoints: [
      'Slices are views — mutating them mutates the original array.',
      'Use np.newaxis (or None) to add an axis: a[:, np.newaxis] turns (3,) into (3,1).',
      'Boolean masks select elements where the condition is True.',
      'Integer arrays let you pick arbitrary indices (including repeats).',
    ],
    examples: [
      {
        title: 'Slice a 2-D array',
        description: 'Select rows, columns, and sub-blocks.',
        code: `import numpy as np
a = np.arange(20).reshape(4, 5)
print("full:\\n", a)
print("row 1:", a[1])
print("col 2:", a[:, 2])
print("block [1:3, 1:4]:\\n", a[1:3, 1:4])
print("every other col:", a[:, ::2])`,
        language: 'python',
      },
      {
        title: 'Boolean masking',
        description: 'Select elements that satisfy a condition.',
        code: `import numpy as np
a = np.array([5, 12, 3, 18, 9, 25])
mask = a > 10
print("mask:", mask)
print("values > 10:", a[mask])
# modify in place using a mask
a[a > 10] = 0
print("after zeroing >10:", a)`,
        language: 'python',
      },
      {
        title: 'Fancy integer indexing',
        description: 'Pick elements at arbitrary positions.',
        code: `import numpy as np
a = np.array([10, 20, 30, 40, 50])
idx = np.array([0, 2, 4, 2])  # can repeat
print("fancy:", a[idx])
# add a new axis
b = np.array([1, 2, 3])
print("column vec:", b[:, np.newaxis])`,
        language: 'python',
      },
    ],
    related: ['np-reshaping', 'np-where-condition'],
  },
  {
    id: 'np-arithmetic-ops',
    title: 'Arithmetic & Broadcasting',
    category: 'Math Operations',
    difficulty: 'beginner',
    summary: 'Element-wise math with + - * / and NumPy broadcasting rules.',
    definition:
      'Arithmetic operators applied to arrays act element-wise and produce new arrays. Broadcasting lets arrays of different shapes be combined by virtually expanding the smaller one along missing axes, avoiding explicit loops.',
    syntax: 'a + b | np.add(a, b) | a * scalar | a @ b (matrix multiply)',
    returns: 'A new array holding the element-wise result.',
    keyPoints: [
      'Operators (+ - * / ** %) have ufunc equivalents (np.add, np.multiply, ...).',
      'Broadcasting aligns shapes from the right; dimensions match if equal or one of them is 1.',
      'Scalar operands broadcast to any shape.',
      '@ (or np.matmul) performs matrix multiplication, NOT element-wise.',
    ],
    examples: [
      {
        title: 'Element-wise math',
        description: 'Add, multiply, and scale arrays element by element.',
        code: `import numpy as np
a = np.array([1, 2, 3, 4])
b = np.array([10, 20, 30, 40])

print("a + b =", a + b)
print("a * b =", a * b)
print("a ** 2 =", a ** 2)
print("scalar 2*a =", 2 * a)`,
        language: 'python',
      },
      {
        title: 'Broadcasting a row to a matrix',
        description: 'Add a 1-D row to every row of a 2-D array.',
        code: `import numpy as np
matrix = np.zeros((3, 4))
row = np.array([1, 2, 3, 4])
# row broadcasts to shape (3,4)
result = matrix + row
print("broadcasted:\\n", result)

# column vector (3,1) + row (4,) -> (3,4)
col = np.array([[10], [20], [30]])
print("outer via broadcast:\\n", col + row)`,
        language: 'python',
      },
      {
        title: 'Matrix multiplication',
        description: 'Use @ for the dot product of 2-D matrices.',
        code: `import numpy as np
A = np.array([[1, 2], [3, 4]])
B = np.array([[5, 6], [7, 8]])
print("A @ B =\\n", A @ B)
print("element-wise A * B =\\n", A * B)`,
        language: 'python',
      },
    ],
    related: ['np-universal-functions', 'np-where-condition'],
  },
  {
    id: 'np-universal-functions',
    title: 'Universal Functions (ufuncs)',
    category: 'Math Operations',
    difficulty: 'intermediate',
    summary: 'Vectorised element-wise functions: sqrt, exp, log, sin, cos, and more.',
    definition:
      'A ufunc (universal function) is a function that operates on ndarrays element by element in compiled C, supporting broadcasting, type casting, and output buffering. They are the engine behind every NumPy vectorised operation.',
    syntax: 'np.sqrt(x) | np.exp(x) | np.log(x) | np.sin(x) | np.where(cond, x, y)',
    returns: 'A new array of the same shape with the function applied element-wise.',
    keyPoints: [
      'Math ufuncs: sqrt, square, exp, expm1, log, log10, log2, sin, cos, tan, arctan2.',
      'Comparison ufuncs: greater, less, equal, logical_and, logical_or.',
      'out= argument writes into a pre-allocated array (avoids allocation).',
      'where= applies the ufunc only at selected positions.',
    ],
    examples: [
      {
        title: 'Common math ufuncs',
        description: 'Apply sqrt, exp, and log to an array.',
        code: `import numpy as np
x = np.array([1, 4, 9, 16, 25], dtype=float)
print("sqrt:", np.sqrt(x))
print("exp of [0,1,2]:", np.exp(np.array([0., 1., 2.])))
print("log10:", np.log10(x))`,
        language: 'python',
      },
      {
        title: 'Trig & rounding',
        description: 'Sine curve and rounding helpers.',
        code: `import numpy as np
angles = np.linspace(0, np.pi, 5)
print("sin:", np.sin(angles))
vals = np.array([1.2, 2.5, 3.7, -1.1])
print("round:", np.round(vals))
print("floor:", np.floor(vals))
print("ceil:", np.ceil(vals))`,
        language: 'python',
      },
      {
        title: 'Reduce & accumulate',
        description: 'Collapse an array along an axis using ufunc methods.',
        code: `import numpy as np
a = np.array([[1, 2, 3], [4, 5, 6]])
print("add.reduce rows:", np.add.reduce(a, axis=1))
print("multiply.accumulate:", np.multiply.accumulate(np.array([1, 2, 3, 4])))`,
        language: 'python',
      },
    ],
    related: ['np-arithmetic-ops', 'np-aggregations', 'np-where-condition'],
  },
  {
    id: 'np-aggregations',
    title: 'Aggregations & Statistics',
    category: 'Math Operations',
    difficulty: 'beginner',
    summary: 'sum, mean, std, min, max, argmin, argmax along any axis.',
    definition:
      'Aggregation functions reduce an array to a scalar or a lower-dimensional array by combining elements. Every aggregator accepts an `axis` argument: axis=0 collapses rows, axis=1 collapses columns; omitting axis collapses everything.',
    syntax: 'arr.sum(axis=None) | np.mean(arr, axis=...) | arr.max(axis=...)',
    returns: 'A scalar (no axis) or an array with the axis dimension removed.',
    keyPoints: [
      'axis=0 collapses across rows (down columns); axis=1 collapses across columns (across rows).',
      'NaN-safe variants exist: np.nansum, np.nanmean, np.nanstd ignore NaNs.',
      'argmin/argmax return the index of the extreme value, not the value itself.',
      'cumsum and cummax return running aggregates, preserving shape.',
    ],
    examples: [
      {
        title: 'Sum and mean by axis',
        description: 'Aggregate a 2-D array along rows and columns.',
        code: `import numpy as np
a = np.array([[1, 2, 3], [4, 5, 6]])
print("total sum:", a.sum())
print("sum axis=0 (down cols):", a.sum(axis=0))
print("sum axis=1 (across rows):", a.sum(axis=1))
print("mean axis=1:", a.mean(axis=1))`,
        language: 'python',
      },
      {
        title: 'Min, max, and their indices',
        description: 'Find extremes and where they sit.',
        code: `import numpy as np
a = np.array([3, 1, 4, 1, 5, 9, 2, 6])
print("min/max:", a.min(), a.max())
print("argmin/argmax:", a.argmin(), a.argmax())
print("cumsum:", a.cumsum())`,
        language: 'python',
      },
      {
        title: 'NaN-aware stats',
        description: 'Ignore missing values with nan-aware aggregators.',
        code: `import numpy as np
a = np.array([1.0, 2.0, np.nan, 4.0])
print("plain mean (NaN!):", a.mean())
print("nanmean:", np.nanmean(a))
print("nansum:", np.nansum(a))`,
        language: 'python',
      },
    ],
    related: ['np-universal-functions', 'np-sorting-searching'],
  },
  {
    id: 'np-sorting-searching',
    title: 'Sorting & Searching',
    category: 'Accessing Data',
    difficulty: 'intermediate',
    summary: 'sort, argsort, argwhere, and searchsorted for ordered data.',
    definition:
      'NumPy provides in-place and copy sorting along any axis, plus search routines. `argsort` returns the indices that would sort an array; `searchsorted` finds insertion points in a sorted array; `where` returns indices where a condition is true.',
    syntax: 'np.sort(arr, axis=-1) | np.argsort(arr) | np.searchsorted(sorted, values)',
    returns: 'A sorted copy (np.sort) or index arrays (argsort / where / searchsorted).',
    keyPoints: [
      'np.sort returns a copy; arr.sort() sorts in place.',
      'argsort is the key to sorting one array by the order of another.',
      'searchsorted requires a pre-sorted array and runs in O(log n).',
      'kind="stable" keeps equal elements in original order.',
    ],
    examples: [
      {
        title: 'Sort and argsort',
        description: 'Sort values and recover the ordering indices.',
        code: `import numpy as np
a = np.array([40, 10, 30, 20])
print("sorted:", np.sort(a))
order = np.argsort(a)
print("argsort indices:", order)
print("apply order:", a[order])`,
        language: 'python',
      },
      {
        title: 'searchsorted',
        description: 'Find where new values would be inserted to keep order.',
        code: `import numpy as np
sorted_a = np.array([10, 20, 30, 40, 50])
new_vals = np.array([25, 5, 45])
idx = np.searchsorted(sorted_a, new_vals)
print("insert positions:", idx)`,
        language: 'python',
      },
      {
        title: 'where & argwhere',
        description: 'Locate elements that match a condition.',
        code: `import numpy as np
a = np.array([[1, 2, 3], [4, 5, 6]])
print("where > 3 (coords):", np.argwhere(a > 3))
print("where > 3 (flat idx):", np.where(a > 3))`,
        language: 'python',
      },
    ],
    related: ['np-indexing-slicing', 'np-aggregations'],
  },
  {
    id: 'np-where-condition',
    title: 'np.where — Conditional Selection',
    category: 'Logic',
    difficulty: 'intermediate',
    summary: 'Vectorised if/else for arrays: choose values based on a boolean mask.',
    definition:
      '`np.where(condition, x, y)` returns an array with elements from x where the condition is True and from y where it is False — the vectorised equivalent of a ternary. With only a condition argument, it returns the indices of True elements.',
    syntax: 'np.where(condition, x, y)  |  np.where(condition)  # indices only',
    parameters: [
      { name: 'condition', type: 'array-like bool', description: 'Boolean mask selecting between x and y.' },
      { name: 'x, y', type: 'array-like', description: 'Values chosen when condition is True / False. Broadcast together.' },
    ],
    returns: 'An ndarray with the broadcasted shape of condition, x, and y.',
    keyPoints: [
      'Three-arg form is a vectorised ternary — no Python loops.',
      'One-arg form returns a tuple of index arrays (one per dimension).',
      'All three arrays broadcast; scalars are fine.',
      'For multi-condition logic, chain with np.logical_and / np.logical_or.',
    ],
    examples: [
      {
        title: 'Replace negatives with zero',
        description: 'Clip all negative values to 0 in one call.',
        code: `import numpy as np
a = np.array([-3, -1, 0, 2, 5])
clean = np.where(a < 0, 0, a)
print("clipped:", clean)`,
        language: 'python',
      },
      {
        title: 'Choose between two arrays',
        description: 'Pick from x or y element by element.',
        code: `import numpy as np
x = np.array([1, 2, 3, 4])
y = np.array([10, 20, 30, 40])
cond = np.array([True, False, True, False])
print("choose:", np.where(cond, x, y))`,
        language: 'python',
      },
      {
        title: 'Indices of matches',
        description: 'Get the positions where a condition holds.',
        code: `import numpy as np
a = np.array([5, 12, 3, 18, 9])
idx = np.where(a > 8)
print("indices:", idx)
print("values:", a[idx])`,
        language: 'python',
      },
    ],
    related: ['np-indexing-slicing', 'np-universal-functions'],
  },
  {
    id: 'np-random',
    title: 'Random Number Generation',
    category: 'Sampling',
    difficulty: 'intermediate',
    summary: 'The modern np.random.Generator API for reproducible random arrays.',
    definition:
      'Since NumPy 1.17 the recommended API is `np.random.default_rng()`, which returns a Generator with better statistical properties and speed than the legacy `np.random.*` functions. Seed the Generator for reproducibility.',
    syntax: 'rng = np.random.default_rng(seed); rng.standard_normal(shape)',
    returns: 'A Generator object whose methods produce random arrays.',
    keyPoints: [
      'Always seed in production/data science for reproducible results.',
      'Methods: standard_normal, normal, uniform, integers, choice, shuffle, permutation.',
      'rng.integers(low, high, size) is half-open [low, high).',
      'choice supports weighted sampling with p= and replacement control.',
    ],
    examples: [
      {
        title: 'Reproducible random arrays',
        description: 'Seed a generator and draw floats and integers.',
        code: `import numpy as np
rng = np.random.default_rng(seed=42)
print("3 normals:", rng.standard_normal(3))
print("2x2 ints 0..9:\\n", rng.integers(0, 10, size=(2, 2)))
print("uniform 0..1:", rng.uniform(size=4))`,
        language: 'python',
      },
      {
        title: 'Sampling & shuffling',
        description: 'Choose and permute elements.',
        code: `import numpy as np
rng = np.random.default_rng(7)
a = np.arange(10)
print("choice(5):", rng.choice(a, size=5, replace=False))
perm = rng.permutation(a)
print("permutation:", perm)
print("original (unchanged):", a)`,
        language: 'python',
      },
    ],
    related: ['np-creating-arrays', 'np-aggregations'],
  },
  {
    id: 'np-linear-algebra',
    title: 'Linear Algebra (np.linalg)',
    category: 'Linear Algebra',
    difficulty: 'advanced',
    summary: 'dot, matmul, inv, solve, eig, svd, and qr decomposition.',
    definition:
      '`np.linalg` wraps BLAS/LAPACK for fast linear algebra. Common routines: `dot`/`matmul` for products, `inv` for matrix inverse, `solve` for Ax=b, `eig`/`eigh` for eigenvalues, `svd` for singular value decomposition, and `norm` for vector/matrix norms.',
    syntax: 'np.linalg.inv(A) | np.linalg.solve(A, b) | np.linalg.eig(A) | np.linalg.svd(A)',
    returns: 'Arrays whose shapes depend on the routine (e.g. eig returns eigenvalues and eigenvectors).',
    keyPoints: [
      'Prefer np.linalg.solve over inv for Ax=b — faster and more numerically stable.',
      'eigh is for symmetric/Hermitian matrices and returns real eigenvalues.',
      'svd returns U, singular values, and Vh; use full_matrices=False for the economy form.',
      'np.linalg.norm defaults to the Frobenius norm for matrices.',
    ],
    examples: [
      {
        title: 'Solve a linear system',
        description: 'Solve A x = b without explicitly inverting A.',
        code: `import numpy as np
A = np.array([[3., 2.], [1., 4.]])
b = np.array([7., 6.])
x = np.linalg.solve(A, b)
print("solution x:", x)
print("check A @ x:", A @ x)`,
        language: 'python',
      },
      {
        title: 'Eigenvalues & inverse',
        description: 'Decompose and invert a square matrix.',
        code: `import numpy as np
A = np.array([[2., 0.], [0., 3.]])
vals, vecs = np.linalg.eig(A)
print("eigenvalues:", vals)
print("eigenvectors:\\n", vecs)
print("inverse:\\n", np.linalg.inv(A))`,
        language: 'python',
      },
      {
        title: 'SVD',
        description: 'Factor a matrix with singular value decomposition.',
        code: `import numpy as np
A = np.array([[1., 2., 3.], [4., 5., 6.]])
U, s, Vh = np.linalg.svd(A, full_matrices=False)
print("U shape:", U.shape, "s:", s, "Vh shape:", Vh.shape)
# reconstruct
recon = U @ np.diag(s) @ Vh
print("reconstruction close:", np.allclose(recon, A))`,
        language: 'python',
      },
    ],
    related: ['np-arithmetic-ops', 'np-aggregations'],
  },
  {
    id: 'np-io-handling',
    title: 'Saving & Loading Arrays',
    category: 'I/O',
    difficulty: 'intermediate',
    summary: 'Persist arrays to disk with .npy and .npz formats.',
    definition:
      '`np.save` writes a single array to a binary `.npy` file; `np.savez` writes several arrays into a zip-like `.npz` archive; `np.load` reads them back. These formats preserve dtype and shape, unlike plain text.',
    syntax: 'np.save("file.npy", arr) | np.savez("f.npz", a=arr1, b=arr2) | np.load("file.npy")',
    returns: 'np.load returns an ndarray (for .npy) or an NpzFile dict-like (for .npz).',
    keyPoints: [
      '.npy and .npz are NumPy-native binary formats — fast and lossless.',
      'savez_compressed reduces file size at the cost of CPU time.',
      'For CSV use np.savetxt / np.loadtxt (text, slower, 2-D only).',
      'NpzFile lazily loads arrays into memory on first access.',
    ],
    examples: [
      {
        title: 'Round-trip to .npy and .npz',
        description: 'Save, reload, and verify arrays.',
        code: `import numpy as np
import tempfile, os
d = tempfile.mkdtemp()
a = np.arange(6).reshape(2, 3)
np.save(os.path.join(d, "a.npy"), a)
loaded = np.load(os.path.join(d, "a.npy"))
print("reloaded:\\n", loaded)

b = np.array([10, 20, 30])
np.savez(os.path.join(d, "data.npz"), a=a, b=b)
z = np.load(os.path.join(d, "data.npz"))
print("from npz a:", z["a"], "b:", z["b"])`,
        language: 'python',
      },
    ],
    related: ['np-creating-arrays', 'np-array-attributes'],
  },
];
