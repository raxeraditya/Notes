import type { Topic } from '../types';

export const matplotlibTopics: Topic[] = [
  {
    id: 'plt-pyplot-basics',
    title: 'pyplot & The Figure/Axes Model',
    category: 'Fundamentals',
    difficulty: 'beginner',
    summary: 'Understand Figure vs Axes and the two coding styles: pyplot and object-oriented.',
    definition:
      'Matplotlib is organised around a hierarchy: a `Figure` is the whole window/image, one or more `Axes` are individual plot areas within it, and each Axes has title, xlabel, ylabel, and one or more Axis objects. The `pyplot` module provides a state-machine interface (`plt.plot`, `plt.title`) for quick plots; the object-oriented interface (`fig, ax = plt.subplots()`) is preferred for anything complex.',
    syntax: 'import matplotlib.pyplot as plt\nplt.plot(x, y)  # pyplot style\nfig, ax = plt.subplots(); ax.plot(x, y)  # OO style',
    returns: 'A Figure and one or more Axes objects.',
    keyPoints: [
      'Always call plt.show() to render, or return the figure for capture.',
      'The OO interface (ax.method) scales to multi-panel figures; plt does not.',
      'A figure can hold many axes; each axes holds exactly two (2-D) Axis objects.',
      'Use plt.tight_layout() to prevent label overlap.',
    ],
    examples: [
      {
        title: 'First line plot',
        description: 'Plot y = x^2 with labels.',
        code: `import matplotlib.pyplot as plt
import numpy as np

x = np.linspace(0, 5, 50)
y = x ** 2

plt.figure(figsize=(7, 4))
plt.plot(x, y, label="y = x²")
plt.title("Quadratic Growth")
plt.xlabel("x")
plt.ylabel("y")
plt.legend()
plt.grid(alpha=0.3)
plt.tight_layout()
plt.show()`,
        language: 'python',
      },
      {
        title: 'Object-oriented style',
        description: 'Use fig, ax for a cleaner, scalable API.',
        code: `import matplotlib.pyplot as plt
import numpy as np

fig, ax = plt.subplots(figsize=(7, 4))
x = np.linspace(0, 2*np.pi, 100)
ax.plot(x, np.sin(x), label="sin")
ax.plot(x, np.cos(x), label="cos")
ax.set_title("Sine & Cosine")
ax.set_xlabel("radians")
ax.legend()
ax.grid(alpha=0.3)
plt.tight_layout()
plt.show()`,
        language: 'python',
      },
    ],
    related: ['plt-line-plots', 'plt-subplots'],
  },
  {
    id: 'plt-line-plots',
    title: 'Line Plots (plot)',
    category: 'Plot Types',
    difficulty: 'beginner',
    summary: 'plot() draws lines and/or markers with full style control.',
    definition:
      '`plt.plot` (or `ax.plot`) connects points with lines, draws markers at each point, or both. The third positional argument is a format string combining color, marker, and line style (e.g. "r--o" = red dashed line with circle markers).',
    syntax: 'plt.plot(x, y, fmt, **kwargs)',
    parameters: [
      { name: 'x, y', type: 'array-like', description: 'Horizontal and vertical coordinates.' },
      { name: 'fmt', type: 'str', description: 'Compact "[color][marker][line]" code, e.g. "g^-".' },
    ],
    returns: 'A list of Line2D objects (one per data series).',
    keyPoints: [
      'Format codes: colors b/g/r/c/m/y/k/w; markers .,o,s,^,v,*; line styles -, --, :, -.',
      'Pass multiple series in one call: plt.plot(x, y1, x, y2).',
      'linewidth, markersize, alpha, label are common keyword args.',
      'Use drawstyle="steps" for step plots, or "steps-post".',
    ],
    examples: [
      {
        title: 'Style with fmt strings',
        description: 'Mix colors, markers, and line styles.',
        code: `import matplotlib.pyplot as plt
import numpy as np
x = np.linspace(0, 4, 12)
plt.figure(figsize=(7,4))
plt.plot(x, x, "r-", label="linear")
plt.plot(x, x**2, "g--s", label="squared")
plt.plot(x, x**3, "b:^", label="cubed")
plt.legend()
plt.title("Growth Rates")
plt.tight_layout()
plt.show()`,
        language: 'python',
      },
      {
        title: 'Markers only',
        description: 'Omit the line style to show only markers.',
        code: `import matplotlib.pyplot as plt
import numpy as np
rng = np.random.default_rng(1)
x = rng.uniform(0, 10, 30)
y = x * 2 + rng.normal(0, 2, 30)
plt.figure(figsize=(7,4))
plt.plot(x, y, "o", color="#38bdf8", alpha=0.7)
plt.title("Scatter via plot()")
plt.xlabel("x"); plt.ylabel("y")
plt.tight_layout()
plt.show()`,
        language: 'python',
      },
    ],
    related: ['plt-scatter-plots', 'plt-pyplot-basics'],
  },
  {
    id: 'plt-scatter-plots',
    title: 'Scatter Plots',
    category: 'Plot Types',
    difficulty: 'beginner',
    summary: 'scatter() maps point size and color to data dimensions.',
    definition:
      '`scatter` draws a marker per observation and can encode additional variables through marker size (`s`) and color (`c`), optionally with a colorbar. Unlike plot, it supports per-point sizes and a colormap.',
    syntax: 'plt.scatter(x, y, s=None, c=None, cmap="viridis", alpha=None)',
    parameters: [
      { name: 's', type: 'array-like or scalar', description: 'Marker area in points². Larger = bigger dots.' },
      { name: 'c', type: 'array-like or color', description: 'Per-point color or a sequence mapped through cmap.' },
      { name: 'cmap', type: 'str or Colormap', description: 'Colormap name when c is numeric.' },
    ],
    returns: 'A PathCollection object (supports set_array, set_sizes).',
    keyPoints: [
      's is AREA in points², not radius — square the radius when scaling.',
      'Pass c as numeric to use a colormap; add plt.colorbar() for the legend.',
      'alpha < 1 helps reveal density when points overlap.',
      'For many points, plot() with markers is faster than scatter().',
    ],
    examples: [
      {
        title: 'Bubble chart with colorbar',
        description: 'Encode a third variable as size and a fourth as color.',
        code: `import matplotlib.pyplot as plt
import numpy as np
rng = np.random.default_rng(3)
n = 50
x = rng.normal(5, 2, n)
y = rng.normal(5, 2, n)
sizes = rng.uniform(10, 400, n)
colors = rng.uniform(0, 10, n)
plt.figure(figsize=(7,4.5))
plt.scatter(x, y, s=sizes, c=colors, cmap="plasma", alpha=0.6, edgecolor="k")
plt.colorbar(label="value")
plt.title("Bubble scatter")
plt.tight_layout()
plt.show()`,
        language: 'python',
      },
    ],
    related: ['plt-line-plots', 'plt-color-maps'],
  },
  {
    id: 'plt-bar-plots',
    title: 'Bar & Barh Plots',
    category: 'Plot Types',
    difficulty: 'beginner',
    summary: 'Compare categorical quantities with vertical or horizontal bars.',
    definition:
      '`bar` draws vertical rectangles whose height encodes a value; `barh` draws horizontal bars. Useful for comparing categorical data. `bottom=` stacks bars; pass x positions to cluster groups.',
    syntax: 'plt.bar(x, height, width=0.8, bottom=None, color=...) | plt.barh(y, width)',
    returns: 'A BarContainer of Rectangle patches.',
    keyPoints: [
      'x can be category names or numeric positions.',
      'width controls bar thickness (default 0.8); <1 leaves gaps.',
      'Stack bars by passing the previous totals as bottom=.',
      'Add error bars with yerr= and capsize=.',
    ],
    examples: [
      {
        title: 'Simple bar chart',
        description: 'Compare values across categories.',
        code: `import matplotlib.pyplot as plt
cats = ["Python", "R", "SQL", "Julia"]
vals = [45, 20, 30, 5]
plt.figure(figsize=(7,4))
plt.bar(cats, vals, color=["#38bdf8","#34d399","#fbbf24","#fb7185"])
plt.title("Language usage")
plt.ylabel("percent")
plt.tight_layout()
plt.show()`,
        language: 'python',
      },
      {
        title: 'Grouped & stacked bars',
        description: 'Compare two series side by side and stacked.',
        code: `import matplotlib.pyplot as plt
import numpy as np
cats = ["Q1","Q2","Q3","Q4"]
a = [10, 15, 13, 18]
b = [8, 12, 16, 14]
x = np.arange(len(cats))
w = 0.4
plt.figure(figsize=(7,4))
plt.bar(x - w/2, a, w, label="2023")
plt.bar(x + w/2, b, w, label="2024")
plt.xticks(x, cats); plt.legend()
plt.title("Grouped bars")
plt.tight_layout()
plt.show()`,
        language: 'python',
      },
    ],
    related: ['plt-histograms', 'plt-pyplot-basics'],
  },
  {
    id: 'plt-histograms',
    title: 'Histograms & Density',
    category: 'Distributions',
    difficulty: 'beginner',
    summary: 'hist() bins data to show the shape of a distribution.',
    definition:
      '`hist` counts how many values fall into each bin and plots them as bars, revealing the distribution of a numeric variable. `bins` controls the number or edges of bins; `density=True` normalises the area to 1.',
    syntax: 'plt.hist(x, bins=10, density=False, alpha=0.7)',
    parameters: [
      { name: 'bins', type: 'int or sequence', description: 'Number of bins or explicit bin edges.' },
      { name: 'density', type: 'bool', description: 'If True, normalise so total area is 1 (a PDF).' },
    ],
    returns: 'A tuple (counts, bin_edges, patches).',
    keyPoints: [
      'Try bins="auto" for a data-driven bin count (numpy estimator).',
      'Overlay multiple distributions with multiple hist calls + alpha.',
      'histtype="step" draws outlines only — cleaner for overlays.',
      'Use density=True to compare distributions of different sizes.',
    ],
    examples: [
      {
        title: 'Compare two distributions',
        description: 'Overlay normal and uniform histograms.',
        code: `import matplotlib.pyplot as plt
import numpy as np
rng = np.random.default_rng(0)
normal = rng.normal(0, 1, 1000)
uniform = rng.uniform(-3, 3, 1000)
plt.figure(figsize=(7,4))
plt.hist(normal, bins=30, alpha=0.6, label="normal", density=True)
plt.hist(uniform, bins=30, alpha=0.6, label="uniform", density=True, histtype="step")
plt.legend(); plt.title("Distributions")
plt.tight_layout()
plt.show()`,
        language: 'python',
      },
    ],
    related: ['plt-bar-plots', 'plt-box-plots'],
  },
  {
    id: 'plt-subplots',
    title: 'Subplots & Layouts',
    category: 'Layout',
    difficulty: 'intermediate',
    summary: 'Arrange multiple Axes in a grid with subplots and subplot_mosaic.',
    definition:
      '`plt.subplots(nrows, ncols)` creates a Figure and a grid of Axes in one call. `subplot_mosaic` builds layouts from an ASCII diagram, giving each Axes a label for easy access.',
    syntax: 'fig, axes = plt.subplots(2, 2, figsize=(...)) | fig, axd = plt.subplot_mosaic("AB;CC")',
    returns: 'A Figure and an array (or dict) of Axes.',
    keyPoints: [
      'axes from subplots is a 2-D array when nrows*ncols > 1; flatten with .ravel().',
      'sharex/sharey=True aligns axes and saves space.',
      'subplot_mosaic labels make complex layouts readable: "AB;CC".',
      'Use fig.suptitle for a figure-wide title.',
    ],
    examples: [
      {
        title: '2x2 grid',
        description: 'Four different plots in one figure.',
        code: `import matplotlib.pyplot as plt
import numpy as np
fig, axes = plt.subplots(2, 2, figsize=(8, 6), sharex=True)
x = np.linspace(0, 5, 50)
axes[0,0].plot(x, x);        axes[0,0].set_title("linear")
axes[0,1].plot(x, x**2);     axes[0,1].set_title("squared")
axes[1,0].plot(x, np.sin(x));axes[1,0].set_title("sin")
axes[1,1].plot(x, np.exp(x));axes[1,1].set_title("exp")
fig.suptitle("Four functions", fontsize=14)
plt.tight_layout()
plt.show()`,
        language: 'python',
      },
      {
        title: 'Mosaic layout',
        description: 'Build an asymmetric layout from a diagram.',
        code: `import matplotlib.pyplot as plt
import numpy as np
fig, axd = plt.subplot_mosaic("AB;AC", figsize=(8,5), constrained_layout=True)
x = np.linspace(0, 2*np.pi, 100)
axd["A"].plot(x, np.sin(x)); axd["A"].set_title("A: sine")
axd["B"].hist(np.random.default_rng(2).normal(0,1,200), bins=20); axd["B"].set_title("B: hist")
axd["C"].plot(x, np.cos(x), "g"); axd["C"].set_title("C: cosine")
plt.show()`,
        language: 'python',
      },
    ],
    related: ['plt-pyplot-basics', 'plt-annotations'],
  },
  {
    id: 'plt-styling',
    title: 'Styling: Colors, Markers, Themes',
    category: 'Appearance',
    difficulty: 'intermediate',
    summary: 'Control every visual element: colors, linestyles, ticks, and themes.',
    definition:
      'Matplotlib is fully customisable. Set styles with `plt.style.use`, cycle colors with the prop cycler, customise ticks via `set_xticks`, and edit the rcParams dictionary for global defaults. Every Artist has dozens of settable properties.',
    syntax: 'plt.style.use("seaborn-v0_8-darkgrid") | plt.rcParams["figure.dpi"] = 120',
    returns: 'None — mutates global or artist state.',
    keyPoints: [
      'plt.style.available lists built-in themes (ggplot, bmh, seaborn-v0_8-*, fivethirtyeight).',
      'rcParams controls defaults: figure.dpi, font.size, axes.grid, etc.',
      'Use context managers: with plt.style.context("dark_background"): ...',
      'Color can be a name, hex "#38bdf8", RGB tuple, or colormap.',
    ],
    examples: [
      {
        title: 'Apply a style sheet',
        description: 'Switch the global look in one line.',
        code: `import matplotlib.pyplot as plt
import numpy as np
plt.style.use("ggplot")
x = np.linspace(0, 10, 100)
plt.figure(figsize=(7,4))
plt.plot(x, np.sin(x), label="sin")
plt.plot(x, np.cos(x), label="cos")
plt.title("ggplot style")
plt.legend()
plt.tight_layout()
plt.show()`,
        language: 'python',
      },
      {
        title: 'Customise ticks & spines',
        description: 'Move spines and relabel ticks.',
        code: `import matplotlib.pyplot as plt
import numpy as np
fig, ax = plt.subplots(figsize=(7,4))
x = np.linspace(-3, 3, 100)
ax.plot(x, x**2)
ax.spines["left"].set_position("zero")
ax.spines["bottom"].set_position("zero")
ax.spines["right"].set_visible(False)
ax.spines["top"].set_visible(False)
ax.set_xticks([-3,-2,-1,0,1,2,3])
ax.set_title("Spines at zero")
plt.tight_layout()
plt.show()`,
        language: 'python',
      },
    ],
    related: ['plt-annotations', 'plt-color-maps'],
  },
  {
    id: 'plt-annotations',
    title: 'Titles, Labels, Legends & Annotations',
    category: 'Appearance',
    difficulty: 'intermediate',
    summary: 'Explain your chart with text, arrows, and well-placed legends.',
    definition:
      'Every Axes carries metadata: `set_title`, `set_xlabel`/`set_ylabel`, and a `legend` built from labelled artists. `annotate` places text with an optional arrow pointing at a data coordinate.',
    syntax: 'ax.set_title(...) | ax.legend(loc="best") | ax.annotate(text, xy, xytext, arrowprops)',
    returns: 'A Text, Legend, or Annotation artist.',
    keyPoints: [
      'Always label axes and give a title — a chart without context is useless.',
      'loc="best" picks a low-overlap spot; use loc="upper right" to pin it.',
      'annotate xy is the point; xytext is where the text sits.',
      'Use fig.suptitle for a figure-wide heading on multi-panel plots.',
    ],
    examples: [
      {
        title: 'Annotate a peak',
        description: 'Point an arrow at the maximum of a curve.',
        code: `import matplotlib.pyplot as plt
import numpy as np
x = np.linspace(0, 10, 200)
y = np.sin(x) * np.exp(-0.1*x)
imax = np.argmax(y)
fig, ax = plt.subplots(figsize=(7,4))
ax.plot(x, y)
ax.annotate("peak", xy=(x[imax], y[imax]),
            xytext=(x[imax]+1.5, y[imax]+0.1),
            arrowprops=dict(arrowstyle="->", color="#fbbf24"))
ax.set_title("Damped sine")
ax.set_xlabel("time"); ax.set_ylabel("amplitude")
plt.tight_layout()
plt.show()`,
        language: 'python',
      },
    ],
    related: ['plt-styling', 'plt-subplots'],
  },
  {
    id: 'plt-color-maps',
    title: 'Colormaps & Colorbars',
    category: 'Appearance',
    difficulty: 'intermediate',
    summary: 'Choose perceptually uniform colormaps and add a colorbar legend.',
    definition:
      'A colormap maps numeric values to colors. Matplotlib ships dozens; prefer the perceptually uniform "viridis" family (viridis, plasma, inferno, magma, cividis) for continuous data. `plt.colorbar` adds a color scale legend.',
    syntax: 'plt.get_cmap("viridis") | plt.colorbar(mappable, ax=..., label=...)',
    returns: 'A Colormap object or a Colorbar artist.',
    keyPoints: [
      'Perceptually uniform maps keep order visible even in grayscale.',
      'Diverging maps (RdBu, coolwarm) suit data centred on zero.',
      'Use cmap.set_bad(color) to color NaNs distinctly.',
      'Normalize with vmin/vmax to lock the color scale across plots.',
    ],
    examples: [
      {
        title: 'Colormap scatter + colorbar',
        description: 'Color points by a value and add a colorbar.',
        code: `import matplotlib.pyplot as plt
import numpy as np
rng = np.random.default_rng(5)
x = rng.normal(0, 1, 500)
y = rng.normal(0, 1, 500)
c = np.hypot(x, y)
plt.figure(figsize=(7,5))
sc = plt.scatter(x, y, c=c, cmap="viridis", s=20, alpha=0.8)
plt.colorbar(sc, label="distance from origin")
plt.title("Viridis colormap")
plt.tight_layout()
plt.show()`,
        language: 'python',
      },
    ],
    related: ['plt-scatter-plots', 'plt-imshow'],
  },
  {
    id: 'plt-imshow',
    title: 'imshow — Image & Matrix Display',
    category: 'Plot Types',
    difficulty: 'intermediate',
    summary: 'Display 2-D arrays as images — heatmaps, matrices, and real pictures.',
    definition:
      '`imshow` renders a 2-D array as a colored grid, with each cell colored according to its value and a colormap. It is the standard way to visualise matrices, heatmaps, and image data.',
    syntax: 'plt.imshow(data, cmap="viridis", aspect="auto", interpolation="nearest")',
    parameters: [
      { name: 'cmap', type: 'str', description: 'Colormap name.' },
      { name: 'aspect', type: 'str', description: '"equal" (square cells) or "auto" (stretch).' },
      { name: 'interpolation', type: 'str', description: 'nearest, bilinear, bicubic, etc.' },
    ],
    returns: 'An AxesImage object.',
    keyPoints: [
      'origin="lower" flips the y-axis so row 0 is at the bottom.',
      'Add a colorbar to interpret the colors.',
      'Set vmin/vmax to fix the color range across multiple images.',
      'For categorical heatmaps with labels, consider seaborn.heatmap.',
    ],
    examples: [
      {
        title: 'Matrix heatmap',
        description: 'Visualise a function of two variables.',
        code: `import matplotlib.pyplot as plt
import numpy as np
x = np.linspace(-3, 3, 60)
y = np.linspace(-3, 3, 60)
X, Y = np.meshgrid(x, y)
Z = np.sin(X) * np.cos(Y)
plt.figure(figsize=(6,5))
plt.imshow(Z, cmap="RdBu", extent=[-3,3,-3,3], origin="lower")
plt.colorbar(label="z")
plt.title("sin(x)*cos(y)")
plt.tight_layout()
plt.show()`,
        language: 'python',
      },
    ],
    related: ['plt-color-maps', 'plt-contour-plots'],
  },
  {
    id: 'plt-contour-plots',
    title: 'Contour & Surface Plots',
    category: 'Plot Types',
    difficulty: 'advanced',
    summary: 'contour and contourf draw level curves of a 2-D scalar field.',
    definition:
      '`contour` draws isolines (lines of constant value) of a 2-D field; `contourf` fills the regions between levels with color. Both require coordinate grids, usually built with np.meshgrid.',
    syntax: 'plt.contour(X, Y, Z, levels=10) | plt.contourf(X, Y, Z, levels=10, cmap=...)',
    returns: 'A QuadContourSet — pass it to plt.colorbar.',
    keyPoints: [
      'Pass explicit levels= to control the contour values.',
      'contourf adds clabels via plt.clabel(cs).',
      'Combine contour (lines) with contourf (fills) for clarity.',
      'Use alpha to layer contour lines over a filled contour.',
    ],
    examples: [
      {
        title: 'Filled contour of a Gaussian',
        description: 'Plot level curves of a 2-D Gaussian bump.',
        code: `import matplotlib.pyplot as plt
import numpy as np
x = np.linspace(-3, 3, 80)
y = np.linspace(-3, 3, 80)
X, Y = np.meshgrid(x, y)
Z = np.exp(-(X**2 + Y**2))
plt.figure(figsize=(6,5))
cs = plt.contourf(X, Y, Z, levels=12, cmap="magma")
plt.contour(X, Y, Z, levels=12, colors="k", linewidths=0.4)
plt.colorbar(cs)
plt.title("2-D Gaussian")
plt.tight_layout()
plt.show()`,
        language: 'python',
      },
    ],
    related: ['plt-imshow', 'plt-color-maps'],
  },
  {
    id: 'plt-savefig',
    title: 'Saving Figures (savefig)',
    category: 'I/O',
    difficulty: 'beginner',
    summary: 'Export figures to PNG, SVG, PDF, and more at any DPI.',
    definition:
      '`savefig` writes the current figure (or a given Figure) to a file or buffer. Format is inferred from the extension. Use `dpi` to control raster resolution and `bbox_inches="tight"` to trim whitespace.',
    syntax: 'plt.savefig("plot.png", dpi=150, bbox_inches="tight")',
    parameters: [
      { name: 'fname', type: 'str or file-like', description: 'Output path or buffer; extension sets the format.' },
      { name: 'dpi', type: 'int', description: 'Dots per inch for raster formats.' },
      { name: 'bbox_inches', type: 'str or bbox', description: '"tight" trims excess margins.' },
    ],
    returns: 'None — writes to disk/buffer.',
    keyPoints: [
      'Vector formats (svg, pdf) scale without pixelation.',
      'transparent=True saves with no background (great for slides).',
      'Call savefig BEFORE plt.show(); show() can clear the figure.',
      'facecolor controls the figure background color.',
    ],
    examples: [
      {
        title: 'Save to a buffer',
        description: 'Render to a PNG in memory.',
        code: `import matplotlib.pyplot as plt
import numpy as np
import io
x = np.linspace(0, 2*np.pi, 100)
plt.plot(x, np.sin(x))
buf = io.BytesIO()
plt.savefig(buf, format="png", dpi=120, bbox_inches="tight")
print("PNG bytes:", len(buf.getvalue()))
plt.show()`,
        language: 'python',
      },
    ],
    related: ['plt-pyplot-basics', 'plt-styling'],
  },
];
