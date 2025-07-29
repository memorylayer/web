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
// import { parseAsArrayOf, parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import React from "react";

interface UseDataTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData>[];
  pageCount?: number;
  initialState?: InitialTableState;
  getRowId?: (originalRow: TData, index: number, parent?: Row<TData>) => string;
  enableAdvancedFilter?: boolean;
  clearOnDefault?: boolean;
  throttleMs?: number;
  debounceMs?: number;
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
  // enableAdvancedFilter = false,
  clearOnDefault = false,
  throttleMs = 50,
  debounceMs = 300,
  shallow = true,
  scroll = false,
  history = "replace",
}: UseDataTableProps<TData>) {
  // For now, we'll use a simpler approach without URL state management
  // TODO: Add nuqs for URL state management
  const page = 1;
  const per_page = 10;
  const sort = "";
  const title = "";
  const status: string[] = [];
  const priority: string[] = [];
  const type: string[] = [];
  const reviewer: string[] = [];

  // Create searchable string for complex filtering
  const searchableData = React.useMemo(
    () =>
      data.map((row) => ({
        id: getRowId?.(row, 0) ?? (row as { id: string }).id,
        ...row,
      })),
    [data, getRowId]
  );

  // Column filters
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

  // Sorting
  const sorting: SortingState = React.useMemo(() => {
    if (!sort) return [];
    
    const [id, desc] = sort.split(":");
    return [{ id, desc: desc === "desc" }];
  }, [sort]);

  // Pagination
  const pagination: PaginationState = React.useMemo(
    () => ({
      pageIndex: page - 1,
      pageSize: per_page,
    }),
    [page, per_page]
  );

  // Column visibility
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});

  // Row selection
  const [rowSelection, setRowSelection] = React.useState({});

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
      const newPagination = typeof updater === "function" ? updater(pagination) : updater;
      setQueryStates({
        page: newPagination.pageIndex + 1,
        per_page: newPagination.pageSize,
      });
    },
    onSortingChange: (updater) => {
      const newSorting = typeof updater === "function" ? updater(sorting) : updater;
      const sortString = newSorting[0] 
        ? `${newSorting[0].id}:${newSorting[0].desc ? "desc" : "asc"}`
        : "";
      setQueryStates({ sort: sortString });
    },
    onColumnFiltersChange: (updater) => {
      const newColumnFilters = typeof updater === "function" ? updater(columnFilters) : updater;
      const updates: Record<string, string | string[]> = {};
      
      // Reset all filter states
      updates.title = "";
      updates.status = [];
      updates.priority = [];
      updates.type = [];
      updates.reviewer = [];
      
             // Set new filter values
       for (const filter of newColumnFilters) {
         if (filter.id === "title" && typeof filter.value === "string") {
           // updates.title = filter.value;
         } else if (Array.isArray(filter.value)) {
           // updates[filter.id as keyof typeof updates] = filter.value;
         }
       }
      
      setQueryStates(updates);
    },
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getRowId: getRowId ? (row, index, parent) => getRowId(row, index, parent) : undefined,
  });

  return {
    table,
  };
} 