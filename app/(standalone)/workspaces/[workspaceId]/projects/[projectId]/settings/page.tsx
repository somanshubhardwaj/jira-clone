import { getCurrent } from "@/features/auth/actions";
import { getProject } from "@/features/projects/actions";
import { EditProjectForm } from "@/features/projects/components/edit-project-form";
import { redirect } from "next/navigation";
import React from "react";

interface ProjectSettingProps {
  params: Promise<{
    projectId: string;
  }>;
}
const ProjectSetting = async (props: ProjectSettingProps) => {
  const params = await props.params;
  const user = await getCurrent();
  if (!user) redirect("/sign-in");
  const initialData = await getProject({ projectId: params.projectId });
  if (!initialData) redirect(`/`);
  return (
    <div className="w-full lg:max-w-lg mx-auto">
      <EditProjectForm initialData={initialData} />
    </div>
  );
};

export default ProjectSetting;
