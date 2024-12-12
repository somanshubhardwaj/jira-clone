"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import WorkSpaceAvatar from "@/components/workspace-avatar";
import { useGetMembers } from "@/features/members/api/use-get-members";
import MembersAvatar from "@/features/members/components/MembersAvatar";
import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { useCreateProjectModal } from "@/features/projects/hooks/use-create-project-modal";
import { Projects } from "@/features/projects/type";
import { useGetTask } from "@/features/tasks/api/use-get-task";
import { useCreateTaskModal } from "@/features/tasks/hooks/use-create-project-modal";
import { Task, TaskStatus } from "@/features/tasks/types";
import { useGetWorkspaceAnalytics } from "@/features/workspaces/api/use-get-workspace-analytics";
import { useGetWorkspace } from "@/features/workspaces/api/use-get-worspace";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import Link from "next/link";
import React from "react";

const Client = () => {
  const workspaceId = useWorkspaceId();
  const { data: workspace, isLoading: isWorkspaceLoading } = useGetWorkspace({
    workspaceId,
  });
  const { data, isLoading } = useGetWorkspaceAnalytics({
    workspaceId,
  });
  const { data: tasks, isLoading: isTasksLoading } = useGetTask({
    workspaceId,
  });
  const { data: projects, isLoading: isProjectsLoading } = useGetProjects({
    workspaceId,
  });
  const { data: members, isLoading: isMembersLoading } = useGetMembers({
    workspaceId,
  });

  if (
    isLoading ||
    isWorkspaceLoading ||
    isTasksLoading ||
    isProjectsLoading ||
    isMembersLoading
  ) {
    return <div>Loading...</div>;
  }

  if (!data || !workspace || !tasks || !projects || !members) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <WorkSpaceAvatar name={workspace.name} image={workspace.imageUrl} />
          <div>
            <h1 className="text-xl font-bold">{workspace.name}</h1>
            <p className="text-sm text-muted-foreground">
              {members?.total || 0} members · {projects?.total || 0} projects ·{" "}
              {tasks?.total || 0} tasks
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* <Button
            onClick={openCreateProjectModal}
            variant="outline"
            size={"sm"}
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Project
          </Button> */}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border p-3">
          <div className="text-sm font-medium text-muted-foreground">
            Total Tasks
          </div>
          <div className="text-2xl font-bold">{data.taskCount}</div>
          <div className="text-sm text-muted-foreground">
            {data.taskDifference >= 0 ? "+" : ""}
            {data.taskDifference} from last month
          </div>
        </div>

        <div className="rounded-lg border p-3">
          <div className="text-sm font-medium text-muted-foreground">
            Assigned Tasks
          </div>
          <div className="text-2xl font-bold">
            {data.thisMonthAssignedTaskCount}
          </div>
          <div className="text-sm text-muted-foreground">
            {data.assignedTaskDifference >= 0 ? "+" : ""}
            {data.assignedTaskDifference} from last month
          </div>
        </div>

        <div className="rounded-lg border p-3">
          <div className="text-sm font-medium text-muted-foreground">
            Completed Tasks
          </div>
          <div className="text-2xl font-bold">
            {data.thisMonthCompletedTaskCount}
          </div>
          <div className="text-sm text-muted-foreground">
            {data.completedTaskDifference >= 0 ? "+" : ""}
            {data.completedTaskDifference} from last month
          </div>
        </div>

        <div className="rounded-lg border p-3">
          <div className="text-sm font-medium text-muted-foreground">
            Overdue Tasks
          </div>
          <div className="text-2xl font-bold">
            {data.thisMonthOverdueTaskCount}
          </div>
          <div className="text-sm text-muted-foreground">
            {data.overdueTaskDifference >= 0 ? "+" : ""}
            {data.overdueTaskDifference} from last month
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 ">
        <TaskList
          data={tasks.documents}
          total={tasks.total}
          workspaceId={workspaceId}
        />
        <ProjectList
          data={projects.documents as Projects[]}
          total={projects.total}
          workspaceId={workspaceId}
        />
        <MembersList data={members.documents} total={members.total} />
      </div>
    </div>
  );
};

export default Client;
//eslint-disable-next-line @typescript-eslint/no-explicit-any
const TaskList = ({
  data,
  total,
  workspaceId,
}: {
  data: any;
  total: number;
  workspaceId: string;
}) => {
  const { open: openCreateTaskModal } = useCreateTaskModal();
  return (
    <div className="rounded-lg border">
      <div className="flex items-center justify-between border-b p-4">
        <div className="flex items-center justify-between w-full">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold">Tasks</h2>
            <p className="text-sm text-muted-foreground">Total {total} tasks</p>
          </div>
          <Button variant="teritary" size={"sm"} onClick={openCreateTaskModal}>
            <Plus className="h-4 w-4 " />
            Create Task
          </Button>
        </div>
      </div>
      <div className="divide-y">
        {data.map((task: Task) => (
          <Link
            href={`/workspaces/${workspaceId}/tasks/${task.$id}`}
            key={task.$id}
            className="flex items-center gap-4 p-4"
          >
            <div className="flex-1 space-y-1">
              <p className="font-medium leading-none">{task.name}</p>
              {/* <p className="text-sm text-muted-foreground">
                Due {new Date(task.dueDate).toLocaleDateString()}
              </p> */}
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={task.status as TaskStatus}>
                {task.status === TaskStatus.INPROGRESS
                  ? "In Progress"
                  : task.status === TaskStatus.INREVIEW
                  ? "In Review"
                  : task.status
                      .split("")
                      .map((char: string, index: number) =>
                        index === 0 || status[index - 1] === "_"
                          ? char.toUpperCase()
                          : char.toLowerCase()
                      )
                      .join("")
                      .replace(/_/g, " ")}
              </Badge>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

//eslint-disable-next-line @typescript-eslint/no-explicit-any
const ProjectList = ({
  data,
  total,
  workspaceId,
}: {
  data: Projects[];
  total: number;
  workspaceId: string;
}) => {
  const { open: openCreateProjectModal } = useCreateProjectModal();
  return (
    <div className="rounded-lg border">
      <div className="flex items-center justify-between border-b p-4">
        <div className="flex items-center justify-between w-full">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold">Projects</h2>
            <p className="text-sm text-muted-foreground">
              Total {total} projects
            </p>
          </div>
          <Button
            variant="teritary"
            size={"sm"}
            onClick={openCreateProjectModal}
          >
            <Plus className="h-4 w-4" />
            Create Project
          </Button>
        </div>
      </div>
      <div className="divide-y">
        {data.map((project: Projects) => (
          <div
            key={project.$id}
            className="hover:bg-accent/50 transition-colors"
          >
            <Link
              href={`/workspaces/${workspaceId}/projects/${project.$id}`}
              key={project.$id}
              className="block p-4"
            >
              <div className={cn("flex items-center gap-3 rounded-md")}>
                <WorkSpaceAvatar
                  image={project.imageUrl}
                  name={project.name}
                  className="size-8 text-sm"
                  fallbackClassName="text-sm"
                />
                <div className="flex flex-col">
                  <span className="font-medium">{project.name}</span>
                  <span className="text-sm text-muted-foreground">
                    Last updated{" "}
                    {new Date(project.$updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};
//eslint-disable-next-line @typescript-eslint/no-explicit-any
const MembersList = ({ data, total }: { data: any; total: number }) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold">Members</h2>
          <p className="text-sm text-muted-foreground">Total {total} members</p>
        </div>
      </div>
      <div className="divide-y">
        {data.map((member: { $id: string; name: string; email: string }) => (
          <div
            key={member.$id}
            className="flex items-center gap-3 p-4 hover:bg-accent/50 transition-colors"
          >
            <MembersAvatar
              name={member.name}
              className="size-8"
              fallbackClassName="text-sm"
            />
            <div className="flex flex-col">
              <span className="font-medium">{member.name}</span>
              <span className="text-sm text-muted-foreground">
                {member.email}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
