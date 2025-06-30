import { z } from "zod";

export const contactSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .max(100, { message: "Name cannot exceed 100 characters" }),

  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" }),

  schoolEmail: z
    .string()
    .min(1, { message: "School email is required" })
    .email({ message: "Invalid email address" })
    .regex(/\.uwo\.ca$/, { message: "Must be a UWO email address" }),

  studentId: z
    .string()
    .min(1, { message: "Student ID is required" })
    .regex(/^[0-9]{8,10}$/, { message: "Student ID must be 8-10 digits" }),

  program: z.string().min(1, { message: "Program is required" }),

  team: z.string().min(1, { message: "Team selection is required" }),

  resumeUrl: z
    .string()
    .optional()
    .refine((val) => !val || val.startsWith("http"), {
      message: "URL must start with http:// or https://",
    }),
});

export type ContactFormValues = z.infer<typeof contactSchema>;
