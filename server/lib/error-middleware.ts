/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { ClientError } from './client-error.js';
import { ZodError } from 'zod';

export function errorMiddleware(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof ClientError) {
    res.status(err.status).json({ error: err.message });
  } else if (err instanceof jwt.JsonWebTokenError) {
    res.status(401).json({ error: 'invalid access token' });
  } else if (err instanceof ZodError) {
    res.status(400).json({ error: 'invalid schema' });
  } else {
    console.error(err);
    res.status(500).json({
      error: 'an unexpected error occurred',
      message: err instanceof Error ? err.message : undefined,
    });
  }
}
