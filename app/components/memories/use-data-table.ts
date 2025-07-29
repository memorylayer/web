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
  // React state management for table functionality
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  // Create searchable data with proper IDs
  const searchableData = React.useMemo(
    () =>
      data.map((row) => ({
        id: getRowId?.(row, 0) ?? (row as { id: string }).id,
        ...row,
      })),
    [data, getRowId],
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
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
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
  };
}
