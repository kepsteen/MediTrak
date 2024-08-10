/* eslint-disable @typescript-eslint/no-unused-vars -- Remove when used */
import 'dotenv/config';
import express from 'express';
import pg from 'pg';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { ClientError, errorMiddleware, authMiddleware } from './lib/index.js';
import { request } from 'http';

type Medication = {
  medicationId: number;
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

type ScheduleInput = {
  scheduleId: number;
  medicationId: number;
  timesPerDay: string;
  daysOfWeek: string;
  userId: number;
  name: string;
  dosage: string;
  form: string;
  createdAt: string;
  updatedAt: string;
};

type ScheduleOutput = {
  scheduleId: number;
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

type Log = {
  id: number;
  medicationId: number;
  userId: number;
  scheduleId: number;
  taken: boolean;
  updatedAt: string;
};

type User = {
  userId: number;
  username: string;
  password: string;
  hashedPassword: string;
  fullName: string;
  role: string;
  dob: string;
  notificationsEnabled: boolean;
  phoneNumber: string;
};

type Auth = {
  username: string;
  password: string;
};

type Requests = {
  requestId: number;
  requestedId: number;
  requesterId: number;
  requesterUsername: string;
  requesterFullName: string;
  active: string;
  requestedAt: string;
  updatedAt: string;
};

type CaregiverAccess = {
  userId: number;
  connectedUserId: number;
  grantedAt: string;
  active: string;
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
    reqBody as ScheduleInput;
  if (!Number.isInteger(medicationId)) {
    throw new ClientError(400, 'Valid medicationId (integer) is required');
  }
  if (!Number.isInteger(+timesPerDay)) {
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

function validateUser(reqBody: unknown): void {
  const { username, password, role, dob, phoneNumber, notificationsEnabled } =
    reqBody as User;
  if (!username) {
    throw new ClientError(400, 'username is required');
  }
  if (!password) throw new ClientError(400, 'Password is required');
  if (!role) throw new ClientError(400, 'Role is required');
  if (!dob) throw new ClientError(400, 'Date of Birth is required');
  if (phoneNumber === undefined)
    throw new ClientError(400, 'Phone number is required');
  if (notificationsEnabled === undefined || notificationsEnabled === null)
    throw new ClientError(400, 'NotificationsEnabled required');
}

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const hashKey = process.env.TOKEN_SECRET;
if (!hashKey) throw new Error('TOKEN_SECRET not found in .env');

const app = express();

// Create paths for static directories
const reactStaticDir = new URL('../client/dist', import.meta.url).pathname;
const uploadsStaticDir = new URL('public', import.meta.url).pathname;

app.use(express.static(reactStaticDir));
// Static directory for file uploads server/public/
app.use(express.static(uploadsStaticDir));
app.use(express.json());

app.post('/api/sign-up', async (req, res, next) => {
  try {
    const { username, password, dob, role, phoneNumber, notificationsEnabled } =
      req.body;
    validateUser(req.body);
    const checkUsernameSql = `
      select *
        from "users"
        where "username" = $1;
    `;
    const userCheck = await db.query<User>(checkUsernameSql, [username]);
    if (userCheck.rows.length > 0) {
      throw new ClientError(409, `Username ${username} already exists.`);
    }
    const hashedPassword = await argon2.hash(password);
    const sql = `
      insert into "users" ("username", "hashedPassword", "role", "dateOfBirth", "phoneNumber", "notificationsEnabled")
        values ($1, $2, $3, $4, $5, $6)
        returning "id", "username", "createdAt";
    `;
    const result = await db.query<User>(sql, [
      username,
      hashedPassword,
      role,
      dob,
      phoneNumber,
      notificationsEnabled,
    ]);
    const [user] = result.rows;
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
});

app.post('/api/sign-in', async (req, res, next) => {
  try {
    const { username, password } = req.body as Partial<Auth>;
    if (!username || !password) {
      throw new ClientError(400, 'username and password are required fields');
    }
    const sql = `
      select *
        from "users"
        where "username" = $1;
    `;
    const result = await db.query<User>(sql, [username]);
    const [user] = result.rows;
    if (!user) throw new ClientError(401, 'Invalid Login');
    if (!(await argon2.verify(user.hashedPassword, password))) {
      throw new ClientError(401, 'Invalid Password');
    }
    const payload = {
      userId: user.userId,
      username: user.username,
      fullName: user.fullName,
      role: user.role,
    };
    const token = jwt.sign(payload, hashKey);
    res.status(200).json({
      user: payload,
      token,
    });
  } catch (err) {
    next(err);
  }
});

app.post('/api/medications', authMiddleware, async (req, res, next) => {
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

app.get('/api/medications/:userId', authMiddleware, async (req, res, next) => {
  try {
    const { userId } = req.params;
    if (!userId) throw new ClientError(400, 'UserId required');
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

app.post('/api/schedule', authMiddleware, async (req, res, next) => {
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

    const timeOptions = ['Morning', 'Noon', 'Evening', 'Bed time'];

    const scheduleValues = [];
    const logValues = [];
    for (const day of daysOfWeek) {
      for (let i = 0; i < timesPerDay; i++) {
        const timeOfDay = timeOptions[i];
        scheduleValues.push([
          medicationId,
          timeOfDay,
          day,
          userId,
          name,
          dosage,
          form,
        ]);
      }
    }
    const scheduleSql = `
      INSERT INTO "medicationSchedules" ("medicationId", "timeOfDay", "dayOfWeek", "userId", "name", "dosage", "form")
      VALUES ${scheduleValues
        .map(
          (_, index) =>
            `($${index * 7 + 1}, $${index * 7 + 2}, $${index * 7 + 3}, $${
              index * 7 + 4
            }, $${index * 7 + 5}, $${index * 7 + 6}, $${index * 7 + 7})`
        )
        .join(', ')}
      RETURNING *;
    `;
    const scheduleResult = await db.query(scheduleSql, scheduleValues.flat());
    for (const schedule of scheduleResult.rows) {
      logValues.push([medicationId, userId, schedule.scheduleId, false]);
    }
    const logSql = `
      INSERT INTO "medicationLogs" ("medicationId", "userId", "scheduleId", "taken")
      VALUES ${logValues
        .map(
          (_, index) =>
            `($${index * 4 + 1}, $${index * 4 + 2}, $${index * 4 + 3}, $${
              index * 4 + 4
            })`
        )
        .join(', ')}
      RETURNING *;
    `;
    const logResult = await db.query(logSql, logValues.flat());
    res.status(201).json(scheduleResult.rows);
  } catch (err) {
    next(err);
  }
});

app.get('/api/schedule/:day', authMiddleware, async (req, res, next) => {
  try {
    const { day } = req.params;
    const sql = `
      select *
        from "medicationSchedules" as "ms"
        join "medicationLogs" as "ml" using ("scheduleId")
        where "ms"."userId" = $1 AND "dayOfWeek" = $2;
    `;
    const result = await db.query<ScheduleOutput>(sql, [req.user?.userId, day]);
    const schedules = result.rows;
    if (schedules.length > 0) {
      for (const schedule of schedules) {
        const updatedAt = new Date(schedule.updatedAt);
        const currentDate = new Date();
        const differenceInDays: number =
          (currentDate.getTime() - updatedAt.getTime()) / (1000 * 60 * 60 * 24);
        if (differenceInDays > 7) {
          const sql = `
            update "medicationLogs"
              set "taken" = false
              where "scheduleId = $1
              returning *;
          `;
          const result = await db.query<Log>(sql, [schedule.scheduleId]);
          const sql2 = `
            update "medicationSchedules"
              set "updatedAt" = NOW()
              where "scheduleId" = $1
              returning *;
          `;
          const result2 = await db.query<ScheduleOutput>(sql2, [
            schedule.scheduleId,
          ]);
        }
      }
    }
    res.json(schedules);
  } catch (err) {
    next(err);
  }
});

app.put('/api/medications', authMiddleware, async (req, res, next) => {
  try {
    const { scheduled, id } = req.body;
    if (scheduled === undefined) {
      throw new ClientError(400, 'scheduled property required');
    }
    if (!id) throw new ClientError(400, 'medicationId required');
    const sql = `
      update "medications"
        set "scheduled" = $1
        where "medicationId" = $2
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

app.put(
  '/api/medications/:id/inventory',
  authMiddleware,
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const { operation } = req.body;
      if (!Number.isInteger(+id))
        throw new ClientError(400, 'Valid medicationId (integer) required');
      if (operation !== 'decrement' && operation !== 'increment') {
        throw new ClientError(400, 'Valid operation required');
      }
      const sql = `
      select * from "medications"
        where "medicationId" = $1;
    `;
      const result = await db.query<Medication>(sql, [id]);
      const [medication] = result.rows;

      if (!medication) throw new ClientError(404, 'no medication found');

      let medicationToUpdate = { ...medication };
      if (operation === 'decrement') {
        medicationToUpdate = {
          ...medication,
          remaining: medication.remaining - 1,
        };
      } else if (operation === 'increment') {
        medicationToUpdate = {
          ...medication,
          remaining: medication.remaining + 1,
        };
      }
      const { remaining, medicationId } = medicationToUpdate;
      const sql2 = `
      update "medications"
        set "remaining" = $1
        where "medicationId" = $2
        returning *;
    `;
      const result2 = await db.query<Medication>(sql2, [
        remaining,
        medicationId,
      ]);
      const [updatedMedication] = result2.rows;
      if (!updatedMedication) throw new ClientError(404, 'No medication found');
      res.status(200).json(updatedMedication);
    } catch (err) {
      next(err);
    }
  }
);
/*
 * Handles paths that aren't handled by any other route handler.
 * It responds with `index.html` to support page refreshes with React Router.
 * This must be the _last_ route, just before errorMiddleware.
 */

app.put('/api/log/:scheduleId', authMiddleware, async (req, res, next) => {
  try {
    const { scheduleId } = req.params;
    const { operation } = req.body;
    let taken;
    switch (operation) {
      case 'decrement':
        taken = true;
        break;
      case 'increment':
        taken = false;
        break;
    }
    const sql = `
      update "medicationLogs"
        set "taken" = $1
        where "scheduleId" = $2
        returning *;
    `;
    const result = await db.query<Log>(sql, [taken, scheduleId]);
    const [log] = result.rows;
    if (!log) throw new ClientError(404, `Log ${scheduleId} not found`);
    res.status(200).json(log);
  } catch (err) {
    next(err);
  }
});

app.get('/api/requests', authMiddleware, async (req, res, next) => {
  console.log('hit endpoint');
  try {
    const sql = `
      select *
        from "accessRequests"
        where "requestedId" = $1;
    `;
    const result = await db.query<Requests>(sql, [req.user?.userId]);
    const requests = result.rows;
    res.json(requests);
  } catch (err) {
    next(err);
  }
});

app.post('/api/requests/add', authMiddleware, async (req, res, next) => {
  try {
    const { username } = req.body;
    const sql = `
      select "userId"
        from "users"
        where "username" = $1;
    `;
    const result = await db.query<User>(sql, [username]);
    const [requestedUser] = result.rows;
    if (!requestedUser)
      throw new ClientError(404, `User ${username} not found.`);
    const requestSql = `
      insert into "accessRequests" ("requestedId", "requesterId", "requesterUsername", "requesterFullName", "active")
        values ($1, $2, $3, $4, $5)
        returning *;
    `;
    const resultRequest = await db.query<Requests>(requestSql, [
      requestedUser.userId,
      req.user?.userId,
      req.user?.username,
      req.user?.fullName,
      true,
    ]);
    const [request] = resultRequest.rows;
    res.status(201).json(request);
  } catch (err) {
    next(err);
  }
});

app.put('/api/requests/respond', authMiddleware, async (req, res, next) => {
  try {
    const { requesterId, isAccepted } = req.body;
    if (!requesterId) throw new ClientError(400, 'requesterId is required');
    if (!Number.isInteger(+requesterId))
      throw new ClientError(400, 'Valid requesterId (integer) is required');
    const deleteRequestSql = `
      delete from "accessRequests"
        where "requesterId" = $1 and "requestedId" = $2
        returning *;
    `;
    const resultDeleteRequest = await db.query<Requests>(deleteRequestSql, [
      requesterId,
      req.user?.userId,
    ]);
    const [accessRequest] = resultDeleteRequest.rows;
    if (!accessRequest) throw new ClientError(404, 'Request not found');
    if (!isAccepted) return;
    const sql = `
      insert into "caregiverAccess" ("userId", "connectedUserId", "active")
        values ($1, $2, $3)
        returning *;
    `;
    const result = await db.query<CaregiverAccess>(sql, [
      req.user?.userId,
      requesterId,
      true,
    ]);
    const [access] = result.rows;
    if (!access) throw new ClientError(404, 'Caregiver Access not found');
    res.status(200).json(access);
  } catch (err) {
    next(err);
  }
});

app.get('*', (req, res) => res.sendFile(`${reactStaticDir}/index.html`));

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  console.log('Listening on port', process.env.PORT);
});
