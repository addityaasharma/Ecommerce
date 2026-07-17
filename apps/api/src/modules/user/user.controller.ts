import type { Request, Response } from 'express';
import { registerUserByGoogleService, registerUserService, userGoogleLoginService, userLoginService, userPasswordService, verifyOtpService } from './user.service.js';
import { generateAccessToken, generateRefreshToken } from '../../common/helper/token.js';

export const registerController = async (req: Request, res: Response) => {
    try {
        const user = await registerUserService(req.body);
        return res.status(201).json({
            success: true,
            data: user,
        })
    } catch (err: any) {
        return res.status(err.statusCode ?? 500).json({
            success: false,
            message: err.message ?? 'Something went wrong'
        })
    }
}

export const registerGoogleController = async (req: Request, res: Response) => {
    try {
        const { user, token } = await registerUserByGoogleService(req.body);
        return res.status(201).json({ success: true, data: user, token });
    } catch (err: any) {
        return res.status(err.statusCode ?? 500).json({
            success: false,
            message: err.message ?? 'Something went wrong'
        })
    }
}

export const userLoginController = async (req: Request, res: Response) => {
    try {
        const user = await userLoginService(req.body);
        const access_token = generateAccessToken(user.id, "user");
        const refresh_token = generateRefreshToken(user.id, "user");

        res.cookie("access_token", access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 15 * 60 * 1600
        })

        res.cookie("refresh_token", refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.status(200).json({
            success: true,
            data: user,
        })
    } catch (err: any) {
        return res.status(err.statusCode ?? 500).json({
            success: false,
            message: err.message ?? 'Something went wrong'
        })
    }
}


export const userLoginGoogleController = async (req: Request, res: Response) => {
    try {
        const { user, token } = await userGoogleLoginService(req.body);
        res.cookie("access_token", token.access, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 15 * 60 * 1000
        })

        res.cookie("refresh_token", token.refresh, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.status(201).json({ success: true, data: user });
    } catch (err: any) {
        return res.status(err.statusCode ?? 500).json({
            success: false,
            message: err.message ?? 'Something went wrong'
        })
    }
}

export const passwordController = async (req: Request, res: Response) => {
    const body = req.body;
    try {
        const user = await userPasswordService(body);
        res.status(200).json({
            success: true,
            message: user
        })
    } catch (err: any) {
        return res.status(err.statusCode ?? 500).json({
            success: false,
            message: err.message ?? 'Something went wrong'
        })
    }
}


export const verifyOTPController = async (req: Request, res: Response) => {
    const body = req.body;
    try {
        const resetPassword = await verifyOtpService(body);
        return res.status(200).json({
            success: true,
            message: resetPassword
        })
    } catch (err: any) {
        return res.status(err.statusCode ?? 500).json({
            success: false,
            message: err.message ?? 'Something went wrong'
        })
    }
}

