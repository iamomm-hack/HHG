import { z } from "zod";

const safeText = (max: number, min = 0, message?: string) => z.string().trim().min(min, message).max(max).transform((v) => v.replace(/[<>]/g, ""));
export const builderDetailsSchema = z.object({
  name: safeText(38, 1, "Add your name"),
  role: safeText(40, 1, "Choose a role"),
  stack: z.array(safeText(24)).min(1, "Choose at least one technology").max(5),
  x: safeText(39),
  statement: safeText(90),
});
