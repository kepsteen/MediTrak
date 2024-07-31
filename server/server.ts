/* eslint-disable @typescript-eslint/no-unused-vars -- Remove when used */
import 'dotenv/config';
import express from 'express';
import pg from 'pg';
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

function validateMedication(reqBody: unknown): void {
  const { name, dosage, form, notes, prescriber, amount, remaining, userId } =
    reqBody as Medication;
  if (!name) throw new ClientError(400, 'no name provided');
  if (!dosage) throw new ClientError(400, 'no dosage provided');
  if (!form) throw new ClientError(400, 'no form provided');
  if (!notes) throw new ClientError(400, 'no notes provided');
  if (!prescriber) throw new ClientError(400, 'no prescriber provided');
  if (!amount) throw new ClientError(400, 'no amount provided');
  if (!remaining) throw new ClientError(400, 'no remaining provided');
  if (!userId) throw new ClientError(400, 'no userId provided');
  if (typeof amount !== 'number') {
    throw new ClientError(400, `amount ${amount} is not a number`);
  }
  if (typeof remaining !== 'number') {
    throw new ClientError(400, `amount ${amount} is not a number`);
  }
  if (remaining > amount) {
    throw new ClientError(400, `amount must be greater than remaining`);
  }
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
    console.log('req.body', req.body);
    validateMedication(req.body);
    const { name, dosage, form, notes, prescriber, amount, remaining, userId } =
      req.body;

    // const term = `${name} ${dosage}`;
    // // const response = await fetch(
    // //   `https://rxnav.nlm.nih.gov/REST/approximateTerm.json?term=${encodeURIComponent(
    // //     term
    // //   )}&maxEntries=1&option=0`,
    // //   {
    // //     method: 'GET',
    // //     headers: {
    // //       'Content-Type': 'application/json',
    // //     },
    // //   }
    // // );
    // // if (!response.ok) throw new Error(`Response status ${response.status}`);
    // // const result = await response.json();
    // // console.log('result', result);

    const sql = `
      insert into "medications" ("rxcui","name","dosage","form","notes","prescriber","amount","remaining","userId" )
        values($1, $2, $3, $4, $5, $6, $7, $8, $9)
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
      userId,
    ];
    const result = await db.query<Medication>(sql, params);
    const [medication] = result.rows;
    res.status(201).json(medication);
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