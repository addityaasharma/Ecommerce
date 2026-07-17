import { Router } from "express";
import { validateSchema } from "../../middleware/schema.middleware.js";
import { adminResetPasswordSchema, adminSigninSchema, adminSignupSchema } from "@repo/validators"
import { adminController, adminLogoutController, adminPasswordController, adminSigninController, adminSignupController } from "./admin.controller.js";
import { adminMiddleware } from "../../middleware/admin.middleware.js";

const router: Router = Router();

router.post("/signup", validateSchema(adminSignupSchema), adminSignupController)
router.post("/signin", validateSchema(adminSigninSchema), adminSigninController)
router.post("/password/reset", validateSchema(adminResetPasswordSchema), adminMiddleware, adminPasswordController)
router.post("/logout", adminLogoutController);
router.get("/", adminMiddleware, adminController)
export default router;
