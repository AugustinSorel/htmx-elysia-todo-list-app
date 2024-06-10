import { z } from "zod";

export const userSchema = z.object({
  email: z
    .string({
      required_error: "email is required",
      invalid_type_error: "email must be of type string",
    })
    .min(3, "email must be at least 3 characters")
    .max(255, "email must be at most 255 characters")
    .trim()
    .email("invalid email format"),
  password: z
    .string({
      required_error: "password is required",
      invalid_type_error: "password must be of type string",
    })
    .min(3, "password must be at least 3 characters")
    .max(255, "password must be at most 255 characters")
    .trim(),
});

export type UserSchema = z.infer<typeof userSchema>;
