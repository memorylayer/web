"use client";

import {
  type ColumnDef,
  type ColumnFiltersState,
  type InitialTableState,
  type PaginationState,
  type Row,
  type SortingState,
  type VisibilityState,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React from "react";
import { useSearchParams } from "react-router";

interface UseDataTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData>[];
  pageCount?: number;
  initialState?: InitialTableState;
  getRowId?: (originalRow: TData, index: number, parent?: Row<TData>) => string;
}

export function useDataTable<TData>({
  data,
  columns,
  pageCount = -1,
  initialState,
  getRowId,
}: UseDataTableProps<TData>) {
  // URL state management with React Router's useSearchParams
  const [searchParams, setSearchParams] = useSearchParams();

  // Helper functions to get values from URLSearchParams
  const getParamAsInteger = (key: string, defaultValue: number): number => {
    const value = searchParams.get(key);
    const parsed = value ? Number.parseInt(value, 10) : Number.NaN;
    return Number.isNaN(parsed) ? defaultValue : parsed;
  };

  const getParamAsString = (key: string, defaultValue = ""): string => {
    return searchParams.get(key) || defaultValue;
  };

  const getParamAsArray = (key: string): string[] => {
    return searchParams.getAll(key).filter(Boolean);
  };

  // Extract current URL state
  const page = getParamAsInteger("page", 1);
  const per_page = getParamAsInteger("per_page", 10);
  const sort = getParamAsString("sort");
  const title = getParamAsString("title");
  const status = getParamAsArray("status");
  const priority = getParamAsArray("priority");
  const type = getParamAsArray("type");
  const reviewer = getParamAsArray("reviewer");

  // Helper function to update search params
  const updateSearchParams = React.useCallback(
    (updates: Record<string, string | string[] | number>) => {
      setSearchParams((prev) => {
        const newParams = new URLSearchParams(prev);

        for (const [key, value] of Object.entries(updates)) {
          // Remove existing values for this key
          newParams.delete(key);

          if (Array.isArray(value)) {
            // Add multiple values for arrays
            for (const v of value) {
              if (v) newParams.append(key, v);
            }
          } else if (value !== undefined && value !== "" && value !== 0) {
            // Add single value (skip empty/default values)
            newParams.set(key, String(value));
          }
        }

        return newParams;
      });
    },
    [setSearchParams],
  );

  // React state management for non-URL state
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  // Current state object for compatibility
  const queryStates = {
    page,
    per_page,
    sort,
    title,
    status,
    priority,
    type,
    reviewer,
  };

  // Create searchable data with proper IDs (memoized more efficiently)
  const searchableData = React.useMemo(
    () =>
      data.map((row) => ({
        id: getRowId?.(row, 0) ?? (row as { id: string }).id,
        ...row,
      })),
    [data, getRowId],
  );

  // Column filters derived from URL state
  const columnFilters: ColumnFiltersState = React.useMemo(() => {
    const filters: ColumnFiltersState = [];

    if (title) {
      filters.push({ id: "title", value: title });
    }
    if (status.length > 0) {
      filters.push({ id: "status", value: status });
    }
    if (priority.length > 0) {
      filters.push({ id: "priority", value: priority });
    }
    if (type.length > 0) {
      filters.push({ id: "type", value: type });
    }
    if (reviewer.length > 0) {
      filters.push({ id: "reviewer", value: reviewer });
    }

    return filters;
  }, [title, status, priority, type, reviewer]);

  // Sorting derived from URL state
  const sorting: SortingState = React.useMemo(() => {
    if (!sort) return [];

    const [id, desc] = sort.split(":");
    return [{ id, desc: desc === "desc" }];
  }, [sort]);

  // Pagination derived from URL state
  const pagination: PaginationState = React.useMemo(
    () => ({
      pageIndex: page - 1,
      pageSize: per_page,
    }),
    [page, per_page],
  );

  const table = useReactTable({
    data: searchableData,
    columns,
    pageCount,
    state: {
      pagination,
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    initialState,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: (updater) => {
      const newPagination =
        typeof updater === "function" ? updater(pagination) : updater;
      updateSearchParams({
        page: newPagination.pageIndex + 1,
        per_page: newPagination.pageSize,
      });
    },
    onSortingChange: (updater) => {
      const newSorting =
        typeof updater === "function" ? updater(sorting) : updater;
      const sortString = newSorting[0]
        ? `${newSorting[0].id}:${newSorting[0].desc ? "desc" : "asc"}`
        : "";
      updateSearchParams({ sort: sortString });
    },
    onColumnFiltersChange: (updater) => {
      const newColumnFilters =
        typeof updater === "function" ? updater(columnFilters) : updater;

      const updates: Record<string, string | string[]> = {};

      // Build filter updates from the new column filters
      for (const filter of newColumnFilters) {
        if (filter.value !== undefined && filter.value !== null) {
          updates[filter.id] = filter.value as string | string[];
        }
      }

      // Clear filters not in newColumnFilters
      const newFilterIds = new Set(newColumnFilters.map((f) => f.id));
      for (const id of ["title", "status", "priority", "type", "reviewer"]) {
        if (!newFilterIds.has(id)) {
          updates[id] = id === "title" ? "" : [];
        }
      }

      updateSearchParams(updates);
    },
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getRowId: getRowId
      ? (row, index, parent) => getRowId(row, index, parent)
      : undefined,
  });

  return {
    table,
    queryStates,
    updateSearchParams,
  };
}
