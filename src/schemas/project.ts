import { z } from "zod/v4";

export const projectSchema = z.object({
  name: z
    .string()
    .min(1, "プロジェクト名を入力してください")
    .max(100, "プロジェクト名は100文字以内で入力してください"),
  description: z.string().max(500, "説明は500文字以内で入力してください").optional(),
});

export type ProjectInput = z.infer<typeof projectSchema>;
