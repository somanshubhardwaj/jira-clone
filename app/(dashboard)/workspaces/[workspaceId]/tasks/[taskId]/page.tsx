import React from "react";
import { getCurrent } from "@/features/auth/actions";
import { redirect } from "next/navigation";
import TaskIdClient from "./client";

const TaskId = async () => {
  const user = await getCurrent();
  if (!user) redirect("/sign-in");
  return <TaskIdClient />;
};

export default TaskId;
