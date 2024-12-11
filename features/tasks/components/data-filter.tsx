import { useGetMembers } from "@/features/members/api/use-get-members";
import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { useGetWorkspaces } from "@/features/workspaces/api/use-get-worspaces";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import React from "react";
import { DatePicker } from "@/components/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ListCheckIcon, UserIcon } from "lucide-react";
import { TaskStatus } from "../types";
import { useTaskFilter } from "../hooks/use-task-filter";
interface DataFiltersProps {
  hideProjectFilter?: boolean;
}
const DataFilters = ({ hideProjectFilter }: DataFiltersProps) => {
  const workspaceId = useWorkspaceId();
  const { data: projects, isLoading: isLoadingProjects } = useGetProjects({
    workspaceId,
  });
  const { data: members, isLoading: isLoadingMembers } = useGetMembers({
    workspaceId,
  });
  const isLoading = isLoadingProjects || isLoadingMembers;

  const projectOptions = projects?.documents.map((project) => ({
    label: project.name,
    value: project.$id,
  }));
  const memberOptions = members?.documents.map((member) => ({
    label: member.name,
    value: member.$id,
  }));
  const [{ status, projectId, assigneeId, dueDate, search }, setFilter] =
    useTaskFilter();
  const onStatusChange = (value: string) => {
    if (value === "all") {
      setFilter({ status: null });
    } else {
      setFilter({ status: value as TaskStatus });
    }
  };
  const onAssigneeChange = (value: string) => {
    if (value === "all") {
      setFilter({ assigneeId: null });
    } else {
      setFilter({ assigneeId: value });
    }
  };
  const onProjectChange = (value: string) => {
    if (value === "all") {
      setFilter({ projectId: null });
    } else {
      setFilter({ projectId: value });
    }
  };
  if (isLoading) return <div>Loading...</div>;
  return (
    <div className="flex flex-col lg:flex-row gap-2">
      <Select defaultValue={status ?? undefined} onValueChange={onStatusChange}>
        <SelectTrigger className="w-full lg:w-auto h-8">
          <div className="flex items-center pr-2">
            <ListCheckIcon className="size-4 mr-2" />
            <SelectValue placeholder="All Status" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectSeparator />
          <SelectItem value={TaskStatus.TODO}>Todo</SelectItem>
          <SelectItem value={TaskStatus.INPROGRESS}>In Progress</SelectItem>
          <SelectItem value={TaskStatus.INREVIEW}>In Review</SelectItem>
          <SelectItem value={TaskStatus.BACKLOG}>Backlog</SelectItem>
          <SelectItem value={TaskStatus.DONE}>Done</SelectItem>
        </SelectContent>
      </Select>
      <Select
        defaultValue={assigneeId ?? undefined}
        onValueChange={onAssigneeChange}
      >
        <SelectTrigger className="w-full lg:w-auto h-8">
          <div className="flex items-center pr-2">
            <UserIcon className="size-4 mr-2" />
            <SelectValue placeholder="All Assignee" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Assignee</SelectItem>
          <SelectSeparator />
          {memberOptions?.map((member) => (
            <SelectItem key={member.value} value={member.value}>
              {member.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {!hideProjectFilter && (
        <Select
          defaultValue={projectId ?? undefined}
          onValueChange={onProjectChange}
        >
          <SelectTrigger className="w-full lg:w-auto h-8">
            <div className="flex items-center pr-2">
              <ListCheckIcon className="size-4 mr-2" />
              <SelectValue placeholder="All Project" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Project</SelectItem>
            <SelectSeparator />
            {projectOptions?.map((project) => (
              <SelectItem key={project.value} value={project.value}>
                {project.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      <DatePicker
        placeholder="Due Date"
        className="h-8 w-full lg:w-auto"
        value={dueDate ? new Date(dueDate) : undefined}
        onChange={(date) => {
          setFilter({ dueDate: date ? date.toISOString() : null });
        }}
      />
    </div>
  );
};

export default DataFilters;
