import { useState, useMemo, useEffect } from 'react';
import type { FormEvent } from 'react';
import api from '@/lib/api';
import { ENDPOINTS } from '@shared/types/api';
import { EmissionScope } from '@shared/types/records';
import type { ManualRecordRequest, ManualRecordResponse } from '@shared/types/records';

// ============================================================
// Manual Entry Page
// ============================================================
// Dynamic form for manually entering emissions records.
// Fields adapt based on source type selection:
//   Fuel → Liters, Electricity → kWh, Gas → m³, etc.
// Posts to Sahiti's /api/records/manual endpoint.
// ============================================================

/** Source types load dynamically from the backend! */
interface SourceTypeConfig {
  label: string;
  defaultScope: EmissionScope;
  units: { value: string; label: string }[];
  categories: string[];
}

const MONTHS = [
  { value: 1, label: 'January' },
  { value: 2, label: 'February' },
  { value: 3, label: 'March' },
  { value: 4, label: 'April' },
  { value: 5, label: 'May' },
  { value: 6, label: 'June' },
  { value: 7, label: 'July' },
  { value: 8, label: 'August' },
  { value: 9, label: 'September' },
  { value: 10, label: 'October' },
  { value: 11, label: 'November' },
  { value: 12, label: 'December' },
];

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 5 }, (_, i) => currentYear - i);

export default function ManualEntryPage() {
  // Form state
  const [sourceType, setSourceType] = useState('');
  const [facilityId, setFacilityId] = useState('');
  const [category, setCategory] = useState('');
  const [scope, setScope] = useState<EmissionScope>(EmissionScope.SCOPE_1);
  const [activityValue, setActivityValue] = useState('');
  const [activityUnit, setActivityUnit] = useState('');
  const [periodMonth, setPeriodMonth] = useState(new Date().getMonth() + 1);
  const [periodYear, setPeriodYear] = useState(currentYear);

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<ManualRecordResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Backend API constraints
  const [facilities, setFacilities] = useState<{ id: string; name: string; location: string }[]>([]);
  const [sourceTypeConfig, setSourceTypeConfig] = useState<Record<string, SourceTypeConfig>>({});

  useEffect(() => {
    // 1. Fetch live facilities
    api.get<{ facilities: { id: string; name: string; location: string }[] }>('/api/facilities')
      .then(res => setFacilities(res.data.facilities))
      .catch(() => {}); // silently fail — user can still type ID manually

    // 2. Fetch live data taxonomy (emission factors, categories, units)
    api.get<{ sourceTypes: Record<string, SourceTypeConfig> }>('/api/metadata/entry-config')
      .then(res => setSourceTypeConfig(res.data.sourceTypes))
      .catch(() => {});
  }, []);

  // Derived config based on backend selection
  const config = useMemo(() => sourceTypeConfig[sourceType] ?? null, [sourceType, sourceTypeConfig]);

  // When source type changes, reset dependent fields
  const handleSourceTypeChange = (newType: string) => {
    setSourceType(newType);
    setCategory('');
    setActivityUnit('');
    setActivityValue('');
    setResult(null);
    setError(null);

    const newConfig = sourceTypeConfig[newType];
    if (newConfig) {
      setScope(newConfig.defaultScope);
      if (newConfig.units.length === 1) {
        setActivityUnit(newConfig.units[0].value);
      }
    }
  };

  const isFormValid = useMemo(() => {
    return (
      sourceType &&
      facilityId.trim() &&
      category &&
      activityUnit &&
      parseFloat(activityValue) > 0 &&
      periodMonth &&
      periodYear
    );
  }, [sourceType, facilityId, category, activityUnit, activityValue, periodMonth, periodYear]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsSubmitting(true);
    setError(null);
    setResult(null);

    const payload: ManualRecordRequest = {
      facilityId: facilityId.trim(),
      sourceType,
      scope,
      category,
      activityValue: parseFloat(activityValue),
      activityUnit,
      periodMonth,
      periodYear,
    };

    try {
      const response = await api.post<ManualRecordResponse>(
        ENDPOINTS.RECORDS_MANUAL,
        payload
      );
      setResult(response.data);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message
        ?? 'Failed to submit record. Please check your inputs and try again.';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSourceType('');
    setFacilityId('');
    setCategory('');
    setScope(EmissionScope.SCOPE_1);
    setActivityValue('');
    setActivityUnit('');
    setPeriodMonth(new Date().getMonth() + 1);
    setPeriodYear(currentYear);
    setResult(null);
    setError(null);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Manual Data Entry</h1>
        <p className="page-description">
          Record emissions activity data manually. Select a source type to see relevant fields.
        </p>
      </div>

      <div className="entry-card">
        <form className="entry-form" onSubmit={handleSubmit}>
          {/* ── Step 1: Source Type ── */}
          <div className="entry-section">
            <h2 className="entry-section-title">
              <span className="entry-step-badge">1</span>
              Source Type
            </h2>
            <div className="entry-type-grid">
              {Object.keys(sourceTypeConfig).length === 0 && (
                <div style={{ gridColumn: '1 / -1', padding: '30px 20px', color: 'var(--text-muted)', fontStyle: 'italic', textAlign: 'center', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px dashed var(--border-medium)' }}>
                  Loading category mappings securely from backend...
                </div>
              )}
              {Object.entries(sourceTypeConfig).map(([key, cfg]) => (
                <button
                  key={key}
                  type="button"
                  className={`entry-type-card ${sourceType === key ? 'entry-type-card--active' : ''}`}
                  onClick={() => handleSourceTypeChange(key)}
                >
                  <span className="entry-type-icon">
                    {key.includes('fuel') || key.includes('diesel') ? '🔥' :
                     key.includes('electric') ? '⚡' :
                     key.includes('heat') || key.includes('steam') ? '♨️' :
                     key.includes('transport') || key.includes('freight') ? '🚛' :
                     key.includes('waste') ? '♻️' :
                     key.includes('water') ? '💧' : '🏭'}
                  </span>
                  <span className="entry-type-label">{cfg.label}</span>
                  <span className={`entry-type-scope entry-type-scope--${cfg.defaultScope.toLowerCase()}`}>
                    {cfg.defaultScope.replace('_', ' ')}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* ── Step 2: Details (shown after source type selected) ── */}
          {config && (
            <div className="entry-section entry-section--animated">
              <h2 className="entry-section-title">
                <span className="entry-step-badge">2</span>
                Activity Details
              </h2>

              <div className="entry-fields-grid">
                {/* Facility */}
                <div className="form-group">
                  <label htmlFor="entry-facility" className="form-label">Facility</label>
                  {facilities.length > 0 ? (
                    <select
                      id="entry-facility"
                      className="form-input form-select"
                      value={facilityId}
                      onChange={(e) => setFacilityId(e.target.value)}
                      required
                    >
                      <option value="">Select facility…</option>
                      {facilities.map((f) => (
                        <option key={f.id} value={f.id}>{f.name} — {f.location}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      id="entry-facility"
                      type="text"
                      className="form-input"
                      placeholder="Enter facility ID (e.g. fac_1)"
                      value={facilityId}
                      onChange={(e) => setFacilityId(e.target.value)}
                      required
                    />
                  )}
                </div>

                {/* Category */}
                <div className="form-group">
                  <label htmlFor="entry-category" className="form-label">Category</label>
                  <select
                    id="entry-category"
                    className="form-input form-select"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                  >
                    <option value="">Select category…</option>
                    {config.categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Scope */}
                <div className="form-group">
                  <label htmlFor="entry-scope" className="form-label">Emission Scope</label>
                  <select
                    id="entry-scope"
                    className="form-input form-select"
                    value={scope}
                    onChange={(e) => setScope(e.target.value as EmissionScope)}
                  >
                    <option value={EmissionScope.SCOPE_1}>Scope 1 — Direct</option>
                    <option value={EmissionScope.SCOPE_2}>Scope 2 — Indirect (Energy)</option>
                    <option value={EmissionScope.SCOPE_3}>Scope 3 — Value Chain</option>
                  </select>
                </div>

                {/* Activity Value */}
                <div className="form-group">
                  <label htmlFor="entry-value" className="form-label">Activity Value</label>
                  <input
                    id="entry-value"
                    type="number"
                    className="form-input"
                    placeholder="e.g. 1500"
                    min="0"
                    step="any"
                    value={activityValue}
                    onChange={(e) => setActivityValue(e.target.value)}
                    required
                  />
                </div>

                {/* Unit */}
                <div className="form-group">
                  <label htmlFor="entry-unit" className="form-label">Unit</label>
                  <select
                    id="entry-unit"
                    className="form-input form-select"
                    value={activityUnit}
                    onChange={(e) => setActivityUnit(e.target.value)}
                    required
                  >
                    <option value="">Select unit…</option>
                    {config.units.map((u) => (
                      <option key={u.value} value={u.value}>{u.label}</option>
                    ))}
                  </select>
                </div>

                {/* Period — Month */}
                <div className="form-group">
                  <label htmlFor="entry-month" className="form-label">Reporting Month</label>
                  <select
                    id="entry-month"
                    className="form-input form-select"
                    value={periodMonth}
                    onChange={(e) => setPeriodMonth(Number(e.target.value))}
                  >
                    {MONTHS.map((m) => (
                      <option key={m.value} value={m.value}>{m.label}</option>
                    ))}
                  </select>
                </div>

                {/* Period — Year */}
                <div className="form-group">
                  <label htmlFor="entry-year" className="form-label">Reporting Year</label>
                  <select
                    id="entry-year"
                    className="form-input form-select"
                    value={periodYear}
                    onChange={(e) => setPeriodYear(Number(e.target.value))}
                  >
                    {YEARS.map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* ── Error ── */}
          {error && (
            <div className="entry-error" role="alert">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm-.75 3.5a.75.75 0 0 1 1.5 0v4a.75.75 0 0 1-1.5 0v-4zM8 12a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* ── Success Result ── */}
          {result && (
            <div className="entry-result">
              <div className="entry-result-header">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent-emerald)" strokeWidth="2.5">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22,4 12,14.01 9,11.01"/>
                </svg>
                <h3>Record Submitted</h3>
              </div>
              <div className="entry-result-details">
                <div className="entry-result-item">
                  <span className="entry-result-label">Record ID</span>
                  <span className="entry-result-value">{result.recordId}</span>
                </div>
                <div className="entry-result-item">
                  <span className="entry-result-label">Calculated Emissions</span>
                  <span className="entry-result-value entry-result-value--highlight">
                    {result.calculatedEmissions.toLocaleString()} tCO₂e
                  </span>
                </div>
                <div className="entry-result-item">
                  <span className="entry-result-label">Status</span>
                  <span className={`entry-result-badge entry-result-badge--${result.status.toLowerCase()}`}>
                    {result.status}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ── Actions ── */}
          {config && (
            <div className="entry-actions">
              <button
                id="entry-submit"
                type="submit"
                className="btn btn-primary"
                disabled={!isFormValid || isSubmitting}
              >
                {isSubmitting ? (
                  <span className="btn-spinner" />
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                      <polyline points="22,4 12,14.01 9,11.01"/>
                    </svg>
                    Submit Record
                  </>
                )}
              </button>
              <button
                id="entry-reset"
                type="button"
                className="btn btn-ghost"
                onClick={handleReset}
                disabled={isSubmitting}
              >
                Reset Form
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
