"use client";

import { useMemoryTable } from "@/hooks";
import { columns } from "./columns";
import { memoriesData } from "./data";
import { DataTable } from "./data-table";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableToolbar } from "./data-table-toolbar";

export function MemoriesDataTable() {
  const { table, actions, filters } = useMemoryTable({
    data: memoriesData,
    columns,
    getRowId: (row) => row.id,
  });

  const { title, status, priority, type, reviewer } = filters;

  return (
    <div className="space-y-4">
      <DataTable table={table}>
        <DataTableToolbar
          table={table}
          searchValue={title}
          onSearchChange={actions.setTitleFilter}
          statusFilter={status}
          onStatusChange={actions.setStatusFilter}
          priorityFilter={priority}
          onPriorityChange={actions.setPriorityFilter}
          typeFilter={type}
          onTypeChange={actions.setTypeFilter}
          reviewerFilter={reviewer}
          onReviewerChange={actions.setReviewerFilter}
        />
      </DataTable>
      <DataTablePagination table={table} />
    </div>
  );
}
