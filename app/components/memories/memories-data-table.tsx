"use client";

import React from "react";
import { columns } from "./columns";
import { memoriesData } from "./data";
import { DataTable } from "./data-table";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableToolbar } from "./data-table-toolbar";
import { useDataTable } from "./use-data-table";

// Debounce hook to prevent excessive URL updates
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
  const { table, queryStates, updateSearchParams } = useDataTable({
    data: memoriesData,
    columns,
    getRowId: (row) => row.id,
  });

  const { title, status, priority, type, reviewer } = queryStates;

  // Local state for immediate UI feedback without URL updates
  const [searchInput, setSearchInput] = React.useState(title);
  const debouncedSearchValue = useDebounce(searchInput, 300);

  // Update URL only when debounced search changes
  React.useEffect(() => {
    if (debouncedSearchValue !== title) {
      updateSearchParams({ title: debouncedSearchValue });
    }
  }, [debouncedSearchValue, title, updateSearchParams]);

  // Sync local input with URL changes (for browser back/forward)
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
          onStatusChange={(values) => updateSearchParams({ status: values })}
          priorityFilter={priority}
          onPriorityChange={(values) =>
            updateSearchParams({ priority: values })
          }
          typeFilter={type}
          onTypeChange={(values) => updateSearchParams({ type: values })}
          reviewerFilter={reviewer}
          onReviewerChange={(values) =>
            updateSearchParams({ reviewer: values })
          }
        />
      </DataTable>
      <DataTablePagination table={table} />
    </div>
  );
}
