import { prisma } from "@repo/db";
import type { CategoryInput, CategoryQuery, CategoryUpdateInput } from "@repo/validators";
import { AppError } from "../../../common/error/appError.js";
import slugify from 'slugify';
import type { Prisma } from "@repo/db/src/generated/prisma/client.js";


export const categoryService = async (input: CategoryInput) => {
    const category = await prisma.category.findUnique({
        where: { name: input.name }
    });
    if (category) {
        throw new AppError("Category already exists", 409);
    }

    const slug = slugify(input.name, { lower: true, strict: true });
    const new_category = await prisma.category.create({
        data: {
            name: input.name,
            description: input.description ?? "",
            icon: input.icon,
            color: input.color,
            slug,
        }
    });

    return new_category;
};

export const categoryDetailService = async ({ page, limit, search, sortBy }: CategoryQuery) => {
    const skip = (page - 1) * limit;
    const where: Prisma.CategoryWhereInput = search ? {
        OR: [
            { name: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } }
        ]
    } : {};

    const orderBy: Prisma.CategoryOrderByWithRelationInput =
        sortBy === "name"
            ? { name: "asc" }
            : sortBy === "oldest"
                ? { createdAt: "asc" }
                : sortBy === "mostProducts"
                    ? { products: { _count: "desc" } }
                    : { createdAt: "desc" };

    const [categories, total] = await Promise.all([
        prisma.category.findMany({
            where,
            skip,
            take: limit,
            orderBy,
            include: {
                _count: { select: { products: true } },
            },
        }),
        prisma.category.count({ where }),
    ]);

    return {
        data: categories,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
};

export const categorySingleDetailService = async (id: number) => {
    const category = await prisma.category.findUnique({
        where: { id }
    });
    if (!category) {
        throw new AppError("Category not found", 404);
    }
    return category;
};

export const categoryUpdateService = async (input: CategoryUpdateInput, id: number) => {
    const category = await prisma.category.findUnique({
        where: { id }
    });
    if (!category) {
        throw new AppError("Category not found", 404);
    }

    const update_category = await prisma.category.update({
        where: { id },
        data: {
            ...(input.name !== undefined && { name: input.name, slug: slugify(input.name, { lower: true, strict: true }) }),
            ...(input.description !== undefined && { description: input.description }),
            ...(input.icon !== undefined && { icon: input.icon }),
            ...(input.color !== undefined && { color: input.color }),
        }
    });

    return update_category;
};

export const categoryDeleteService = async (id: number) => {
    const category = await prisma.category.findUnique({ where: { id } });
    if (!category) {
        throw new AppError("Category not found", 404);
    }
    await prisma.category.delete({ where: { id } });
};