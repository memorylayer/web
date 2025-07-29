"use client";

import React from "react";
import { columns } from "./columns";
import { memoriesData } from "./data";
import { DataTable } from "./data-table";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableToolbar } from "./data-table-toolbar";
import { useDataTable } from "./use-data-table";

export function MemoriesDataTable() {
  const { table, queryStates, setQueryStates } = useDataTable({
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
          onSearchChange={(value) => setQueryStates({ title: value })}
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
