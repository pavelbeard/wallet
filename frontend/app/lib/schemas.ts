import { z } from 'zod';

export const SignInSchema = z.object({
    identifier: z.union([
        z.string().trim().min(3).optional(),
        z.string().trim().min(3).email().optional()
    ]),
    password: z.string()
        .min(1, { message: 'Password required!' })
        .min(8, { message: 'Password should have at least 8 characters'})
});