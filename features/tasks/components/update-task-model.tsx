"use client";
import React from "react";
import { ResponsiveModal } from "@/components/responsive-modal";
import { useUpdateTaskModal } from "../hooks/use-update-task-modal";
import EditTaskFormWrapper from "./update-task-form-wrapper";

const UpdateTaskModal = () => {
  const { taskId, open, close } = useUpdateTaskModal();
  return (
    <ResponsiveModal open={!!taskId} onOpenChange={close}>
      {taskId && <EditTaskFormWrapper onCancel={close} taskId={taskId} />}
    </ResponsiveModal>
  );
};

export default UpdateTaskModal;
