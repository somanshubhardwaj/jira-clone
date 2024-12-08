import { getCurrent } from "@/features/auth/actions";
import { getWorkspace } from "@/features/workspaces/actions";
import { EditWorkspaceForm } from "@/features/workspaces/components/edit-worspace-form";
import { redirect } from "next/navigation";
import React from "react";
interface SettingsProps {
  params: {
    workspaceId: string;
  };
}
const Settings = async ({ params }: SettingsProps) => {
  const user = await getCurrent();
  if (!user) redirect("/sign-in");
  const initialData = await getWorkspace({ workspaceId: params.workspaceId });
  if (!initialData) redirect(`/workspaces/${params.workspaceId}`);
  return (
    <div className="w-full max-w-screen-xl mx-auto">
      <EditWorkspaceForm initialData={initialData} />
    </div>
  );
};

export default Settings;
