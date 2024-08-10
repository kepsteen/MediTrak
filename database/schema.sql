set client_min_messages to warning;

-- DANGER: this is NOT how to do it in the real world.
-- `drop schema` INSTANTLY ERASES EVERYTHING.
drop schema "public" cascade;

create schema "public";

CREATE TABLE "medicationSchedules" (
  "scheduleId" SERIAL PRIMARY KEY,
  "medicationId" integer,
  "timeOfDay" text,
  "dayOfWeek" text,
  "userId" integer,
  "name" text,
  "dosage" text,
  "form" text,
  "createdAt" timestamptz NOT NULL DEFAULT (now()),
  "updatedAt" timestamptz NOT NULL DEFAULT (now())
);

CREATE TABLE "users" (
  "userId" SERIAL PRIMARY KEY,
  "username" text UNIQUE,
  "hashedPassword" text,
  "fullName" text,
  "role" text,
  "dateOfBirth" text,
  "phoneNumber" text,
  "notificationsEnabled" boolean,
  "createdAt" timestamptz NOT NULL DEFAULT (now())
);


CREATE TABLE "accessRequests" (
  "requestId" SERIAL PRIMARY KEY,
  "requestedId" integer,
  "requesterId" integer,
  "requesterUsername" text,
  "requesterFullName" text,
  "status" text,
  "requestedAt" timestamptz NOT NULL DEFAULT (now()),
  "updatedAt" timestamptz NOT NULL DEFAULT (now())
);

CREATE TABLE "medications" (
  "medicationId" SERIAL PRIMARY KEY,
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

CREATE TABLE "medicationLogs" (
  "logId" SERIAL PRIMARY KEY,
  "medicationId" integer,
  "userId" integer,
  "scheduleId" integer,
  "taken" boolean,
  "updatedAt" timestamptz NOT NULL DEFAULT (now())
);

CREATE TABLE "rxNormConcepts" (
  "rxcui" integer PRIMARY KEY,
  "name" text
);

COMMENT ON COLUMN "medications"."notes" IS 'Any notes about the med';

ALTER TABLE "medicationSchedules" ADD FOREIGN KEY ("medicationId") REFERENCES "medications" ("medicationId");

ALTER TABLE "medicationSchedules" ADD FOREIGN KEY ("userId") REFERENCES "users" ("userId");

ALTER TABLE "medications" ADD FOREIGN KEY ("userId") REFERENCES "users" ("userId");

ALTER TABLE "medicationLogs" ADD FOREIGN KEY ("medicationId") REFERENCES "medications" ("medicationId");

ALTER TABLE "medicationLogs" ADD FOREIGN KEY ("userId") REFERENCES "users" ("userId");

ALTER TABLE "medicationLogs" ADD FOREIGN KEY ("scheduleId") REFERENCES "medicationSchedules" ("scheduleId");

ALTER TABLE "accessRequests" ADD FOREIGN KEY ("requesterId") REFERENCES "users" ("userId");

ALTER TABLE "accessRequests" ADD FOREIGN KEY ("requestedId") REFERENCES "users" ("userId");


-- Add trigger function to update the updatedAt column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW."updatedAt" = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for medicationLogs table
CREATE TRIGGER update_medicationLogs_updated_at
BEFORE UPDATE ON "medicationLogs"
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Create a new trigger for medicationSchedules table
CREATE TRIGGER update_medicationSchedules_updated_at
BEFORE UPDATE ON "medicationSchedules"
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Create a new trigger for accessRequests table
CREATE TRIGGER update_medicationSchedules_updated_at
BEFORE UPDATE ON "accessRequests"
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
