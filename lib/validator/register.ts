import { z } from "zod";

export const registerSchema = z.object({
    name: z.string().min(1, "Full name is required").trim(),
    phone: z
        .string()
        .min(9, "Phone number must be at least 9 digits")
        .max(10, "Phone number must be at most 10 digits")
        .regex(/^\d+$/, "Phone number must only contain digits"),
    email: z.string().min(1, "Email is required").email("Invalid email address").trim(),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Password must include at least one uppercase letter")
        .regex(/[a-z]/, "Password must include at least one lowercase letter")
        .regex(/[0-9]/, "Password must include at least one number")
        .regex(/[#?!@$%^&*-]/, "Password must include at least one special character"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Confirmed passwords do not match",
    path: ["confirmPassword"],
});

export type RegisterInput = z.infer<typeof registerSchema>;
