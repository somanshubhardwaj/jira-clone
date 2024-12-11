import React from "react";
import { getCurrent } from "@/features/auth/actions";
import { redirect } from "next/navigation";
import Client from "./Client";

const page = async () => {
  const user = await getCurrent();
  if (!user) redirect("/sign-in");
  return <Client />;
};

export default page;
