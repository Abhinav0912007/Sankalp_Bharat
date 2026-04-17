import React, { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
  type Row,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  Pagination,
  Skeleton,
  alpha,
  useTheme,
  Collapse,
  IconButton,
  Chip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import TableRowsIcon from '@mui/icons-material/TableRows';
import FilterListIcon from '@mui/icons-material/FilterList';

interface CarbonDataGridProps<T> {
  data: T[];
  columns: ColumnDef<T, unknown>[];
  isLoading?: boolean;
  totalCount?: number;
  totalPages?: number;
  page?: number;
  pageSize?: number;
  searchQuery?: string;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  onSearchChange?: (query: string) => void;
  enableSearch?: boolean;
  enablePagination?: boolean;
  title?: string;
  subtitle?: string;
  expandableContent?: (row: Row<T>) => React.ReactNode;
  toolbarActions?: React.ReactNode;
  emptyMessage?: string;
}

function CarbonDataGrid<T>({
  data,
  columns,
  isLoading = false,
  totalCount = 0,
  totalPages = 1,
  page = 1,
  pageSize = 50,
  searchQuery = '',
  onPageChange,
  onPageSizeChange,
  onSearchChange,
  enableSearch = true,
  enablePagination = true,
  title,
  subtitle,
  expandableContent,
  toolbarActions,
  emptyMessage = 'No records found. Data will appear here once the backend provides it.',
}: CarbonDataGridProps<T>) {
  const theme = useTheme();
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  const toggleRowExpansion = (rowId: string) => {
    setExpandedRows((prev) => ({ ...prev, [rowId]: !prev[rowId] }));
  };

  // If expandable, prepend an expand column
  const allColumns: ColumnDef<T, unknown>[] = expandableContent
    ? [
        {
          id: '_expand',
          header: '',
          size: 48,
          cell: ({ row }) => (
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                toggleRowExpansion(row.id);
              }}
              sx={{
                transition: 'transform 0.2s ease',
                transform: expandedRows[row.id] ? 'rotate(180deg)' : 'rotate(0deg)',
              }}
            >
              {expandedRows[row.id] ? (
                <KeyboardArrowUpIcon fontSize="small" />
              ) : (
                <KeyboardArrowDownIcon fontSize="small" />
              )}
            </IconButton>
          ),
        },
        ...columns,
      ]
    : columns;

  const table = useReactTable({
    data,
    columns: allColumns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: totalPages,
  });

  // Loading skeleton
  const renderSkeleton = () => (
    <>
      {Array.from({ length: 8 }).map((_, i) => (
        <TableRow key={`skeleton-${i}`}>
          {allColumns.map((_, j) => (
            <TableCell key={`skeleton-cell-${i}-${j}`}>
              <Skeleton
                variant="text"
                animation="wave"
                sx={{ width: `${60 + Math.random() * 30}%` }}
              />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );

  // Empty state
  const renderEmpty = () => (
    <TableRow>
      <TableCell colSpan={allColumns.length}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            py: 8,
            gap: 2,
          }}
        >
          <Box
            sx={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              background: alpha(theme.palette.secondary.main, 0.1),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <TableRowsIcon sx={{ fontSize: 32, color: theme.palette.secondary.main }} />
          </Box>
          <Typography variant="h6" sx={{ color: theme.palette.text.secondary, fontWeight: 500 }}>
            {emptyMessage}
          </Typography>
          <Typography variant="caption" sx={{ color: theme.palette.text.disabled }}>
            Records will load dynamically from the backend API
          </Typography>
        </Box>
      </TableCell>
    </TableRow>
  );

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: '14px',
        border: `1px solid ${theme.palette.divider}`,
        overflow: 'hidden',
        transition: 'box-shadow 0.3s ease',
        '&:hover': {
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
        },
      }}
    >
      {/* Header / Toolbar */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
          px: 2.5,
          py: 2,
          borderBottom: `1px solid ${theme.palette.divider}`,
          flexWrap: 'wrap',
        }}
      >
        <Box>
          {title && (
            <Typography variant="h4" sx={{ fontSize: '1rem' }}>
              {title}
            </Typography>
          )}
          {subtitle && (
            <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
              {subtitle}
            </Typography>
          )}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
          {enableSearch && (
            <TextField
              size="small"
              placeholder="Search records..."
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ fontSize: 18, color: theme.palette.text.disabled }} />
                    </InputAdornment>
                  ),
                },
              }}
              sx={{
                minWidth: 220,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.02),
                },
              }}
            />
          )}
          {totalCount > 0 && (
            <Chip
              icon={<FilterListIcon sx={{ fontSize: 14 }} />}
              label={`${totalCount.toLocaleString()} total`}
              size="small"
              variant="outlined"
              sx={{ fontWeight: 600 }}
            />
          )}
          {toolbarActions}
        </Box>
      </Box>

      {/* Table */}
      <TableContainer sx={{ border: 'none', borderRadius: 0 }}>
        <Table size="small">
          <TableHead>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableCell
                    key={header.id}
                    sx={{
                      width: header.getSize() !== 150 ? header.getSize() : undefined,
                    }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {isLoading ? (
              renderSkeleton()
            ) : data.length === 0 ? (
              renderEmpty()
            ) : (
              table.getRowModel().rows.map((row) => (
                <React.Fragment key={row.id}>
                  <TableRow
                    sx={{
                      cursor: expandableContent ? 'pointer' : 'default',
                      backgroundColor: expandedRows[row.id]
                        ? alpha(theme.palette.secondary.main, 0.04)
                        : 'transparent',
                    }}
                    onClick={() => expandableContent && toggleRowExpansion(row.id)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>

                  {/* Expandable content */}
                  {expandableContent && (
                    <TableRow>
                      <TableCell
                        colSpan={allColumns.length}
                        sx={{ py: 0, px: 0, borderBottom: expandedRows[row.id] ? undefined : 'none' }}
                      >
                        <Collapse in={expandedRows[row.id]} timeout="auto" unmountOnExit>
                          <Box
                            sx={{
                              px: 3,
                              py: 2,
                              backgroundColor: alpha(theme.palette.primary.main, 0.02),
                              borderTop: `1px dashed ${theme.palette.divider}`,
                            }}
                          >
                            {expandableContent(row)}
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      {enablePagination && !isLoading && data.length > 0 && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 2.5,
            py: 1.5,
            borderTop: `1px solid ${theme.palette.divider}`,
            backgroundColor: alpha(theme.palette.primary.main, 0.01),
            flexWrap: 'wrap',
            gap: 1,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
              Rows per page:
            </Typography>
            <FormControl size="small">
              <Select
                value={pageSize}
                onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
                sx={{
                  fontSize: '0.75rem',
                  height: 30,
                  '& .MuiSelect-select': { py: 0.5, px: 1 },
                }}
              >
                <MenuItem value={25}>25</MenuItem>
                <MenuItem value={50}>50</MenuItem>
                <MenuItem value={100}>100</MenuItem>
              </Select>
            </FormControl>
            <Typography variant="caption" sx={{ color: theme.palette.text.disabled, ml: 1 }}>
              Page {page} of {totalPages} ({totalCount.toLocaleString()} records)
            </Typography>
          </Box>

          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, newPage) => onPageChange?.(newPage)}
            size="small"
            shape="rounded"
            color="primary"
            sx={{
              '& .MuiPaginationItem-root': {
                fontWeight: 600,
                fontSize: '0.75rem',
              },
            }}
          />
        </Box>
      )}
    </Paper>
  );
}

export default CarbonDataGrid;
