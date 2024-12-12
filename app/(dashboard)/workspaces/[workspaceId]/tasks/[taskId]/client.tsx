"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import WorkSpaceAvatar from "@/components/workspace-avatar";
import MembersAvatar from "@/features/members/components/MembersAvatar";
import { useDeleteTask } from "@/features/tasks/api/usedeletetask";
import { useGetTask } from "@/features/tasks/api/use-get-task-with-id";
import TAskDate from "@/features/tasks/components/TAskDate";
import { useTaskId } from "@/features/tasks/hooks/use-task-is";
import { Task, TaskStatus } from "@/features/tasks/types";
import { Projects } from "@/features/projects/type";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useConfirm } from "@/hooks/use-confirm";
import { ChevronRightIcon, PencilIcon, TrashIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUpdateTaskModal } from "@/features/tasks/hooks/use-update-task-modal";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateTask } from "@/features/tasks/api/useupdatetask";
import { useState } from "react";

export default function TaskIdClient() {
  const taskId = useTaskId();
  const { data: task, isLoading } = useGetTask({ taskId });
  if (isLoading) return <div>Loading...</div>;
  if (!task) return <div>Task not found</div>;
  return (
    <div className="flex flex-col gap-4">
      <TaskBreadcrumb task={task} project={task.project} />
      <Separator className="my-4" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TaskOverview task={task} />
        <TaskDescription task={task} />
      </div>
    </div>
  );
}

const TaskBreadcrumb = ({
  task,
  project,
}: {
  task: Task;
  project: Projects;
}) => {
  const router = useRouter();
  const { mutate: deleteTask, isPending: isDeletingTask } = useDeleteTask();
  const [ConfirmDialog, confirmAction] = useConfirm(
    "Are you sure you want to delete this task?",
    "This action cannot be undone.",
    "destructive"
  );
  const workspaceId = useWorkspaceId();
  const handleDeleteTask = async () => {
    const ok = await confirmAction();
    if (ok) {
      deleteTask(
        { param: { taskId: task.$id } },
        {
          onSuccess: () => {
            router.push(`/workspaces/${workspaceId}/tasks`);
          },
        }
      );
    }
  };
  return (
    <div className="flex items-center gap-x-2">
      <ConfirmDialog />

      <WorkSpaceAvatar name={project.name} image={project.image} />
      <Link
        href={`/workspaces/${workspaceId}/projects/${project.$id}`}
        className="text-sm lg:text-lg font-semibold text-muted-foreground hover:opacity-75 transition-all"
      >
        {project.name}
      </Link>
      <ChevronRightIcon className="w-4 h-4 text-muted-foreground" />
      <span className="text-sm lg:text-lg font-semibold ">{task.name}</span>
      <Button
        variant={"destructive"}
        size={"sm"}
        className="ml-auto"
        onClick={handleDeleteTask}
        disabled={isDeletingTask}
      >
        <TrashIcon className="w-4 h-4 lg:mr-2" />
        <span className="hidden lg:block">Delete</span>
      </Button>
    </div>
  );
};

const TaskOverview = ({ task }: { task: Task }) => {
  const { open } = useUpdateTaskModal();
  return (
    <div className="flex flex-col gap-y-4 col-span-1">
      <div className="bg-muted rounded-lg p-4 ">
        <div className="flex items-center">
          <h2 className="text-lg font-semibold">Task Overview</h2>
          <Button
            variant={"outline"}
            size={"sm"}
            className="ml-auto"
            onClick={() => open(task.$id)}
          >
            <PencilIcon className="w-4 h-4 lg:mr-2" />
            <span className="hidden lg:block">Edit</span>
          </Button>
        </div>
        <Separator className="my-4" />
        <div className="flex flex-col gap-y-2">
          <OverviewProperty label="Assignee">
            <MembersAvatar name={task.assignee.name} className="size-6" />
            <p className="text-sm text-muted-foreground">
              {task.assignee.name}
            </p>
          </OverviewProperty>
          <OverviewProperty label="Due Date">
            {task.dueDate ? (
              <TAskDate
                date={new Date(task.dueDate)}
                className="text-sm font-medium"
              />
            ) : (
              <div className="text-xs text-muted-foreground">No due date</div>
            )}
          </OverviewProperty>
          <OverviewProperty label="Status">
            <Badge variant={task.status}>
              {task.status === TaskStatus.INPROGRESS
                ? "In Progress"
                : task.status === TaskStatus.INREVIEW
                ? "In Review"
                : task.status
                    .split("")
                    .map((char, index) =>
                      index === 0 || task.status[index - 1] === "_"
                        ? char.toUpperCase()
                        : char.toLowerCase()
                    )
                    .join("")
                    .replace(/_/g, " ")}
            </Badge>
          </OverviewProperty>
        </div>
      </div>
    </div>
  );
};

const OverviewProperty = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="flex items-start gap-x-2">
      <div className="min-w-[100px]">
        <p className="text-sm font-semibold text-muted-foreground">{label}</p>
      </div>
      <div className="flex items-center gap-x-2">{children}</div>
    </div>
  );
};

const TaskDescription = ({ task }: { task: Task }) => {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(task.description);
  const { mutate: updateTask, isPending: isUpdatingTask } = useUpdateTask();

  const handleSave = () => {
    updateTask({ param: { taskId: task.$id }, json: { description: value } });
    setEditing(false);
  };
  return (
    <div className="flex flex-col gap-y-4 col-span-1 p-4 rounded-lg border">
      <div className="flex items-center justify-between">
        <p className="text-lg font-semibold">Overview</p>
        <Button
          variant={"outline"}
          size={"sm"}
          className="ml-auto"
          onClick={() => setEditing((prev) => !prev)}
        >
          {editing ? (
            <XIcon className="w-4 h-4 lg:mr-2" />
          ) : (
            <PencilIcon className="w-4 h-4 lg:mr-2" />
          )}
          <span className="hidden lg:block">{editing ? "Cancel" : "Edit"}</span>
        </Button>
      </div>
      <Separator className="my-4" />
      <div className="flex flex-col gap-y-4">
        {editing ? (
          <div className="flex flex-col gap-y-4">
            <Textarea
              value={value || ""}
              onChange={(e) => setValue(e.target.value)}
              className="min-h-[100px]"
              rows={5}
              disabled={isUpdatingTask}
              placeholder="Enter your description here..."
            />
            <Button
              onClick={handleSave}
              disabled={isUpdatingTask}
              className="ml-auto"
            >
              Save
            </Button>
          </div>
        ) : (
          <div className="flex items-start text-justify gap-y-2 flex-col">
            {value || (
              <span className="text-sm text-muted-foreground">
                No description
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
