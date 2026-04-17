import { useAuthStore } from '@/store/authStore';

// ============================================================
// Dashboard Page (Placeholder)
// ============================================================
// This will be built out by Sparsh in Phase 3 with Recharts.
// For now, shows a welcome message and confirms auth is working.
// ============================================================

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-description">
          Welcome back, <strong>{user?.name ?? 'User'}</strong>. Your ESG overview is loading.
        </p>
      </div>

      <div className="dashboard-grid">
        {/* Metric Cards — placeholder shells for Sparsh */}
        <div className="metric-card">
          <div className="metric-card-icon metric-card-icon--scope1">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <div className="metric-card-content">
            <span className="metric-card-label">Total Emissions</span>
            <span className="metric-card-value metric-card-value--loading">—</span>
            <span className="metric-card-unit">tCO₂e</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-card-icon metric-card-icon--scope2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
            </svg>
          </div>
          <div className="metric-card-content">
            <span className="metric-card-label">Data Quality</span>
            <span className="metric-card-value metric-card-value--loading">—</span>
            <span className="metric-card-unit">score</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-card-icon metric-card-icon--issues">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <div className="metric-card-content">
            <span className="metric-card-label">Open Issues</span>
            <span className="metric-card-value metric-card-value--loading">—</span>
            <span className="metric-card-unit">pending</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-card-icon metric-card-icon--suppliers">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <div className="metric-card-content">
            <span className="metric-card-label">Suppliers</span>
            <span className="metric-card-value metric-card-value--loading">—</span>
            <span className="metric-card-unit">connected</span>
          </div>
        </div>
      </div>

      {/* Chart placeholder area */}
      <div className="dashboard-chart-placeholder">
        <div className="chart-placeholder-inner">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.4">
            <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/>
          </svg>
          <p>Emissions trends chart will appear here once data is loaded.</p>
        </div>
      </div>
    </div>
  );
}
