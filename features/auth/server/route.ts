import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { createAdminClient } from "@/lib/appwrite";
import { ID } from "node-appwrite";
import { deleteCookie, setCookie } from "hono/cookie";
import { AUTH_COOKIE_NAME } from "../const";
import { sessionMiddleware } from "@/lib/session-middleware";
const app = new Hono()
  .get("/current", sessionMiddleware, async (c) => {
    const user = c.get("user");
    return c.json({ user });
  })
  .post(
    "/login",
    zValidator(
      "json",
      z.object({
        email: z.string().email(),
        password: z.string(),
      })
    ),
    async (c) => {
      const { email, password } = c.req.valid("json");
      const { account } = await createAdminClient();
      const session = await account.createEmailPasswordSession(email, password);
      // console.log(session);
      // console.log(session.secret);
      setCookie(c, AUTH_COOKIE_NAME, session.secret, {
        path: "/",
        httpOnly: true,
        secure: true,
        sameSite: "Strict",
        maxAge: 60 * 60 * 24 * 30,
      });

      return c.json({ success: true });
    }
  )
  .post(
    "/register",
    zValidator(
      "json",
      z.object({
        name: z.string().trim().min(1, "Name is required"),
        email: z.string().email(),
        password: z.string().min(8, "Minimum 8 characters required"),
      })
    ),
    async (c) => {
      const { email, password, name } = c.req.valid("json");
      const { account } = await createAdminClient();

      await account.create(ID.unique(), email, password, name);
      const session = await account.createEmailPasswordSession(email, password);
      // console.log(session.secret);
      setCookie(c, AUTH_COOKIE_NAME, session.secret, {
        path: "/",
        httpOnly: true,
        secure: true,
        sameSite: "Strict",
        maxAge: 60 * 60 * 24 * 30,
      });
      return c.json({ success: true });
    }
  )
  .post("/logout", sessionMiddleware, async (c) => {
    const account = c.get("account");

    deleteCookie(c, AUTH_COOKIE_NAME);
    await account.deleteSession("current");
    return c.json({ success: true });
  });

export default app;
