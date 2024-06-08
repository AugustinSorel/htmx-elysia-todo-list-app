import { z } from "zod";

export const todoSchema = z.object({
  title: z
    .string({
      required_error: "title is required",
      invalid_type_error: "title must be of type string",
    })
    .min(3, "title must be at least 3 characters")
    .max(255, "title must be at most 255 characters"),
  done: z.boolean({
    required_error: "done is required",
    invalid_type_error: "done must be of type boolean",
  }),
});

export type TodoSchema = z.infer<typeof todoSchema>;
