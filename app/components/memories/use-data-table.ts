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
import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  useQueryStates,
} from "nuqs";
import React from "react";

interface UseDataTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData>[];
  pageCount?: number;
  initialState?: InitialTableState;
  getRowId?: (originalRow: TData, index: number, parent?: Row<TData>) => string;
  clearOnDefault?: boolean;
  throttleMs?: number;
  shallow?: boolean;
  scroll?: boolean;
  history?: "push" | "replace";
}

export function useDataTable<TData>({
  data,
  columns,
  pageCount = -1,
  initialState,
  getRowId,
  clearOnDefault = false,
  throttleMs = 300,
  shallow = true,
  scroll = false,
  history = "replace",
}: UseDataTableProps<TData>) {
  // URL state management with nuqs
  const [queryStates, setQueryStates] = useQueryStates(
    {
      page: parseAsInteger.withDefault(1),
      per_page: parseAsInteger.withDefault(10),
      sort: parseAsString.withDefault(""),
      title: parseAsString.withDefault(""),
      status: parseAsArrayOf(parseAsString).withDefault([]),
      priority: parseAsArrayOf(parseAsString).withDefault([]),
      type: parseAsArrayOf(parseAsString).withDefault([]),
      reviewer: parseAsArrayOf(parseAsString).withDefault([]),
    },
    {
      shallow,
      throttleMs,
      scroll,
      history,
      clearOnDefault,
    },
  );

  const { page, per_page, sort, title, status, priority, type, reviewer } =
    queryStates;

  // React state management for non-URL state
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

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
      setQueryStates({
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
      setQueryStates({ sort: sortString });
    },
    onColumnFiltersChange: (updater) => {
      const newColumnFilters =
        typeof updater === "function" ? updater(columnFilters) : updater;
      
      // Only update changed values, don't reset everything
      const updates: Record<string, string | string[]> = {};
      
      // Map current filters to track what changed
      const currentFilterMap = new Map(columnFilters.map(f => [f.id, f.value]));
      const newFilterMap = new Map(newColumnFilters.map(f => [f.id, f.value]));
      
      // Check each filter type for changes
      const filterIds = ['title', 'status', 'priority', 'type', 'reviewer'];
      
      for (const filterId of filterIds) {
        const currentValue = currentFilterMap.get(filterId);
        const newValue = newFilterMap.get(filterId);
        
                 // Only update if value actually changed
         if (JSON.stringify(currentValue) !== JSON.stringify(newValue)) {
           if (newValue !== undefined && newValue !== null) {
             updates[filterId] = newValue as string | string[];
           } else {
             // Clear the filter if it was removed
             updates[filterId] = filterId === 'title' ? '' : [];
           }
         }
      }
      
      // Only update URL if there are actual changes
      if (Object.keys(updates).length > 0) {
        setQueryStates(updates);
      }
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
    setQueryStates,
  };
}
