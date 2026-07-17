import type { Request, Response, NextFunction } from "express"
import { AppError, getEnvVar } from "../common/error/appError.js";
import jwt from "jsonwebtoken";
import { prisma } from "@repo/db";


export interface AdminTokenPayload {
    adminId: number,
    role: string
}

declare global {
    namespace Express {
        interface Request {
            admin?: AdminTokenPayload;
        }
    }
}

export interface AdminRequest extends Request {
    admin: AdminTokenPayload;
}

const ACCESS_TOKEN = getEnvVar("JWT_ACCESS_SECRET")

export const adminMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies?.admin_access_token || req.headers.authorization?.replace("Bearer ", "");
        if (!token) {
            throw new AppError("Not authenticated", 401);
        }

        const decoded = jwt.verify(token, ACCESS_TOKEN) as AdminTokenPayload;
        if (decoded.role !== "admin") {
            throw new AppError("Access denied: admin only", 403);
        }

        req.admin = decoded;
        next();
    } catch (err) {
        if (err instanceof AppError) {
            return res.status(err.statusCode).json({ success: false, message: err.message });
        }
        return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
};