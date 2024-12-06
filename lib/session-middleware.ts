import "server-only";
import { getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import { AUTH_COOKIE_NAME } from "@/features/auth/const";
import {
  Databases,
  Account,
  Account as AccountType,
  Client,
  Models,
  Storage,
  type Databases as DatabasesType,
  type Storage as StorageType,
  type Users as UsersType,
} from "node-appwrite";
import next from "next";
type AdditionalContext = {
  Variables: {
    account: AccountType;
    storage: StorageType;
    databases: DatabasesType;
    users: UsersType;
    user: Models.User<Models.Preferences>;
  };
};
export const sessionMiddleware = createMiddleware<AdditionalContext>(
  async (c, next) => {
    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

    const session = getCookie(c, AUTH_COOKIE_NAME);
    if (!session) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    client.setSession(session);

    const account = new Account(client);
    const storage = new Storage(client);
    const databases = new Databases(client);
    const user = await account.get();
    c.set("user", user);
    c.set("account", account);
    c.set("storage", storage);
    c.set("databases", databases);
    await next();
  }
);
