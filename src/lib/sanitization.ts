export interface SanitizationOptions {
  allowedTags?: string[];
  allowedAttributes?: string[];
  allowDataAttributes?: boolean;
}

/**
 * Sanitize HTML content to prevent XSS attacks
 * Note: This is a basic implementation. For production, consider using DOMPurify
 */
export function sanitizeHtml(
  html: string,
  options: SanitizationOptions = {}
): string {
  if (typeof html !== 'string') return '';

  // Basic HTML sanitization - remove script tags and event handlers
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/on\w+='[^']*'/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/vbscript:/gi, '')
    .replace(/data:text\/html/gi, '');
}

/**
 * Sanitize plain text input (remove potentially dangerous characters)
 */
export function sanitizeText(text: string): string {
  if (typeof text !== 'string') return '';

  return text
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
}

/**
 * Sanitize URL input
 */
export function sanitizeUrl(url: string): string {
  if (typeof url !== 'string') return '';

  try {
    const parsedUrl = new URL(url);

    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return '';
    }

    return parsedUrl.toString();
  } catch {
    // If URL parsing fails, return empty string
    return '';
  }
}

/**
 * Sanitize filename (remove path traversal and dangerous characters)
 */
export function sanitizeFilename(filename: string): string {
  if (typeof filename !== 'string') return '';

  return filename
    .replace(/[/\\]/g, '') // Remove path separators
    .replace(/[<>:"|?*]/g, '') // Remove Windows forbidden characters
    .replace(/^\.+/, '') // Remove leading dots
    .replace(/\.$/, '') // Remove trailing dot
    .trim();
}

/**
 * Validate and sanitize email
 */
export function sanitizeEmail(email: string): string {
  if (typeof email !== 'string') return '';

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const sanitized = email.toLowerCase().trim();

  return emailRegex.test(sanitized) ? sanitized : '';
}