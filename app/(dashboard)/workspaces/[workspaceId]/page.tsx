import { getCurrent } from "@/features/auth/actions";
import { redirect } from "next/navigation";
import Client from "./Client";
import React from "react";

const WorkspaceIdPage = async () => {
  const user = await getCurrent();
  if (!user) redirect("/sign-in");
  return <Client />;
};

export default WorkspaceIdPage;
