import type { ForgotPasswordInput, GoogleInput, LoginInput, RegisterInput, ResetPasswordInput } from "@repo/validators"
import bcrypt from "bcrypt";
import { prisma } from "@repo/db";
import { AppError } from "../../common/error/appError.js";
import { generateOTP, OTP_EXPIRE } from "../../common/helper/otpFunction.js";
import { redis } from "../../config/redis.js";
import { verifyGoogleToken } from "../../common/helper/googleVerify.js";
import { generateAccessToken, generateRefreshToken } from "../../common/helper/token.js";

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


export const registerUserByGoogleService = async (input: GoogleInput) => {
    const { googleId, username, email, profileURL } = await verifyGoogleToken(input.googleId);
    const existing_user = await prisma.user.findFirst({
        where: {
            OR: [{ googleId }, { email }]
        }
    })

    if (existing_user) {
        if (!existing_user.googleId) {
            const linked = await prisma.user.update({
                where: { id: existing_user.id },
                data: { googleId }
            });
            const { password, ...safeUser } = linked;
            const access_token = generateAccessToken(linked.id, "user");
            const refresh_token = generateRefreshToken(linked.id, "user");
            return { user: safeUser, token: { access: access_token, refresh: refresh_token } }
        } throw new AppError("User already exists", 409)
    }

    const new_user = await prisma.user.create({
        data: { googleId, email, username, profilePicture: profileURL, password: null, role: "user" },
    });

    const { password, ...safeUser } = new_user;
    const access_token = generateAccessToken(new_user.id, "user");
    const refresh_token = generateRefreshToken(new_user.id, "user");
    return { user: safeUser, token: { access: access_token, refresh: refresh_token } };
}


export const userLoginService = async (input: LoginInput) => {
    const user = await prisma.user.findFirst({
        where: {
            OR: [{ email: input.identifier }, { username: input.identifier }]
        }
    })
    if (!user || !user.password) {
        throw new AppError("username or password is wrong", 404)
    }

    const checkPassword = await bcrypt.compare(input.password, user.password)
    if (!checkPassword) {
        throw new AppError("Password do not match", 401)
    }

    const { password, ...safeUser } = user;
    return safeUser;
}

export const userGoogleLoginService = async (input: GoogleInput) => {
    const { googleId, email } = await verifyGoogleToken(input.googleId);
    const existing_user = await prisma.user.findFirst({
        where: {
            OR: [{ googleId }, { email }]
        }
    })

    if (!existing_user) {
        throw new AppError("user does not exist", 409)
    }

    let user = existing_user
    if (!existing_user.googleId) {
        user = await prisma.user.update({
            where: { id: existing_user.id },
            data: { googleId }
        });
    }

    const { password, ...safeUser } = user;
    const access_token = generateAccessToken(user.id, "user");
    const refresh_token = generateRefreshToken(user.id, "user");
    return { user: safeUser, token: { access: access_token, refresh: refresh_token } }
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