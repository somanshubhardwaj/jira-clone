"use client";
import React from "react";
import { useCreateTaskModal } from "../hooks/use-create-project-modal";
import { ResponsiveModal } from "@/components/responsive-modal";
import TaskFormWrapper from "./create-task-form-wrapper";

const CreateTaskModal = () => {
  const { isOpen, setIsOpen, close } = useCreateTaskModal();
  return (
    <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
      <div>
        <TaskFormWrapper onCancel={close} />
      </div>
    </ResponsiveModal>
  );
};

export default CreateTaskModal;
