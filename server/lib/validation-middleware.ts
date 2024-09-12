import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

export function validationMiddleware(schema: z.ZodObject<any, any>) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      console.log(req.body);
      schema.parse(req.body);
      console.log('running');
    } catch (error) {
      console.error(error);
    } finally {
      next();
    }
  };
}
