import React from "react";
import { Task } from "../types";
import TastActions from "./TastActions";
import { MoreHorizontal } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import MembersAvatar from "@/features/members/components/MembersAvatar";
import TAskDate from "./TAskDate";
import WorkSpaceAvatar from "@/components/workspace-avatar";
interface KanbanCArdProps {
  task: Task;
}
const KanbanCard = ({ task }: KanbanCArdProps) => {
  return (
    <div className="bg-white rounded-md p-2 shadow-md my-2">
      <div className="flex  gap-2 items-start justify-between">
        <h3 className="text-sm line-clamp-2 font-semibold">{task.name}</h3>
        <TastActions id={task.$id} projectId={task.projectId}>
          <MoreHorizontal className="text-muted-foreground transition-all hover:text-primary cursor-pointer size-[18px]" />
        </TastActions>
      </div>
      <Separator className="my-2.5" />
      <div className="flex gap-2.5 items-center mb-3">
        <MembersAvatar
          name={task.assignee.name}
          fallbackClassName="text-[10px]"
        />
        <div className="size-1 rounded-full bg-neutral-300" />
        {task.dueDate ? (
          <TAskDate className="text-xs" date={new Date(task.dueDate)} />
        ) : (
          <div className="text-xs text-muted-foreground">No due date</div>
        )}
      </div>
      {/* <div className="flex gap-x-2.5 items-center mt-1">
        <WorkSpaceAvatar
          image={task.project.imageUrl}
          name={task.project.name}
          className="size-5 text-sm"
          fallbackClassName="text-[10px]"
        />
        <span className="text-xs font-medium text-muted-foreground">
          {task.project.name}
        </span>
      </div> */}
    </div>
  );
};

export default KanbanCard;
