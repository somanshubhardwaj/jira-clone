import { createSessionClient } from "@/lib/appwrite";
import { getMember } from "../members/utils";
import { useWorkspaceId } from "../workspaces/hooks/use-workspace-id";
import { DATABASE_ID, PROJECTS_ID } from "@/config";
import { Projects } from "./type";

export const getProject = async ({ projectId }: { projectId: string }) => {
  try {
    const { databases, account } = await createSessionClient();
    const user = await account.get();
    // const workspaceId = useWorkspaceId();
    const project = await databases.getDocument<Projects>(
      DATABASE_ID,
      PROJECTS_ID,
      projectId
    );
    const members = await getMember({
      databases,
      userId: user.$id,
      workspaceId: project.workspaceId,
    });
    if (!members) return null;

    return project;
  } catch (error) {
    return null;
  }
};
