import { z } from "zod";

export const userSchema = z
  .object({
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
    confirmPassword: z
      .string({
        required_error: "confirm password is required",
        invalid_type_error: "confirm password must be of type string",
      })
      .min(3, "confirm password must be at least 3 characters")
      .max(255, "confirm password must be at most 255 characters")
      .trim(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type User = z.infer<typeof userSchema>;
