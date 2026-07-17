import { z } from 'zod';
import { passwordField, phoneNumber, usernameField } from './auth.validator.js';

export const adminSignupSchema = z.object({
    username: usernameField,
    password: passwordField,
    confirmPassword: z.string().min(1, "Please confirm your password"),
    phoneNumber: phoneNumber,
    profilePicture: z.url("Invalid url").optional(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "password do not match",
    path: ["confirmPassword"]
})

export const adminSigninSchema = z.object({
    username: usernameField,
    password: passwordField,
})

export const adminResetPasswordSchema = z.object({
    oldPassword: z.string().min(1, "Please enter old password"),
    newPassword: passwordField,
    confirmPassword: passwordField,
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "passwords do not match",
    path: ["confirmPassword"]
})

export const adminUpdateProfileSchema = z.object({
    username: usernameField.optional(),
    phoneNumber: phoneNumber.optional(),
    profilePicture: z.url("Invalid url").optional(),
    bio: z.string().optional(),
})

export type AdminSignupInput = z.output<typeof adminSignupSchema>;
export type AdminSigninInput = z.output<typeof adminSigninSchema>;
export type AdminUpdateProfileInput = z.output<typeof adminUpdateProfileSchema>;
export type AdminResetPasswordInput = z.output<typeof adminResetPasswordSchema>;