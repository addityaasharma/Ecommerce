import type { AdminResetPasswordInput, AdminSigninInput, AdminSignupInput, AdminUpdateProfileInput } from "@repo/validators"
import { prisma } from "@repo/db"
import { AppError } from "../../common/error/appError.js"
import bcrypt from 'bcrypt';
import { generateAccessToken, generateRefreshToken } from "../../common/helper/token.js";
import type { AdminTokenPayload } from "../../middleware/admin.middleware.js";


export const adminSignupService = async (input: AdminSignupInput) => {
    const admin = await prisma.admin.findFirst({
        where: { username: input.username }
    })
    if (admin) { throw new AppError("User already exist", 409) }

    const new_admin = await prisma.admin.create({
        data: {
            username: input.username,
            password: await bcrypt.hash(input.password, 10),
            phoneNumber: input.phoneNumber,
            profilePicture: input.profilePicture ?? null
        }
    })

    const { password, ...safeAdmin } = new_admin
    const access_token = generateAccessToken(new_admin.id, "admin")
    const refresh_token = generateRefreshToken(new_admin.id, "admin")

    return { admin: safeAdmin, token: { access: access_token, refresh: refresh_token } }
}


export const adminSigninService = async (input: AdminSigninInput) => {
    const admin = await prisma.admin.findFirst({
        where: { username: input.username }
    })
    if (!admin) { throw new AppError("User does not exist", 409) }

    const checkpassword = await bcrypt.compare(input.password, admin.password)
    if (!checkpassword) {
        throw new AppError("wrong password or email", 404)
    }
    const { password, ...safeAdmin } = admin
    const access_token = generateAccessToken(admin.id, "admin")
    const refresh_token = generateRefreshToken(admin.id, "admin")
    return { admin: safeAdmin, token: { access: access_token, refresh: refresh_token } }
}


export const adminResetService = async (input: AdminResetPasswordInput, token: AdminTokenPayload) => {
    const admin = await prisma.admin.findUnique({
        where: { id: token.adminId }
    })
    if (!admin) {
        throw new AppError("failed to authorize", 409)
    }

    const is_match = await bcrypt.compare(input.oldPassword, admin.password);
    if (!is_match) {
        throw new AppError("Old password is incorrect", 400);
    }

    const newHashedPassword = await bcrypt.hash(input.newPassword, 10);
    await prisma.admin.update({
        where: { id: admin.id },
        data: { password: newHashedPassword },
    });
}


export const adminProfileService = async (token: AdminTokenPayload) => {
    const admin = await prisma.admin.findFirst({
        where: { id: token.adminId }
    })
    if (!admin) {
        throw new AppError("Admin not found", 400)
    }

    const { password, ...safeadmin } = admin;
    return safeadmin;
}


export const profileUpdateService = async (input: AdminUpdateProfileInput, token: AdminTokenPayload) => {
    const existingAdmin = await prisma.admin.findUnique({
        where: { id: token.adminId }
    });
    if (!existingAdmin) {
        throw new AppError("Admin not found", 404);
    }

    const admin = await prisma.admin.update({
        where: { id: token.adminId },
        data: {
            ...(input.username !== undefined && { username: input.username }),
            ...(input.phoneNumber !== undefined && { phoneNumber: input.phoneNumber }),
            ...(input.profilePicture !== undefined && { profilePicture: input.profilePicture }),
            ...(input.bio !== undefined && { bio: input.bio }),
        }
    });

    const { password, ...safeAdmin } = admin;
    return safeAdmin;
};




