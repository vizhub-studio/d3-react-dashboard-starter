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
