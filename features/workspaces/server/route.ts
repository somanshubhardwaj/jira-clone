import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { updateWorkspaceSchema, WorkspaceSchema } from "../schema";
import { sessionMiddleware } from "@/lib/session-middleware";
import {
  DATABASE_ID,
  IMAGES_BUCKET_ID,
  MEMBERS_ID,
  TASKS_ID,
  WORKSPACES_ID,
} from "@/config";
import { ID, Query } from "node-appwrite";
import { memberRole } from "@/features/members/type";
import { generateInviteCode } from "@/lib/utils";
import { getMember } from "@/features/members/utils";
import { z } from "zod";
import { Workspace } from "../type";
import { endOfMonth, subMonths } from "date-fns";
import { startOfMonth } from "date-fns";
import { TaskStatus } from "@/features/tasks/types";

const app = new Hono()
  .get("/", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const user = c.get("user");
    const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
      Query.equal("userId", user.$id),
    ]);
    if (members.total === 0) {
      return c.json({ data: { documents: [], total: 0 } });
    }
    const workspaceIds = members.documents.map((member) => member.workspaceId);
    const workspaces = await databases.listDocuments(
      DATABASE_ID,
      WORKSPACES_ID,
      [Query.orderDesc("$createdAt"), Query.contains("$id", workspaceIds)]
    );

    return c.json({ data: workspaces });
  })
  .get("/:workspaceId", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const user = c.get("user");
    const { workspaceId } = c.req.param();
    const member = await getMember({
      databases,
      userId: user.$id,
      workspaceId,
    });
    if (!member) {
      return c.json({ error: "You are not a member of this workspace" }, 401);
    }
    const workspace = await databases.getDocument<Workspace>(
      DATABASE_ID,
      WORKSPACES_ID,
      workspaceId
    );
    return c.json({ data: workspace });
  })
  .get("/:workspaceId/info", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const { workspaceId } = c.req.param();
    const workspace = await databases.getDocument<Workspace>(
      DATABASE_ID,
      WORKSPACES_ID,
      workspaceId
    );
    return c.json({
      data: {
        $id: workspace.$id,
        name: workspace.name,
        imageUrl: workspace.imageUrl,
      },
    });
  })
  .post(
    "/",
    zValidator("form", WorkspaceSchema),
    sessionMiddleware,
    async (c) => {
      const databases = c.get("databases");
      const storage = c.get("storage");
      const user = c.get("user");
      const { name, image } = c.req.valid("form");
      let uploadedImageUrl: string | undefined;
      if (image instanceof File) {
        const file = await storage.createFile(
          IMAGES_BUCKET_ID,
          ID.unique(),
          image
        );

        const arrayBuffer = await storage.getFilePreview(
          IMAGES_BUCKET_ID,
          file.$id
        );
        uploadedImageUrl = `data:image/png;base64,${Buffer.from(
          arrayBuffer
        ).toString("base64")}`;
      }
      const workspace = await databases.createDocument(
        DATABASE_ID,
        WORKSPACES_ID,
        ID.unique(),
        {
          name,
          userId: user.$id,
          imageUrl: uploadedImageUrl,
          inviteCode: generateInviteCode(6),
        }
      );
      await databases.createDocument(DATABASE_ID, MEMBERS_ID, ID.unique(), {
        userId: user.$id,
        workspaceId: workspace.$id,
        role: memberRole.ADMIN,
      });

      return c.json({ data: workspace });
    }
  )
  .patch(
    "/:workspaceId",
    sessionMiddleware,
    zValidator("form", updateWorkspaceSchema),
    async (c) => {
      const databases = c.get("databases");
      const storage = c.get("storage");
      const user = c.get("user");
      const { name, image } = c.req.valid("form");
      const workspaceId = c.req.param("workspaceId");
      const workspace = await databases.getDocument(
        DATABASE_ID,
        WORKSPACES_ID,
        workspaceId
      );
      const member = await getMember({
        databases,
        userId: user.$id,
        workspaceId,
      });
      if (!member || member.role !== memberRole.ADMIN) {
        return c.json(
          {
            error: "You are not allowed to update this workspace",
          },
          401
        );
      }
      let uploadedImageUrl: string | undefined;
      if (image instanceof File) {
        const file = await storage.createFile(
          IMAGES_BUCKET_ID,
          ID.unique(),
          image
        );

        const arrayBuffer = await storage.getFilePreview(
          IMAGES_BUCKET_ID,
          file.$id
        );
        uploadedImageUrl = `data:image/png;base64,${Buffer.from(
          arrayBuffer
        ).toString("base64")}`;
      } else {
        uploadedImageUrl = image;
      }
      const updatedWorkspace = await databases.updateDocument(
        DATABASE_ID,
        WORKSPACES_ID,
        workspaceId,
        {
          name,
          imageUrl: uploadedImageUrl,
        }
      );

      return c.json({ data: updatedWorkspace });
    }
  )
  .delete("/:workspaceId", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const user = c.get("user");
    const workspaceId = c.req.param("workspaceId");
    const member = await getMember({
      databases,
      userId: user.$id,
      workspaceId,
    });
    if (!member || member.role !== memberRole.ADMIN) {
      return c.json(
        {
          error: "You are not allowed to delete this workspace",
        },
        401
      );
    }
    await databases.deleteDocument(DATABASE_ID, WORKSPACES_ID, workspaceId);
    return c.json({ data: { $id: workspaceId } });
  })
  .post("/:workspaceId/reset-invite-code", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const user = c.get("user");
    const workspaceId = c.req.param("workspaceId");
    const member = await getMember({
      databases,
      userId: user.$id,
      workspaceId,
    });
    if (!member || member.role !== memberRole.ADMIN) {
      return c.json(
        {
          error: "You are not allowed to delete this workspace",
        },
        401
      );
    }
    const workspace = await databases.updateDocument(
      DATABASE_ID,
      WORKSPACES_ID,
      workspaceId,
      {
        inviteCode: generateInviteCode(6),
      }
    );
    return c.json({ data: workspace });
  })
  .post(
    "/:workspaceId/join",
    sessionMiddleware,
    zValidator("json", z.object({ code: z.string() })),
    async (c) => {
      const { workspaceId } = c.req.param();
      const { code } = c.req.valid("json");

      const databases = c.get("databases");
      const user = c.get("user");
      const member = await getMember({
        databases,
        userId: user.$id,
        workspaceId,
      });
      if (member) {
        return c.json(
          {
            error: "You are already a member of this workspace",
          },
          400
        );
      }
      const workspace = await databases.getDocument<Workspace>(
        DATABASE_ID,
        WORKSPACES_ID,
        workspaceId
      );
      if (workspace.inviteCode !== code) {
        return c.json(
          {
            error: "Invalid invite code",
          },
          400
        );
      }
      await databases.createDocument(DATABASE_ID, MEMBERS_ID, ID.unique(), {
        userId: user.$id,
        workspaceId,
        role: memberRole.MEMBER,
      });
      return c.json({ data: workspace });
    }
  )
  .get("/:workspaceId/analytics", sessionMiddleware, async (c) => {
    const { workspaceId } = c.req.param();
    const databases = c.get("databases");
    const user = c.get("user");
   
    const member = await getMember({
      databases,
      userId: user.$id,
      workspaceId
    });
    if (!member) {
      return c.json({ error: "You are not allowed to view this project" }, 401);
    }
    const now = new Date();
    const startOfThisMonth = startOfMonth(now);
    const endOfThisMonth = endOfMonth(now);
    const startOfLastMonth = startOfMonth(subMonths(now, 1));
    const endOfLastMonth = endOfMonth(subMonths(now, 1));

    const thisMonthTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("workspaceId", workspaceId),
        Query.greaterThanEqual("$createdAt", startOfThisMonth.toISOString()),
        Query.lessThanEqual("$createdAt", endOfThisMonth.toISOString()),
      ]
    );
    const lastMonthTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
          Query.equal("workspaceId", workspaceId),
        Query.greaterThanEqual("$createdAt", startOfLastMonth.toISOString()),
        Query.lessThanEqual("$createdAt", endOfLastMonth.toISOString()),
      ]
    );
    const taskCount = thisMonthTasks.total;
    const lastMonthTaskCount = lastMonthTasks.total;
    const taskDifference = taskCount - lastMonthTaskCount;
    const thisMonthAssignedTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("workspaceId", workspaceId),
        Query.equal("assigneeId", user.$id),
        Query.greaterThanEqual("$createdAt", startOfThisMonth.toISOString()),
        Query.lessThanEqual("$createdAt", endOfThisMonth.toISOString()),
      ]
    );
    const lastMonthAssignedTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("workspaceId", workspaceId),
        Query.equal("assigneeId", user.$id),
        Query.greaterThanEqual("$createdAt", startOfLastMonth.toISOString()),
        Query.lessThanEqual("$createdAt", endOfLastMonth.toISOString()),
      ]
    );
    const thisMonthAssignedTaskCount = thisMonthAssignedTasks.total;
    const lastMonthAssignedTaskCount = lastMonthAssignedTasks.total;
    const assignedTaskDifference =
      thisMonthAssignedTaskCount - lastMonthAssignedTaskCount;

    const thisMonthUncompletedTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("workspaceId", workspaceId),
        Query.notEqual("status", TaskStatus.DONE),
        Query.greaterThanEqual("$createdAt", startOfThisMonth.toISOString()),
        Query.lessThanEqual("$createdAt", endOfThisMonth.toISOString()),
      ]
    );
    const lastMonthUncompletedTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("workspaceId", workspaceId),
        Query.notEqual("status", TaskStatus.DONE),
        Query.greaterThanEqual("$createdAt", startOfLastMonth.toISOString()),
        Query.lessThanEqual("$createdAt", endOfLastMonth.toISOString()),
      ]
    );
    const thisMonthUncompletedTaskCount = thisMonthUncompletedTasks.total;
    const lastMonthUncompletedTaskCount = lastMonthUncompletedTasks.total;
    const uncompletedTaskDifference =
      thisMonthUncompletedTaskCount - lastMonthUncompletedTaskCount;

    const thisMonthCompletedTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("workspaceId", workspaceId),
        Query.equal("status", TaskStatus.DONE),
        Query.greaterThanEqual("$createdAt", startOfThisMonth.toISOString()),
        Query.lessThanEqual("$createdAt", endOfThisMonth.toISOString()),
      ]
    );
    const lastMonthCompletedTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("workspaceId", workspaceId),
        Query.equal("status", TaskStatus.DONE),
        Query.greaterThanEqual("$createdAt", startOfLastMonth.toISOString()),
        Query.lessThanEqual("$createdAt", endOfLastMonth.toISOString()),
      ]
    );
    const thisMonthCompletedTaskCount = thisMonthCompletedTasks.total;
    const lastMonthCompletedTaskCount = lastMonthCompletedTasks.total;
    const completedTaskDifference =
      thisMonthCompletedTaskCount - lastMonthCompletedTaskCount;

    const thisMonthOverdueTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("workspaceId", workspaceId),
        Query.notEqual("status", TaskStatus.DONE),
        Query.lessThan("dueDate", now.toISOString()),
        Query.greaterThanEqual("$createdAt", startOfThisMonth.toISOString()),
        Query.lessThanEqual("$createdAt", endOfThisMonth.toISOString()),
      ]
    );
    const lastMonthOverdueTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("workspaceId", workspaceId),
        Query.notEqual("status", TaskStatus.DONE),
        Query.lessThan("dueDate", now.toISOString()),
        Query.greaterThanEqual("$createdAt", startOfLastMonth.toISOString()),
        Query.lessThanEqual("$createdAt", endOfLastMonth.toISOString()),
      ]
    );
    const thisMonthOverdueTaskCount = thisMonthOverdueTasks.total;
    const lastMonthOverdueTaskCount = lastMonthOverdueTasks.total;
    const overdueTaskDifference =
      thisMonthOverdueTaskCount - lastMonthOverdueTaskCount;

    return c.json({
      data: {
        taskCount,
        taskDifference,
        thisMonthAssignedTaskCount,
        lastMonthAssignedTaskCount,
        assignedTaskDifference,
        thisMonthUncompletedTaskCount,
        lastMonthUncompletedTaskCount,
        uncompletedTaskDifference,
        thisMonthCompletedTaskCount,
        lastMonthCompletedTaskCount,
        completedTaskDifference,
        thisMonthOverdueTaskCount,
        lastMonthOverdueTaskCount,
        overdueTaskDifference,
      },
    });
  });;

export default app;
