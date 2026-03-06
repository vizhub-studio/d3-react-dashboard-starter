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
