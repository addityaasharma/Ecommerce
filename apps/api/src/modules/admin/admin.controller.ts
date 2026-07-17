import { resetPassword } from '@repo/validators';
import type { Request, Response } from 'express';
import { error } from 'node:console';
import { adminProfileService, adminResetService, adminSigninService, adminSignupService, profileUpdateService } from './admin.service.js';
import type { RequestMetadataResponse } from 'google-auth-library/build/src/auth/oauth2client.js';
import { AppError } from '../../common/error/appError.js';
import { asyncHandler } from '../../common/helper/asyncHandler.js';



export const adminSignupController = asyncHandler(async (req, res) => {
    const { admin, token } = await adminSignupService(req.body);
    res.cookie("admin_access_token", token.access, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60 * 1600
    })

    res.cookie("admin_refresh_token", token.refresh, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    })

    return res.status(200).json({
        status: true,
        message: admin,
    })
})


export const adminSigninController = asyncHandler(async (req, res) => {
    const { admin, token } = await adminSigninService(req.body);
    res.cookie("admin_access_token", token.access, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60 * 1600
    })

    res.cookie("admin_refresh_token", token.refresh, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    })

    return res.status(200).json({
        status: true,
        message: admin,
    })
})

export const adminLogoutController = asyncHandler(async (req, res) => {
    res.clearCookie("admin_refresh_token")
    res.clearCookie("admin_access_token")
    return res.status(200).json({
        status: true,
        navigate: "/login",
        message: "Logut successfully",
    })
})


export const adminPasswordController = asyncHandler(async (req, res) => {
    const admin = await adminResetService(req.body, req.admin);
    return res.status(200).json({
        success: true,
        message: "Password changed successfully",
    });
})


export const adminController = asyncHandler(async (req, res) => {
    const profile = await adminProfileService(req.admin);
    res.status(200).json({ success: true, data: profile });
})

export const profileUpdateController = asyncHandler(async (req, res) => {
    const admin = await profileUpdateService(req.body, req.admin);
    res.status(200).json({ success: true, data: admin });
})