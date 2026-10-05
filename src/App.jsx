import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import DatasetPage from './pages/DatasetPage';
import StatisticsPage from './pages/StatisticsPage';
import CorrelationPage from './pages/CorrelationPage';
import RegressionPage from './pages/RegressionPage';
import FormulaLabPage from './pages/FormulaLabPage';
import ReportPage from './pages/ReportPage';

export default function App() {
  return (
    <Routes>
      {/* Standalone Landing Page */}
      <Route path="/" element={<LandingPage />} />

      {/* Main Analytics Suite wrapped in App Shell Layout */}
      <Route element={<Layout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/dataset" element={<DatasetPage />} />
        <Route path="/statistics" element={<StatisticsPage />} />
        <Route path="/correlation" element={<CorrelationPage />} />
        <Route path="/regression" element={<RegressionPage />} />
        <Route path="/formula-lab" element={<FormulaLabPage />} />
        <Route path="/report" element={<ReportPage />} />
        <Route path="/analysis-report" element={<ReportPage />} />
      </Route>

      {/* Fallback to Home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
