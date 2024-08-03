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
  timesPerDay: number;
  userId: number;
};
