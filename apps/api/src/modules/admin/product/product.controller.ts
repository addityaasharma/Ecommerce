import { productQuerySchema } from "@repo/validators";
import { categoryIdParamSchema } from "@repo/validators"; // reuse the same id-param pattern (or make a productIdParamSchema)
import {
    productDeleteService,
    productDetailByIdService,
    productDetailService,
    productService,
    productUpdateService
} from "./product.service.js";
import { asyncHandler } from "../../../common/helper/asyncHandler.js";

export const productController = asyncHandler(async (req, res) => {
    const product = await productService(req.body);
    return res.status(201).json({ success: true, message: "Product created", data: product });
});

export const productDetailsController = asyncHandler(async (req, res) => {
    const query = productQuerySchema.parse(req.query);
    const result = await productDetailService(query);
    return res.status(200).json({ success: true, message: "Products fetched", data: result });
});

export const productDetailsByIdController = asyncHandler(async (req, res) => {
    const { id } = categoryIdParamSchema.parse(req.params);
    const product = await productDetailByIdService(id);
    return res.status(200).json({ success: true, message: "Product fetched", data: product });
});

export const productUpdateController = asyncHandler(async (req, res) => {
    const { id } = categoryIdParamSchema.parse(req.params);
    const product = await productUpdateService(req.body, id);
    return res.status(200).json({ success: true, message: "Product updated", data: product });
});

export const productDeleteController = asyncHandler(async (req, res) => {
    const { id } = categoryIdParamSchema.parse(req.params);
    await productDeleteService(id);
    return res.status(200).json({ success: true, message: "Product deleted" });
});