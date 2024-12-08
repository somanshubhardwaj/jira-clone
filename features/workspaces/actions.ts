"use server";

import { Query } from "node-appwrite";
import { DATABASE_ID, MEMBERS_ID, WORKSPACES_ID } from "@/config";
import { getMember } from "../members/utils";
import { Workspace } from "./type";
import { createSessionClient } from "@/lib/appwrite";

export const getWorkspaces = async () => {
  try {
    const { databases, account } = await createSessionClient();
    const user = await account.get();
    const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
      Query.equal("userId", user.$id),
    ]);
    if (members.total === 0) {
      return { documents: [], total: 0 };
    }
    const workspaceIds = members.documents.map((member) => member.workspaceId);
    const workspaces = await databases.listDocuments(
      DATABASE_ID,
      WORKSPACES_ID,
      [Query.orderDesc("$createdAt"), Query.contains("$id", workspaceIds)]
    );
    return workspaces;
  } catch (error) {
    return { documents: [], total: 0 };
  }
};
export const getWorkspace = async ({
  workspaceId,
}: {
  workspaceId: string;
}) => {
  try {
    const { databases, account } = await createSessionClient();
    const user = await account.get();
    const members = await getMember({
      databases,
      userId: user.$id,
      workspaceId,
    });
    if (!members) return null;

    const workspace = await databases.getDocument<Workspace>(
      DATABASE_ID,
      WORKSPACES_ID,
      workspaceId
    );
    return workspace;
  } catch (error) {
    return null;
  }
};
export const getWorkspaceInfo = async ({
  workspaceId,
}: {
  workspaceId: string;
}) => {
  try {
    const { databases, account } = await createSessionClient();
    // const user = await account.get();
    // const members = await getMember({
    //   databases,
    //   userId: user.$id,
    //   workspaceId,
    // });
    // if (!members) return null;

    const workspace = await databases.getDocument<Workspace>(
      DATABASE_ID,
      WORKSPACES_ID,
      workspaceId
    );
    return {
      name: workspace.name,
    };
  } catch (error) {
    return null;
  }
};
