import React from "react";
import { TaskStatus } from "../types";
import {
  CircleCheckIcon,
  CircleDashedIcon,
  CircleDotIcon,
  CircleDotDashedIcon,
  CircleIcon,
  PlusIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCreateTaskModal } from "../hooks/use-create-project-modal";
const statusIcons: Record<TaskStatus, React.ReactNode> = {
  [TaskStatus.INPROGRESS]: (
    <CircleDotIcon className="h-4 w-4 text-orange-500" />
  ),
  [TaskStatus.INREVIEW]: (
    <CircleDashedIcon className="h-4 w-4 text-purple-500" />
  ),
  [TaskStatus.DONE]: <CircleCheckIcon className="h-4 w-4 text-green-500" />,
  [TaskStatus.TODO]: <CircleIcon className="h-4 w-4 text-blue-500" />,
  [TaskStatus.BACKLOG]: (
    <CircleDotDashedIcon className="h-4 w-4 text-gray-500" />
  ),
};
const KanbanColumnHeader = ({
  board,
  taskCount,
}: {
  board: TaskStatus;
  taskCount: number;
}) => {
  const { open } = useCreateTaskModal();
  const Icon = statusIcons[board];
  return (
    <div className="px-2 py-1.5 flex items-center justify-between">
      <div className="flex items-center gap-x-2">
        {Icon}
        <h2 className="text-sm font-medium text-foreground">
          {board === TaskStatus.INPROGRESS
            ? "In Progress"
            : board === TaskStatus.INREVIEW
            ? "In Review"
            : board
                .split("")
                .map((char, index) =>
                  index === 0 || board[index - 1] === "_"
                    ? char.toUpperCase()
                    : char.toLowerCase()
                )
                .join("")
                .replace(/_/g, " ")}
        </h2>
        <p className="text-sm text-muted-foreground size-5 flex items-center justify-center p-2 rounded-full bg-neutral-200">
          {taskCount}
        </p>
      </div>
      <Button size={"icon"} variant={"ghost"} onClick={open}>
        <PlusIcon className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default KanbanColumnHeader;
