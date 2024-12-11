import { Models } from "node-appwrite";

export enum TaskStatus {
  TODO = "TODO",
  INPROGRESS = "INPROGRESS",
  INREVIEW = "INREVIEW",
  BACKLOG = "BACKLOG",
  DONE = "DONE",
}
export type Task = Models.Document & {
  name: string;
  status: TaskStatus;
  projectId: string;
  assigneeId: string;
  dueDate: string;
  position: number;
  workspaceId: string;
  description?: string;
};
