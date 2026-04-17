import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Snackbar, Alert } from '@mui/material';
import carbonLensTheme from './theme/carbonLensTheme';
import AppLayout from './layouts/AppLayout';
import DashboardPage from './pages/DashboardPage';
import RecordsPage from './pages/RecordsPage';
import ManualEntryPage from './pages/ManualEntryPage';
import GovernancePage from './pages/GovernancePage';
import UploadPage from './pages/UploadPage';
import SuppliersPage from './pages/SuppliersPage';
import ReportsPage from './pages/ReportsPage';

/**
 * CarbonLens — ESG Control Tower Frontend
 *
 * Routing structure:
 * - / → Dashboard (Phase 3 analytics)
 * - /records → High-performance Data Grid (Phase 1)
 * - /manual-entry → Dynamic Entry Form (Phase 2)
 * - /governance → Review Grid with Approve/Flag (Phase 2)
 * - /upload → File Upload UI (Atharva)
 * - /suppliers → Supplier Portal (Harsh)
 * - /reports → Report Generation (Phase 4)
 */
const App: React.FC = () => {
  const [errorToast, setErrorToast] = useState<{ open: boolean; message: string }>({ open: false, message: '' });

  useEffect(() => {
    const handleError = (e: CustomEvent<string>) => {
      setErrorToast({ open: true, message: e.detail });
    };
    window.addEventListener('axios-error', handleError as EventListener);
    return () => window.removeEventListener('axios-error', handleError as EventListener);
  }, []);

  const handleCloseToast = () => {
    setErrorToast((prev) => ({ ...prev, open: false }));
  };

  return (
    <ThemeProvider theme={carbonLensTheme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/records" element={<RecordsPage />} />
            <Route path="/manual-entry" element={<ManualEntryPage />} />
            <Route path="/governance" element={<GovernancePage />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/suppliers" element={<SuppliersPage />} />
            <Route path="/reports" element={<ReportsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>

      <Snackbar 
        open={errorToast.open} 
        autoHideDuration={6000} 
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseToast} severity="error" sx={{ width: '100%' }}>
          {errorToast.message}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
};

export default App;
