import express, { type Router } from 'express';
import { validateSchema } from '../../middleware/schema.middleware.js';
import { registerSchema, loginSchema, googleAuth, forgotPassword, resetPassword } from "@repo/validators"
import { passwordController, registerController, userLoginController, verifyOTPController } from './user.controller.js';

const router: Router = express.Router();

router.post("/signup", validateSchema(registerSchema), registerController);
router.post("/login", validateSchema(loginSchema), userLoginController);
router.post("/password", validateSchema(forgotPassword), passwordController);
router.post("/password/reset", validateSchema(resetPassword), verifyOTPController);

export default router;