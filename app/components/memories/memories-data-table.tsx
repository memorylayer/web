"use client";

import React from "react";
import { columns } from "./columns";
import { memoriesData } from "./data";
import { DataTable } from "./data-table";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableToolbar } from "./data-table-toolbar";
import { useDataTable } from "./use-data-table";

export function MemoriesDataTable() {
  const { table, queryStates, updateSearchParams } = useDataTable({
    data: memoriesData,
    columns,
    getRowId: (row) => row.id,
  });

  const { title, status, priority, type, reviewer } = queryStates;

  return (
    <div className="space-y-4">
      <DataTable table={table}>
        <DataTableToolbar
          table={table}
          searchValue={title}
          onSearchChange={(value) => updateSearchParams({ title: value })}
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
