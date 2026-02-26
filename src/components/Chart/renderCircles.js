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
