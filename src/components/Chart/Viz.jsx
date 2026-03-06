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
