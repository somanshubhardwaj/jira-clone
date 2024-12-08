import "server-only";
import { Client, Account, Storage, Users, Databases } from "node-appwrite";
import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME } from "@/features/auth/const";
export async function createSessionClient() {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

  const session = (await cookies()).get(AUTH_COOKIE_NAME);
  if (!session || !session.value) {
    throw new Error("No session found");
  }
  client.setSession(session.value);
  return {
    get account() {
      return new Account(client);
    },
    get storage() {
      return new Storage(client);
    },
    get users() {
      return new Users(client);
    },
    get databases() {
      return new Databases(client);
    },
  };
}
export async function createAdminClient() {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!)
    .setKey(process.env.NEXT_APPWRITE_KEY!);
  return {
    get account() {
      return new Account(client);
    },
  };
}
