import { z } from 'zod'

export const loginSchema = z.object({
	email: z.string().email('Invalid email'),
	password: z.string().min(1, 'Password is required'),
})

export const registerSchema = z
	.object({
		name: z.string().min(1, 'Name is required'),
		email: z.string().email('Invalid email'),
		password: z.string().min(8, 'Password must be at least 8 characters long'),
		repeatPassword: z.string().min(1, 'Repeat password is required'),
	})
	.refine((data) => data.password === data.repeatPassword, {
		message: 'Passwords do not match',
		path: ['repeatPassword'],
	})

export type TLoginInput = z.infer<typeof loginSchema>
export type TRegisterInput = z.infer<typeof registerSchema>

