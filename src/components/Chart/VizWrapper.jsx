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
