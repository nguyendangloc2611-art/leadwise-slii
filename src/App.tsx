import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { OverviewPage } from './pages/Overview';
import { EmployeeTasksPage } from './pages/EmployeeTasks';
import { ObserversPage } from './pages/Observers';
import { AssessmentPage } from './pages/Assessment';
import { AnalysisPage } from './pages/Analysis';
import { ActionPlanPage } from './pages/ActionPlan';
import { SummaryPage } from './pages/Summary';

function App() {
  const { state } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);

  const renderPage = () => {
    switch (state.activePage) {
      case 'overview':
        return <OverviewPage />;
      case 'employee-tasks':
        return <EmployeeTasksPage />;
      case 'observers':
        return <ObserversPage />;
      case 'assessment':
        return <AssessmentPage />;
      case 'analysis':
        return <AnalysisPage />;
      case 'action-plan':
        return <ActionPlanPage />;
      case 'summary':
        return <SummaryPage />;
      default:
        return <OverviewPage />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-canvas">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={state.activePage}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="mx-auto w-full max-w-[1400px] px-4 py-6 lg:px-8 lg:py-8"
            >
              {renderPage()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

export default App;
