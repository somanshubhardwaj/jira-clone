import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
const app = new Hono()
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
      console.log({ email, password });
      return c.json({ email, password });
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
      console.log({ email, password, name });
      return c.json({ email, password, name });
    }
  );

export default app;
