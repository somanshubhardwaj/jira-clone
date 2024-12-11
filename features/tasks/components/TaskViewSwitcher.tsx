"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Columns, Loader2, PlusIcon } from "lucide-react";
import React, { useCallback } from "react";
import { useCreateTaskModal } from "../hooks/use-create-project-modal";
import { useGetTask } from "../api/use-get-task";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useQueryState } from "nuqs";
import DataFilters from "./data-filter";
import { useTaskFilter } from "../hooks/use-task-filter";
import { DataTable } from "./data-table";
import columns from "./Columns";
import DataKanban from "./data-kanban";
import { Task, TaskStatus } from "../types";
import { useBulkUpdateTask } from "../api/usebulkupdate";
interface TaskViewSwitcherProps {
  hideProjectFilter?: boolean;
}
const TaskViewSwitcher = ({ hideProjectFilter }: TaskViewSwitcherProps) => {
  const [{ status, projectId, assigneeId, dueDate, search }] = useTaskFilter();
  const [view, setView] = useQueryState("task-view", {
    defaultValue: "table",
  });
  const workspaceId = useWorkspaceId();
  const { data: tasks, isLoading: isLoadingTasks } = useGetTask({
    workspaceId,
    status,
    projectId,
    assigneeId,
    dueDate,
    search,
  });
  const { open } = useCreateTaskModal();
  const { mutate: bulkUpdateTask } = useBulkUpdateTask();
  const handleKanbanChange = useCallback(
    (tasks: { $id: string; status: TaskStatus; position: number }[]) => {
      bulkUpdateTask({
        json: {
          tasks,
        },
      });
    },
    [bulkUpdateTask]
  );
  return (
    <Tabs
      className="flex-1 w-full rounded-lg border "
      defaultValue={view}
      onValueChange={setView}
    >
      <div className="h-full flex flex-col overflow-auto p-4">
        <div className="flex items-center justify-between flex-col gap-y-2 lg:flex-row ">
          <TabsList className="w-full lg:w-auto">
            <TabsTrigger value="table" className="h-8 w-full lg:w-auto">
              Table
            </TabsTrigger>
            <TabsTrigger value="kanban" className="h-8 w-full lg:w-auto">
              Kanban
            </TabsTrigger>
            <TabsTrigger value="calendar" className="h-8 w-full lg:w-auto">
              Calendar
            </TabsTrigger>
          </TabsList>
          <Button size={"sm"} className="w-full lg:w-auto" onClick={open}>
            <PlusIcon className="w-4 h-4" />
            New Task
          </Button>
        </div>
        <Separator className="my-4" />
        <DataFilters hideProjectFilter={hideProjectFilter} />
        <Separator className="my-4" />
        {isLoadingTasks ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-4 h-4 animate-spin" />
          </div>
        ) : (
          <>
            <TabsContent value="table" className="mt-0">
              <DataTable columns={columns} data={tasks?.documents ?? []} />
            </TabsContent>
            <TabsContent value="kanban" className="mt-0">
              <DataKanban
                data={tasks?.documents ?? []}
                onChange={handleKanbanChange}
              />
            </TabsContent>
            <TabsContent value="calendar" className="mt-0">
              <div className="h-full w-full flex justify-center items-center text-muted-foreground text-center">
                Coming Soon
              </div>
            </TabsContent>
          </>
        )}
      </div>
    </Tabs>
  );
};

export default TaskViewSwitcher;
