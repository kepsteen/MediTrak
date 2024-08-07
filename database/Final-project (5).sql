CREATE TABLE "medicationSchedules" (
  "id" SERIAL PRIMARY KEY,
  "medicationId" integer,
  "timeOfDay" text,
  "dayOfWeek" text,
  "taken" boolean,
  "userId" integer,
  "name" text,
  "dosage" text,
  "form" text
);

CREATE TABLE "users" (
  "id" SERIAL PRIMARY KEY,
  "username" text UNIQUE,
  "hashedPassword" text,
  "role" text,
  "createdAt" timestamptz NOT NULL DEFAULT (now())
);

CREATE TABLE "medications" (
  "id" SERIAL PRIMARY KEY,
  "rxcui" integer,
  "name" text,
  "dosage" text,
  "form" text,
  "notes" text,
  "prescriber" text,
  "amount" integer,
  "remaining" integer,
  "scheduled" boolean,
  "userId" integer,
  "createdAt" timestamptz NOT NULL DEFAULT (now())
);

CREATE TABLE "caregiverAccess" (
  "id" SERIAL PRIMARY KEY,
  "patientId" integer,
  "caregiverId" integer,
  "grantedAt" timestamptz NOT NULL DEFAULT (now()),
  "active" boolean
);

CREATE TABLE "medicationLogs" (
  "id" SERIAL PRIMARY KEY,
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

ALTER TABLE "medications" ADD FOREIGN KEY ("userId") REFERENCES "users" ("id");

ALTER TABLE "caregiverAccess" ADD FOREIGN KEY ("patientId") REFERENCES "users" ("id");

ALTER TABLE "caregiverAccess" ADD FOREIGN KEY ("caregiverId") REFERENCES "users" ("id");

ALTER TABLE "medicationLogs" ADD FOREIGN KEY ("medicationId") REFERENCES "medications" ("id");

ALTER TABLE "medicationLogs" ADD FOREIGN KEY ("patientId") REFERENCES "users" ("id");
