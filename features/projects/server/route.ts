import { DATABASE_ID, IMAGES_BUCKET_ID, PROJECTS_ID } from "@/config";
import { getMember } from "@/features/members/utils";
import { sessionMiddleware } from "@/lib/session-middleware";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { ID, Query } from "node-appwrite";
import { z } from "zod";
import { ProjectSchema, updateProjectSchema } from "../schema";
import { memberRole } from "@/features/members/type";
import { Projects } from "../type";

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
  });
export default app;
