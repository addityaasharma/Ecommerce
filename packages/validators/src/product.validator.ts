import { z } from 'zod'


export const productSchema = z.object({
    categoryId: z.number().optional(),
    vendorId: z.number().optional(),
    name: z.string().min(1, "Please enter product name"),
    description: z.string().min(1, "Please enter product description").optional(),
    productImage: z.url(),
    productImages: z.url().array().optional(),
    sizes: z.string().array().optional(),
    colors: z.string().array().optional(),
    price: z.number(),
    compareAtPrice: z.number().optional(),
    stock: z.number(),
    unitPrice: z.number().optional(),
    chargeTax: z.boolean().optional(),
    taxRate: z.number().optional(),
    costPrice: z.number().optional(),
    sku: z.string().min(1, "Please enter SKU"),
    barcode: z.string().min(1, "Please enter barcode").optional(),
    countryOfOrigin: z.string().min(1, "Please enter country of origin").optional(),
    weight: z.number().optional(),
    weightUnit: z.string().min(1, "Please enter weight unit").max(20).optional(),
    commission: z.number().optional(),
    productType: z.enum(["physical", "digital"]).optional(),
    sellWhenOutOfStock: z.boolean().optional(),
    quantity: z.number(),
    status: z.enum(["active", "draft", "inactive"]).optional(),
});


export const productUpdateSchema = z.object({
    categoryId: z.number().optional(),
    vendorId: z.number().optional(),
    name: z.string().min(1, "Please enter product name").optional(),
    description: z.string().min(1, "Please enter product description").optional(),
    productImage: z.url().optional(),
    productImages: z.url().array().optional(),
    sizes: z.string().array().optional(),
    colors: z.string().array().optional(),
    price: z.number().optional(),
    compareAtPrice: z.number().optional(),
    stock: z.number().optional(),
    unitPrice: z.number().optional(),
    chargeTax: z.boolean().optional(),
    taxRate: z.number().optional(),
    costPrice: z.number().optional(),
    sku: z.string().min(1, "Please enter SKU").optional(),
    barcode: z.string().min(1, "Please enter barcode").optional(),
    countryOfOrigin: z.string().min(1, "Please enter country of origin").optional(),
    weight: z.number().optional(),
    weightUnit: z.string().min(1, "Please enter weight unit").max(20).optional(),
    commission: z.number().optional(),
    productType: z.enum(["physical", "digital"]).optional(),
    sellWhenOutOfStock: z.boolean().optional(),
    quantity: z.number().optional(),
    status: z.enum(["active", "draft", "inactive"]).optional(),
})

export const productQuerySchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
    search: z.string().trim().min(1).optional(),
    sortBy: z.enum(["name", "price", "newest", "oldest", "stock"]).default("newest"),
    status: z.enum(["active", "draft", "inactive"]).optional(),
    categoryId: z.coerce.number().optional(),
});

export type ProductQuery = z.output<typeof productQuerySchema>;
export type ProductInput = z.output<typeof productSchema>;
export type ProductUpdateInput = z.output<typeof productUpdateSchema>