/* eslint-disable @typescript-eslint/no-unused-vars -- Remove when used */
import 'dotenv/config';
import express from 'express';
import pg, { Client } from 'pg';
import { ClientError, errorMiddleware } from './lib/index.js';

type Medication = {
  id: number;
  name: string;
  dosage: string;
  form: string;
  notes: string;
  prescriber: string;
  amount: number;
  remaining: number;
  userId: number;
  createdAt: string;
};

type Schedule = {
  id: number;
  medicationId: number;
  timesPerDay: number;
  daysOfWeek: string[];
  userId: number;
  name: string;
  dosage: string;
  form: string;
};

function validateMedication(reqBody: unknown): void {
  const { name, dosage, form, notes, prescriber, amount, remaining, userId } =
    reqBody as Medication;

  if (name === undefined) throw new ClientError(400, 'no name provided');
  if (dosage === undefined) throw new ClientError(400, 'no dosage provided');
  if (form === undefined) throw new ClientError(400, 'no form provided');
  if (notes === undefined) throw new ClientError(400, 'no notes provided');
  if (prescriber === undefined)
    throw new ClientError(400, 'no prescriber provided');
  if (amount === undefined) throw new ClientError(400, 'no amount provided');
  if (remaining === undefined)
    throw new ClientError(400, 'no remaining provided');
  if (userId === undefined) throw new ClientError(400, 'no userId provided');
  if (!Number.isInteger(+amount) && amount !== null) {
    throw new ClientError(400, `amount ${amount} is not a number`);
  }
  if (!Number.isInteger(+remaining) && remaining !== null) {
    throw new ClientError(400, `amount ${remaining} is not a number`);
  }
}

function validateSchedule(reqBody: unknown): void {
  const { medicationId, timesPerDay, daysOfWeek, userId, name, dosage, form } =
    reqBody as Schedule;
  if (!Number.isInteger(medicationId)) {
    throw new ClientError(400, 'Valid medicationId (integer) is required');
  }
  if (!Number.isInteger(timesPerDay)) {
    throw new ClientError(400, 'Valid timesPerDay (integer) is required');
  }
  if (
    !Array.isArray(daysOfWeek) ||
    !daysOfWeek.every((day) => typeof day === 'string')
  ) {
    throw new ClientError(400, 'daysOfWeek must be an array of strings');
  }
  if (!Number.isInteger(userId)) {
    throw new ClientError(400, 'Valid userId (integer) is required');
  }
  if (!name) throw new ClientError(400, 'Valid name required');
  if (!dosage) throw new ClientError(400, 'Valid dosage required');
  if (!form) throw new ClientError(400, 'Valid form required');
}

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const app = express();

// Create paths for static directories
const reactStaticDir = new URL('../client/dist', import.meta.url).pathname;
const uploadsStaticDir = new URL('public', import.meta.url).pathname;

app.use(express.static(reactStaticDir));
// Static directory for file uploads server/public/
app.use(express.static(uploadsStaticDir));
app.use(express.json());

app.post('/api/medications', async (req, res, next) => {
  try {
    validateMedication(req.body);
    const {
      name,
      dosage,
      form,
      notes,
      prescriber,
      amount,
      remaining,
      scheduled,
      userId,
    } = req.body;
    const sql = `
      insert into "medications" ("rxcui","name","dosage","form","notes","prescriber","amount","remaining","scheduled","userId" )
        values($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        returning *;
    `;
    const params = [
      1,
      name,
      dosage,
      form,
      notes,
      prescriber,
      amount,
      remaining,
      scheduled,
      userId,
    ];
    const result = await db.query<Medication>(sql, params);
    const [medication] = result.rows;
    res.status(201).json(medication);
  } catch (err) {
    next(err);
  }
});

app.get('/api/medications/:userId', async (req, res, next) => {
  try {
    const { userId } = req.params;
    if (!userId) throw new ClientError(400, 'UserId required');
    // Not sure if this is correct
    const sql = `
      select *
        from "medications"
        where "userId" = $1;
    `;
    const result = await db.query<Medication>(sql, [userId]);
    const medications = result.rows;
    res.json(medications);
  } catch (err) {
    next(err);
  }
});

app.post('/api/schedule', async (req, res, next) => {
  try {
    validateSchedule(req.body);
    const {
      medicationId,
      timesPerDay,
      daysOfWeek,
      userId,
      name,
      dosage,
      form,
    } = req.body;

    const sql = `
      insert into "medicationSchedules" ("medicationId", "timesPerDay", "daysOfWeek", "userId", "name", "dosage", "form")
        values ($1, $2, $3, $4, $5, $6, $7)
        returning *;
    `;
    const result = await db.query<Schedule>(sql, [
      medicationId,
      timesPerDay,
      daysOfWeek,
      userId,
      name,
      dosage,
      form,
    ]);
    const schedules = result.rows;
    console.log('schedules', schedules);
    res.status(201).json(schedules);
  } catch (err) {
    next(err);
  }
});

app.put('/api/medications', async (req, res, next) => {
  try {
    const { scheduled, id } = req.body;
    if (scheduled === undefined) {
      throw new ClientError(400, 'scheduled property required');
    }
    if (!id) throw new ClientError(400, 'medicationId required');
    const sql = `
      update "medications"
        set "scheduled" = $1
        where "id" = $2
        returning *;
    `;
    const result = await db.query(sql, [scheduled, id]);
    const [medication] = result.rows;
    if (!medication)
      throw new ClientError(404, `failed to update scheduled status`);
    res.status(200).json(medication);
  } catch (err) {
    next(err);
  }
});

app.get('/api/schedule', async (req, res, next) => {
  try {
    const sql = `
      select *
        from "medicationSchedules";
    `;
    const result = await db.query(sql);
    const schedules = result.rows;
    if (schedules.length === 0)
      throw new ClientError(404, 'No schedules found');
    res.json(schedules);
  } catch (err) {
    next(err);
  }
});
/*
 * Handles paths that aren't handled by any other route handler.
 * It responds with `index.html` to support page refreshes with React Router.
 * This must be the _last_ route, just before errorMiddleware.
 */
app.get('*', (req, res) => res.sendFile(`${reactStaticDir}/index.html`));

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  console.log('Listening on port', process.env.PORT);
});
