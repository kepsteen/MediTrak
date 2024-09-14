import { z } from 'zod';
import { ValidationSchema } from './validation-middleware';

export const addMedicationSchema = {
  body: z.object({
    name: z.string(),
    dosage: z.string(),
    form: z.string(),
    notes: z.string().nullable(),
    prescriber: z.string().nullable(),
    amount: z.string(),
    remaining: z.string(),
    userId: z.number(),
  }),
};

export const scheduleInputSchema = {
  body: z.object({
    medicationId: z.number(),
    timesPerDay: z.number(),
    daysOfWeek: z.string().array(),
    userId: z.number(),
    name: z.string(),
    dosage: z.string(),
    form: z.string(),
  }),
};

export const userSchema: ValidationSchema = {
  body: z.object({
    username: z.string(),
    password: z.string(),
    role: z.string(),
    fullName: z.string(),
    dob: z.string(),
    notificationsEnabled: z.boolean(),
    phoneNumber: z.string(),
  }),
};

export const getMedicationsSchema = {
  params: z.object({
    userId: z
      .string()
      .transform((val) => parseInt(val))
      .refine((val) => !isNaN(val)),
  }),
  query: z.object({
    name: z.string().optional(),
    form: z
      .enum([
        'Tablet',
        'Capsule',
        'Liquid',
        'Injection',
        'Patch',
        'Inhaler',
        'Topical',
      ])
      .optional(),
  }),
};
