import { z } from "zod";

const fileSchema = z.instanceof(File).refine(file => file.size > 0, {
    message: 'File is required'
}).transform(file => ({
    ...file,
    preview: URL.createObjectURL(file)
}));

export const createProductSchema = z.object({
    name: z.string({ required_error: 'Product name is required'}),
    description: z.string({required_error: 'Description is required'}).min(10, { 
        message: 'Description must be at least 10 characters'}),
    price: z.coerce.number({required_error: 'Price is required'})
        .min(1, 'Price must ber at least 1 €'),
    type: z.string({required_error: 'Type is required'}),
    brand: z.string({required_error: 'Brand is required'}),
    quantityInStock: z.coerce.number({required_error: 'Quantity is required'})
        .min(1, 'Quantity must be at least 1'),
    pictureUrl: z.string().optional(),
    file: fileSchema.optional()
}).refine((data) => data.pictureUrl || data.file, {
    message: 'Image is required',
    path: ['file']
});

export type CreateProductSchema = z.infer<typeof createProductSchema>;