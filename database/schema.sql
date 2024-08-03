set client_min_messages to warning;

-- DANGER: this is NOT how to do it in the real world.
-- `drop schema` INSTANTLY ERASES EVERYTHING.
drop schema "public" cascade;

create schema "public";

CREATE TABLE "medicationSchedules" (
  "id" serial PRIMARY KEY,
  "medicationId" integer,
  "timesPerDay" integer,
  "daysOfWeek" varchar(255)[],
  "userId" integer
);

CREATE TABLE "users" (
  "id" serial PRIMARY KEY,
  "username" text,
  "email" text UNIQUE,
  "role" text,
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
  "scheduled" boolean,
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

ALTER TABLE "medications" ADD FOREIGN KEY ("userId") REFERENCES "users" ("id");

ALTER TABLE "caregiverAccess" ADD FOREIGN KEY ("patientId") REFERENCES "users" ("id");

ALTER TABLE "caregiverAccess" ADD FOREIGN KEY ("caregiverId") REFERENCES "users" ("id");

ALTER TABLE "medicationLogs" ADD FOREIGN KEY ("medicationId") REFERENCES "medications" ("id");

ALTER TABLE "medicationLogs" ADD FOREIGN KEY ("patientId") REFERENCES "users" ("id");
