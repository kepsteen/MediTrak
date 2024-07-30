CREATE TABLE "medicationSchedules" (
  "id" serial PRIMARY KEY,
  "medicationId" integer,
  "timesPerDay" integer,
  "timeOfDay" ENUM(Morning,Noon,Evening,Bedtime),
  "userId" integer
);

CREATE TABLE "scheduleDays" (
  "id" serial PRIMARY KEY,
  "scheduleId" integer,
  "dayOfWeek" enum(Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday)
);

CREATE TABLE "users" (
  "id" serial PRIMARY KEY,
  "username" text,
  "email" text UNIQUE,
  "role" enum(Patient,Caregiver),
  "createdAt" timestamptz NOT NULL DEFAULT (now())
);

CREATE TABLE "medications" (
  "id" serial PRIMARY KEY,
  "rxcui" integer,
  "name" text,
  "dosage" text,
  "form" text,
  "notes" text,
  "prescriber" text,
  "amount" integer,
  "remaining" integer,
  "userId" integer,
  "createdAt" timestamptz NOT NULL DEFAULT (now())
);

CREATE TABLE "caregiverAccess" (
  "id" serial PRIMARY KEY,
  "patientId" integer,
  "caregiverId" integer,
  "grantedAt" timestamptz NOT NULL DEFAULT (now()),
  "active" boolean
);

CREATE TABLE "medicationLogs" (
  "id" serial PRIMARY KEY,
  "medicationId" integer,
  "patientId" integer,
  "taken" boolean
);

CREATE TABLE "rxNormConcepts" (
  "rxcui" integer PRIMARY KEY,
  "name" text
);

COMMENT ON COLUMN "medications"."notes" IS 'Any notes about the med';

ALTER TABLE "medicationSchedules" ADD FOREIGN KEY ("medicationId") REFERENCES "medications" ("id");

ALTER TABLE "medicationSchedules" ADD FOREIGN KEY ("userId") REFERENCES "users" ("id");

ALTER TABLE "scheduleDays" ADD FOREIGN KEY ("scheduleId") REFERENCES "medicationSchedules" ("id");

ALTER TABLE "medications" ADD FOREIGN KEY ("rxcui") REFERENCES "rxNormConcepts" ("rxcui");

ALTER TABLE "medications" ADD FOREIGN KEY ("userId") REFERENCES "users" ("id");

ALTER TABLE "caregiverAccess" ADD FOREIGN KEY ("patientId") REFERENCES "users" ("id");

ALTER TABLE "caregiverAccess" ADD FOREIGN KEY ("caregiverId") REFERENCES "users" ("id");

ALTER TABLE "medicationLogs" ADD FOREIGN KEY ("medicationId") REFERENCES "medications" ("id");

ALTER TABLE "medicationLogs" ADD FOREIGN KEY ("patientId") REFERENCES "users" ("id");
