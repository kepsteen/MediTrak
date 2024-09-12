import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

export function validationMiddleware(schema: z.ZodObject<any, any>) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.body);
    } catch (error) {
      next(error);
    } finally {
      next();
    }
  };
}
