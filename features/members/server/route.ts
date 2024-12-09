import { createAdminClient } from "@/lib/appwrite";
import { sessionMiddleware } from "@/lib/session-middleware";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { getMember } from "../utils";
import { DATABASE_ID, MEMBERS_ID, WORKSPACES_ID } from "@/config";
import { Query } from "node-appwrite";
import { memberRole } from "../type";

const app = new Hono()
  .get(
    "/",
    sessionMiddleware,
    zValidator(
      "query",
      z.object({
        workspaceId: z.string(),
      })
    ),
    async (c) => {
      const { users } = await createAdminClient();
      const { workspaceId } = c.req.valid("query");
      const databases = c.get("databases");
      const user = c.get("user");
      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });
      if (!member) {
        return c.json({ error: "Not a member" }, 401);
      }
      const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
        Query.equal("workspaceId", workspaceId),
      ]);
      const populatedMembers = await Promise.all(
        members.documents.map(async (member) => {
          const user = await users.get(member.userId);
          return {
            ...member,
            name: user.name,
            email: user.email,
          };
        })
      );
      return c.json({ data: { ...members, documents: populatedMembers } });
    }
  )
  .delete("/:memberId", sessionMiddleware, async (c) => {
    const { memberId } = c.req.param();
    const user = c.get("user");
    const databases = c.get("databases");
    const memberToDelete = await databases.getDocument(
      DATABASE_ID,
      MEMBERS_ID,
      memberId
    );
    if (!memberToDelete) {
      return c.json({ error: "Member not found" }, 404);
    }
    const allMembers = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
      Query.equal("workspaceId", memberToDelete.workspaceId),
    ]);
    const member = await getMember({
      databases,
      workspaceId: memberToDelete.workspaceId,
      userId: user.$id,
    });
    if (!member) {
      return c.json({ error: "Not a member" }, 401);
    }
    if (allMembers.documents.length === 1) {
      return c.json({ error: "Cannot delete the last member" }, 400);
    }
    if (memberToDelete.$id !== member.$id && member.role !== memberRole.ADMIN) {
      return c.json({ error: "Not authorized" }, 401);
    }

    await databases.deleteDocument(DATABASE_ID, MEMBERS_ID, memberId);
    return c.json({ data: { $id: memberToDelete.$id } });
  })
  .patch(
    "/:memberId",
    sessionMiddleware,
    zValidator("json", z.object({ role: z.nativeEnum(memberRole) })),
    async (c) => {
      const { memberId } = c.req.param();
      const { role } = c.req.valid("json");
      const user = c.get("user");
      const databases = c.get("databases");
      const memberToUpdate = await databases.getDocument(
        DATABASE_ID,
        MEMBERS_ID,
        memberId
      );
      if (!memberToUpdate) {
        return c.json({ error: "Member not found" }, 404);
      }
      const allMembers = await databases.listDocuments(
        DATABASE_ID,
        MEMBERS_ID,
        [Query.equal("workspaceId", memberToUpdate.workspaceId)]
      );
      const member = await getMember({
        databases,
        workspaceId: memberToUpdate.workspaceId,
        userId: user.$id,
      });
      if (!member) {
        return c.json({ error: "Not a member" }, 401);
      }
      if (member.role !== memberRole.ADMIN) {
        return c.json({ error: "Not authorized" }, 401);
      }
      const isLastAdmin =
        allMembers.documents.filter((m) => m.role === memberRole.ADMIN)
          .length === 1;
      if (isLastAdmin && role !== memberRole.ADMIN) {
        return c.json({ error: "Cannot remove the last admin" }, 400);
      }
      if (memberToUpdate.$id === member.$id && role !== memberRole.ADMIN) {
        return c.json({ error: "Cannot change your own role" }, 400);
      }
      await databases.updateDocument(DATABASE_ID, MEMBERS_ID, memberId, {
        role,
      });
      return c.json({ data: { $id: memberToUpdate.$id, role } });
    }
  );

export default app;
