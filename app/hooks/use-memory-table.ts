import {
  actions,
  initializeFromURL,
  memoryTableState$,
  syncToURL,
  tanStackColumnFilters$,
  tanStackPagination$,
  tanStackSorting$,
} from "@/states/memories";
import { observe } from "@legendapp/state";
import { use$ } from "@legendapp/state/react";
import {
  type ColumnDef,
  type InitialTableState,
  type Row,
  useReactTable,
} from "@tanstack/react-table";
import {
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import React from "react";
import { useSearchParams } from "react-router";

interface UseMemoryTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData>[];
  initialState?: InitialTableState;
  getRowId?: (originalRow: TData, index: number, parent?: Row<TData>) => string;
}

export function useMemoryTable<TData>({
  data,
  columns,
  initialState,
  getRowId,
}: UseMemoryTableProps<TData>) {
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize Legend State from URL on mount and when URL changes
  React.useEffect(() => {
    initializeFromURL(searchParams);
  }, [searchParams]);

  // Set up URL sync observer (only creates observer once)
  React.useEffect(() => {
    const dispose = observe(() => {
      // This will run whenever any tracked observable changes
      syncToURL(setSearchParams);
    });

    return dispose; // Cleanup observer on unmount
  }, [setSearchParams]);

  // Create searchable data with proper IDs
  const searchableData = React.useMemo(
    () =>
      data.map((row) => ({
        id: getRowId?.(row, 0) ?? (row as { id: string }).id,
        ...row,
      })),
    [data, getRowId],
  );

  // Use Legend State observables for reactive table state
  const pagination = use$(tanStackPagination$);
  const sorting = use$(tanStackSorting$);
  const columnFilters = use$(tanStackColumnFilters$);
  const columnVisibility = use$(memoryTableState$.columnVisibility);
  const rowSelection = use$(memoryTableState$.rowSelection);

  // Create TanStack Table with Legend State integration
  const table = useReactTable({
    data: searchableData,
    columns,
    state: {
      pagination,
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    initialState,
    enableRowSelection: true,

    // Update Legend State when TanStack Table changes
    onRowSelectionChange: (updater) => {
      const newSelection =
        typeof updater === "function" ? updater(rowSelection) : updater;
      actions.setRowSelection(newSelection);
    },

    onPaginationChange: (updater) => {
      const newPagination =
        typeof updater === "function" ? updater(pagination) : updater;
      actions.setPagination(newPagination);
    },

    onSortingChange: (updater) => {
      const newSorting =
        typeof updater === "function" ? updater(sorting) : updater;
      actions.setSorting(newSorting);
    },

    onColumnFiltersChange: (updater) => {
      const newColumnFilters =
        typeof updater === "function" ? updater(columnFilters) : updater;

      // Extract individual filter values and update Legend State
      const titleFilter = newColumnFilters.find((f) => f.id === "title");
      const statusFilter = newColumnFilters.find((f) => f.id === "status");
      const priorityFilter = newColumnFilters.find((f) => f.id === "priority");
      const typeFilter = newColumnFilters.find((f) => f.id === "type");
      const reviewerFilter = newColumnFilters.find((f) => f.id === "reviewer");

      // Update each filter individually to trigger fine-grained updates
      actions.setTitleFilter((titleFilter?.value as string) || "");
      actions.setStatusFilter((statusFilter?.value as string[]) || []);
      actions.setPriorityFilter((priorityFilter?.value as string[]) || []);
      actions.setTypeFilter((typeFilter?.value as string[]) || []);
      actions.setReviewerFilter((reviewerFilter?.value as string[]) || []);
    },

    onColumnVisibilityChange: (updater) => {
      const newVisibility =
        typeof updater === "function" ? updater(columnVisibility) : updater;
      actions.setColumnVisibility(newVisibility);
    },

    // Table model functions
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

  // Return table and Legend State actions for external use
  return {
    table,
    // Export Legend State actions for direct use in components
    actions,
    // Export current filter values for toolbar components
    filters: {
      title: use$(memoryTableState$.filters.title),
      status: use$(memoryTableState$.filters.status),
      priority: use$(memoryTableState$.filters.priority),
      type: use$(memoryTableState$.filters.type),
      reviewer: use$(memoryTableState$.filters.reviewer),
    },
  };
}
