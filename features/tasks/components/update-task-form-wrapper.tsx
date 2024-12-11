import { Card, CardContent } from "@/components/ui/card";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { Loader } from "lucide-react";
import React from "react";
import { CreateTaskForm } from "./create-task-form";
import { useGetTask } from "../api/use-get-task-with-id";
import { UpdateTaskForm } from "./update-task-form";
interface EditTaskFormWrapperProps {
  onCancel: () => void;
  taskId: string;
}

const EditTaskFormWrapper = ({
  onCancel,
  taskId,
}: EditTaskFormWrapperProps) => {
  const workspaceId = useWorkspaceId();

  const { data: projects, isLoading: isLoadingProjects } = useGetProjects({
    workspaceId,
  });
  const { data: members, isLoading: isLoadingMembers } = useGetMembers({
    workspaceId,
  });

  const { data: initialTask, isLoading: isLoadingTask } = useGetTask({
    taskId,
  });

  const projectsOptions = projects?.documents.map((project) => ({
    id: project.$id,
    name: project.name,
    imageUrl: project.imageUrl,
  }));
  const membersOptions = members?.documents.map((member) => ({
    id: member.$id,
    name: member.name,
  }));

  const isLoading = isLoadingProjects || isLoadingMembers || isLoadingTask;

  if (isLoading) {
    return (
      <Card className="min-h-[25vh]">
        <CardContent className="flex justify-center items-center h-full w-full">
          <Loader className="size-4 animate-spin" />
        </CardContent>
      </Card>
    );
  }
  if (!initialTask) {
    return <div>Task not found</div>;
  }

  return (
    <div>
      <UpdateTaskForm
        onCancel={onCancel}
        projectOptions={projectsOptions || []}
        memberOptions={membersOptions || []}
        initialTask={initialTask}
      />
    </div>
  );
};

export default EditTaskFormWrapper;
