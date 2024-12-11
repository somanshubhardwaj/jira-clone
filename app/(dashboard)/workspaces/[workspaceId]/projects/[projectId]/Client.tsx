"use client";
import { PencilIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import WorkSpaceAvatar from "@/components/workspace-avatar";

import React from "react";
import TaskViewSwitcher from "@/features/tasks/components/TaskViewSwitcher";
import Link from "next/link";
import { useProjectId } from "@/features/projects/hooks/useProjectId";
import { useGetProject } from "@/features/projects/api/use-get-project";

const Client = () => {
  const projectId = useProjectId();
  const { data: project, isLoading } = useGetProject({ projectId });
  if (isLoading) return <div>Loading...</div>;
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
      <TaskViewSwitcher hideProjectFilter />
    </div>
  );
};

export default Client;
