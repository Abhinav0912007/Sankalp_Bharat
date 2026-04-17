import { useState, useCallback } from 'react';
import api, { type GovernanceIssue } from '../services/api';

interface UseGovernanceActionsReturn {
  approveIssue: (issueId: string) => Promise<void>;
  flagIssue: (issueId: string) => Promise<void>;
  assignIssue: (issueId: string, ownerUserId: string) => Promise<void>;
  actionLoading: Record<string, boolean>;
  actionError: string | null;
  clearError: () => void;
  lastAction: { issueId: string; action: string; success: boolean } | null;
}

/**
 * Custom hook for governance issue actions (Approve, Flag, Assign).
 * Communicates with Sameera's Issue tracking APIs — no hardcoded data.
 */
export function useGovernanceActions(
  onSuccess?: (issueId: string, updatedIssue: Partial<GovernanceIssue>) => void
): UseGovernanceActionsReturn {
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});
  const [actionError, setActionError] = useState<string | null>(null);
  const [lastAction, setLastAction] = useState<{ issueId: string; action: string; success: boolean } | null>(null);

  const setLoading = (issueId: string, loading: boolean) => {
    setActionLoading((prev) => ({ ...prev, [issueId]: loading }));
  };

  const approveIssue = useCallback(async (issueId: string) => {
    setLoading(issueId, true);
    setActionError(null);
    try {
      const response = await api.post(`/issues/${issueId}/status`, { status: 'RESOLVED' });
      setLastAction({ issueId, action: 'APPROVED', success: true });
      onSuccess?.(issueId, { status: 'RESOLVED', ...response.data });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to approve issue';
      setActionError(message);
      setLastAction({ issueId, action: 'APPROVED', success: false });
    } finally {
      setLoading(issueId, false);
    }
  }, [onSuccess]);

  const flagIssue = useCallback(async (issueId: string) => {
    setLoading(issueId, true);
    setActionError(null);
    try {
      const response = await api.post(`/issues/${issueId}/status`, { status: 'ESCALATED' });
      setLastAction({ issueId, action: 'FLAGGED', success: true });
      onSuccess?.(issueId, { status: 'ESCALATED', ...response.data });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to flag issue';
      setActionError(message);
      setLastAction({ issueId, action: 'FLAGGED', success: false });
    } finally {
      setLoading(issueId, false);
    }
  }, [onSuccess]);

  const assignIssue = useCallback(async (issueId: string, ownerUserId: string) => {
    setLoading(issueId, true);
    setActionError(null);
    try {
      const response = await api.post(`/issues/${issueId}/assign`, { ownerUserId });
      setLastAction({ issueId, action: 'ASSIGNED', success: true });
      onSuccess?.(issueId, { ownerUserId, ...response.data });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to assign issue';
      setActionError(message);
      setLastAction({ issueId, action: 'ASSIGNED', success: false });
    } finally {
      setLoading(issueId, false);
    }
  }, [onSuccess]);

  const clearError = useCallback(() => setActionError(null), []);

  return {
    approveIssue,
    flagIssue,
    assignIssue,
    actionLoading,
    actionError,
    clearError,
    lastAction,
  };
}
