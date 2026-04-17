import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { type ColumnDef, type Row } from '@tanstack/react-table';
import {
  Box,
  Typography,
  Chip,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Snackbar,
  useTheme,
  alpha,
  Tooltip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FlagIcon from '@mui/icons-material/Flag';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CarbonDataGrid from '../components/DataGrid/CarbonDataGrid';
import { useGovernanceActions } from '../hooks/useGovernanceActions';
import api, { type GovernanceIssue } from '../services/api';

/**
 * Governance Page — Phase 2 Review Grid
 *
 * Features:
 * - Nested expandable rows showing linked record details
 * - Inline Approve / Flag action buttons
 * - Assign dialog
 * - Status & severity filters
 * - All data fetched from GET /issues — no hardcoded data
 */
const GovernancePage: React.FC = () => {
  const theme = useTheme();

  // Data state
  const [issues, setIssues] = useState<GovernanceIssue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Assign dialog
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [assignIssueId, setAssignIssueId] = useState<string>('');
  const [assignUserId, setAssignUserId] = useState('');

  // Snackbar
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  // Governance actions hook — updates local state on success
  const handleActionSuccess = useCallback((issueId: string, updates: Partial<GovernanceIssue>) => {
    setIssues((prev) =>
      prev.map((issue) => (issue.id === issueId ? { ...issue, ...updates } : issue))
    );
    const action = updates.status === 'RESOLVED' ? 'approved' : updates.status === 'ESCALATED' ? 'flagged' : 'updated';
    setSnackbar({ open: true, message: `Issue ${issueId} ${action} successfully`, severity: 'success' });
  }, []);

  const { approveIssue, flagIssue, assignIssue, actionLoading, actionError } = useGovernanceActions(handleActionSuccess);

  // Fetch issues from API
  const fetchIssues = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params: Record<string, unknown> = {
        page,
        limit: pageSize,
      };
      if (searchQuery.trim()) params.search = searchQuery.trim();
      if (statusFilter !== 'ALL') params.status = statusFilter;

      const response = await api.get('/issues', { params });

      // Handle response shape flexibly
      if (response.data?.issues) {
        setIssues(response.data.issues);
        setTotalCount(response.data.total ?? response.data.issues.length);
        setTotalPages(response.data.totalPages ?? Math.ceil((response.data.total ?? response.data.issues.length) / pageSize));
      } else if (response.data?.data) {
        setIssues(response.data.data);
        setTotalCount(response.data.total ?? 0);
        setTotalPages(response.data.totalPages ?? 0);
      } else if (Array.isArray(response.data)) {
        setIssues(response.data);
        setTotalCount(response.data.length);
        setTotalPages(Math.ceil(response.data.length / pageSize));
      } else {
        setIssues([]);
        setTotalCount(0);
        setTotalPages(0);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch governance issues';
      setError(message);
      setIssues([]);
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize, searchQuery, statusFilter]);

  useEffect(() => {
    fetchIssues();
  }, [fetchIssues]);

  // Reset page on filter change
  useEffect(() => {
    setPage(1);
  }, [searchQuery, statusFilter]);

  const severityColorMap: Record<string, 'error' | 'warning' | 'info' | 'default'> = {
    CRITICAL: 'error',
    HIGH: 'error',
    MEDIUM: 'warning',
    LOW: 'info',
  };

  const statusColorMap: Record<string, 'success' | 'warning' | 'error' | 'info' | 'default'> = {
    OPEN: 'warning',
    UNDER_REVIEW: 'info',
    RESOLVED: 'success',
    ESCALATED: 'error',
  };

  const columns = useMemo<ColumnDef<GovernanceIssue, unknown>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'Issue ID',
        size: 90,
        cell: ({ getValue }) => (
          <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 600, fontSize: '0.75rem' }}>
            {String(getValue())}
          </Typography>
        ),
      },
      {
        accessorKey: 'title',
        header: 'Title',
        cell: ({ getValue }) => (
          <Typography variant="body2" sx={{ fontWeight: 500, maxWidth: 250, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {String(getValue())}
          </Typography>
        ),
      },
      {
        accessorKey: 'severity',
        header: 'Severity',
        size: 100,
        cell: ({ getValue }) => {
          const severity = String(getValue());
          return (
            <Chip
              icon={severity === 'CRITICAL' || severity === 'HIGH' ? <WarningAmberIcon sx={{ fontSize: 14 }} /> : undefined}
              label={severity}
              size="small"
              color={severityColorMap[severity] || 'default'}
            />
          );
        },
      },
      {
        accessorKey: 'status',
        header: 'Status',
        size: 120,
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
      {
        accessorKey: 'ownerName',
        header: 'Owner',
        size: 120,
        cell: ({ getValue, row }) => (
          <Typography variant="body2" sx={{ fontSize: '0.78rem', color: theme.palette.text.secondary }}>
            {String(getValue() || row.original.ownerUserId || 'Unassigned')}
          </Typography>
        ),
      },
      {
        accessorKey: 'dueDate',
        header: 'Due Date',
        size: 100,
        cell: ({ getValue }) => {
          const date = getValue() as string | null;
          if (!date) return <Typography variant="body2" sx={{ color: theme.palette.text.disabled }}>—</Typography>;
          const d = new Date(date);
          const isOverdue = d < new Date();
          return (
            <Typography
              variant="body2"
              sx={{
                fontSize: '0.78rem',
                fontWeight: isOverdue ? 600 : 400,
                color: isOverdue ? theme.palette.error.main : theme.palette.text.secondary,
              }}
            >
              {d.toLocaleDateString()}
            </Typography>
          );
        },
      },
      {
        id: 'actions',
        header: 'Actions',
        size: 200,
        cell: ({ row }) => {
          const issue = row.original;
          const isProcessing = actionLoading[issue.id];
          const isResolved = issue.status === 'RESOLVED';
          const isEscalated = issue.status === 'ESCALATED';

          return (
            <Box sx={{ display: 'flex', gap: 0.75, alignItems: 'center' }} onClick={(e) => e.stopPropagation()}>
              <Tooltip title="Approve — mark as resolved">
                <span>
                  <Button
                    size="small"
                    variant={isResolved ? 'contained' : 'outlined'}
                    color="success"
                    disabled={isProcessing || isResolved}
                    onClick={() => approveIssue(issue.id)}
                    startIcon={isProcessing ? <CircularProgress size={12} /> : <CheckCircleIcon sx={{ fontSize: 14 }} />}
                    sx={{
                      minWidth: 0,
                      px: 1.2,
                      py: 0.4,
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      borderRadius: '6px',
                    }}
                  >
                    {isResolved ? 'Approved' : 'Approve'}
                  </Button>
                </span>
              </Tooltip>

              <Tooltip title="Flag — escalate for review">
                <span>
                  <Button
                    size="small"
                    variant={isEscalated ? 'contained' : 'outlined'}
                    color="warning"
                    disabled={isProcessing || isEscalated}
                    onClick={() => flagIssue(issue.id)}
                    startIcon={<FlagIcon sx={{ fontSize: 14 }} />}
                    sx={{
                      minWidth: 0,
                      px: 1.2,
                      py: 0.4,
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      borderRadius: '6px',
                    }}
                  >
                    {isEscalated ? 'Flagged' : 'Flag'}
                  </Button>
                </span>
              </Tooltip>

              <Tooltip title="Assign to user">
                <span>
                  <Button
                    size="small"
                    variant="outlined"
                    color="info"
                    disabled={isProcessing}
                    onClick={() => {
                      setAssignIssueId(issue.id);
                      setAssignUserId('');
                      setAssignDialogOpen(true);
                    }}
                    sx={{
                      minWidth: 0,
                      px: 0.8,
                      py: 0.4,
                      borderRadius: '6px',
                    }}
                  >
                    <PersonAddIcon sx={{ fontSize: 14 }} />
                  </Button>
                </span>
              </Tooltip>
            </Box>
          );
        },
      },
    ],
    [theme, actionLoading, approveIssue, flagIssue]
  );

  // Expandable row — nested detail
  const renderExpandedRow = (row: Row<GovernanceIssue>) => {
    const issue = row.original;
    return (
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 2.5 }}>
        <Box>
          <Typography variant="overline">Description</Typography>
          <Typography variant="body2" sx={{ mt: 0.5 }}>
            {issue.description || 'No description provided'}
          </Typography>
        </Box>
        <Box>
          <Typography variant="overline">Linked Record</Typography>
          <Typography variant="body2" sx={{ fontFamily: 'monospace', mt: 0.5 }}>
            {issue.recordType}: {issue.recordId}
          </Typography>
          {issue.linkedRecord && (
            <Box sx={{ mt: 1, p: 1.5, borderRadius: 1.5, backgroundColor: alpha(theme.palette.primary.main, 0.03), border: `1px solid ${theme.palette.divider}` }}>
              <Typography variant="caption" sx={{ display: 'block' }}>
                Source: {issue.linkedRecord.sourceType} • {issue.linkedRecord.scope}
              </Typography>
              <Typography variant="caption" sx={{ display: 'block' }}>
                Activity: {issue.linkedRecord.activityValue} {issue.linkedRecord.activityUnit}
              </Typography>
              <Typography variant="caption" sx={{ display: 'block', fontWeight: 700 }}>
                CO₂e: {issue.linkedRecord.calculatedEmissions?.toLocaleString()} kg
              </Typography>
            </Box>
          )}
        </Box>
        <Box>
          <Typography variant="overline">Issue Details</Typography>
          <Box sx={{ mt: 0.5, display: 'grid', gap: 0.5 }}>
            <Typography variant="caption">
              Severity: <strong>{issue.severity}</strong>
            </Typography>
            <Typography variant="caption">
              Created: {issue.createdAt ? new Date(issue.createdAt).toLocaleString() : '—'}
            </Typography>
            <Typography variant="caption">
              Owner: {issue.ownerName || issue.ownerUserId || 'Unassigned'}
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  };

  // Status filter toolbar action
  const toolbarActions = (
    <FormControl size="small" sx={{ minWidth: 140 }}>
      <InputLabel>Status</InputLabel>
      <Select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        label="Status"
        sx={{ fontSize: '0.8rem', height: 36 }}
      >
        <MenuItem value="ALL">All Statuses</MenuItem>
        <MenuItem value="OPEN">Open</MenuItem>
        <MenuItem value="UNDER_REVIEW">Under Review</MenuItem>
        <MenuItem value="RESOLVED">Resolved</MenuItem>
        <MenuItem value="ESCALATED">Escalated</MenuItem>
      </Select>
    </FormControl>
  );

  return (
    <Box>
      {/* Page header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h2" gutterBottom>
          Governance Review
        </Typography>
        <Typography variant="subtitle1">
          Review, approve, or flag data quality issues — all data from the backend governance API
        </Typography>
      </Box>

      {/* Error banner */}
      {(error || actionError) && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
          {error || actionError}
        </Alert>
      )}

      {/* Governance Grid */}
      <CarbonDataGrid<GovernanceIssue>
        data={issues}
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
        title="Issue Review Queue"
        subtitle="Data quality issues requiring governance action"
        expandableContent={renderExpandedRow}
        toolbarActions={toolbarActions}
        emptyMessage="No governance issues found"
      />

      {/* Assign Dialog */}
      <Dialog
        open={assignDialogOpen}
        onClose={() => setAssignDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Assign Issue</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2, color: theme.palette.text.secondary }}>
            Assign issue <strong>{assignIssueId}</strong> to a team member for review.
          </Typography>
          <TextField
            fullWidth
            label="User ID"
            value={assignUserId}
            onChange={(e) => setAssignUserId(e.target.value)}
            placeholder="e.g. usr_2"
            helperText="Enter the user ID of the assignee"
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setAssignDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="primary"
            disabled={!assignUserId.trim() || actionLoading[assignIssueId]}
            onClick={async () => {
              await assignIssue(assignIssueId, assignUserId.trim());
              setAssignDialogOpen(false);
            }}
            startIcon={actionLoading[assignIssueId] ? <CircularProgress size={14} /> : <PersonAddIcon />}
          >
            Assign
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          variant="filled"
          sx={{ borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default GovernancePage;
