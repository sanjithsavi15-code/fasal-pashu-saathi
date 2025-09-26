import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface OfflineData {
  diseaseReports: any[];
  queries: any[];
}

export const useOffline = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingData, setPendingData] = useState<OfflineData>({
    diseaseReports: [],
    queries: []
  });

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      syncPendingData();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Load pending data from localStorage
    loadPendingData();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const loadPendingData = () => {
    const saved = localStorage.getItem('pendingOfflineData');
    if (saved) {
      try {
        setPendingData(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading pending data:', error);
      }
    }
  };

  const savePendingData = (data: OfflineData) => {
    setPendingData(data);
    localStorage.setItem('pendingOfflineData', JSON.stringify(data));
  };

  const addPendingDiseaseReport = (report: any) => {
    const newData = {
      ...pendingData,
      diseaseReports: [...pendingData.diseaseReports, { ...report, id: Date.now().toString(), offline: true }]
    };
    savePendingData(newData);
  };

  const addPendingQuery = (query: any) => {
    const newData = {
      ...pendingData,
      queries: [...pendingData.queries, { ...query, id: Date.now().toString(), offline: true }]
    };
    savePendingData(newData);
  };

  const syncPendingData = async () => {
    if (!isOnline) return;

    try {
      // Sync disease reports
      for (const report of pendingData.diseaseReports) {
        const { offline, id, ...reportData } = report;
        await supabase.from('disease_reports').insert(reportData);
      }

      // Sync queries
      for (const query of pendingData.queries) {
        const { offline, id, ...queryData } = query;
        await supabase.from('farmer_queries').insert(queryData);
      }

      // Clear pending data
      savePendingData({ diseaseReports: [], queries: [] });
    } catch (error) {
      console.error('Error syncing data:', error);
    }
  };

  return {
    isOnline,
    pendingData,
    addPendingDiseaseReport,
    addPendingQuery,
    syncPendingData
  };
};