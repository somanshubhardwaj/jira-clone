"use client";
import { PencilIcon, TrendingUpIcon, TrendingDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import WorkSpaceAvatar from "@/components/workspace-avatar";

import React from "react";
import TaskViewSwitcher from "@/features/tasks/components/TaskViewSwitcher";
import Link from "next/link";
import { useProjectId } from "@/features/projects/hooks/useProjectId";
import { useGetProject } from "@/features/projects/api/use-get-project";
import {
  ProjectAnalyticsResponseType,
  useGetProjectAnalytics,
} from "@/features/projects/api/use-get-project -analytics";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const Client = () => {
  const projectId = useProjectId();
  const { data: project, isLoading } = useGetProject({ projectId });
  const { data: analytics, isLoading: isAnalyticsLoading } =
    useGetProjectAnalytics({ projectId });
  if (isLoading || isAnalyticsLoading) return <div>Loading...</div>;
  if (!project) return <div>Project not found</div>;
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <WorkSpaceAvatar
            name={project.name}
            image={project.imageUrl}
            className="size-8"
          />
          <p className="text-lg font-bold">{project.name}</p>
        </div>
        <div className="flex items-center gap-x-2">
          <Button variant={"secondary"} asChild>
            <Link
              href={`/workspaces/${project.workspaceId}/projects/${project.$id}/settings`}
            >
              <PencilIcon className="size-4 mr-2" />
              Edit Project
            </Link>
          </Button>
        </div>
      </div>
      {analytics && <Analytics data={analytics} />}
      <TaskViewSwitcher hideProjectFilter />
    </div>
  );
};

export default Client;

export const Analytics = ({ data }: ProjectAnalyticsResponseType) => {
  if (!data) return null;
  return (
    <ScrollArea className="border rounded-lg w-full whitespace-nowrap shrink-0">
      <div className="flex flex-row gap-4 w-full">
        <div className="flex items-center flex-1">
          <AnalyticsCard
            title="Total Tasks"
            value={data.taskCount}
            variant={data.taskDifference > 0 ? "up" : "down"}
            increaseValue={data.taskDifference}
          />
          <Separator orientation="vertical" />
        </div>
        <div className="flex items-center flex-1">
          <AnalyticsCard
            title="Assigned Tasks"
            value={data.thisMonthAssignedTaskCount}
            variant={data.assignedTaskDifference > 0 ? "up" : "down"}
            increaseValue={data.assignedTaskDifference}
          />
          <Separator orientation="vertical" />
        </div>

        <div className="flex items-center flex-1">
          <AnalyticsCard
            title="Incomplete Tasks"
            value={data.thisMonthUncompletedTaskCount}
            variant={data.uncompletedTaskDifference > 0 ? "up" : "down"}
            increaseValue={data.uncompletedTaskDifference}
          />
          <Separator orientation="vertical" />
        </div>
        <div className="flex items-center flex-1">
          <AnalyticsCard
            title="Completed Tasks"
            value={data.thisMonthCompletedTaskCount}
            variant={data.completedTaskDifference > 0 ? "up" : "down"}
            increaseValue={data.completedTaskDifference}
          />
          <Separator orientation="vertical" />
        </div>
        <div className="flex items-center flex-1">
          <AnalyticsCard
            title="Overdue Tasks"
            value={data.thisMonthOverdueTaskCount}
            variant={data.overdueTaskDifference > 0 ? "up" : "down"}
            increaseValue={data.overdueTaskDifference}
          />
          {/* <Separator orientation="vertical" /> */}
        </div>
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};

interface AnalyticsCardProps {
  title: string;
  value: number;
  variant: "up" | "down";
  increaseValue: number;
}

const AnalyticsCard = ({
  title,
  value,
  variant,
  increaseValue,
}: AnalyticsCardProps) => {
  return (
    <div className="flex flex-col gap-2 p-4 rounded-lg min-w-[200px] w-full sm:min-w-[200px] md:min-w-[250px] lg:min-w-[300px]">
      <p className="text-sm font-medium text-muted-foreground">{title}</p>
      <div className="flex items-center gap-2">
        <p className="text-2xl font-bold">{value}</p>
        <div
          className={`flex items-center ${
            variant === "up" ? "text-green-500" : "text-red-500"
          }`}
        >
          {variant === "up" ? (
            <TrendingUpIcon className="size-4" />
          ) : (
            <TrendingDownIcon className="size-4" />
          )}
          <span className="text-sm font-medium">{Math.abs(increaseValue)}</span>
        </div>
      </div>
    </div>
  );
};
