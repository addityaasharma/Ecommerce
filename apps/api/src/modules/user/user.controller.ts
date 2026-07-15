import type { Request, Response } from 'express';
import { registerUser } from './user.service.js';

export const register = async (req: Request, res: Response) => {
    try {
        const user = await registerUser(req.body);
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