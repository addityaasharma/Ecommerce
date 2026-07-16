import { OAuth2Client } from "google-auth-library";
import { getEnvVar, AppError } from "../error/appError.js";
import { OTP_EXPIRE } from "./otpFunction.js";
import { appendFile } from "node:fs";


const googleID = getEnvVar("GOOGLE_CLIENT_ID")
const client = new OAuth2Client(googleID);

export const verifyGoogleToken = async (idToken: string) => {
    const ticket = await client.verifyIdToken({
        idToken,
        audience: googleID,
    })

    const payload = ticket.getPayload()
    if (!payload || !payload.sub || !payload.email) {
        throw new AppError("Login Failed", 400)
    }

    const emailPrefix = payload.email.split("@")[0] ?? payload.email;

    return {
        googleId: payload.sub,
        email: payload.email,
        username: payload.name ?? emailPrefix,
        profileURL : payload.picture ?? null
    }
}
