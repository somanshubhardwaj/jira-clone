import { z } from "zod";
import { TaskStatus } from "./types";

export const taskSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  status: z.nativeEnum(TaskStatus),
  dueDate: z.coerce.date(),
  workspaceId: z.string().trim().min(1),
  projectId: z.string().trim().min(1),
  assigneeId: z.string().trim().min(1),
});
