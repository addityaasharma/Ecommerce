import jwt from "jsonwebtoken";
import { ACCESS_SECRET, REFRESH_SECRET } from "../constants/tokens.js";

export const generateAccessToken = (userId: number) => {
    return jwt.sign({ sub: userId }, ACCESS_SECRET, { expiresIn: '15m' });
}

export const generateRefreshToken = (userId: number) => {
    return jwt.sign({ sub: userId }, REFRESH_SECRET, { expiresIn: "7d" });
}