import { z } from "zod";

export const ProjectSchema = z.object({
  name: z.string().trim().min(1, "Required").max(255, "Too long"),
  image: z
    .union([
      z.instanceof(File),
      z.string().transform((val) => (val === "" ? undefined : val)),
    ])
    .optional(),
  workspaceId: z.string(),
});
export const updateProjectSchema = z.object({
  name: z.string().trim().min(1, "Required").max(255, "Too long").optional(),
  image: z
    .union([
      z.instanceof(File),
      z.string().transform((val) => (val === "" ? undefined : val)),
    ])
    .optional(),
});
