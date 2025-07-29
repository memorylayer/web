"use client";

import {
  type ColumnFiltersState,
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
import { columns } from "./columns";
import { type Memory, memoriesData } from "./data";
import { DataTable } from "./data-table";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableToolbar } from "./data-table-toolbar";

export function MemoriesDataTable() {
  const [data] = React.useState<Memory[]>(memoriesData);
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  // Filter states for the toolbar
  const [searchValue, setSearchValue] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string[]>([]);
  const [priorityFilter, setPriorityFilter] = React.useState<string[]>([]);
  const [typeFilter, setTypeFilter] = React.useState<string[]>([]);
  const [reviewerFilter, setReviewerFilter] = React.useState<string[]>([]);

  // Filtered data based on toolbar filters
  const filteredData = React.useMemo(() => {
    return data.filter((item) => {
      const matchesSearch =
        searchValue === "" ||
        item.title.toLowerCase().includes(searchValue.toLowerCase()) ||
        item.task.toLowerCase().includes(searchValue.toLowerCase());

      const matchesStatus =
        statusFilter.length === 0 || statusFilter.includes(item.status);
      const matchesPriority =
        priorityFilter.length === 0 || priorityFilter.includes(item.priority);
      const matchesType =
        typeFilter.length === 0 || typeFilter.includes(item.type);
      const matchesReviewer =
        reviewerFilter.length === 0 || reviewerFilter.includes(item.reviewer);

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority &&
        matchesType &&
        matchesReviewer
      );
    });
  }, [
    data,
    searchValue,
    statusFilter,
    priorityFilter,
    typeFilter,
    reviewerFilter,
  ]);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getRowId: (row) => row.id,
  });

  return (
    <div className="space-y-4">
      <DataTable table={table}>
        <DataTableToolbar
          table={table}
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          priorityFilter={priorityFilter}
          onPriorityChange={setPriorityFilter}
          typeFilter={typeFilter}
          onTypeChange={setTypeFilter}
          reviewerFilter={reviewerFilter}
          onReviewerChange={setReviewerFilter}
        />
      </DataTable>
      <DataTablePagination table={table} />
    </div>
  );
}
