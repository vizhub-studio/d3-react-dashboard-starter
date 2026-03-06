Please make a plan to implement the following dashboard example into our project:

**index.html**

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Interactive Dashboard</title>
    <script type="importmap">
      {
        "imports": {
          "react": "https://cdn.jsdelivr.net/npm/react@19.1.0/+esm",
          "react/jsx-runtime": "https://cdn.jsdelivr.net/npm/react@19.1.0/jsx-runtime/+esm",
          "react-dom/client": "https://cdn.jsdelivr.net/npm/react-dom@19.1.0/client/+esm",
          "d3": "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm"
        }
      }
    </script>
    <script src="https://unpkg.com/@tailwindcss/browser@4"></script>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="index.jsx"></script>
  </body>
</html>

```

**README.md**

```
# Interactive Dashboard

A modern, interactive dashboard application built with React
and D3.js, featuring dual synchronized charts (scatter plot
and bar chart) with a grayscale theme and professional
styling.

## Features

- **Dual Interactive Charts**:
  - Scatter plot with clickable circles
  - Bar chart with synchronized selection
  - Charts update reactively based on user interactions
- **Synchronized Selection**: Click on elements in either
  chart to select them; click again to deselect
- **Responsive Design**: Charts automatically resize to fit
  their containers using ResizeObserver
- **D3 Integration**: Leverages D3.js scales and selections
  for data visualization
- **Grayscale Theme**: Professional grayscale color palette
  with dark gradient background
- **Hover Effects**: Visual feedback with brightness
  transitions on hover

## Architecture

### Components

- **App**: Main application component that manages shared
  selection state
- **Layout**: High-level layout wrapper with header and main
  content sections
- **HeaderTitleTagline**: Reusable header component with
  title and subtitle
- **LayoutMainContent**: Flexible main content container
- **Viz**: Generic chart container that handles SVG
  rendering and dimension tracking
- **ScatterPlot**: Scatter plot component (renders circles)
- **BarChart**: Bar chart component (renders bars)

### Utilities

- **useChartDimensions**: Custom hook that uses
  ResizeObserver to track container dimensions
- **chartConfig.js**: Centralized configuration for colors
  and padding
- **chartUtils.js**: Shared D3 utilities for styling and
  interactions
- **renderCircles.js**: D3 rendering function for scatter
  plot
- **renderBars.js**: D3 rendering function for bar chart

## Data

The application uses sample data defined in `data.js`
containing 5 data points with:

- `id`: Unique identifier
- `x`: X-axis value (0-960 range)
- `y`: Y-axis value (0-500 range)

## Color Scheme

- **Primary**: #666666 (Medium Gray) - Default element color
- **Selected**: #ffffff (White) - Highlighted element color
- **Accent**: #cccccc (Light Gray) - Selected element stroke
- **Background**: Grayscale gradient from #1a1a1a to #2d2d2d

## Getting Started

1. Open `index.html` in a modern browser (uses ES modules)
2. The application loads React, React-DOM, and D3 from CDN
3. Styling is powered by Tailwind CSS and custom theme
   variables

## Interaction

- **Click** on circles or bars to select/deselect them
- **Hover** over elements for visual brightness feedback
- **Click on SVG background** to deselect all elements
- Selection state is synchronized across both charts

## Tech Stack

- **React 19**: UI framework
- **D3 7**: Data visualization
- **Tailwind CSS 4**: Utility-first CSS framework
- **ES Modules**: Modern JavaScript module system

```

**index.jsx**

```
import { createRoot } from 'react-dom/client';
import App from './App';
import { InteractionProvider } from './contexts/InteractionContext';
import { DataProvider } from './contexts/DataContext';

const root = createRoot(document.getElementById('root'));
root.render(
  <DataProvider>
    <InteractionProvider>
      <App />
    </InteractionProvider>
  </DataProvider>,
);

```

**App.jsx**

```
import Layout from './components/Layout/Layout';
import HeaderTitleTagline from './components/Layout/HeaderTitleTagline';
import LayoutMainContent from './components/Layout/LayoutMainContent';
import ScatterPlot from './components/Chart/ScatterPlot';
import BarChart from './components/Chart/BarChart';

const App = () => {
  return (
    <Layout
      header={
        <HeaderTitleTagline
          title="Interactive Dashboard"
          tagline="This dashboard explains why circles and bars are best friends"
        />
      }
      mainContent={
        <LayoutMainContent className="flex flex-row gap-4 h-full">
          <div className="flex-1 min-w-0">
            <ScatterPlot />
          </div>
          <div className="flex-1 min-w-0">
            <BarChart />
          </div>
        </LayoutMainContent>
      }
    />
  );
};

export default App;

```

**components/Chart/BarChart.jsx**

```
import { useContext, useCallback } from 'react';
import { DataContext } from '../../contexts/DataContext';
import { InteractionContext } from '../../contexts/InteractionContext';
import Viz from './Viz';
import VizWrapper from './VizWrapper';
import { renderBars } from './renderBars';

const BarChart = () => {
  const { data, loading, error } = useContext(DataContext);
  const { selectedId, setSelectedId } = useContext(
    InteractionContext,
  );

  const renderFunction = useCallback(
    (svg, { width, height }) => {
      renderBars(svg, {
        xValue: (d) => d.id,
        yValue: (d) => d.y,
        data,
        selectedId,
        onClick: setSelectedId,
        width,
        height,
      });
    },
    [data, selectedId, setSelectedId],
  );

  return (
    <VizWrapper loading={loading} error={error}>
      <Viz renderFunction={renderFunction} />
    </VizWrapper>
  );
};

export default BarChart;

```

**components/Chart/renderBars.js**

```javascript
import { scaleLinear, scaleBand, easeLinear } from 'd3';
import { DEFAULT_MARGIN } from './chartConfig';
import { attachInteractions } from './chartUtils';
import { CHART_COLORS } from './chartConfig';

export const renderBars = (
  selection,
  {
    xValue,
    yValue,
    data,
    selectedId,
    onClick,
    width,
    height,
    margin = DEFAULT_MARGIN,
  },
) => {
  const xScale = scaleBand()
    .domain(data.map((d) => xValue(d)))
    .range([margin.left, width - margin.right])
    .padding(0.3);

  const yScale = scaleLinear()
    .domain([0, 500])
    .range([height - margin.bottom, margin.top]);

  const bars = selection
    .selectAll('rect.bar')
    .data(data, (d) => d.id)
    .join('rect')
    .attr('class', 'bar')
    .attr('x', (d) => xScale(xValue(d)))
    .attr('width', xScale.bandwidth())
    .attr('y', (d) => yScale(yValue(d)))
    .attr(
      'height',
      (d) => height - margin.bottom - yScale(yValue(d)),
    );

  // Apply color transitions with linear easing
  bars
    .transition()
    .ease(easeLinear)
    .duration(300)
    .attr('fill', (d) =>
      d.id === selectedId
        ? CHART_COLORS.selected
        : CHART_COLORS.primary,
    )
    .attr('stroke', (d) =>
      d.id === selectedId
        ? CHART_COLORS.selectedStroke
        : '#999999',
    )
    .attr('stroke-width', 1);

  attachInteractions({
    marks: bars,
    svg: selection.node().parentNode ? selection : null,
    onClick,
  });
};

```

**components/Layout/HeaderTitleTagline.jsx**

```
export default function HeaderTitleTagline({
  title,
  tagline,
}) {
  return (
    <div className="flex flex-col w-full py-1">
      <h1 className="text-3xl font-bold tracking-wide">
        {title}
      </h1>
      <p className="text-sm text-neutral-400">{tagline}</p>
    </div>
  );
}

```

**hooks/useChartDimensions.js**

```javascript
import { useEffect, useState } from 'react';

const useChartDimensions = (containerRef) => {
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        setDimensions({ width, height });
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, [containerRef]);

  return dimensions;
};

export default useChartDimensions;

```

**components/Chart/chartConfig.js**

```javascript
export const CHART_COLORS = {
  primary: '#666666',
  selected: '#ffffff',
  selectedStroke: '#cccccc',
  lightStroke: '#999999',
};

export const DEFAULT_MARGIN = {
  top: 20,
  right: 20,
  bottom: 20,
  left: 20,
};

```

**components/Layout/Layout.jsx**

```
/**
 * Layout.jsx - High-level layout component
 *
 * Neutral gradient background with header and main content sections
 */

export default function Layout({ header, mainContent }) {
  return (
    <div className="h-screen bg-gradient-to-b from-neutral-950 to-neutral-900 text-neutral-100 font-sans flex flex-col">
      {/* Header Section */}
      {header && (
        <header className="shrink-0 flex items-center justify-between px-4 py-1 border-b border-neutral-600">
          {header}
        </header>
      )}

      {/* Main Content Area */}
      {mainContent && (
        <main className="flex-1 flex flex-col border-r border-neutral-600 overflow-y-auto min-h-0">
          {mainContent}
        </main>
      )}
    </div>
  );
}

```

**components/Chart/renderCircles.js**

```javascript
import { scaleLinear, easeLinear } from 'd3';
import {
  applyStyles,
  attachInteractions,
} from './chartUtils';
import { DEFAULT_MARGIN } from './chartConfig';

export const renderCircles = (
  selection,
  {
    xValue,
    yValue,
    data,
    selectedId,
    onClick,
    width,
    height,
    margin = DEFAULT_MARGIN,
  },
) => {
  const xScale = scaleLinear()
    .domain([0, 960])
    .range([margin.left, width - margin.right]);

  const yScale = scaleLinear()
    .domain([0, 500])
    .range([height - margin.bottom, margin.top]);

  const circles = selection
    .selectAll('circle')
    .data(data, (d) => d.id)
    .join('circle')
    .attr('cx', (d) => xScale(xValue(d)))
    .attr('cy', (d) => yScale(yValue(d)))
    .attr('r', 30);

  // Apply style transitions with linear easing
  circles
    .transition()
    .ease(easeLinear)
    .duration(300)
    .attr('fill', (d) =>
      d.id === selectedId ? '#ffffff' : '#666666',
    )
    .attr('stroke', (d) =>
      d.id === selectedId ? '#cccccc' : '#999999',
    )
    .attr('stroke-width', 1);

  attachInteractions({
    marks: circles,
    svg: selection,
    onClick,
  });
};

```

**components/Layout/LayoutMainContent.jsx**

```
export default function LayoutMainContent({
  children,
  className = '',
}) {
  return (
    <div
      className={`flex-1 flex flex-col bg-neutral-950 p-4 min-h-0 ${className}`}
    >
      {children}
    </div>
  );
}

```

**components/Chart/chartUtils.js**

```javascript
import { select, easeLinear } from 'd3';
import { CHART_COLORS } from './chartConfig';

export const applyStyles = (
  elements,
  selectedId,
  strokeWidth = 1,
) => {
  elements
    .attr('fill', (d) =>
      d.id === selectedId
        ? CHART_COLORS.selected
        : CHART_COLORS.primary,
    )
    .attr('stroke', (d) =>
      d.id === selectedId
        ? CHART_COLORS.selectedStroke
        : '#999999',
    )
    .attr('stroke-width', strokeWidth);
};

export const attachInteractions = ({
  marks,
  svg,
  onClick,
}) => {
  // Add interactions to marks (circles or bars)
  marks
    .style('cursor', 'pointer')
    .on('click', (event, d) => {
      event.stopPropagation();
      // Get the current selected state from the element's data
      const isCurrentlySelected =
        select(event.target).attr('fill') ===
        CHART_COLORS.selected;
      // If already selected, deselect by passing null; otherwise select this item
      onClick(isCurrentlySelected ? null : d.id);
    })
    .on('mouseenter', function () {
      select(this)
        .transition()
        .ease(easeLinear)
        .duration(200)
        .style('filter', 'brightness(1.3)');
    })
    .on('mouseleave', function () {
      select(this)
        .transition()
        .ease(easeLinear)
        .duration(200)
        .style('filter', 'brightness(1)');
    });

  // Add background click handler to deselect
  if (svg) {
    svg.on('click', function (event) {
      // Only deselect if clicking directly on the SVG background
      if (event.target === this) {
        onClick(null);
      }
    });
  }
};

```

**contexts/InteractionContext.jsx**

```
import { createContext, useState } from 'react';

export const InteractionContext = createContext();

export const InteractionProvider = ({ children }) => {
  const [selectedId, setSelectedId] = useState(null);

  return (
    <InteractionContext.Provider
      value={{ selectedId, setSelectedId }}
    >
      {children}
    </InteractionContext.Provider>
  );
};

```

**data.csv**

```
id,x,y
1,100,438
2,300,305
3,500,300
4,700,200
5,837,135
```

**contexts/DataContext.jsx**

```
import { createContext, useState, useEffect } from 'react';
import { csv } from 'd3';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Introduce 800ms delay to see loading state
        await new Promise((resolve) =>
          setTimeout(resolve, 800),
        );

        const parsedData = await csv('./data.csv', (d) => ({
          id: +d.id,
          x: +d.x,
          y: +d.y,
        }));

        setData(parsedData);
      } catch (err) {
        setError(err.message);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <DataContext.Provider value={{ data, loading, error }}>
      {children}
    </DataContext.Provider>
  );
};

```

**components/Chart/ScatterPlot.jsx**

```
import { useContext, useCallback } from 'react';
import { DataContext } from '../../contexts/DataContext';
import { InteractionContext } from '../../contexts/InteractionContext';
import Viz from './Viz';
import VizWrapper from './VizWrapper';
import { renderCircles } from './renderCircles';

const ScatterPlot = () => {
  const { data, loading, error } = useContext(DataContext);
  const { selectedId, setSelectedId } = useContext(
    InteractionContext,
  );

  const renderFunction = useCallback(
    (svg, { width, height }) => {
      renderCircles(svg, {
        xValue: (d) => d.x,
        yValue: (d) => d.y,
        data,
        selectedId,
        onClick: setSelectedId,
        width,
        height,
      });
    },
    [data, selectedId, setSelectedId],
  );

  return (
    <VizWrapper loading={loading} error={error}>
      <Viz renderFunction={renderFunction} />
    </VizWrapper>
  );
};

export default ScatterPlot;

```

**components/Chart/Viz.jsx**

```
import { useRef, useEffect } from 'react';
import { select } from 'd3';
import useChartDimensions from '../../hooks/useChartDimensions';

const Viz = ({ renderFunction }) => {
  const containerRef = useRef(null);
  const svgRef = useRef(null);
  const dimensions = useChartDimensions(containerRef);

  useEffect(() => {
    if (dimensions.width === 0 || dimensions.height === 0)
      return;

    const svg = select(svgRef.current);
    svg
      .attr('width', dimensions.width)
      .attr('height', dimensions.height);

    renderFunction(svg, {
      width: dimensions.width,
      height: dimensions.height,
    });
  }, [dimensions, renderFunction]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full bg-neutral-900 bg-opacity-40 rounded-lg border border-neutral-600 relative overflow-hidden"
    >
      <svg ref={svgRef} className="w-full h-full" />
    </div>
  );
};

export default Viz;

```

**components/Chart/VizWrapper.jsx**

```
const VizWrapper = ({ children, loading, error }) => {
  if (loading) {
    return (
      <div className="w-full h-full bg-neutral-900 bg-opacity-40 rounded-lg border border-neutral-600 flex items-center justify-center">
        <p className="text-neutral-400">Loading chart...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full bg-neutral-900 bg-opacity-40 rounded-lg border border-neutral-600 flex items-center justify-center">
        <p className="text-red-400">Error: {error}</p>
      </div>
    );
  }

  return children;
};

export default VizWrapper;

```