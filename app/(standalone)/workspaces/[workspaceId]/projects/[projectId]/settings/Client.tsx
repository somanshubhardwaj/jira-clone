"use client";
import { useGetProject } from "@/features/projects/api/use-get-project";
import { EditProjectForm } from "@/features/projects/components/edit-project-form";
import { useProjectId } from "@/features/projects/hooks/useProjectId";
import React from "react";

const Client = () => {
  const projectId = useProjectId();
  const { data: project, isLoading } = useGetProject({ projectId });
  if (isLoading) return <div>Loading...</div>;
  if (!project) return <div>Project not found</div>;
  return <EditProjectForm initialData={project} />;
};

export default Client;
