import { z } from 'zod';

export const medicationSchema = z.object({
  name: z.string(),
  dosage: z.string(),
  form: z.string(),
  notes: z.string().nullable(),
  prescriber: z.string().nullable(),
  amount: z.string(),
  remaining: z.string(),
  userId: z.number(),
});

export const scheduleInputSchema = z.object({
  medicationId: z.number(),
  timesPerDay: z.number(),
  daysOfWeek: z.string().array(),
  userId: z.number(),
  name: z.string(),
  dosage: z.string(),
  form: z.string(),
});

export const userSchema = z.object({
  username: z.string(),
  password: z.string(),
  role: z.string(),
  fullName: z.string(),
  dob: z.string(),
  notificationsEnabled: z.boolean(),
  phoneNumber: z.string(),
});
