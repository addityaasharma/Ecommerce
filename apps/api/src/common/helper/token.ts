import jwt from "jsonwebtoken";
import { ACCESS_SECRET, REFRESH_SECRET } from "../constants/tokens.js";

export const generateAccessToken = (userId: number, role: string) => {
    return jwt.sign({ sub: userId, role: role }, ACCESS_SECRET, { expiresIn: '15m' });
}

export const generateRefreshToken = (userId: number, role: string) => {
    return jwt.sign({ sub: userId, role: role }, REFRESH_SECRET, { expiresIn: "7d" });
}