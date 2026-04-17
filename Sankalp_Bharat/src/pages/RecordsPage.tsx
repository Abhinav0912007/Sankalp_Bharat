import React, { useMemo } from 'react';
import { type ColumnDef, type Row } from '@tanstack/react-table';
import { Box, Typography, Chip, useTheme, alpha } from '@mui/material';
import CarbonDataGrid from '../components/DataGrid/CarbonDataGrid';
import { useRecords } from '../hooks/useRecords';
import type { EmissionRecord } from '../services/api';

/**
 * Records Page — Phase 1 High-Performance Data Grid
 * 
 * Renders up to 1,000 emission records dynamically fetched from the backend.
 * Server-side pagination, sorting, and search — no hardcoded data.
 */
const RecordsPage: React.FC = () => {
  const theme = useTheme();
  const {
    records,
    isLoading,
    error,
    totalCount,
    totalPages,
    page,
    pageSize,
    searchQuery,
    setPage,
    setPageSize,
    setSearchQuery,
  } = useRecords();

  const statusColorMap: Record<string, 'success' | 'warning' | 'error' | 'info' | 'default'> = {
    ACCEPTED: 'success',
    FLAGGED: 'warning',
    REJECTED: 'error',
    DRAFT: 'info',
    SUBMITTED: 'info',
    UNDER_REVIEW: 'warning',
    APPROVED: 'success',
  };

  const scopeColorMap: Record<string, string> = {
    SCOPE_1: '#D97706',
    SCOPE_2: '#7C3AED',
    SCOPE_3: '#2563EB',
  };

  const columns = useMemo<ColumnDef<EmissionRecord, unknown>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        size: 90,
        cell: ({ getValue }) => (
          <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 600, fontSize: '0.75rem' }}>
            {String(getValue())}
          </Typography>
        ),
      },
      {
        accessorKey: 'facilityName',
        header: 'Facility',
        cell: ({ getValue, row }) => (
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {String(getValue() || row.original.facilityId || '—')}
          </Typography>
        ),
      },
      {
        accessorKey: 'sourceType',
        header: 'Source',
        cell: ({ getValue }) => {
          const val = String(getValue());
          return (
            <Chip
              label={val.replace(/_/g, ' ')}
              size="small"
              sx={{
                fontWeight: 600,
                fontSize: '0.65rem',
                textTransform: 'capitalize',
              }}
            />
          );
        },
      },
      {
        accessorKey: 'scope',
        header: 'Scope',
        size: 120,
        cell: ({ getValue }) => {
          const scope = String(getValue());
          const color = scopeColorMap[scope] || theme.palette.text.secondary;
          return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: color,
                  flexShrink: 0,
                }}
              />
              <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.75rem', color }}>
                {scope.replace('_', ' ')}
              </Typography>
            </Box>
          );
        },
      },
      {
        accessorKey: 'category',
        header: 'Category',
        cell: ({ getValue }) => (
          <Typography variant="body2" sx={{ fontSize: '0.78rem', color: theme.palette.text.secondary }}>
            {String(getValue())}
          </Typography>
        ),
      },
      {
        accessorKey: 'activityValue',
        header: 'Activity',
        size: 110,
        cell: ({ getValue, row }) => (
          <Typography variant="body2" sx={{ fontWeight: 600, fontFamily: 'monospace', fontSize: '0.8rem' }}>
            {Number(getValue()).toLocaleString()} <span style={{ fontWeight: 400, fontSize: '0.7rem', color: theme.palette.text.secondary }}>{row.original.activityUnit}</span>
          </Typography>
        ),
      },
      {
        accessorKey: 'calculatedEmissions',
        header: 'CO₂e (kg)',
        size: 120,
        cell: ({ getValue }) => {
          const val = Number(getValue());
          return (
            <Typography
              variant="body2"
              sx={{
                fontWeight: 700,
                fontFamily: 'monospace',
                fontSize: '0.82rem',
                color: val > 5000 ? theme.palette.error.main : theme.palette.text.primary,
              }}
            >
              {val.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
            </Typography>
          );
        },
      },
      {
        id: 'period',
        header: 'Period',
        size: 100,
        cell: ({ row }) => {
          const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          const m = row.original.periodMonth;
          const y = row.original.periodYear;
          return (
            <Typography variant="body2" sx={{ fontSize: '0.78rem' }}>
              {monthNames[(m || 1) - 1]} {y}
            </Typography>
          );
        },
      },
      {
        accessorKey: 'status',
        header: 'Status',
        size: 110,
        cell: ({ getValue }) => {
          const status = String(getValue());
          return (
            <Chip
              label={status.replace(/_/g, ' ')}
              size="small"
              color={statusColorMap[status] || 'default'}
              sx={{ textTransform: 'capitalize' }}
            />
          );
        },
      },
    ],
    [theme]
  );

  // Expandable row content
  const renderExpandedRow = (row: Row<EmissionRecord>) => {
    const record = row.original;
    return (
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
        <Box>
          <Typography variant="overline">Record ID</Typography>
          <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>{record.id}</Typography>
        </Box>
        <Box>
          <Typography variant="overline">Organization</Typography>
          <Typography variant="body2">{record.organizationId}</Typography>
        </Box>
        <Box>
          <Typography variant="overline">Emission Factor</Typography>
          <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>{record.emissionFactorId || 'Auto-matched'}</Typography>
        </Box>
        <Box>
          <Typography variant="overline">Created</Typography>
          <Typography variant="body2">{record.createdAt ? new Date(record.createdAt).toLocaleString() : '—'}</Typography>
        </Box>
      </Box>
    );
  };

  return (
    <Box>
      {/* Page header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h2" gutterBottom>
          Emission Records
        </Typography>
        <Typography variant="subtitle1">
          High-performance data grid — all records fetched dynamically from the backend
        </Typography>
      </Box>

      {/* Error banner */}
      {error && (
        <Box
          sx={{
            mb: 2,
            p: 2,
            borderRadius: 2,
            backgroundColor: alpha(theme.palette.error.main, 0.08),
            border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
          }}
        >
          <Typography variant="body2" sx={{ color: theme.palette.error.dark, fontWeight: 500 }}>
            ⚠ API Error: {error}
          </Typography>
          <Typography variant="caption" sx={{ color: theme.palette.error.main }}>
            Ensure the backend server is running at the configured API base URL
          </Typography>
        </Box>
      )}

      {/* Data Grid */}
      <CarbonDataGrid<EmissionRecord>
        data={records}
        columns={columns}
        isLoading={isLoading}
        totalCount={totalCount}
        totalPages={totalPages}
        page={page}
        pageSize={pageSize}
        searchQuery={searchQuery}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        onSearchChange={setSearchQuery}
        title="All Emission Records"
        subtitle="Scope 1, 2 & 3 activity data with calculated CO₂e"
        expandableContent={renderExpandedRow}
        emptyMessage="No emission records found"
      />
    </Box>
  );
};

export default RecordsPage;
