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
