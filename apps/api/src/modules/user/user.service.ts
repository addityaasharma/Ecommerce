import type { RegisterInput } from "@repo/validators"
import bcrypt from "bcrypt";
import { prisma } from "@repo/db";
import { AppError } from "../../common/error/appError.js";

export const registerUser = async (input: RegisterInput) => {
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