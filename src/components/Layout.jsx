import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const PAGE_META = {
  '/dashboard': {
    title: 'Mathematical Analytics Dashboard',
    subtitle: 'High-level metrics, dataset geometry, and analytical health'
  },
  '/dataset': {
    title: 'Dataset Management Hub',
    subtitle: 'Upload, inspect, and structure statistical tabular data'
  },
  '/statistics': {
    title: 'Descriptive Statistics',
    subtitle: 'Measures of central tendency, dispersion, and quartiles'
  },
  '/correlation': {
    title: 'Bivariate Correlation Analysis',
    subtitle: 'Pearson product-moment, Spearman rank, and covariance matrices'
  },
  '/regression': {
    title: 'Linear & Multiple Regression',
    subtitle: 'Ordinary Least Squares modeling, R² variance, and forecasting'
  },
  '/formula-lab': {
    title: 'Mathematical Formula Lab',
    subtitle: 'Exact equations, LaTeX definitions, and pedagogical derivation proofs'
  },
  '/report': {
    title: 'Formal Academic Report Preview',
    subtitle: 'Executive summary, analytical observations, and presentation export'
  },
  '/analysis-report': {
    title: 'Formal Academic Report Preview',
    subtitle: 'Executive summary, analytical observations, and presentation export'
  }
};

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const currentMeta = PAGE_META[location.pathname] || {
    title: 'INSIGHTX Platform',
    subtitle: 'Universal Mathematical Data Analytics'
  };

  return (
    <div className="app-container">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main-content">
        <Header
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          title={currentMeta.title}
          subtitle={currentMeta.subtitle}
        />
        <main className="page-wrapper">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
