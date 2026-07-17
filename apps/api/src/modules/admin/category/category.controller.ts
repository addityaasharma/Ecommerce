import { asyncHandler } from "../../../common/helper/asyncHandler.js";


export const categoryController = asyncHandler(async (req, res) => {
    const category = await categoryService(req.body);
    return res.status(201).json({ success: true, message: "category created", data: category })
})