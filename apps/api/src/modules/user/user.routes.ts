import express, { type Router } from 'express';
import { validateSchema } from '../../middleware/schema.middleware.js';
import { registerSchema, loginSchema, googleAuth, forgotPassword } from "@repo/validators"

const router: Router = express.Router();

router.post("/signup", validateSchema(registerSchema),);
// router.post("/", validateSchema(loginSchema),);
// router.post("/", validateSchema(googleAuth),);
// router.post("/", validateSchema(forgotPassword),);

export default router;