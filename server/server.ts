/* eslint-disable @typescript-eslint/no-unused-vars -- Remove when used */
import 'dotenv/config';
import express from 'express';
import pg from 'pg';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { ClientError, errorMiddleware, authMiddleware } from './lib/index.js';
import twilio from 'twilio';

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
  status: string;
  requestedAt: string;
  updatedAt: string;
};

type ConnectedUsers = {
  requestId: number;
  requestedId: number;
  requestedUsername: string;
  requestedFullName: string;
  requesterId: number;
  requesterUsername: string;
  requesterFullName: string;
  status: string;
  requestedAt: string;
  updatedAt: string;
};

type MedicationUser = {
  medicationName: string;
  dosage: string;
  form: string;
  prescriber: string;
  remaining: number;
  phoneNumber: string;
  notificationsEnabled: boolean;
};

/**
 * Validates the data sent in the body of the request for a Medication type
 * @param reqBody - request body
 * @throws error if any of the fields are missing or are the incorrect type
 */
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

/**
 * Validates the data in the body of the request for a Schedule type
 * @param reqBody  - request body
 * @throws error if any of the fields are missing or are the incorrect type
 */
function validateSchedule(reqBody: unknown): void {
  const { medicationId, timesPerDay, daysOfWeek, userId, name, dosage, form } =
    reqBody as ScheduleInput;
  if (!Number.isInteger(+medicationId)) {
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

/**
 * Validates the data in the body of the request for a User type
 * @param reqBody - request body
 * @throws error if any of the fields are missing or are the incorrect type
 */
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

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

/**
 * Sends a msg to the User from the Twilio acct phone number
 * @param msgBody - the msg to be sent to the patient
 * @param phoneNumber - The patient's phone number
 */
async function createMessage(
  msgBody: string,
  phoneNumber: string
): Promise<void> {
  const message = await client.messages.create({
    body: msgBody,
    from: '+18559702293',
    to: `+1${phoneNumber}`,
  });
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

// Register a new User
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
        returning "userId", "username", "createdAt";
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

// Sign in a user
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

// Add new medication to the Database
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

// Get the medications of a user
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

// Schedule a medication
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
      currentDay,
    } = req.body;

    const timeOptions = ['Morning', 'Noon', 'Evening', 'Bed time'];

    const scheduleValues = [];
    const logValues = [];

    // Prepares the schedule data to be inserted into the database from the template.
    // The nested loops creates an array of schedule values arrays that has a length of daysOfWeek * timesPerDay.

    for (const dayOfWeek of daysOfWeek) {
      for (let i = 0; i < timesPerDay; i++) {
        const timeOfDay = timeOptions[i];
        scheduleValues.push([
          medicationId,
          timeOfDay,
          dayOfWeek,
          userId,
          name,
          dosage,
          form,
        ]);
      }
    }
    // This approach avoids having to create a query for each subarray of scheduleValues.
    // scheduleValues is mapped over to insert one row in the database for each subarray of scheduleValues.
    // The index is used to increment the parameterized placeholders according to the number of values inserted into each row (7 in this case)
    // e.g. values ($1, $2, $3, $4, $5, $6, $7),
    //             ($8, $9, $10, $11, $12, $13, $14) ...
    const scheduleSql = `
      insert into "medicationSchedules" ("medicationId", "timeOfDay", "dayOfWeek", "userId", "name", "dosage", "form")
      values ${scheduleValues
        .map(
          (_, index) =>
            `($${index * 7 + 1}, $${index * 7 + 2}, $${index * 7 + 3}, $${
              index * 7 + 4
            }, $${index * 7 + 5}, $${index * 7 + 6}, $${index * 7 + 7})`
        )
        .join(', ')}
      returning *;
    `;
    // The array is flattened so each item corresponds to the parameterized placeholder
    const scheduleResult = await db.query<ScheduleOutput>(
      scheduleSql,
      scheduleValues.flat()
    );
    for (const schedule of scheduleResult.rows) {
      logValues.push([medicationId, userId, schedule.scheduleId, false]);
    }
    // The created medication Schedules are used to create a log in the database that tracks if the patient has taken the medication
    const logSql = `
      insert into "medicationLogs" ("medicationId", "userId", "scheduleId", "taken")
      values ${logValues
        .map(
          (_, index) =>
            `($${index * 4 + 1}, $${index * 4 + 2}, $${index * 4 + 3}, $${
              index * 4 + 4
            })`
        )
        .join(', ')}
      returning *;
    `;
    const logResult = await db.query(logSql, logValues.flat());

    // After creating the rows in both tables the joinResult is returned in the response
    const joinSql = `
      select *
        from "medicationSchedules" AS "ms"
        join "medicationLogs" AS "ml" USING ("scheduleId")
        where "ms"."userId" = $1 and "ms"."dayOfWeek" = $2 and "ms"."medicationId" = $3;
    `;
    const joinResult = await db.query(joinSql, [
      userId,
      currentDay,
      medicationId,
    ]);
    res.status(201).json(joinResult.rows);
  } catch (err) {
    next(err);
  }
});

// Get the daily scheduled meds
app.get(
  '/api/schedule/:day/:patientId',
  authMiddleware,
  async (req, res, next) => {
    try {
      const { day, patientId } = req.params;
      const sql = `
      select *
        from "medicationSchedules" as "ms"
        join "medicationLogs" as "ml" using ("scheduleId")
        where "ms"."userId" = $1 and "dayOfWeek" = $2;
    `;
      const result = await db.query<ScheduleOutput>(sql, [patientId, day]);
      const schedules = result.rows;
      if (schedules.length > 0) {
        for (const schedule of schedules) {
          const updatedAt = new Date(schedule.updatedAt);
          const currentDate = new Date();
          const differenceInDays: number =
            (currentDate.getTime() - updatedAt.getTime()) /
            (1000 * 60 * 60 * 24);
          if (differenceInDays > 7) {
            const sql = `
            update "medicationLogs"
              set "taken" = false
              where "scheduleId = $1
              returning *;
          `;
            await db.query<Log>(sql, [schedule.scheduleId]);
            const sql2 = `
            update "medicationSchedules"
              set "updatedAt" = NOW()
              where "scheduleId" = $1
              returning *;
          `;
            await db.query<ScheduleOutput>(sql2, [schedule.scheduleId]);
          }
        }
      }
      res.json(schedules);
    } catch (err) {
      next(err);
    }
  }
);

// Update the scheduled attribute of the medication
app.put('/api/medications', authMiddleware, async (req, res, next) => {
  try {
    const { scheduled, medicationId } = req.body;
    if (scheduled === undefined) {
      throw new ClientError(400, 'scheduled property required');
    }
    if (!medicationId) throw new ClientError(400, 'medicationId required');
    const sql = `
      update "medications"
        set "scheduled" = $1
        where "medicationId" = $2
        returning *;
    `;
    const result = await db.query(sql, [scheduled, medicationId]);
    const [medication] = result.rows;
    if (!medication)
      throw new ClientError(404, `failed to update scheduled status`);
    res.status(200).json(medication);
  } catch (err) {
    next(err);
  }
});

// Update the remaining amount in the Database
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
      const sign = operation === 'increment' ? '+' : '-';
      const sqlUpdateRemaining = `
      update "medications"
        set "remaining" = "remaining" ${sign} 1
        where "medicationId" = $1
        returning *;
    `;
      const resultUpdateRemaining = await db.query<Medication>(
        sqlUpdateRemaining,
        [id]
      );
      const [updatedMedication] = resultUpdateRemaining.rows;
      if (!updatedMedication) throw new ClientError(404, 'No medication found');
      res.status(200).json(updatedMedication);
    } catch (err) {
      next(err);
    }
  }
);

app.post(
  '/api/medications/:id/notify-depletion',
  authMiddleware,
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const sqlMedicationUser = `
          select  "m"."name" as "medicationName",
                  "m"."dosage",
                  "m"."form",
                  "m"."prescriber",
                  "m"."remaining",
                  "u"."phoneNumber",
                  "u"."notificationsEnabled"
            from "medications" AS "m"
            inner join "users" AS "u" on "m"."userId" = "u"."userId"
            where "m"."medicationId" = $1;
        `;
      const result = await db.query<MedicationUser>(sqlMedicationUser, [id]);

      const [medicationUser] = result.rows;
      console.log('medicationUser', medicationUser);
      if (medicationUser.notificationsEnabled) {
        // If prescriber is null set it to the default msg
        const prescriber = medicationUser.prescriber
          ? `${medicationUser.prescriber}'s office`
          : "your doctor's office";
        const msg = `Please call ${prescriber} to refill ${medicationUser.medicationName} ${medicationUser.dosage} ${medicationUser.form}.`;
        createMessage(msg, medicationUser.phoneNumber);
      }
    } catch (err) {
      next(err);
    }
  }
);

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
  try {
    const sql = `
      select
        "ar"."requestId",
        "ar"."requesterId",
        "ar"."requestedId",
        "ar"."requesterUsername",
        "ar"."requesterFullName",
        "ar"."status",
        "u"."username" AS "requestedUsername",
        "u"."fullName" AS "requestedFullName"
      from
        "accessRequests" "ar"
      inner join
        "users" "u" ON "ar"."requestedId" = "u"."userId"
      where
        "ar"."requesterId" = $1 OR "u"."userId" = $1;
    `;
    const result = await db.query<ConnectedUsers>(sql, [req.user?.userId]);
    const requestUsers = result.rows;
    res.json(requestUsers);
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
      insert into "accessRequests" ("requestedId", "requesterId", "requesterUsername", "requesterFullName", "status")
        values ($1, $2, $3, $4, $5)
        returning *;
    `;
    const resultRequest = await db.query<Requests>(requestSql, [
      requestedUser.userId,
      req.user?.userId,
      req.user?.username,
      req.user?.fullName,
      'Pending',
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
    const sql = `
      update "accessRequests"
        set "status" = 'Accepted'
        where "requesterId" = $1 and "requestedId" = $2
        returning *;
    `;
    const result = await db.query<Requests>(sql, [
      requesterId,
      req.user?.userId,
    ]);
    const [request] = result.rows;
    if (!request) throw new ClientError(404, 'Connection Request Not found');

    if (!isAccepted) {
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
    }

    res.status(200).json(request);
  } catch (err) {
    next(err);
  }
});

app.get(
  '/api/notifications-setting',
  authMiddleware,
  async (req, res, next) => {
    try {
      const sql = `
      select "notificationsEnabled"
        from "users"
        where "userId" = $1;
    `;
      const result = await db.query(sql, [req.user?.userId]);
      const [notificationSetting] = result.rows;
      res.json(notificationSetting);
    } catch (err) {
      next(err);
    }
  }
);

app.put(
  '/api/notifications-setting',
  authMiddleware,
  async (req, res, next) => {
    try {
      const sql = `
      update "users"
        set "notificationsEnabled" = not "notificationsEnabled"
        where "userId" = $1
        returning "notificationsEnabled";
    `;
      const result = await db.query(sql, [req.user?.userId]);
      const [setting] = result.rows;
      res.status(201).json(setting);
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
app.get('*', (req, res) => res.sendFile(`${reactStaticDir}/index.html`));

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  console.log('Listening on port', process.env.PORT);
});
