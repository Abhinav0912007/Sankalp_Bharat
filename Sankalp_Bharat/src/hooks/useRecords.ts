import { useState, useEffect, useCallback } from 'react';
import api, { type EmissionRecord, type PaginationParams } from '../services/api';

interface UseRecordsReturn {
  records: EmissionRecord[];
  isLoading: boolean;
  error: string | null;
  totalCount: number;
  totalPages: number;
  page: number;
  pageSize: number;
  sortField: string;
  sortOrder: 'asc' | 'desc';
  searchQuery: string;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setSortField: (field: string) => void;
  setSortOrder: (order: 'asc' | 'desc') => void;
  setSearchQuery: (query: string) => void;
  refetch: () => void;
}

/**
 * Custom hook for fetching emission records with pagination, sorting, and search.
 * All data is fetched dynamically from the backend — no hardcoded data.
 */
export function useRecords(): UseRecordsReturn {
  const [records, setRecords] = useState<EmissionRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [sortField, setSortField] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchRecords = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params: PaginationParams = {
        page,
        limit: pageSize,
        sort: sortField,
        order: sortOrder,
      };

      if (searchQuery.trim()) {
        params.search = searchQuery.trim();
      }

      const response = await api.get('/records', { params });

      // Handle both paginated response format and simple array format
      if (response.data?.records) {
        // Simple format: { records: [...] }
        setRecords(response.data.records);
        setTotalCount(response.data.total ?? response.data.records.length);
        setTotalPages(response.data.totalPages ?? Math.ceil((response.data.total ?? response.data.records.length) / pageSize));
      } else if (response.data?.data) {
        // Paginated format: { data: [...], total, page, limit, totalPages }
        setRecords(response.data.data);
        setTotalCount(response.data.total ?? 0);
        setTotalPages(response.data.totalPages ?? 0);
      } else if (Array.isArray(response.data)) {
        setRecords(response.data);
        setTotalCount(response.data.length);
        setTotalPages(Math.ceil(response.data.length / pageSize));
      } else {
        setRecords([]);
        setTotalCount(0);
        setTotalPages(0);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch records';
      setError(message);
      setRecords([]);
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize, sortField, sortOrder, searchQuery]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  // Reset to page 1 when search changes
  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  return {
    records,
    isLoading,
    error,
    totalCount,
    totalPages,
    page,
    pageSize,
    sortField,
    sortOrder,
    searchQuery,
    setPage,
    setPageSize,
    setSortField,
    setSortOrder,
    setSearchQuery,
    refetch: fetchRecords,
  };
}
