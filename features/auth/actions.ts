"use server";

import { cookies } from "next/headers";
import { Account, Client } from "node-appwrite";
import { AUTH_COOKIE_NAME } from "./const";
import { getCookie } from "hono/cookie";

export const getCurrent = async () => {
  try {
    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

    const session = (await cookies()).get(AUTH_COOKIE_NAME);

    if (!session) {
      return null;
    }
    client.setSession(session.value);
    const account = new Account(client);
    const user = await account.get();
    return user;
  } catch (error) {
    return null;
  }
};
