import React from "react";
import { getCurrent } from "@/features/auth/actions";
import { redirect } from "next/navigation";
import { getProject } from "@/features/projects/actions";
import WorkSpaceAvatar from "@/components/workspace-avatar";
import { Button } from "@/components/ui/button";
import { PencilIcon } from "lucide-react";
import Link from "next/link";
import TaskViewSwitcher from "@/features/tasks/components/TaskViewSwitcher";
interface props {
  params: Promise<{ projectId: string }>;
}
const page = async (props: props) => {
  const params = await props.params;
  const user = await getCurrent();
  const initialData = await getProject({ projectId: params.projectId });
  if (!user) redirect("/sign-in");
  if (!initialData) redirect("/");
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <WorkSpaceAvatar
            name={initialData?.name}
            image={initialData?.imageUrl}
            className="size-8"
          />
          <p className="text-lg font-bold">{initialData.name}</p>
        </div>
        <div className="flex items-center gap-x-2">
          <Button variant={"secondary"} asChild>
            <Link
              href={`/workspaces/${initialData.workspaceId}/projects/${initialData.$id}/settings`}
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

export default page;
