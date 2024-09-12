import { z } from 'zod';

// type Medication = {
//   medicationId: number;
//   name: string;
//   dosage: string;
//   form: string;
//   notes: string;
//   prescriber: string;
//   amount: number;
//   remaining: number;
//   userId: number;
//   createdAt: string;
// };

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
