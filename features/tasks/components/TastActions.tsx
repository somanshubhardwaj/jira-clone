import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ExternalLinkIcon, PencilIcon, TrashIcon } from "lucide-react";
import { useDeleteTask } from "../api/usedeletetask";
import { useConfirm } from "@/hooks/use-confirm";
import { useRouter } from "next/navigation";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useUpdateTaskModal } from "../hooks/use-update-task-modal";

interface TastActionsProps {
  id: string;
  projectId: string;
  children: React.ReactNode;
}

const TastActions = ({ id, projectId, children }: TastActionsProps) => {
  const workspaceId = useWorkspaceId();
  const router = useRouter();
  const { open, close } = useUpdateTaskModal();
  const { mutate: deleteTask, isPending: isDeletingTask } = useDeleteTask();
  const [ConfirmDialog, confirmAction] = useConfirm(
    "Are you sure you want to delete this task?",
    "This action cannot be undone.",
    "destructive"
  );
  const onDeleteTask = async () => {
    const confirmed = await confirmAction();
    if (confirmed) {
      deleteTask({ param: { taskId: id } });
    }
  };
  const onOpenTask = () => {
    router.push(`/workspace/${workspaceId}/tasks/${id}`);
  };
  const onOpenProject = () => {
    router.push(`/workspace/${workspaceId}/projects/${projectId}`);
  };

  return (
    <div className="flex justify-end">
      <ConfirmDialog />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem
            onClick={onOpenTask}
            disabled={false}
            className="p-[10px] cursor-pointer"
          >
            <ExternalLinkIcon className="mr-2 h-4 w-4 stroke-2" />
            Task Details
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => open(id)}
            disabled={false}
            className="p-[10px] cursor-pointer"
          >
            <PencilIcon className="mr-2 h-4 w-4 stroke-2" />
            Edit Task
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={onOpenProject}
            disabled={false}
            className="p-[10px] cursor-pointer"
          >
            <ExternalLinkIcon className="mr-2 h-4 w-4 stroke-2" />
            Project Open
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={onDeleteTask}
            disabled={isDeletingTask}
            className="p-[10px] cursor-pointer text-destructive"
          >
            <TrashIcon className="mr-2 h-4 w-4 stroke-2" />
            Delete Task
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default TastActions;
