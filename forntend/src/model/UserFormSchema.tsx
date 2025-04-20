import { z } from "zod";

export const UserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  age: z.number().int().min(0, "Age must be a non-negative number"),
  gender: z.enum(["Male", "Female", "Trans"]),
  email: z.string().email("Invalid email"),
});

export type UserFormData = z.infer<typeof UserSchema>;
