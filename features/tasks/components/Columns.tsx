"use client";
import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Task, TaskStatus } from "../types";
import { ArrowUpDown, MoreHorizontalIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import MembersAvatar from "@/features/members/components/MembersAvatar";
import TAskDate from "./TAskDate";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import TastActions from "./TastActions";
const columns: ColumnDef<Task>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Task Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <div className="line-clamp-1">{row.original.name}</div>;
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Badge variant={status}>
          {status === TaskStatus.INPROGRESS
            ? "In Progress"
            : status === TaskStatus.INREVIEW
            ? "In Review"
            : status
                .split("")
                .map((char, index) =>
                  index === 0 || status[index - 1] === "_"
                    ? char.toUpperCase()
                    : char.toLowerCase()
                )
                .join("")
                .replace(/_/g, " ")}
        </Badge>
      );
    },
  },
  {
    accessorKey: "dueDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Due Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const dueDate = new Date(row.original.dueDate);
      return <TAskDate date={dueDate} />;
    },
  },
  {
    accessorKey: "assignee",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Assignee
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="line-clamp-1 flex items-center gap-x-2 text-sm font-medium ">
          <MembersAvatar name={row.original.assignee.name} />
          {row.original.assignee.name}
        </div>
      );
    },
  },
  {
    accessorKey: "project",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Project
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-x-2 text-sm font-medium  line-clamp-1">
          {row.original.project.name}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <TastActions id={row.original.$id} projectId={row.original.projectId}>
          <Button variant="ghost" className="size-8 p-0">
            <MoreHorizontalIcon className="h-4 w-4" />
          </Button>
        </TastActions>
      );
    },
  },
];

export default columns;
