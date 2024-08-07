export type Medication = {
  id: number;
  name: string;
  dosage: string;
  form: string;
  notes: string;
  prescriber: string;
  amount: number;
  remaining: number;
  userId: number;
  scheduled: boolean;
  createdAt: string;
};

export type Schedule = {
  id: number;
  medicationId: number;
  timeOfDay: string;
  dayOfWeek: string;
  userId: number;
  name: string;
  dosage: string;
  form: string;
  createdAt: string;
  updatedAt: string;
};

export type Log = {
  id: number;
  medicationId: number;
  userId: number;
  scheduleId: number;
  taken: boolean;
  updatedAt: string;
};
