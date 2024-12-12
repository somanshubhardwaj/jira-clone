import { getCurrent } from "@/features/auth/actions";
import { redirect } from "next/navigation";
import React from "react";
import Client from "./Client";

const Page = async () => {
  const user = await getCurrent();
  if (!user) redirect("/sign-in");

  return <Client />;
};

export default Page;
