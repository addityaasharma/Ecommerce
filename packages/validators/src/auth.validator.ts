import { z } from 'zod';

const usernameField = z.string()
    .trim()
    .toLowerCase()
    .min(3, "Username must be atleast 3 character")
    .max(50, "username should not exceed more then 50 words")
    .regex(
        /^[a-zA-Z0-9_.]+$/,
        "Username can only contain letters, numbers, underscores, and dots"
    )

const emailField = z.string().trim().lowercase().email("Invalid email address")

const passwordField = z.string()
    .min(8, "Password should be atleast 8 characters")
    .max(72, "character should not exceed more then 72 words")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number");

const phoneNumber = z.string().trim().regex(/^[0-9]{10}$/, "Phone number must be a valid 10-digit number");

export const registerSchema = z.object({
    username: usernameField,
    email: emailField,
    password: passwordField,
    confirmPassword: z.string(),
    phoneNumber: phoneNumber.optional(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "passwords do not match",
    path: ["confirmPassword"]
});

export const loginSchema = z.object({
    identifier: z.string().trim().lowercase().min(1, "enter your email or username"),
    password: z.string().min(1, "Password is required"),
});

export const googleAuth = z.object({
    googleId: z.string().min(1, "Google ID is required"),
    email: emailField,
    username: usernameField,
    profileURL: z.string().min(1).url("Invalid URL").optional(),
});

export const forgotPassword = z.object({
    email: emailField,
});

export const resetPassword = z.object({
    email: z.email(),
    otp : z.string().min(5, "otp is required"),
    password: passwordField,
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "passwords do not match",
    path: ["confirmPassword"]
})

export const changePassword = z.object({
    currentPassword: z.string().min(1, "please enter password"),
    newPassword: passwordField,
    confirmPassword: z.string().min(1, "please confirm password")
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "passwords do not match",
    path: ["confirmPassword"]
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type GoogleInput = z.infer<typeof googleAuth>;
export type ForgotPasswordInput = z.infer<typeof forgotPassword>;
export type ResetPasswordInput = z.infer<typeof resetPassword>;
export type ChangePasswordInput = z.infer<typeof changePassword>;