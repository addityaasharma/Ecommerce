import z from 'zod';

export const categoryValidator = z.object({
    name: z.string().min(1, "please enter name"),
    description: z.string().min(1, "please add little description").optional(),
    icon: z.url(),
    color: z.string().min(1, "enter color"),
})

export const updateCategoryValidator = z.object({
    name: z.string().optional(),
    description: z.string().min(1, "please add little description").optional(),
    icon: z.url().optional(),
    color: z.string().min(1, "enter color").optional(),
})

export const categoryQuerySchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
    search: z.string().trim().min(1).optional(),
    sortBy: z.enum(["newest", "oldest", "name", "mostProducts"]).default("newest")
});

export type CategoryQuery = z.output<typeof categoryQuerySchema>;
export type CategoryInput = z.output<typeof categoryValidator>;
export type CategoryUpdateInput = z.output<typeof updateCategoryValidator>;