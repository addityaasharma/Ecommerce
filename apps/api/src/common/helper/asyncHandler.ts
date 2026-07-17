import type { Request, Response, NextFunction } from 'express';
import type { AdminRequest } from '../../middleware/admin.middleware.js';

export const asyncHandler = (fn: (req: AdminRequest, res: Response) => Promise<void | Response>) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await fn(req as AdminRequest, res);
        } catch (err: any) {
            res.status(err.statusCode ?? 500).json({
                success: false,
                message: err.message ?? "Something went wrong",
            });
        }
    }
}
