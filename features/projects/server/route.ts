import { DATABASE_ID, IMAGES_BUCKET_ID, PROJECTS_ID, TASKS_ID } from "@/config";
import { getMember } from "@/features/members/utils";
import { sessionMiddleware } from "@/lib/session-middleware";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { ID, Query } from "node-appwrite";
import { z } from "zod";
import { ProjectSchema, updateProjectSchema } from "../schema";
import { memberRole } from "@/features/members/type";
import { Projects } from "../type";
import { endOfMonth, startOfMonth, subMonths } from "date-fns";
import TaskId from "@/app/(dashboard)/workspaces/[workspaceId]/tasks/[taskId]/page";
import { TaskStatus } from "@/features/tasks/types";
const app = new Hono()
  .get(
    "/",
    sessionMiddleware,
    zValidator("query", z.object({ workspaceId: z.string() })),
    async (c) => {
      const user = c.get("user");
      const databases = c.get("databases");
      const { workspaceId } = c.req.valid("query");

      if (!workspaceId)
        return c.json({ error: "Workspace ID is required" }, 400);

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });
      if (!member) {
        return c.json({ error: "Not a member of this workspace" }, 401);
      }
      const projects = await databases.listDocuments(DATABASE_ID, PROJECTS_ID, [
        Query.equal("workspaceId", workspaceId),
        Query.orderDesc("$createdAt"),
      ]);
      return c.json({ data: projects });
    }
  )
  .get(
    "/:projectId",
    sessionMiddleware,
    zValidator("param", z.object({ projectId: z.string() })),
    async (c) => {
      const { projectId } = c.req.param();
      const databases = c.get("databases");
      const user = c.get("user");

      const project = await databases.getDocument<Projects>(
        DATABASE_ID,
        PROJECTS_ID,
        projectId
      );
      const member = await getMember({
        databases,
        userId: user.$id,
        workspaceId: project.workspaceId,
      });
      if (!member) {
        return c.json({ error: "Not a member of this workspace" }, 401);
      }
      return c.json({ data: project });
    }
  )
  .post(
    "/",
    sessionMiddleware,
    zValidator("form", ProjectSchema),
    async (c) => {
      const databases = c.get("databases");
      const storage = c.get("storage");
      const user = c.get("user");
      const { name, image, workspaceId } = c.req.valid("form");

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });
      if (!member) {
        return c.json({ error: "Not a member of this workspace" }, 401);
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
      }
      const project = await databases.createDocument(
        DATABASE_ID,
        PROJECTS_ID,
        ID.unique(),
        {
          name,
          imageUrl: uploadedImageUrl,
          workspaceId,
        }
      );

      return c.json({ data: project });
    }
  )
  .patch(
    "/:projectId",
    sessionMiddleware,
    zValidator("form", updateProjectSchema),
    async (c) => {
      const databases = c.get("databases");
      const storage = c.get("storage");
      const user = c.get("user");
      const { name, image } = c.req.valid("form");
      const projectId = c.req.param("projectId");
      const project = await databases.getDocument<Projects>(
        DATABASE_ID,
        PROJECTS_ID,
        projectId
      );
      const member = await getMember({
        databases,
        userId: user.$id,
        workspaceId: project.workspaceId,
      });
      if (!member) {
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
      const updatedProject = await databases.updateDocument(
        DATABASE_ID,
        PROJECTS_ID,
        projectId,
        {
          name,
          imageUrl: uploadedImageUrl,
        }
      );

      return c.json({ data: updatedProject });
    }
  )
  .delete("/:projectId", sessionMiddleware, async (c) => {
    const { projectId } = c.req.param();
    const databases = c.get("databases");
    const storage = c.get("storage");
    const user = c.get("user");
    const project = await databases.getDocument<Projects>(
      DATABASE_ID,
      PROJECTS_ID,
      projectId
    );
    const member = await getMember({
      databases,
      userId: user.$id,
      workspaceId: project.workspaceId,
    });
    if (!member) {
      return c.json(
        { error: "You are not allowed to delete this project" },
        401
      );
    }
    // await storage.deleteFile(IMAGES_BUCKET_ID, project.imageUrl);
    await databases.deleteDocument(DATABASE_ID, PROJECTS_ID, projectId);
    return c.json({ data: "Project deleted successfully" });
  })
  .get("/:projectId/analytics", sessionMiddleware, async (c) => {
    const { projectId } = c.req.param();
    const databases = c.get("databases");
    const user = c.get("user");
    const project = await databases.getDocument<Projects>(
      DATABASE_ID,
      PROJECTS_ID,
      projectId
    );
    const member = await getMember({
      databases,
      userId: user.$id,
      workspaceId: project.workspaceId,
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
        Query.equal("projectId", projectId),
        Query.greaterThanEqual("$createdAt", startOfThisMonth.toISOString()),
        Query.lessThanEqual("$createdAt", endOfThisMonth.toISOString()),
      ]
    );
    const lastMonthTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("projectId", projectId),
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
        Query.equal("projectId", projectId),
        Query.equal("assigneeId", user.$id),
        Query.greaterThanEqual("$createdAt", startOfThisMonth.toISOString()),
        Query.lessThanEqual("$createdAt", endOfThisMonth.toISOString()),
      ]
    );
    const lastMonthAssignedTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("projectId", projectId),
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
        Query.equal("projectId", projectId),
        Query.notEqual("status", TaskStatus.DONE),
        Query.greaterThanEqual("$createdAt", startOfThisMonth.toISOString()),
        Query.lessThanEqual("$createdAt", endOfThisMonth.toISOString()),
      ]
    );
    const lastMonthUncompletedTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("projectId", projectId),
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
        Query.equal("projectId", projectId),
        Query.equal("status", TaskStatus.DONE),
        Query.greaterThanEqual("$createdAt", startOfThisMonth.toISOString()),
        Query.lessThanEqual("$createdAt", endOfThisMonth.toISOString()),
      ]
    );
    const lastMonthCompletedTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("projectId", projectId),
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
        Query.equal("projectId", projectId),
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
        Query.equal("projectId", projectId),
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
  });
export default app;
