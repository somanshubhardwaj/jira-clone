import React from "react";
import { getCurrent } from "@/features/auth/actions";
import { redirect } from "next/navigation";
import TaskViewSwitcher from "@/features/tasks/components/TaskViewSwitcher";

const MyTasks = async () => {
  const user = await getCurrent();
  if (!user) redirect("/sign-in");
  return (
    <div className="flex flex-col h-full gap-4">
      <TaskViewSwitcher />
    </div>
  );
};

export default MyTasks;
