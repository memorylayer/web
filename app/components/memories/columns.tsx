"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Column, ColumnDef } from "@tanstack/react-table";
import {
  CheckCircle,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  MoreHorizontal,
  Text,
  Calendar,
  Hash,
  User,
  Folder,
} from "lucide-react";
import { DataTableColumnHeader } from "./data-table-column-header";
import type { Memory } from "./data";

function getStatusIcon(status: Memory["status"]) {
  switch (status) {
    case "done":
      return CheckCircle2;
    case "in-progress":
      return Clock;
    case "todo":
      return CheckCircle;
    case "canceled":
      return XCircle;
    default:
      return CheckCircle;
  }
}

function getStatusVariant(status: Memory["status"]) {
  switch (status) {
    case "done":
      return "default";
    case "in-progress":
      return "secondary";
    case "todo":
      return "outline";
    case "canceled":
      return "destructive";
    default:
      return "outline";
  }
}

function getPriorityIcon(priority: Memory["priority"]) {
  switch (priority) {
    case "urgent":
      return AlertTriangle;
    case "high":
      return AlertTriangle;
    case "medium":
      return CheckCircle;
    case "low":
      return CheckCircle;
    default:
      return CheckCircle;
  }
}

function getPriorityColor(priority: Memory["priority"]) {
  switch (priority) {
    case "urgent":
      return "text-red-500";
    case "high":
      return "text-orange-500";
    case "medium":
      return "text-yellow-500";
    case "low":
      return "text-green-500";
    default:
      return "text-gray-500";
  }
}

export const columns: ColumnDef<Memory>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    size: 32,
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "task",
    accessorKey: "task",
    header: ({ column }: { column: Column<Memory, unknown> }) => (
      <DataTableColumnHeader column={column} title="Task" />
    ),
    cell: ({ cell }) => (
      <div className="font-mono text-sm">
        {cell.getValue<Memory["task"]>()}
      </div>
    ),
    meta: {
      label: "Task",
      placeholder: "Search tasks...",
      variant: "text",
      icon: Hash,
    },
    enableColumnFilter: true,
    size: 120,
  },
  {
    id: "title",
    accessorKey: "title",
    header: ({ column }: { column: Column<Memory, unknown> }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    cell: ({ cell }) => (
      <div className="max-w-[400px] truncate">
        {cell.getValue<Memory["title"]>()}
      </div>
    ),
    meta: {
      label: "Title",
      placeholder: "Search titles...",
      variant: "text",
      icon: Text,
    },
    enableColumnFilter: true,
  },
  {
    id: "status",
    accessorKey: "status",
    header: ({ column }: { column: Column<Memory, unknown> }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ cell }) => {
      const status = cell.getValue<Memory["status"]>();
      const Icon = getStatusIcon(status);
      const variant = getStatusVariant(status);

      return (
        <Badge variant={variant} className="capitalize">
          <Icon className="mr-1 h-3 w-3" />
          {status === "in-progress" ? "In Progress" : status}
        </Badge>
      );
    },
    meta: {
      label: "Status",
      variant: "multiSelect",
      options: [
        { label: "Todo", value: "todo", icon: CheckCircle },
        { label: "In Progress", value: "in-progress", icon: Clock },
        { label: "Done", value: "done", icon: CheckCircle2 },
        { label: "Canceled", value: "canceled", icon: XCircle },
      ],
    },
    enableColumnFilter: true,
    size: 120,
  },
  {
    id: "priority",
    accessorKey: "priority",
    header: ({ column }: { column: Column<Memory, unknown> }) => (
      <DataTableColumnHeader column={column} title="Priority" />
    ),
    cell: ({ cell }) => {
      const priority = cell.getValue<Memory["priority"]>();
      const Icon = getPriorityIcon(priority);
      const colorClass = getPriorityColor(priority);

      return (
        <div className={`flex items-center gap-1 ${colorClass}`}>
          <Icon className="h-3 w-3" />
          <span className="capitalize">{priority}</span>
        </div>
      );
    },
    meta: {
      label: "Priority",
      variant: "multiSelect",
      options: [
        { label: "Low", value: "low", icon: CheckCircle },
        { label: "Medium", value: "medium", icon: CheckCircle },
        { label: "High", value: "high", icon: AlertTriangle },
        { label: "Urgent", value: "urgent", icon: AlertTriangle },
      ],
    },
    enableColumnFilter: true,
    size: 100,
  },
  {
    id: "estHours",
    accessorKey: "estHours",
    header: ({ column }: { column: Column<Memory, unknown> }) => (
      <DataTableColumnHeader column={column} title="Est. Hours" />
    ),
    cell: ({ cell }) => {
      const hours = cell.getValue<Memory["estHours"]>();
      return (
        <div className="text-right font-mono">
          {hours}h
        </div>
      );
    },
    meta: {
      label: "Est. Hours",
      variant: "range",
      range: [1, 25] as [number, number],
      unit: "hr",
    },
    enableColumnFilter: true,
    size: 100,
  },
  {
    id: "type",
    accessorKey: "type", 
    header: ({ column }: { column: Column<Memory, unknown> }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    cell: ({ cell }) => (
      <Badge variant="outline" className="text-xs">
        {cell.getValue<Memory["type"]>()}
      </Badge>
    ),
    meta: {
      label: "Type",
      variant: "multiSelect",
      options: [
        { label: "Narrative", value: "Narrative", icon: Folder },
        { label: "Technical content", value: "Technical content", icon: Folder },
        { label: "Research", value: "Research", icon: Folder },
        { label: "Legal", value: "Legal", icon: Folder },
        { label: "Planning", value: "Planning", icon: Folder },
        { label: "Visual", value: "Visual", icon: Folder },
        { label: "Financial", value: "Financial", icon: Folder },
        { label: "Cover page", value: "Cover page", icon: Folder },
        { label: "Table of contents", value: "Table of contents", icon: Folder },
        { label: "Plain language", value: "Plain language", icon: Folder },
      ],
    },
    enableColumnFilter: true,
    size: 150,
  },
  {
    id: "reviewer",
    accessorKey: "reviewer",
    header: ({ column }: { column: Column<Memory, unknown> }) => (
      <DataTableColumnHeader column={column} title="Reviewer" />
    ),
    cell: ({ cell }) => {
      const reviewer = cell.getValue<Memory["reviewer"]>();
      return (
        <div className="flex items-center gap-1">
          <User className="h-3 w-3 text-muted-foreground" />
          <span className={reviewer === "Unassigned" ? "text-muted-foreground" : ""}>
            {reviewer}
          </span>
        </div>
      );
    },
    meta: {
      label: "Reviewer",
      variant: "multiSelect",
      options: [
        { label: "Eddie Lake", value: "Eddie Lake", icon: User },
        { label: "Jamik Tashpulatov", value: "Jamik Tashpulatov", icon: User },
        { label: "Maya Johnson", value: "Maya Johnson", icon: User },
        { label: "Carlos Rodriguez", value: "Carlos Rodriguez", icon: User },
        { label: "Sarah Chen", value: "Sarah Chen", icon: User },
        { label: "Raj Patel", value: "Raj Patel", icon: User },
        { label: "Leila Ahmadi", value: "Leila Ahmadi", icon: User },
        { label: "Thomas Wilson", value: "Thomas Wilson", icon: User },
        { label: "Sophia Martinez", value: "Sophia Martinez", icon: User },
        { label: "Unassigned", value: "Unassigned", icon: User },
      ],
    },
    enableColumnFilter: true,
    size: 150,
  },
  {
    id: "createdAt",
    accessorKey: "createdAt",
    header: ({ column }: { column: Column<Memory, unknown> }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ cell }) => {
      const date = new Date(cell.getValue<Memory["createdAt"]>());
      return (
        <div className="flex items-center gap-1 text-sm">
          <Calendar className="h-3 w-3 text-muted-foreground" />
          {date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </div>
      );
    },
    meta: {
      label: "Created At",
      variant: "dateRange",
      icon: Calendar,
    },
    enableColumnFilter: true,
    size: 120,
  },
  {
    id: "actions",
    cell: function Cell() {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>Duplicate</DropdownMenuItem>
            <DropdownMenuItem>View Details</DropdownMenuItem>
            <DropdownMenuItem variant="destructive">
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    size: 32,
  },
]; 