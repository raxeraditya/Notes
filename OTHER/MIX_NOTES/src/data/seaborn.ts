import type { Topic } from '../types';

export const seabornTopics: Topic[] = [
  {
    id: 'sns-intro',
    title: 'Seaborn Overview & Datasets',
    category: 'Fundamentals',
    difficulty: 'beginner',
    summary: 'A high-level statistical plotting API built on matplotlib with beautiful defaults.',
    definition:
      'Seaborn is a Matplotlib-based library for statistical data visualisation. It provides a dataset-oriented API: you pass a DataFrame and column names, and seaborn handles grouping, aggregation, and styling. It also ships built-in datasets via `load_dataset` and sets attractive defaults.',
    syntax: 'import seaborn as sns\nsns.set_theme(style="whitegrid")\ndf = sns.load_dataset("penguins")',
    returns: 'A seaborn theme context and a DataFrame for load_dataset.',
    keyPoints: [
      'sns.set_theme() applies seaborn defaults globally (replaces matplotlib defaults).',
      'Most functions accept data=df and x=/y= column-name arguments.',
      'Built-in datasets: penguins, tips, flights, iris, diamonds, mpg, planets.',
      'Every seaborn function returns a Matplotlib Axes — you can still customise it.',
    ],
    examples: [
      {
        title: 'Theme + scatter of penguins',
        description: 'Load a dataset and plot with one call.',
        code: `import seaborn as sns
import matplotlib.pyplot as plt
sns.set_theme(style="whitegrid")
df = sns.load_dataset("penguins")
print(df.head())
print("\\nshape:", df.shape, "species:", df["species"].unique().tolist())
sns.scatterplot(data=df, x="flipper_length_mm", y="body_mass_g", hue="species")
plt.title("Penguin flipper vs mass")
plt.tight_layout()
plt.show()`,
        language: 'python',
      },
    ],
    related: ['sns-relational-plots', 'sns-distribution-plots'],
  },
  {
    id: 'sns-relational-plots',
    title: 'Relational Plots (scatterplot, lineplot)',
    category: 'Relational',
    difficulty: 'beginner',
    summary: 'Visualise relationships between two numeric variables, with hue/size/style for more.',
    definition:
      '`scatterplot` and `lineplot` show relationships between two numeric variables. Both support `hue`, `size`, and `style` to encode additional categorical or numeric variables. `relplot` is the figure-level wrapper that can facet by row/column.',
    syntax: 'sns.scatterplot(data=df, x=, y=, hue=, size=, style=)',
    returns: 'A Matplotlib Axes (or FacetGrid for relplot).',
    keyPoints: [
      'hue colours by a category; size scales marker by a numeric; style changes marker shape.',
      'lineplot aggregates y at each x by default (mean + 95% CI).',
      'relplot(kind="scatter", col="cat") faceting creates subplots automatically.',
      'Pass palette="Set2" or a dict for custom colors.',
    ],
    examples: [
      {
        title: 'Multi-encoding scatter',
        description: 'Colour and size by different columns.',
        code: `import seaborn as sns
import matplotlib.pyplot as plt
sns.set_theme()
df = sns.load_dataset("tips")
sns.scatterplot(data=df, x="total_bill", y="tip",
                hue="time", size="size", sizes=(20, 200), alpha=0.7)
plt.title("Bill vs tip")
plt.tight_layout()
plt.show()`,
        language: 'python',
      },
      {
        title: 'Faceted relplot',
        description: 'Create one subplot per category.',
        code: `import seaborn as sns
import matplotlib.pyplot as plt
df = sns.load_dataset("penguins").dropna()
g = sns.relplot(data=df, x="flipper_length_mm", y="body_mass_g",
                hue="species", col="island", kind="scatter")
g.fig.suptitle("Penguins by island", y=1.03)
plt.show()`,
        language: 'python',
      },
    ],
    related: ['sns-categorical-plots', 'sns-intro'],
  },
  {
    id: 'sns-distribution-plots',
    title: 'Distribution Plots (histplot, kdeplot, ecdfplot)',
    category: 'Distributions',
    difficulty: 'intermediate',
    summary: 'Visualise the distribution of one or more variables.',
    definition:
      '`histplot` bins data; `kdeplot` draws a smooth kernel density estimate; `ecdfplot` draws the empirical cumulative distribution. `displot` is the figure-level wrapper that can facet and combine hist + kde.',
    syntax: 'sns.histplot(data=df, x="col", hue="cat", kde=True, stat="density")',
    returns: 'A Matplotlib Axes (or FacetGrid for displot).',
    keyPoints: [
      'kde=True overlays a density curve on the histogram.',
      'stat="density" normalises so the area is 1 (compare distributions).',
      'hue splits by category; multiple="stack"/"dodge"/"fill" controls overlap.',
      'common_norm=False normalises each hue group independently.',
    ],
    examples: [
      {
        title: 'Histogram with KDE',
        description: 'Compare a distribution across categories.',
        code: `import seaborn as sns
import matplotlib.pyplot as plt
sns.set_theme()
df = sns.load_dataset("penguins").dropna()
sns.histplot(data=df, x="flipper_length_mm", hue="species",
             kde=True, stat="density", common_norm=False, alpha=0.4)
plt.title("Flipper length by species")
plt.tight_layout()
plt.show()`,
        language: 'python',
      },
      {
        title: 'KDE only',
        description: 'Smooth density curves.',
        code: `import seaborn as sns
import matplotlib.pyplot as plt
df = sns.load_dataset("tips")
sns.kdeplot(data=df, x="total_bill", hue="time", fill=True, alpha=0.4)
plt.title("Bill density by time")
plt.tight_layout()
plt.show()`,
        language: 'python',
      },
    ],
    related: ['sns-categorical-plots', 'sns-intro'],
  },
  {
    id: 'sns-categorical-plots',
    title: 'Categorical Plots (barplot, boxplot, violinplot)',
    category: 'Categorical',
    difficulty: 'intermediate',
    summary: 'Compare a numeric variable across categorical groups.',
    definition:
      '`barplot` shows an estimate (mean by default) with a confidence interval; `boxplot` shows quartiles and outliers; `violinplot` combines a boxplot with a KDE. `catplot` is the figure-level wrapper with kind=.',
    syntax: 'sns.boxplot(data=df, x="cat", y="num", hue="group")',
    returns: 'A Matplotlib Axes (or FacetGrid for catplot).',
    keyPoints: [
      'barplot estimator defaults to mean; pass estimator=np.median.',
      'boxplot shows median, IQR box, whiskers (1.5*IQR), and outlier dots.',
      'violinplot adds a symmetric KDE — good for seeing distribution shape.',
      'hue + dodge=True puts hue groups side-by-side.',
    ],
    examples: [
      {
        title: 'Boxplot by category',
        description: 'Compare bill distributions by day.',
        code: `import seaborn as sns
import matplotlib.pyplot as plt
sns.set_theme()
df = sns.load_dataset("tips")
sns.boxplot(data=df, x="day", y="total_bill", hue="time", dodge=True)
plt.title("Bill by day & time")
plt.tight_layout()
plt.show()`,
        language: 'python',
      },
      {
        title: 'Violinplot',
        description: 'See full distribution shape per group.',
        code: `import seaborn as sns
import matplotlib.pyplot as plt
df = sns.load_dataset("penguins").dropna()
sns.violinplot(data=df, x="species", y="body_mass_g", inner="quartile")
plt.title("Body mass by species")
plt.tight_layout()
plt.show()`,
        language: 'python',
      },
    ],
    related: ['sns-distribution-plots', 'sns-relational-plots'],
  },
  {
    id: 'sns-regression-plots',
    title: 'Regression Plots (regplot, lmplot)',
    category: 'Regression',
    difficulty: 'intermediate',
    summary: 'Plot a linear fit with confidence interval over a scatter.',
    definition:
      '`regplot` fits and plots a simple linear regression with a 95% confidence band; `lmplot` is the figure-level version that supports hue and faceting. Both can fit polynomial orders and logistic regressions.',
    syntax: 'sns.regplot(data=df, x="a", y="b", order=1, ci=95)',
    returns: 'A Matplotlib Axes (or FacetGrid for lmplot).',
    keyPoints: [
      'order=2+ fits a polynomial of that degree.',
      'logistic=True fits a binary-outcome logistic regression.',
      'ci=None removes the confidence band for speed.',
      'scatter_kws and line_kws pass kwargs to the underlying artists.',
    ],
    examples: [
      {
        title: 'Linear fit with CI',
        description: 'Fit bill vs tip with a confidence band.',
        code: `import seaborn as sns
import matplotlib.pyplot as plt
sns.set_theme()
df = sns.load_dataset("tips")
sns.regplot(data=df, x="total_bill", y="tip",
            scatter_kws={"alpha":0.5}, line_kws={"color":"#fb7185"})
plt.title("Tip vs bill")
plt.tight_layout()
plt.show()`,
        language: 'python',
      },
    ],
    related: ['sns-relational-plots', 'sns-matrix-plots'],
  },
  {
    id: 'sns-matrix-plots',
    title: 'Matrix Plots (heatmap, clustermap)',
    category: 'Matrix',
    difficulty: 'intermediate',
    summary: 'Visualise 2-D matrices and correlation tables with color.',
    definition:
      '`heatmap` draws a color-coded matrix with optional cell annotations; `clustermap` reorders rows and columns by hierarchical clustering to reveal structure. Both take a 2-D array or DataFrame.',
    syntax: 'sns.heatmap(data, annot=True, cmap="coolwarm", center=0)',
    returns: 'A Matplotlib Axes (heatmap) or ClusterGrid (clustermap).',
    keyPoints: [
      'annot=True writes the numeric value in each cell.',
      'center=0 centers the colormap — ideal for correlations.',
      'fmt=".1f" controls annotation number format.',
      'corr = df.corr(numeric_only=True) is the classic heatmap input.',
    ],
    examples: [
      {
        title: 'Correlation heatmap',
        description: 'Show correlations between numeric columns.',
        code: `import seaborn as sns
import matplotlib.pyplot as plt
df = sns.load_dataset("penguins").dropna()
corr = df.select_dtypes("number").corr()
sns.heatmap(corr, annot=True, cmap="coolwarm", center=0, fmt=".2f",
            square=True, linewidths=0.5)
plt.title("Penguin correlations")
plt.tight_layout()
plt.show()`,
        language: 'python',
      },
    ],
    related: ['sns-categorical-plots', 'sns-distribution-plots'],
  },
  {
    id: 'sns-pair-plot',
    title: 'Pairplot — All-vs-All Scatter Matrix',
    category: 'Multivariate',
    difficulty: 'intermediate',
    summary: 'Scatter every numeric column against every other in one grid.',
    definition:
      '`pairplot` creates a grid of pairwise scatter plots for all numeric columns, with univariate distributions on the diagonal. `hue` colours by a categorical variable, instantly revealing class separation.',
    syntax: 'sns.pairplot(data=df, hue="species", diag_kind="kde")',
    returns: 'A PairGrid (figure-level) — call .savefig on .fig.',
    keyPoints: [
      'diag_kind="kde" or "hist" sets the diagonal plot type.',
      'hue colours points and splits the diagonal by category.',
      'vars=["a","b","c"] plots a subset of columns.',
      'corner=True shows only the lower triangle to save space.',
    ],
    examples: [
      {
        title: 'Penguin pairplot',
        description: 'All-vs-all scatter coloured by species.',
        code: `import seaborn as sns
import matplotlib.pyplot as plt
df = sns.load_dataset("penguins").dropna()
g = sns.pairplot(df, hue="species", diag_kind="kde", corner=True)
g.fig.suptitle("Penguin pairplot", y=1.02)
plt.show()`,
        language: 'python',
      },
    ],
    related: ['sns-relational-plots', 'sns-matrix-plots'],
  },
  {
    id: 'sns-joint-plot',
    title: 'jointplot — Bivariate + Marginals',
    category: 'Multivariate',
    difficulty: 'intermediate',
    summary: 'A scatter (or KDE) in the centre with marginal distributions on the sides.',
    definition:
      '`jointplot` shows the joint relationship between two variables in the centre and their univariate distributions on the top and right margins. kind can be "scatter" (default), "kde", "hist", "hex", or "reg".',
    syntax: 'sns.jointplot(data=df, x="a", y="b", hue="cat", kind="scatter")',
    returns: 'A JointGrid object (figure-level).',
    keyPoints: [
      'kind="kde" shows contour lines instead of points.',
      'kind="hex" uses hexbin bins — great for dense data.',
      'hue splits both the joint and marginal plots by category.',
      'Access the underlying axes via g.ax_joint and g.ax_marg_*.',
    ],
    examples: [
      {
        title: 'Joint KDE plot',
        description: 'Density contours with marginal curves.',
        code: `import seaborn as sns
import matplotlib.pyplot as plt
df = sns.load_dataset("penguins").dropna()
g = sns.jointplot(data=df, x="flipper_length_mm", y="body_mass_g",
                  hue="species", kind="kde")
plt.show()`,
        language: 'python',
      },
    ],
    related: ['sns-distribution-plots', 'sns-pair-plot'],
  },
  {
    id: 'sns-themes-palettes',
    title: 'Themes & Color Palettes',
    category: 'Appearance',
    difficulty: 'beginner',
    summary: 'set_theme, despine, and color_palette control the global look.',
    definition:
      'Seaborn themes (white, dark, whitegrid, darkgrid, ticks) set background and grid style; `despine` removes the top/right spines for a cleaner look; `color_palette` returns a list of colors you can pass to any plot or use in a custom cycle.',
    syntax: 'sns.set_theme(style="whitegrid", palette="Set2") | sns.color_palette("Set2")',
    returns: 'set_theme mutates global state; color_palette returns a list of RGB tuples.',
    keyPoints: [
      'context="talk"/"paper"/"notebook" scales font sizes.',
      'deep, pastel, dark, colorblind, Set2 are common qualitative palettes.',
      'sns.despine() removes the top and right axes borders.',
      'with sns.color_palette("Set2"): temporarily sets the cycle.',
    ],
    examples: [
      {
        title: 'Custom palette bar plot',
        description: 'Use a named palette and despine.',
        code: `import seaborn as sns
import matplotlib.pyplot as plt
sns.set_theme(style="white", palette="Set2")
df = sns.load_dataset("tips")
ax = sns.barplot(data=df, x="day", y="total_bill", errorbar=None)
sns.despine()
plt.title("Mean bill by day")
plt.tight_layout()
plt.show()`,
        language: 'python',
      },
    ],
    related: ['sns-intro', 'sns-categorical-plots'],
  },
];
