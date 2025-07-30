import { observable } from "@legendapp/state";
import type {
  ColumnFiltersState,
  PaginationState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";

// Types for our memory table state
interface MemoryTableState {
  // Pagination
  pagination: {
    pageIndex: number;
    pageSize: number;
  };

  // Filters
  filters: {
    title: string;
    status: string[];
    priority: string[];
    type: string[];
    reviewer: string[];
  };

  // Sorting
  sorting: {
    id: string;
    desc: boolean;
  } | null;

  // UI State
  columnVisibility: Record<string, boolean>;
  rowSelection: Record<string, boolean>;
}

// Create the main observable store
export const memoryTableState$ = observable<MemoryTableState>({
  pagination: {
    pageIndex: 0,
    pageSize: 10,
  },
  filters: {
    title: "",
    status: [],
    priority: [],
    type: [],
    reviewer: [],
  },
  sorting: null,
  columnVisibility: {},
  rowSelection: {},
});

// Helper functions to parse URL parameters
function getParamAsInteger(
  searchParams: URLSearchParams,
  key: string,
  defaultValue: number,
): number {
  const value = searchParams.get(key);
  const parsed = value ? Number.parseInt(value, 10) : Number.NaN;
  return Number.isNaN(parsed) ? defaultValue : parsed;
}

function getParamAsString(
  searchParams: URLSearchParams,
  key: string,
  defaultValue = "",
): string {
  return searchParams.get(key) || defaultValue;
}

function getParamAsArray(searchParams: URLSearchParams, key: string): string[] {
  return searchParams.getAll(key).filter(Boolean);
}

// Initialize state from URL parameters
export function initializeFromURL(searchParams: URLSearchParams) {
  const page = getParamAsInteger(searchParams, "page", 1);
  const per_page = getParamAsInteger(searchParams, "per_page", 10);
  const sort = getParamAsString(searchParams, "sort");
  const title = getParamAsString(searchParams, "title");
  const status = getParamAsArray(searchParams, "status");
  const priority = getParamAsArray(searchParams, "priority");
  const type = getParamAsArray(searchParams, "type");
  const reviewer = getParamAsArray(searchParams, "reviewer");

  // Update pagination
  memoryTableState$.pagination.pageIndex.set(page - 1);
  memoryTableState$.pagination.pageSize.set(per_page);

  // Update filters
  memoryTableState$.filters.title.set(title);
  memoryTableState$.filters.status.set(status);
  memoryTableState$.filters.priority.set(priority);
  memoryTableState$.filters.type.set(type);
  memoryTableState$.filters.reviewer.set(reviewer);

  // Update sorting
  if (sort) {
    const [id, desc] = sort.split(":");
    memoryTableState$.sorting.set({
      id,
      desc: desc === "desc",
    });
  } else {
    memoryTableState$.sorting.set(null);
  }
}

// Sync state to URL parameters
export function syncToURL(setSearchParams: (params: URLSearchParams) => void) {
  const pagination = memoryTableState$.pagination.get();
  const filters = memoryTableState$.filters.get();
  const sorting = memoryTableState$.sorting.get();

  const newParams = new URLSearchParams();

  // Add pagination
  if (pagination.pageIndex > 0) {
    newParams.set("page", String(pagination.pageIndex + 1));
  }
  if (pagination.pageSize !== 10) {
    newParams.set("per_page", String(pagination.pageSize));
  }

  // Add filters
  if (filters.title) {
    newParams.set("title", filters.title);
  }
  for (const status of filters.status) {
    if (status) newParams.append("status", status);
  }
  for (const priority of filters.priority) {
    if (priority) newParams.append("priority", priority);
  }
  for (const type of filters.type) {
    if (type) newParams.append("type", type);
  }
  for (const reviewer of filters.reviewer) {
    if (reviewer) newParams.append("reviewer", reviewer);
  }

  // Add sorting
  if (sorting) {
    const sortString = `${sorting.id}:${sorting.desc ? "desc" : "asc"}`;
    newParams.set("sort", sortString);
  }

  setSearchParams(newParams);
}

// Computed observables for TanStack Table format (v3 syntax)
export const tanStackPagination$ = observable(() => {
  const pagination = memoryTableState$.pagination.get();
  return {
    pageIndex: pagination.pageIndex,
    pageSize: pagination.pageSize,
  };
});

export const tanStackSorting$ = observable(() => {
  const sorting = memoryTableState$.sorting.get();
  return sorting ? [sorting] : [];
});

export const tanStackColumnFilters$ = observable(() => {
  const filters = memoryTableState$.filters.get();
  const columnFilters: ColumnFiltersState = [];

  if (filters.title) {
    columnFilters.push({ id: "title", value: filters.title });
  }
  if (filters.status.length > 0) {
    columnFilters.push({ id: "status", value: filters.status });
  }
  if (filters.priority.length > 0) {
    columnFilters.push({ id: "priority", value: filters.priority });
  }
  if (filters.type.length > 0) {
    columnFilters.push({ id: "type", value: filters.type });
  }
  if (filters.reviewer.length > 0) {
    columnFilters.push({ id: "reviewer", value: filters.reviewer });
  }

  return columnFilters;
});

// Action functions for updating state
export const actions = {
  // Pagination actions
  setPage: (pageIndex: number) => {
    memoryTableState$.pagination.pageIndex.set(pageIndex);
  },

  setPageSize: (pageSize: number) => {
    memoryTableState$.pagination.pageSize.set(pageSize);
    memoryTableState$.pagination.pageIndex.set(0); // Reset to first page
  },

  setPagination: (pagination: PaginationState) => {
    memoryTableState$.pagination.set(pagination);
  },

  // Filter actions
  setTitleFilter: (title: string) => {
    memoryTableState$.filters.title.set(title);
    memoryTableState$.pagination.pageIndex.set(0); // Reset to first page when filtering
  },

  setStatusFilter: (status: string[]) => {
    memoryTableState$.filters.status.set(status);
    memoryTableState$.pagination.pageIndex.set(0);
  },

  setPriorityFilter: (priority: string[]) => {
    memoryTableState$.filters.priority.set(priority);
    memoryTableState$.pagination.pageIndex.set(0);
  },

  setTypeFilter: (type: string[]) => {
    memoryTableState$.filters.type.set(type);
    memoryTableState$.pagination.pageIndex.set(0);
  },

  setReviewerFilter: (reviewer: string[]) => {
    memoryTableState$.filters.reviewer.set(reviewer);
    memoryTableState$.pagination.pageIndex.set(0);
  },

  // Sorting actions
  setSorting: (sorting: SortingState) => {
    memoryTableState$.sorting.set(sorting.length > 0 ? sorting[0] : null);
  },

  // UI state actions
  setColumnVisibility: (visibility: VisibilityState) => {
    memoryTableState$.columnVisibility.set(visibility);
  },

  setRowSelection: (selection: Record<string, boolean>) => {
    memoryTableState$.rowSelection.set(selection);
  },

  // Reset actions
  resetFilters: () => {
    memoryTableState$.filters.set({
      title: "",
      status: [],
      priority: [],
      type: [],
      reviewer: [],
    });
    memoryTableState$.pagination.pageIndex.set(0);
  },

  resetAll: () => {
    memoryTableState$.set({
      pagination: {
        pageIndex: 0,
        pageSize: 10,
      },
      filters: {
        title: "",
        status: [],
        priority: [],
        type: [],
        reviewer: [],
      },
      sorting: null,
      columnVisibility: {},
      rowSelection: {},
    });
  },
};

// All exports are already declared above
