import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

export type ValidationSchema = {
  params?: z.ZodObject<any, any>;
  query?: z.ZodObject<any, any>;
  body?: z.ZodObject<any, any>;
};

export function validationMiddleware(schema: ValidationSchema) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      if (schema.body) {
        req.body = schema.body.parse(req.body);
      }
      if (schema.params) {
        req.params = schema.params.parse(req.params);
      }
      if (schema.query) {
        req.query = schema.query.parse(req.query);
      }
      next();
    } catch (error) {
      console.error(error);
      next(error);
    }
  };
}
