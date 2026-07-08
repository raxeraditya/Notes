import type { Topic } from '../types';

export const plotlyTopics: Topic[] = [
  {
    id: 'plotly-intro',
    title: 'Plotly Overview & Express API',
    category: 'Fundamentals',
    difficulty: 'beginner',
    summary: 'Build interactive, browser-based figures in one call with plotly.express.',
    definition:
      'Plotly produces interactive, JavaScript-rendered figures with zoom, pan, hover, and export. `plotly.express` (imported as `px`) is the high-level API: one call creates a complete Figure. For fine-grained control, `plotly.graph_objects` (imported as `go`) exposes every property. Figures are JSON objects that the browser renders.',
    syntax: 'import plotly.express as px\nfig = px.scatter(df, x="a", y="b", color="cat")\nfig.show()',
    returns: 'A plotly Figure object (a JSON-serialisable graph description).',
    keyPoints: [
      'px functions accept a DataFrame and column names — like seaborn.',
      'Every figure is interactive: hover, zoom, pan, and a modebar.',
      'fig.show() renders in a notebook or browser; fig.to_html() embeds it.',
      'fig.to_html() embeds the figure in a web page.',
    ],
    examples: [
      {
        title: 'First interactive scatter',
        description: 'Plot a DataFrame with hover tooltips.',
        code: `import plotly.express as px
df = px.data.iris()
fig = px.scatter(df, x="sepal_width", y="sepal_length",
                 color="species", size="petal_length",
                 hover_data=["petal_width"],
                 title="Iris - interactive")
fig.show()`,
        language: 'python',
      },
    ],
    related: ['plotly-express-scatter', 'plotly-express-line'],
  },
  {
    id: 'plotly-express-scatter',
    title: 'Express Scatter & Bubble Plots',
    category: 'Express',
    difficulty: 'beginner',
    summary: 'scatter, scatter_3d, and scatter_matrix with color, size, and facet.',
    definition:
      '`px.scatter` creates an interactive scatter plot. `color` and `symbol` map categorical columns to visual attributes; `size` maps a numeric column to marker size (bubble chart); `facet_col`/`facet_row` split into subplots; `hover_name` sets the hover title.',
    syntax: 'px.scatter(df, x=, y=, color=, size=, hover_name=, facet_col=)',
    returns: 'A plotly Figure.',
    keyPoints: [
      'animation_frame= adds a play button that animates over a column.',
      'hover_data=["a","b"] adds extra columns to the hover tooltip.',
      'marginal_y="box" / marginal_x="histogram" add marginal plots.',
      'trendline="ols" fits and draws an ordinary least-squares line.',
    ],
    examples: [
      {
        title: 'Animated bubble chart',
        description: 'Animate a gapminder-style plot by year.',
        code: `import plotly.express as px
df = px.data.gapminder().query("continent == 'Europe'")
fig = px.scatter(df, x="gdpPercap", y="lifeExp",
                 size="pop", color="country",
                 hover_name="country",
                 animation_frame="year",
                 size_max=45, range_x=[0, 60000], range_y=[60, 85],
                 title="Europe over time")
fig.show()`,
        language: 'python',
      },
      {
        title: 'Scatter with marginals',
        description: 'Add marginal histograms.',
        code: `import plotly.express as px
df = px.data.iris()
fig = px.scatter(df, x="sepal_length", y="petal_length",
                 color="species",
                 marginal_x="box", marginal_y="violin",
                 title="Scatter with marginals")
fig.show()`,
        language: 'python',
      },
    ],
    related: ['plotly-intro', 'plotly-express-line'],
  },
  {
    id: 'plotly-express-line',
    title: 'Express Line & Area Plots',
    category: 'Express',
    difficulty: 'beginner',
    summary: 'line and area for time series and trends, with color groups.',
    definition:
      '`px.line` connects points in order; `px.area` fills the area under the line. Both support `color` for multiple series, `line_group` to group rows into lines, and `markers=True` to show data points.',
    syntax: 'px.line(df, x=, y=, color=, line_group=, markers=True)',
    returns: 'A plotly Figure.',
    keyPoints: [
      'Pass a long-format DataFrame with color=category to draw multiple lines.',
      'line_dash="cat" encodes another category as dash style.',
      'area plot stacks by default; groupnorm="percent" normalises to 100%.',
      'Use range_x / range_y to fix the axis bounds.',
    ],
    examples: [
      {
        title: 'Multi-series line',
        description: 'Plot GDP per capita for several countries.',
        code: `import plotly.express as px
df = px.data.gapminder().query("country in ['Canada','France','Japan']")
fig = px.line(df, x="year", y="gdpPercap", color="country",
              markers=True, title="GDP per capita")
fig.show()`,
        language: 'python',
      },
      {
        title: 'Stacked area',
        description: 'Fill area under each line, stacked.',
        code: `import plotly.express as px
df = px.data.gapminder().query("continent == 'Asia'")
df = df.groupby(["year","continent"], as_index=False)["pop"].sum()
fig = px.area(df, x="year", y="pop", title="Asia population")
fig.show()`,
        language: 'python',
      },
    ],
    related: ['plotly-express-scatter', 'plotly-express-bar'],
  },
  {
    id: 'plotly-express-bar',
    title: 'Express Bar & Histogram',
    category: 'Express',
    difficulty: 'beginner',
    summary: 'bar for categorical comparisons, histogram for distributions.',
    definition:
      '`px.bar` draws bars; pass a category to `x` and a value to `y`. With a long-format frame and `color`, bars group or stack (barmode="group"/"stack"/"relative"). `px.histogram` bins a numeric column; `color` splits by category and `barmode="overlay"` or "stack" controls interaction.',
    syntax: 'px.bar(df, x=, y=, color=, barmode="group") | px.histogram(df, x=, color=, nbins=30)',
    returns: 'A plotly Figure.',
    keyPoints: [
      'bar with color and barmode="stack" stacks; default is "group" (side-by-side).',
      'histogram y can be a column for weighted counts.',
      'histfunc="avg" changes the aggregation for bar plots.',
      'text_auto=True shows value labels on bars.',
    ],
    examples: [
      {
        title: 'Grouped & stacked bars',
        description: 'Compare two series with different barmodes.',
        code: `import plotly.express as px
df = px.data.tips()
fig = px.bar(df, x="day", y="total_bill", color="sex",
             barmode="group", title="Grouped bars",
             labels={"total_bill":"total bill ($)"})
fig.show()`,
        language: 'python',
      },
      {
        title: 'Histogram overlay',
        description: 'Compare distributions across a category.',
        code: `import plotly.express as px
df = px.data.tips()
fig = px.histogram(df, x="total_bill", color="time",
                   nbins=25, barmode="overlay", opacity=0.7,
                   title="Bill distribution by time")
fig.show()`,
        language: 'python',
      },
    ],
    related: ['plotly-express-line', 'plotly-express-scatter'],
  },
  {
    id: 'plotly-express-faceting',
    title: 'Faceting (facet_col, facet_row)',
    category: 'Express',
    difficulty: 'intermediate',
    summary: 'Split a figure into small multiples by a categorical column.',
    definition:
      '`facet_col` and `facet_row` create a grid of subplots, one per value of a categorical column — seaborn-style faceting, but interactive. `facet_col_wrap` wraps a long row of facets into rows.',
    syntax: 'px.scatter(df, x=, y=, facet_col="cat", facet_col_wrap=3)',
    returns: 'A plotly Figure with multiple subplots.',
    keyPoints: [
      'facet_col_wrap=N wraps N facets per row.',
      'Use facet_row_spacing / facet_col_spacing to adjust gaps.',
      'Hover stays scoped to each facet — perfect for comparison.',
      'category_orders= controls the facet order.',
    ],
    examples: [
      {
        title: 'Faceted scatter',
        description: 'One subplot per continent.',
        code: `import plotly.express as px
df = px.data.gapminder().query("year == 2007")
fig = px.scatter(df, x="gdpPercap", y="lifeExp", size="pop",
                 color="country", facet_col="continent",
                 facet_col_wrap=3, size_max=45,
                 title="2007 life expectancy vs GDP")
fig.show()`,
        language: 'python',
      },
    ],
    related: ['plotly-express-scatter', 'plotly-express-bar'],
  },
  {
    id: 'plotly-graph-objects',
    title: 'Graph Objects (go) — Low-Level API',
    category: 'Graph Objects',
    difficulty: 'advanced',
    summary: 'Build figures trace by trace with full control over every property.',
    definition:
      '`plotly.graph_objects` (go) is the low-level API. A Figure holds a list of `Trace` objects (Scatter, Bar, Box, Histogram, Heatmap, Surface, ...) and a `Layout`. You add traces with fig.add_trace() and style the figure with fig.update_layout().',
    syntax: 'fig = go.Figure(); fig.add_trace(go.Scatter(x=, y=, mode="markers+lines"))',
    returns: 'A go.Figure object.',
    keyPoints: [
      'mode can be "markers", "lines", or "markers+lines".',
      'fig.update_layout(title=, xaxis_title=, template="plotly_dark") styles globally.',
      'Multiple traces of different types create a combined chart.',
      'Use fig.add_trace(go.Heatmap(z=matrix)) for 2-D color arrays.',
    ],
    examples: [
      {
        title: 'Custom two-trace figure',
        description: 'Combine a line and markers with a dark template.',
        code: `import plotly.graph_objects as go
import numpy as np
x = np.linspace(0, 6, 30)
fig = go.Figure()
fig.add_trace(go.Scatter(x=x, y=np.sin(x), mode="lines",
                         name="sin", line=dict(color="#38bdf8")))
fig.add_trace(go.Scatter(x=x, y=np.cos(x), mode="markers",
                         name="cos", marker=dict(size=6, color="#34d399")))
fig.update_layout(title="sin & cos", template="plotly_dark",
                  xaxis_title="x", yaxis_title="value")
fig.show()`,
        language: 'python',
      },
    ],
    related: ['plotly-intro', 'plotly-subplots-go'],
  },
  {
    id: 'plotly-subplots-go',
    title: 'Subplots with make_subplots',
    category: 'Graph Objects',
    difficulty: 'advanced',
    summary: 'Arrange multiple traces in a grid and mix trace types per cell.',
    definition:
      '`make_subplots(rows=N, cols=M, specs=...)` creates a Figure with an empty grid; you add traces to specific cells with `fig.add_trace(trace, row=r, col=c)`. `specs` supports mixed types (e.g. a scatter beside a pie) via secondary_y for dual axes.',
    syntax: 'fig = make_subplots(rows=1, cols=2); fig.add_trace(trace, row=1, col=2)',
    returns: 'A go.Figure with a pre-built subplot grid.',
    keyPoints: [
      'subplot_titles= sets a title for each cell.',
      'specs controls the trace type per cell (e.g. {"type":"domain"} for pie).',
      'row_heights / column_widths set relative sizes.',
      'shared_xaxes=True links the x-axis across a column.',
    ],
    examples: [
      {
        title: 'Side-by-side scatter and bar',
        description: 'Two different chart types in one figure.',
        code: `from plotly.subplots import make_subplots
import plotly.graph_objects as go
import numpy as np
fig = make_subplots(rows=1, cols=2, subplot_titles=("Scatter","Bars"))
x = np.linspace(0, 5, 20)
fig.add_trace(go.Scatter(x=x, y=x**2, mode="markers",
                         marker=dict(color="#38bdf8")), row=1, col=1)
fig.add_trace(go.Bar(x=["A","B","C"], y=[3,5,2],
                     marker=dict(color="#34d399")), row=1, col=2)
fig.update_layout(title="Mixed subplots", showlegend=False)
fig.show()`,
        language: 'python',
      },
    ],
    related: ['plotly-graph-objects', 'plotly-intro'],
  },
  {
    id: 'plotly-express-distributions',
    title: 'Distribution Plots (box, violin, strip)',
    category: 'Express',
    difficulty: 'intermediate',
    summary: 'box, violin, and strip for comparing distributions across groups.',
    definition:
      '`px.box` draws box-and-whisker plots; `px.violin` adds a kernel density; `px.strip` shows individual points (a beeswarm when jitter is enabled). All accept `color` for grouping and `box=True`/`points="all"` to combine views.',
    syntax: 'px.box(df, x=, y=, color=) | px.violin(df, x=, y=, box=True, points="all")',
    returns: 'A plotly Figure.',
    keyPoints: [
      'violin box=True overlays a mini boxplot inside the violin.',
      'points="all" shows every observation; points="outliers" shows only outliers.',
      'notched=True on box adds a notch for median comparison.',
      'facet_col works on all distribution plots.',
    ],
    examples: [
      {
        title: 'Violin with box overlay',
        description: 'Compare a distribution by category.',
        code: `import plotly.express as px
df = px.data.tips()
fig = px.violin(df, y="total_bill", x="day", color="sex",
                box=True, points="all", title="Bill by day & sex")
fig.show()`,
        language: 'python',
      },
    ],
    related: ['plotly-express-bar', 'plotly-express-scatter'],
  },
  {
    id: 'plotly-heatmap-3d',
    title: 'Heatmaps & 3-D Surface Plots',
    category: 'Advanced',
    difficulty: 'advanced',
    summary: 'Visualise 2-D scalar fields and 3-D surfaces interactively.',
    definition:
      '`px.imshow` displays a 2-D array as an interactive heatmap with hover values. `go.Surface` renders a 3-D surface from a grid of x, y, z values — fully rotatable in the browser.',
    syntax: 'px.imshow(matrix, color_continuous_scale="Viridis") | go.Surface(x=X, y=Y, z=Z)',
    returns: 'A plotly Figure.',
    keyPoints: [
      'imshow supports color_continuous_scale and color_continuous_midpoint.',
      'Surface needs meshgrid-style X, Y, Z arrays.',
      'Use scene_camera to set the default 3-D viewing angle.',
      'contours_z=dict(show=True) draws contour lines on a surface.',
    ],
    examples: [
      {
        title: 'Interactive heatmap',
        description: 'Show a matrix with hover values.',
        code: `import plotly.express as px
import numpy as np
rng = np.random.default_rng(1)
z = rng.uniform(0, 10, (8, 8))
fig = px.imshow(z, color_continuous_scale="Viridis",
                title="Random heatmap", text_auto=".1f")
fig.show()`,
        language: 'python',
      },
      {
        title: '3-D surface',
        description: 'Render a rotatable surface.',
        code: `import plotly.graph_objects as go
import numpy as np
x = np.linspace(-3, 3, 40)
y = np.linspace(-3, 3, 40)
X, Y = np.meshgrid(x, y)
Z = np.sin(X) * np.cos(Y)
fig = go.Figure(data=[go.Surface(x=X, y=Y, z=Z, colorscale="Magma")])
fig.update_layout(title="3-D surface", scene=dict(
    xaxis_title="x", yaxis_title="y", zaxis_title="z"))
fig.show()`,
        language: 'python',
      },
    ],
    related: ['plotly-graph-objects', 'plotly-subplots-go'],
  },
  {
    id: 'plotly-styling-themes',
    title: 'Styling, Templates & Hover Control',
    category: 'Appearance',
    difficulty: 'intermediate',
    summary: 'Templates, update_traces, and hover_data control the look and tooltips.',
    definition:
      'Plotly themes are called "templates" (plotly, plotly_white, plotly_dark, ggplot2, seaborn, simple_white). `fig.update_traces()` edits all traces at once; `fig.update_layout()` edits the figure chrome. `hovermode`, `hovertemplate`, and `customdata` fully control tooltips.',
    syntax: 'fig.update_layout(template="plotly_dark", hovermode="x unified")',
    returns: 'The same Figure, mutated in place (also returned for chaining).',
    keyPoints: [
      'px.defaults.template = "plotly_dark" sets a global default.',
      'hovermode="x unified" shows one combined tooltip per x value.',
      'hovertemplate="%{y:.1f} units" fully customises tooltip text.',
      'update_traces(marker=dict(size=8, opacity=0.6)) edits every trace.',
    ],
    examples: [
      {
        title: 'Dark template + custom hover',
        description: 'Style a scatter and customise the tooltip.',
        code: `import plotly.express as px
df = px.data.iris()
fig = px.scatter(df, x="sepal_width", y="sepal_length", color="species")
fig.update_layout(template="plotly_dark",
                  title="Iris (dark)",
                  hovermode="x unified")
fig.update_traces(marker=dict(size=9, line=dict(width=0.5, color="white")))
fig.show()`,
        language: 'python',
      },
    ],
    related: ['plotly-intro', 'plotly-graph-objects'],
  },
  {
    id: 'plotly-export-html',
    title: 'Exporting Figures (to_html, to_image)',
    category: 'I/O',
    difficulty: 'intermediate',
    summary: 'Embed figures in web pages or export to static images.',
    definition:
      '`fig.to_html(full_html=False, include_plotlyjs="cdn")` returns an HTML snippet that renders the figure with the Plotly.js library. `to_image(format="png")` needs the kaleido package. to_html is the standard way to embed figures in web pages.',
    syntax: 'fig.to_html(full_html=False, include_plotlyjs="cdn") | fig.to_image(format="png")',
    returns: 'An HTML string or image bytes.',
    keyPoints: [
      'include_plotlyjs="cdn" loads Plotly.js from a CDN — smallest HTML.',
      'include_plotlyjs=False requires the page to already load plotly.js.',
      'full_html=False returns a div snippet; True returns a full page.',
      'config={"displayModeBar": False} hides the toolbar in the output.',
    ],
    examples: [
      {
        title: 'Export to HTML snippet',
        description: 'Get the HTML string for embedding.',
        code: `import plotly.express as px
df = px.data.iris()
fig = px.scatter(df, x="sepal_width", y="sepal_length", color="species")
html = fig.to_html(full_html=False, include_plotlyjs="cdn")
print("HTML length:", len(html), "chars")
print("starts with:", html[:60])`,
        language: 'python',
      },
    ],
    related: ['plotly-intro', 'plotly-styling-themes'],
  },
];
