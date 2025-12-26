import { z } from 'zod';

// Authentication schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email format').min(1, 'Email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters').max(20, 'Username must be less than 20 characters'),
  nickname: z.string().min(1, 'Nickname is required').max(50, 'Nickname must be less than 50 characters'),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

// Chat schemas
export const sendMessageSchema = z.object({
  content: z.string().min(1, 'Message cannot be empty').max(2000, 'Message too long'),
  chatId: z.string().uuid('Invalid chat ID'),
});

export const createChatSchema = z.object({
  name: z.string().min(1, 'Chat name is required').max(100, 'Chat name too long'),
  participants: z.array(z.string().uuid()).min(1, 'At least one participant required'),
  type: z.enum(['direct', 'group']).default('direct'),
});

// Integration schemas
export const discordIntegrationSchema = z.object({
  botToken: z.string().min(1, 'Bot token is required'),
  webhookUrl: z.string().url().optional(),
});

export const slackIntegrationSchema = z.object({
  accessToken: z.string().min(1, 'Access token is required'),
  webhookUrl: z.string().url().optional(),
});

export const telegramIntegrationSchema = z.object({
  botToken: z.string().min(1, 'Bot token is required'),
  webhookUrl: z.string().url().optional(),
});

export const integrationConfigSchema = z.union([
  discordIntegrationSchema,
  slackIntegrationSchema,
  telegramIntegrationSchema,
]);

// File upload schema
export const fileUploadSchema = z.object({
  filename: z.string().min(1, 'Filename is required').max(255, 'Filename too long'),
  contentType: z.string().regex(/^[^/]+\/[^/]+$/, 'Invalid content type'),
  size: z.number().max(10 * 1024 * 1024, 'File too large (max 10MB)'), // 10MB limit
});

// User profile schema
export const updateProfileSchema = z.object({
  nickname: z.string().min(1, 'Nickname is required').max(50, 'Nickname too long').optional(),
  bio: z.string().max(500, 'Bio too long').optional(),
  avatar: z.string().url().optional(),
});

// WebRTC schemas
export const startCallSchema = z.object({
  participants: z.array(z.string().uuid()).min(1, 'At least one participant required'),
  type: z.enum(['audio', 'video']).default('video'),
});

// Validation helper functions
export function validateData<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; errors: z.ZodError } {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  } else {
    return { success: false, errors: result.error };
  }
}

export function sanitizeAndValidate<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  sanitizer?: (data: unknown) => unknown
): { success: true; data: T } | { success: false; errors: z.ZodError } {
  const sanitizedData = sanitizer ? sanitizer(data) : data;
  return validateData(schema, sanitizedData);
}