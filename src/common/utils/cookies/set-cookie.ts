import { Response } from 'express';

export function setCookie(
  res: Response,
  name: string,
  value?: string,
  maxAge?: number,
): void {
  res.cookie(name, value ?? null, {
    expires: new Date(Date.now() + (maxAge ?? 0)),
  });
}
