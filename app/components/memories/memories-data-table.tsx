"use client";

import React from "react";
import { columns } from "./columns";
import { memoriesData } from "./data";
import { DataTable } from "./data-table";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableToolbar } from "./data-table-toolbar";
import { useDataTable } from "./use-data-table";

// Debounce hook for search input
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function MemoriesDataTable() {
  const { table, queryStates, setQueryStates } = useDataTable({
    data: memoriesData,
    columns,
    getRowId: (row) => row.id,
    throttleMs: 500, // Increase throttling for better performance
  });

  const { title, status, priority, type, reviewer } = queryStates;

  // Local state for immediate search input feedback
  const [searchInput, setSearchInput] = React.useState(title);
  const debouncedSearchValue = useDebounce(searchInput, 300);

  // Update URL when debounced search value changes
  React.useEffect(() => {
    if (debouncedSearchValue !== title) {
      setQueryStates({ title: debouncedSearchValue });
    }
  }, [debouncedSearchValue, title, setQueryStates]);

  // Update local input when URL changes (e.g., browser back/forward)
  React.useEffect(() => {
    setSearchInput(title);
  }, [title]);

  return (
    <div className="space-y-4">
      <DataTable table={table}>
        <DataTableToolbar
          table={table}
          searchValue={searchInput}
          onSearchChange={setSearchInput}
          statusFilter={status}
          onStatusChange={(values) => setQueryStates({ status: values })}
          priorityFilter={priority}
          onPriorityChange={(values) => setQueryStates({ priority: values })}
          typeFilter={type}
          onTypeChange={(values) => setQueryStates({ type: values })}
          reviewerFilter={reviewer}
          onReviewerChange={(values) => setQueryStates({ reviewer: values })}
        />
      </DataTable>
      <DataTablePagination table={table} />
    </div>
  );
}
