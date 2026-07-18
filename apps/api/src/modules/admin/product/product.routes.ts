import { Router } from "express";
import { adminMiddleware } from "../../../middleware/admin.middleware.js";
import { validateSchema } from "../../../middleware/schema.middleware.js";
import { productController, productDeleteController, productDetailsByIdController, productDetailsController, productUpdateController } from "./product.controller.js";
import { productSchema, productUpdateSchema } from "@repo/validators";

const router: Router = Router();

router.post("/", adminMiddleware, validateSchema(productSchema), productController);
router.get("/", productDetailsController);
router.get("/:id", productDetailsByIdController);
router.put("/:id", adminMiddleware, validateSchema(productUpdateSchema), productUpdateController);
router.delete("/:id", adminMiddleware, productDeleteController);

export default router;