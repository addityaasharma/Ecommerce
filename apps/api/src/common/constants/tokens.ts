import { getEnvVar } from "../error/appError.js";

export const ACCESS_SECRET = getEnvVar("JWT_ACCESS_SECRET");
export const REFRESH_SECRET = getEnvVar("JWT_REFRESH_SECRET");