import type { ForgotPasswordInput, LoginInput, RegisterInput, ResetPasswordInput } from "@repo/validators"
import bcrypt from "bcrypt";
import { prisma } from "@repo/db";
import { AppError } from "../../common/error/appError.js";
import { generateOTP, OTP_EXPIRE } from "../../common/helper/otpFunction.js";
import { redis } from "../../config/redis.js";
import jwt from 'jsonwebtoken';
import { ACCESS_SECRET, REFRESH_SECRET } from "../../common/constants/tokens.js";

export const registerUserService = async (input: RegisterInput) => {
    const existing = await prisma.user.findFirst({
        where: {
            OR: [{ email: input.email }, { username: input.username }]
        }
    })
    if (existing) {
        throw new AppError("Email or username already exists", 409)
    }
    const hashedPassword = await bcrypt.hash(input.password, 10);
    const user = await prisma.user.create({
        data: {
            username: input.username,
            email: input.email,
            password: hashedPassword,
            phoneNumber: input.phoneNumber ?? null,
        },
    });
    const { password, ...safeUser } = user;
    return safeUser;
}


export const userLoginService = async (input: LoginInput) => {
    const user = await prisma.user.findFirst({
        where: {
            OR: [{ email: input.identifier }, { username: input.identifier }]
        }
    })
    if (!user) {
        throw new AppError("User not found", 404)
    }

    const checkPassword = await bcrypt.compare(input.password, user.password)
    if (!checkPassword) {
        throw new AppError("Password do not match", 401)
    }

    const { password, ...safeUser } = user;
    return safeUser;
}


export const userPasswordService = async (input: ForgotPasswordInput) => {
    const user = await prisma.user.findFirst({
        where: { email: input.email }
    })
    if (!user) {
        throw new AppError("User not found", 404)
    }

    const otp: number = generateOTP();
    await redis.set(`otp:${user.email}`, otp.toString(), 'EX', OTP_EXPIRE)
    return { message: "OTP has been sent" };
}

export const verifyOtpService = async (input: ResetPasswordInput) => {
    const user = await prisma.user.findFirst({
        where: { email: input.email }
    });
    if (!user) {
        throw new AppError("Invalid or expired OTP", 400);
    }

    const otp = await redis.get(`otp:${user.email}`);
    if (!otp || otp !== input.otp.toString()) {
        throw new AppError("Invalid or expired OTP", 400);
    }

    const hashedPassword = await bcrypt.hash(input.password, 10);
    await prisma.user.update({
        where: { email: input.email },
        data: { password: hashedPassword }
    })
    await redis.del(`otp:${user.email}`)
    return { message: "Password updated successfully" }
}