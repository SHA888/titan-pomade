import { registerAs } from '@nestjs/config';

function parseFrom(
  raw?: string,
): { name?: string; email?: string } | undefined {
  if (!raw) return undefined;
  // Accept formats like: "Name <email@example.com>" or just "email@example.com"
  const match = raw.match(/^\s*([^<]+)?\s*<\s*([^>]+)\s*>\s*$/);
  if (match) {
    const name = match[1]?.trim();
    const email = match[2]?.trim();
    return { name, email };
  }
  // Fallback: treat as plain email
  return { email: raw.trim() };
}

export default registerAs('mail', () => ({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : undefined,
  secure: process.env.SMTP_SECURE === 'true',
  user: process.env.SMTP_USER,
  password: process.env.SMTP_PASS,
  from: parseFrom(process.env.SMTP_FROM),
}));
