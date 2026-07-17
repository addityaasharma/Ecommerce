import { categoryIdParamSchema, categoryQuerySchema } from "@repo/validators";
import { asyncHandler } from "../../../common/helper/asyncHandler.js";
import { categoryDeleteService, categoryDetailService, categoryService, categorySingleDetailService, categoryUpdateService } from "./category.service.js";

export const categoryController = asyncHandler(async (req, res) => {
    const category = await categoryService(req.body);
    return res.status(201).json({ success: true, message: "Category created", data: category });
});

export const categoryByIdController = asyncHandler(async (req, res) => {
    const { id } = categoryIdParamSchema.parse(req.params);
    const category = await categorySingleDetailService(id);
    return res.status(200).json({ success: true, message: "Category fetched", data: category });
});

export const categoryDetailsController = asyncHandler(async (req, res) => {
    const query = categoryQuerySchema.parse(req.query);
    const category = await categoryDetailService(query);
    return res.status(200).json({ success: true, message: "Categories fetched", data: category });
});

export const categoryDeleteController = asyncHandler(async (req, res) => {
    const { id } = categoryIdParamSchema.parse(req.params);
    await categoryDeleteService(id);
    return res.status(200).json({ success: true, message: "Category deleted" });
});

export const categoryUpdateController = asyncHandler(async (req, res) => {
    const { id } = categoryIdParamSchema.parse(req.params);
    const category = await categoryUpdateService(req.body, id);
    return res.status(200).json({ success: true, message: "Category updated", data: category });
});