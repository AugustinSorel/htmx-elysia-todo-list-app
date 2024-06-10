import { z } from "zod";
import { userSchema } from "./user.schemas";

export const signInSchema = userSchema.pick({ email: true, password: true });

export const signUpSchema = userSchema
  .pick({ email: true, password: true })
  .extend({
    confirmPassword: userSchema.shape.password,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type SignInSchema = z.infer<typeof signInSchema>;
export type SignUpSchema = z.infer<typeof signUpSchema>;
