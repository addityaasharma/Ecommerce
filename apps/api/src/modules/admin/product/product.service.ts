import { prisma } from "@repo/db";
import { AppError } from "../../../common/error/appError.js";
import { omitHandler } from "../../../common/helper/omitHandler.js";
import type { ProductInput, ProductQuery, ProductUpdateInput } from "@repo/validators";
import type { Prisma } from "@repo/db/src/generated/prisma/client.js";


export const productService = async (input: ProductInput) => {
    if (input.categoryId !== undefined) {
        const category = await prisma.category.findUnique({
            where: { id: input.categoryId }
        });
        if (!category) {
            throw new AppError("Category not found", 404);
        }
    }

    if (input.vendorId !== undefined) {
        const vendor = await prisma.vendor.findUnique({
            where: { id: input.vendorId }
        });
        if (!vendor) {
            throw new AppError("Vendor not found", 404);
        }
    }

    const existingProduct = await prisma.products.findFirst({
        where: {
            OR: [
                { name: input.name },
                { sku: input.sku },
                ...(input.barcode !== undefined ? [{ barcode: input.barcode }] : []),
            ]
        }
    });
    if (existingProduct) {
        throw new AppError("A product with this name, SKU, or barcode already exists", 409);
    }

    const product = await prisma.products.create({
        data: omitHandler(input),
    });

    return product;
};

export const productDetailService = async ({ page, limit, search, sortBy, status, categoryId }: ProductQuery) => {
    const skip = (page - 1) * limit;

    const where: Prisma.ProductsWhereInput = {
        ...(search && {
            OR: [
                { name: { contains: search, mode: "insensitive" } },
                { sku: { contains: search, mode: "insensitive" } },
            ],
        }),
        ...(status !== undefined && { status }),
        ...(categoryId !== undefined && { categoryId }),
    };

    const orderBy: Prisma.ProductsOrderByWithRelationInput =
        sortBy === "name"
            ? { name: "asc" }
            : sortBy === "price"
                ? { price: "asc" }
                : sortBy === "oldest"
                    ? { createdAt: "asc" }
                    : sortBy === "stock"
                        ? { stock: "asc" }
                        : { createdAt: "desc" }; // "newest" — default

    const [products, total] = await Promise.all([
        prisma.products.findMany({
            where,
            skip,
            take: limit,
            orderBy,
            include: {
                category: { select: { id: true, name: true } },
                vendor: { select: { id: true, storeName: true, isActive: true } },
            },
        }),
        prisma.products.count({ where }),
    ]);

    return {
        data: products,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
};

export const productDetailByIdService = async (id: number) => {
    const product = await prisma.products.findUnique({
        where: { id },
        include: {
            category: { select: { id: true, name: true } },
            vendor: { select: { id: true, username: true } },
        },
    });
    if (!product) {
        throw new AppError("Product not found", 404);
    }
    return product;
};

export const productUpdateService = async (input: ProductUpdateInput, id: number) => {
    const existingProduct = await prisma.products.findUnique({ where: { id } });
    if (!existingProduct) {
        throw new AppError("Product not found", 404);
    }

    if (input.categoryId !== undefined) {
        const category = await prisma.category.findUnique({ where: { id: input.categoryId } });
        if (!category) {
            throw new AppError("Category not found", 404);
        }
    }

    if (input.vendorId !== undefined) {
        const vendor = await prisma.vendor.findUnique({ where: { id: input.vendorId } });
        if (!vendor) {
            throw new AppError("Vendor not found", 404);
        }
    }

    if (input.sku !== undefined || input.name !== undefined || input.barcode !== undefined) {
        const duplicate = await prisma.products.findFirst({
            where: {
                id: { not: id }, // exclude the current product from the check
                OR: [
                    ...(input.name !== undefined ? [{ name: input.name }] : []),
                    ...(input.sku !== undefined ? [{ sku: input.sku }] : []),
                    ...(input.barcode !== undefined ? [{ barcode: input.barcode }] : []),
                ],
            },
        });
        if (duplicate) {
            throw new AppError("A product with this name, SKU, or barcode already exists", 409);
        }
    }

    const updated = await prisma.products.update({
        where: { id },
        data: omitHandler(input),
    });

    return updated;
};

export const productDeleteService = async (id: number) => {
    const product = await prisma.products.findUnique({ where: { id } });
    if (!product) {
        throw new AppError("Product not found", 404);
    }
    await prisma.products.delete({ where: { id } });
};