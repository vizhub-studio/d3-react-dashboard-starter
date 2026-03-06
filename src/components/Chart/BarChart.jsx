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
