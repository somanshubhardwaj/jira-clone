"use client";

import { useGetWorkspace } from "@/features/workspaces/api/use-get-worspace";
import { EditWorkspaceForm } from "@/features/workspaces/components/edit-worspace-form";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

export default function Client() {
  const workspaceId = useWorkspaceId();
  const { data: workspace } = useGetWorkspace({ workspaceId });
  if (!workspace) return null;
  return (
    <div className="w-full max-w-2xl mx-auto">
      <EditWorkspaceForm initialData={workspace} />
    </div>
  );
}
