import React, { createContext, useContext, useState, useCallback } from 'react';
import { parseDatasetFile } from '../utils/dataParser';
import { getSampleDataset } from '../data/sampleDatasets';

const DatasetContext = createContext(null);

export function DatasetProvider({ children }) {
  const [dataset, setDataset] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const clearError = useCallback(() => setError(null), []);
  const clearSuccess = useCallback(() => setSuccess(null), []);

  const removeDataset = useCallback(() => {
    setDataset(null);
    setError(null);
    setSuccess('Dataset removed successfully. The platform is now in standby state.');
  }, []);

  const loadDatasetFromFile = useCallback(async (file) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const parsedData = await parseDatasetFile(file);
      setDataset(parsedData);
      setSuccess(`Dataset "${parsedData.name}" loaded successfully (${parsedData.rowCount} records, ${parsedData.columnCount} variables).`);
    } catch (err) {
      console.error('File parsing error:', err);
      setError(err.message || 'Failed to parse file. Please verify file format and headers.');
      // Do not clear existing dataset if an upload fails
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadSampleDataset = useCallback((sampleId) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const sample = getSampleDataset(sampleId);
      setDataset(sample);
      setSuccess(`Sample dataset "${sample.sampleTitle}" loaded successfully (${sample.rowCount} records, ${sample.columnCount} variables).`);
    } catch (err) {
      console.error('Sample loading error:', err);
      setError(err.message || 'Failed to load sample dataset.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value = {
    dataset,
    isLoading,
    error,
    success,
    loadDatasetFromFile,
    loadSampleDataset,
    removeDataset,
    clearError,
    clearSuccess,
  };

  return (
    <DatasetContext.Provider value={value}>
      {children}
    </DatasetContext.Provider>
  );
}

export function useDataset() {
  const context = useContext(DatasetContext);
  if (!context) {
    throw new Error('useDataset must be used within a DatasetProvider');
  }
  return context;
}
