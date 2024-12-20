import { z } from "zod";

export const WorkspaceSchema = z.object({
  name: z.string().trim().min(1, "Required").max(255, "Too long"),
  image: z
    .union([
      z.instanceof(File),
      z.string().transform((val) => (val === "" ? undefined : val)),
    ])
    .optional(),
});
export const updateWorkspaceSchema = z.object({
  name: z.string().trim().min(1, "Required").max(255, "Too long").optional(),
  image: z
    .union([
      z.instanceof(File),
      z.string().transform((val) => (val === "" ? undefined : val)),
    ])
    .optional(),
});
