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
