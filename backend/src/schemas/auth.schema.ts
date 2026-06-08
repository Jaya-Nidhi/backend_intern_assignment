import { z } from 'zod';

export const RegisterSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  role: z.enum(['USER', 'ADMIN']).optional().default('USER'),
});

export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const NoteSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  content: z.string().min(1, 'Content cannot be empty').max(5000, 'Content too long'),
});

export const UpdateNoteSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  content: z.string().min(1).max(5000).optional(),
}).refine(data => data.title !== undefined || data.content !== undefined, {
  message: 'At least one field (title or content) must be provided',
});

export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type NoteInput = z.infer<typeof NoteSchema>;
export type UpdateNoteInput = z.infer<typeof UpdateNoteSchema>;
