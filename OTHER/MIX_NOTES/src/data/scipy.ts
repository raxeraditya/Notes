import type { Topic } from '../types';

export const scipyTopics: Topic[] = [
  {
    id: 'scipy-intro',
    title: 'SciPy Overview & Subpackages',
    category: 'Fundamentals',
    difficulty: 'beginner',
    summary: 'SciPy organises scientific algorithms into focused subpackages.',
    definition:
      'SciPy is a collection of mathematical algorithms and convenience functions built on NumPy. It is organised into subpackages by domain: `scipy.optimize`, `scipy.integrate`, `scipy.interpolate`, `scipy.linalg`, `scipy.signal`, `scipy.stats`, `scipy.sparse`, `scipy.fft`, and more. Import the subpackage you need, not all of scipy.',
    syntax: 'from scipy import optimize, integrate, stats',
    returns: 'Module objects exposing domain-specific functions.',
    keyPoints: [
      'Import submodules: from scipy import stats — lighter than import scipy.',
      'scipy.linalg extends numpy.linalg (more routines, LAPACK-backed).',
      'scipy.stats has 100+ distributions and statistical tests.',
      'Most functions accept array-like inputs and return arrays or result objects.',
    ],
    examples: [
      {
        title: 'Check available subpackages',
        description: 'Print the main subpackage names.',
        code: `from scipy import optimize, integrate, interpolate, stats, linalg, signal, sparse, fft
import numpy as np
# quick sanity check
print("norm pdf at 0:", stats.norm.pdf(0))
print("quad of sin 0..pi:", integrate.quad(np.sin, 0, np.pi)[0])`,
        language: 'python',
      },
    ],
    related: ['scipy-stats-distributions', 'scipy-optimization', 'scipy-integration'],
  },
  {
    id: 'scipy-stats-distributions',
    title: 'Distributions (scipy.stats)',
    category: 'Statistics',
    difficulty: 'intermediate',
    summary: '100+ continuous and discrete distributions with pdf, cdf, ppf, rvs.',
    definition:
      '`scipy.stats` provides distribution objects (norm, uniform, expon, gamma, poisson, binom, ...). Each exposes `.pdf`/`.pmf` (density/mass), `.cdf` (cumulative), `.ppf` (quantile / inverse cdf), and `.rvs` (random samples). For a normal distribution use `norm(loc=mean, scale=std)`.',
    syntax: 'stats.norm(loc=0, scale=1).pdf(x) | dist.cdf(x) | dist.ppf(q) | dist.rvs(size=100)',
    returns: 'Arrays of density, probability, quantile, or sample values.',
    keyPoints: [
      'loc and scale generalise location and spread (mean & std for norm).',
      'ppf is the inverse of cdf — use it for confidence intervals.',
      'rvs uses numpys Generator; pass random_state for reproducibility.',
      'Discrete distributions (binom, poisson) use pmf instead of pdf.',
    ],
    examples: [
      {
        title: 'Normal pdf, cdf, ppf',
        description: 'Compute density, tail probability, and quantiles.',
        code: `from scipy import stats
import numpy as np
dist = stats.norm(loc=100, scale=15)
print("pdf at 100:", dist.pdf(100))
print("P(X <= 115):", dist.cdf(115))
print("95th percentile:", dist.ppf(0.95))
print("5 samples:", dist.rvs(size=5, random_state=1))`,
        language: 'python',
      },
      {
        title: 'Binomial distribution',
        description: 'Discrete probabilities for coin-flip counts.',
        code: `from scipy import stats
b = stats.binom(n=10, p=0.5)
ks = list(range(0, 11))
print("pmf:", [round(b.pmf(k), 4) for k in ks])
print("P(<=5 heads):", round(b.cdf(5), 4))`,
        language: 'python',
      },
    ],
    related: ['scipy-statistical-tests', 'scipy-intro'],
  },
  {
    id: 'scipy-statistical-tests',
    title: 'Statistical Tests (t-test, chi2, KS)',
    category: 'Statistics',
    difficulty: 'advanced',
    summary: 'Hypothesis tests with p-values: ttest_1samp, ttest_ind, chi2_contingency, ks_2samp.',
    definition:
      'scipy.stats ships a large collection of hypothesis tests. Each returns a result object (or tuple) with a statistic and a p-value. Compare the p-value to your significance level alpha (commonly 0.05) to decide whether to reject the null hypothesis.',
    syntax: 'stats.ttest_ind(a, b) | stats.chi2_contingency(table) | stats.ks_2samp(a, b)',
    returns: 'A result with .statistic and .pvalue (new API) or a (statistic, pvalue) tuple.',
    keyPoints: [
      'ttest_1samp tests whether the mean of one sample equals a value.',
      'ttest_ind compares the means of two independent samples.',
      'chi2_contingency tests independence of two categorical variables.',
      'A small p-value (< alpha) means evidence against the null hypothesis.',
    ],
    examples: [
      {
        title: 'Two-sample t-test',
        description: 'Compare the means of two groups.',
        code: `from scipy import stats
import numpy as np
rng = np.random.default_rng(0)
a = rng.normal(100, 10, 40)
b = rng.normal(105, 10, 40)
res = stats.ttest_ind(a, b)
print("t-stat:", round(res.statistic, 3))
print("p-value:", round(res.pvalue, 4))
print("reject null at 0.05:", res.pvalue < 0.05)`,
        language: 'python',
      },
      {
        title: 'Chi-square independence',
        description: 'Test whether two categorical variables are independent.',
        code: `from scipy import stats
import numpy as np
table = np.array([[30, 10], [20, 40]])
chi2, p, dof, expected = stats.chi2_contingency(table)
print("chi2:", round(chi2, 3), "p:", round(p, 4), "dof:", dof)`,
        language: 'python',
      },
    ],
    related: ['scipy-stats-distributions', 'scipy-descriptive-stats'],
  },
  {
    id: 'scipy-descriptive-stats',
    title: 'Descriptive Statistics (describe, skew, kurtosis)',
    category: 'Statistics',
    difficulty: 'beginner',
    summary: 'Summarise a sample: mean, variance, skew, kurtosis, and more.',
    definition:
      '`stats.describe` returns a summary (n, min/max, mean, variance, skewness, kurtosis). `stats.skew` and `stats.kurtosis` compute individual shape moments. `stats.trim_mean` gives a robust mean ignoring extreme tails.',
    syntax: 'stats.describe(x) | stats.skew(x) | stats.kurtosis(x, fisher=True)',
    returns: 'A DescribeResult or a scalar moment value.',
    keyPoints: [
      'describe returns n, minmax, mean, variance, skewness, kurtosis.',
      'Fisher kurtosis (default) gives 0 for a normal distribution.',
      'bias=False applies bias corrections for sample estimates.',
      'trim_mean(x, 0.1) drops the top and bottom 10% before averaging.',
    ],
    examples: [
      {
        title: 'Summarise a sample',
        description: 'Get the full describe output.',
        code: `from scipy import stats
import numpy as np
rng = np.random.default_rng(2)
x = rng.normal(0, 1, 500)
d = stats.describe(x)
print("n:", d.n)
print("mean:", round(d.mean, 4))
print("variance:", round(d.variance, 4))
print("skew:", round(d.skewness, 4))
print("kurtosis:", round(d.kurtosis, 4))`,
        language: 'python',
      },
    ],
    related: ['scipy-stats-distributions', 'scipy-statistical-tests'],
  },
  {
    id: 'scipy-optimization',
    title: 'Optimization (scipy.optimize)',
    category: 'Optimization',
    difficulty: 'advanced',
    summary: 'minimize, curve_fit, and root_scalar for finding minima and fitting models.',
    definition:
      '`scipy.optimize` finds minima of scalar or multivariate functions. `minimize` is the general-purpose multivariate minimiser (BFGS, Nelder-Mead, etc.); `curve_fit` fits a parametric model to data by least squares; `root_scalar` finds zeros of a 1-D function.',
    syntax: 'optimize.minimize(fun, x0, method="BFGS") | optimize.curve_fit(model, xdata, ydata)',
    returns: 'An OptimizeResult (minimize) or (popt, pcov) tuple (curve_fit).',
    keyPoints: [
      'minimize result.x holds the optimal parameters; result.fun the value.',
      'Provide a Jacobian with jac= for faster, more stable convergence.',
      'curve_fit returns optimal params and the covariance matrix.',
      'Bounds and constraints are supported via method="SLSQP" or "trust-constr".',
    ],
    examples: [
      {
        title: 'Minimise a quadratic',
        description: 'Find the minimum of f(x,y) = (x-1)^2 + (y-2)^2.',
        code: `from scipy import optimize
def f(x):
    return (x[0]-1)**2 + (x[1]-2)**2
res = optimize.minimize(f, x0=[0, 0], method="BFGS")
print("optimal x:", res.x)
print("min value:", res.fun)
print("success:", res.success)`,
        language: 'python',
      },
      {
        title: 'Fit a curve to data',
        description: 'Fit an exponential decay model.',
        code: `from scipy import optimize
import numpy as np
def model(t, a, b):
    return a * np.exp(-b * t)
rng = np.random.default_rng(3)
t = np.linspace(0, 4, 30)
y = model(t, 2.5, 0.7) + rng.normal(0, 0.1, 30)
popt, pcov = optimize.curve_fit(model, t, y)
print("fitted a, b:", popt)
print("std devs:", np.sqrt(np.diag(pcov)))`,
        language: 'python',
      },
    ],
    related: ['scipy-intro', 'scipy-integration'],
  },
  {
    id: 'scipy-integration',
    title: 'Integration (scipy.integrate)',
    category: 'Calculus',
    difficulty: 'advanced',
    summary: 'quad for definite integrals, odeint/solve_ivp for ODEs.',
    definition:
      '`scipy.integrate` numerically integrates functions and solves ordinary differential equations. `quad` computes a definite integral with adaptive quadrature; `solve_ivp` is the modern ODE solver (replaces odeint); `trapezoid`/`simpson` integrate sampled data.',
    syntax: 'integrate.quad(func, a, b) | integrate.solve_ivp(func, [t0, tf], y0)',
    returns: 'quad returns (value, error estimate); solve_ivp returns an OdeResult.',
    keyPoints: [
      'quad handles infinite limits with np.inf as a bound.',
      'solve_ivp method defaults to RK45; use method="Radau" for stiff problems.',
      'Pass t_eval= to get dense output at specific times.',
      'trapezoid(y, x) integrates sampled data with the trapezoidal rule.',
    ],
    examples: [
      {
        title: 'Definite integral',
        description: 'Integrate sin(x) from 0 to pi (should be 2).',
        code: `from scipy import integrate
import numpy as np
val, err = integrate.quad(np.sin, 0, np.pi)
print("integral:", val, "error est:", err)
# gaussian integral should be sqrt(pi)
g, _ = integrate.quad(lambda x: np.exp(-x**2), -np.inf, np.inf)
print("gaussian:", g, "sqrt(pi):", np.sqrt(np.pi))`,
        language: 'python',
      },
      {
        title: 'Solve an ODE',
        description: 'Integrate dy/dt = -y (exponential decay).',
        code: `from scipy import integrate
import numpy as np
def decay(t, y):
    return -0.5 * y
sol = integrate.solve_ivp(decay, [0, 5], [1.0], t_eval=np.linspace(0, 5, 6))
print("t:", sol.t)
print("y:", sol.y[0].round(4))
print("exact exp(-0.5t):", np.exp(-0.5*sol.t).round(4))`,
        language: 'python',
      },
    ],
    related: ['scipy-optimization', 'scipy-intro'],
  },
  {
    id: 'scipy-interpolation',
    title: 'Interpolation (scipy.interpolate)',
    category: 'Interpolation',
    difficulty: 'intermediate',
    summary: 'interp1d, CubicSpline, and griddata for filling in values.',
    definition:
      '`scipy.interpolate` constructs functions that estimate values between known data points. `interp1d` builds a 1-D interpolator (linear, cubic, nearest); `CubicSpline` gives a smooth piecewise cubic; `griddata` interpolates scattered data onto a grid.',
    syntax: 'interp1d(x, y, kind="cubic") | CubicSpline(x, y) | griddata(points, values, xi, method="cubic")',
    returns: 'A callable interpolator or an array of interpolated values.',
    keyPoints: [
      'interp1d returns a function you call with new x values.',
      'CubicSpline is smoother than kind="cubic" and gives continuous 2nd derivatives.',
      'Use bounds_error=False, fill_value=... to extrapolate safely.',
      'RegularGridInterpolator handles n-D regular grids.',
    ],
    examples: [
      {
        title: 'Cubic spline interpolation',
        description: 'Smoothly interpolate between sparse points.',
        code: `from scipy.interpolate import CubicSpline
import numpy as np
x = np.array([0, 1, 2, 3, 4])
y = np.array([0, 1, 0, 1, 0])
cs = CubicSpline(x, y)
xs = np.linspace(0, 4, 20)
print("interpolated:", cs(xs).round(3))`,
        language: 'python',
      },
    ],
    related: ['scipy-integration', 'scipy-intro'],
  },
  {
    id: 'scipy-linear-algebra',
    title: 'Linear Algebra (scipy.linalg)',
    category: 'Linear Algebra',
    difficulty: 'advanced',
    summary: 'lu, qr, cholesky, svd, and solvers beyond numpy.linalg.',
    definition:
      '`scipy.linalg` extends numpy.linalg with decompositions (lu, qr, cholesky, schur), matrix functions (expm, logm), and specialised solvers. It always uses LAPACK and is preferred over numpy.linalg for production work.',
    syntax: 'linalg.lu(A) | linalg.qr(A) | linalg.cholesky(A) | linalg.solve(A, b)',
    returns: 'Arrays or tuples of arrays depending on the decomposition.',
    keyPoints: [
      'lu returns (P, L, U) such that P @ A = L @ U.',
      'qr returns (Q, R) with A = Q @ R.',
      'cholesky needs a symmetric positive-definite matrix.',
      'Use scipy.linalg instead of numpy.linalg for consistent LAPACK backing.',
    ],
    examples: [
      {
        title: 'LU & QR decomposition',
        description: 'Factor a matrix two ways.',
        code: `from scipy import linalg
import numpy as np
A = np.array([[4., 3.], [6., 3.]])
P, L, U = linalg.lu(A)
print("P:\\n", P)
print("L:\\n", L)
print("U:\\n", U)
print("reconstruct P@A = L@U:", np.allclose(P @ A, L @ U))
Q, R = linalg.qr(A)
print("\\nQ:\\n", Q.round(3))
print("R:\\n", R.round(3))`,
        language: 'python',
      },
    ],
    related: ['scipy-intro', 'scipy-optimization'],
  },
  {
    id: 'scipy-signal-processing',
    title: 'Signal Processing (scipy.signal)',
    category: 'Signal',
    difficulty: 'advanced',
    summary: 'Filters, convolutions, and spectral analysis for 1-D signals.',
    definition:
      '`scipy.signal` provides filtering, convolution, and spectral tools. `butter` designs a Butterworth filter; `filtfilt` applies it with zero phase delay; `spectrogram` computes a time-frequency representation; `find_peaks` locates local maxima.',
    syntax: 'signal.butter(N, Wn, btype="low") | signal.filtfilt(b, a, x) | signal.find_peaks(x)',
    returns: 'Filter coefficients, filtered arrays, or peak index arrays.',
    keyPoints: [
      'Wn is normalised frequency in [0, 1] where 1 is Nyquist.',
      'filtfilt runs the filter forward and backward for zero phase.',
      'find_peaks returns indices; tune with prominence= and distance=.',
      'Use signal.spectrogram to visualise frequency over time.',
    ],
    examples: [
      {
        title: 'Find peaks in a signal',
        description: 'Locate local maxima with a prominence threshold.',
        code: `from scipy import signal
import numpy as np
x = np.array([0, 1, 0, 3, 0, 2, 0, 5, 0, 1, 0])
peaks, props = signal.find_peaks(x, prominence=1)
print("peak indices:", peaks)
print("peak values:", x[peaks])
print("prominences:", props["prominences"])`,
        language: 'python',
      },
    ],
    related: ['scipy-intro', 'scipy-interpolation'],
  },
  {
    id: 'scipy-sparse-matrices',
    title: 'Sparse Matrices (scipy.sparse)',
    category: 'Sparse',
    difficulty: 'advanced',
    summary: 'Store mostly-zero matrices compactly and operate on them fast.',
    definition:
      '`scipy.sparse` provides matrix formats (CSR, CSC, COO, LIL, DOK) that store only non-zero entries, saving memory and speeding up operations on sparse data. CSR and CSC are best for arithmetic; COO is best for construction.',
    syntax: 'sparse.csr_matrix(data) | sparse.coo_matrix((vals, (rows, cols)), shape=(m, n))',
    returns: 'A sparse matrix object with .toarray(), .dot(), .T, etc.',
    keyPoints: [
      'CSR is best for row slicing and arithmetic; CSC for column slicing.',
      'COO is the easiest format to build from (rows, cols, data) triplets.',
      '.nnz gives the number of stored (non-zero) values.',
      'Use sparse.linalg for sparse linear algebra (e.g. spsolve).',
    ],
    examples: [
      {
        title: 'Build and use a sparse matrix',
        description: 'Create from triplets and multiply.',
        code: `from scipy import sparse
import numpy as np
rows = [0, 1, 2, 3]
cols = [0, 1, 2, 3]
vals = [1, 2, 3, 4]
S = sparse.coo_matrix((vals, (rows, cols)), shape=(4, 4)).tocsr()
print("nnz:", S.nnz)
print("dense:\\n", S.toarray())
v = np.ones(4)
print("S @ v:", S.dot(v))`,
        language: 'python',
      },
    ],
    related: ['scipy-linear-algebra', 'scipy-intro'],
  },
  {
    id: 'scipy-fft',
    title: 'Fast Fourier Transform (scipy.fft)',
    category: 'Signal',
    difficulty: 'advanced',
    summary: 'fft, ifft, and fftfreq for spectral analysis of signals.',
    definition:
      '`scipy.fft` computes the Discrete Fourier Transform and its inverse. `fft(x)` transforms a signal into its frequency components; `fftfreq(n, d)` returns the corresponding frequencies; `ifft` inverts the transform.',
    syntax: 'fft.fft(x) | fft.fftfreq(n, d=1.0) | fft.ifft(X)',
    returns: 'Complex arrays of frequency components or reconstructed signal.',
    keyPoints: [
      'The magnitude np.abs(X) is the amplitude spectrum.',
      'fftfreq needs the sample spacing d to label frequencies correctly.',
      'fftshift centres zero frequency for plotting.',
      'Use rfft for real signals — half the output, same information.',
    ],
    examples: [
      {
        title: 'Spectrum of a sum of sines',
        description: 'Find the frequencies present in a signal.',
        code: `from scipy import fft
import numpy as np
fs = 1000
t = np.arange(0, 1, 1/fs)
x = np.sin(2*np.pi*50*t) + 0.5*np.sin(2*np.pi*120*t)
X = fft.rfft(x)
freqs = fft.rfftfreq(len(t), 1/fs)
peak_idx = np.argsort(np.abs(X))[-2:]
print("peak frequencies (Hz):", freqs[peak_idx])`,
        language: 'python',
      },
    ],
    related: ['scipy-signal-processing', 'scipy-intro'],
  },
];
