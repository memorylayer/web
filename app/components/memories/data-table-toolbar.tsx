"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, Filter, SlidersHorizontal, X, Settings2 } from "lucide-react";
import type { Table } from "@tanstack/react-table";
import React from "react";
import type { Memory } from "./data";

interface DataTableToolbarProps {
  table: Table<Memory>;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  statusFilter?: string[];
  onStatusChange?: (values: string[]) => void;
  priorityFilter?: string[];
  onPriorityChange?: (values: string[]) => void;
  typeFilter?: string[];
  onTypeChange?: (values: string[]) => void;
  reviewerFilter?: string[];
  onReviewerChange?: (values: string[]) => void;
}

export function DataTableToolbar({
  table,
  searchValue = "",
  onSearchChange,
  statusFilter = [],
  onStatusChange,
  priorityFilter = [],
  onPriorityChange,
  typeFilter = [],
  onTypeChange,
  reviewerFilter = [],
  onReviewerChange,
}: DataTableToolbarProps) {


  // Get unique values for filter options
  const statusOptions = React.useMemo(() => {
    const statuses = table.getCoreRowModel().rows.map(row => row.original.status);
    return Array.from(new Set(statuses)).map(status => ({
      label: status === "in-progress" ? "In Progress" : status.charAt(0).toUpperCase() + status.slice(1),
      value: status
    }));
  }, [table]);

  const priorityOptions = React.useMemo(() => {
    const priorities = table.getCoreRowModel().rows.map(row => row.original.priority);
    return Array.from(new Set(priorities)).map(priority => ({
      label: priority.charAt(0).toUpperCase() + priority.slice(1),
      value: priority
    }));
  }, [table]);

  const typeOptions = React.useMemo(() => {
    const types = table.getCoreRowModel().rows.map(row => row.original.type);
    return Array.from(new Set(types)).map(type => ({
      label: type,
      value: type
    }));
  }, [table]);

  const reviewerOptions = React.useMemo(() => {
    const reviewers = table.getCoreRowModel().rows.map(row => row.original.reviewer);
    return Array.from(new Set(reviewers)).map(reviewer => ({
      label: reviewer,
      value: reviewer
    }));
  }, [table]);

  const hasActiveFilters = statusFilter.length > 0 || priorityFilter.length > 0 || typeFilter.length > 0 || reviewerFilter.length > 0 || searchValue.length > 0;

  const clearAllFilters = () => {
    onSearchChange?.("");
    onStatusChange?.([]);
    onPriorityChange?.([]);
    onTypeChange?.([]);
    onReviewerChange?.([]);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search memories..."
              value={searchValue}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="pl-9 text-xs font-mono"
            />
          </div>

          {/* Status Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 border-dashed">
                <Filter className="mr-2 h-4 w-4" />
                Status
                {statusFilter.length > 0 && (
                  <Badge
                    variant="secondary"
                    className="ml-1 rounded-sm px-1 font-normal"
                  >
                    {statusFilter.length}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[200px]" align="start">
              <DropdownMenuLabel>Filter by status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {statusOptions.map((option) => (
                <DropdownMenuCheckboxItem
                  key={option.value}
                  checked={statusFilter.includes(option.value)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      onStatusChange?.([...statusFilter, option.value]);
                    } else {
                      onStatusChange?.(statusFilter.filter(v => v !== option.value));
                    }
                  }}
                >
                  {option.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Priority Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 border-dashed">
                <Filter className="mr-2 h-4 w-4" />
                Priority
                {priorityFilter.length > 0 && (
                  <Badge
                    variant="secondary"
                    className="ml-1 rounded-sm px-1 font-normal"
                  >
                    {priorityFilter.length}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[200px]" align="start">
              <DropdownMenuLabel>Filter by priority</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {priorityOptions.map((option) => (
                <DropdownMenuCheckboxItem
                  key={option.value}
                  checked={priorityFilter.includes(option.value)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      onPriorityChange?.([...priorityFilter, option.value]);
                    } else {
                      onPriorityChange?.(priorityFilter.filter(v => v !== option.value));
                    }
                  }}
                >
                  {option.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Type Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 border-dashed">
                <Filter className="mr-2 h-4 w-4" />
                Type
                {typeFilter.length > 0 && (
                  <Badge
                    variant="secondary"
                    className="ml-1 rounded-sm px-1 font-normal"
                  >
                    {typeFilter.length}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[200px]" align="start">
              <DropdownMenuLabel>Filter by type</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {typeOptions.map((option) => (
                <DropdownMenuCheckboxItem
                  key={option.value}
                  checked={typeFilter.includes(option.value)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      onTypeChange?.([...typeFilter, option.value]);
                    } else {
                      onTypeChange?.(typeFilter.filter(v => v !== option.value));
                    }
                  }}
                >
                  {option.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Reviewer Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 border-dashed">
                <Filter className="mr-2 h-4 w-4" />
                Reviewer
                {reviewerFilter.length > 0 && (
                  <Badge
                    variant="secondary"
                    className="ml-1 rounded-sm px-1 font-normal"
                  >
                    {reviewerFilter.length}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[200px]" align="start">
              <DropdownMenuLabel>Filter by reviewer</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {reviewerOptions.map((option) => (
                <DropdownMenuCheckboxItem
                  key={option.value}
                  checked={reviewerFilter.includes(option.value)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      onReviewerChange?.([...reviewerFilter, option.value]);
                    } else {
                      onReviewerChange?.(reviewerFilter.filter(v => v !== option.value));
                    }
                  }}
                >
                  {option.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              onClick={clearAllFilters}
              className="h-8 px-2 lg:px-3"
            >
              Reset
              <X className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {/* Column visibility */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="ml-auto h-8">
                <Settings2 className="mr-2 h-4 w-4" />
                View
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[150px]">
              <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {table
                .getAllColumns()
                .filter(
                  (column) =>
                    typeof column.accessorFn !== "undefined" && column.getCanHide()
                )
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Active filters display */}
      {hasActiveFilters && (
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {searchValue && (
            <Badge variant="secondary" className="h-6 px-2 py-0 text-xs">
              Search: {searchValue}
              <Button
                variant="ghost"
                size="sm"
                className="ml-1 h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => onSearchChange?.("")}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          {statusFilter.map((status) => (
            <Badge key={status} variant="secondary" className="h-6 px-2 py-0 text-xs">
              Status: {status === "in-progress" ? "In Progress" : status}
              <Button
                variant="ghost"
                size="sm" 
                className="ml-1 h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => onStatusChange?.(statusFilter.filter(v => v !== status))}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
          {priorityFilter.map((priority) => (
            <Badge key={priority} variant="secondary" className="h-6 px-2 py-0 text-xs">
              Priority: {priority}
              <Button
                variant="ghost"
                size="sm"
                className="ml-1 h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => onPriorityChange?.(priorityFilter.filter(v => v !== priority))}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
          {typeFilter.map((type) => (
            <Badge key={type} variant="secondary" className="h-6 px-2 py-0 text-xs">
              Type: {type}
              <Button
                variant="ghost"
                size="sm"
                className="ml-1 h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => onTypeChange?.(typeFilter.filter(v => v !== type))}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
          {reviewerFilter.map((reviewer) => (
            <Badge key={reviewer} variant="secondary" className="h-6 px-2 py-0 text-xs">
              Reviewer: {reviewer}
              <Button
                variant="ghost"
                size="sm"
                className="ml-1 h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => onReviewerChange?.(reviewerFilter.filter(v => v !== reviewer))}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}


    </div>
  );
} 