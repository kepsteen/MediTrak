-- Use SQL insert statements to add any
-- starting/dummy data to your database tables

-- EXAMPLE:

insert into "users" ("username", "email", "role")
  values ('cody', 'test@test.com', 'Patient');

insert into "medications" ("rxcui", "name", "dosage", "form", "notes", "prescriber", "amount", "remaining", "scheduled", "userId")
  values (1, 'Tylenol', '500 mg', 'Capsule', 'For headaches', 'Dr. Smith', 30, 29, false, 1);

INSERT INTO "medications" ("rxcui", "name", "dosage", "form", "notes", "prescriber", "amount", "remaining", "scheduled", "userId")
  VALUES (1, 'Amoxicillin', '250 mg', 'Tablet', 'For bacterial infections', 'Dr. Johnson', 20, 20, false, 1);

INSERT INTO "medications" ("rxcui", "name", "dosage", "form", "notes", "prescriber", "amount", "remaining", "scheduled", "userId")
  VALUES (1, 'Lisinopril', '10 mg', 'Tablet', 'For high blood pressure', 'Dr. Williams', 90, 85, false, 1);

INSERT INTO "medications" ("rxcui", "name", "dosage", "form", "notes", "prescriber", "amount", "remaining", "scheduled", "userId")
  VALUES (1, 'Metformin', '500 mg', 'Tablet', 'For type 2 diabetes', 'Dr. Brown', 60, 58, false, 1);

INSERT INTO "medications" ("rxcui", "name", "dosage", "form", "notes", "prescriber", "amount", "remaining", "scheduled", "userId")
  VALUES (1, 'Sertraline', '50 mg', 'Tablet', 'For depression and anxiety', 'Dr. Davis', 30, 28, false, 1);

INSERT INTO "medications" ("rxcui", "name", "dosage", "form", "notes", "prescriber", "amount", "remaining", "scheduled", "userId")
  VALUES (1, 'Albuterol', '90 mcg', 'Inhaler', 'For asthma', 'Dr. Miller', 1, 1, false, 1);

INSERT INTO "medications" ("rxcui", "name", "dosage", "form", "notes", "prescriber", "amount", "remaining", "scheduled", "userId")
  VALUES (1, 'Omeprazole', '20 mg', 'Capsule', 'For acid reflux', 'Dr. Wilson', 30, 25, false, 1);

INSERT INTO "medications" ("rxcui", "name", "dosage", "form", "notes", "prescriber", "amount", "remaining", "scheduled", "userId")
  VALUES (1, 'Ibuprofen', '400 mg', 'Tablet', 'For pain and inflammation', 'Dr. Moore', 50, 48, false, 1);

INSERT INTO "medications" ("rxcui", "name", "dosage", "form", "notes", "prescriber", "amount", "remaining", "scheduled", "userId")
  VALUES (1, 'Simvastatin', '20 mg', 'Tablet', 'For high cholesterol', 'Dr. Taylor', 30, 30, false, 1);

INSERT INTO "medications" ("rxcui", "name", "dosage", "form", "notes", "prescriber", "amount", "remaining", "scheduled", "userId")
  VALUES (1, 'Levothyroxine', '75 mcg', 'Tablet', 'For hypothyroidism', 'Dr. Anderson', 90, 88, false, 1);

INSERT INTO "medicationSchedules" ("medicationId", "timesPerDay", "daysOfWeek", "fullMedName", "userId")
VALUES (1, 2, '{Monday, Wednesday, Friday}', 'Tylenol 500 mg Capsule', 1)
RETURNING *;

INSERT INTO "medicationSchedules" ("medicationId", "timesPerDay", "daysOfWeek", "fullMedName", "userId")
VALUES (2, 3, '{Tuesday, Thursday, Saturday}', 'Amoxicillin 250 mg Tablet', 1)
RETURNING *;

INSERT INTO "medicationSchedules" ("medicationId", "timesPerDay", "daysOfWeek", "fullMedName", "userId")
VALUES (3, 1, '{Monday, Tuesday}', 'Lisinopril 10 mg Tablet', 1)
RETURNING *;

INSERT INTO "medicationSchedules" ("medicationId", "timesPerDay", "daysOfWeek", "fullMedName", "userId")
VALUES (4, 4, '{Wednesday, Friday, Sunday}', 'Metformin 500 mg Tablet', 1)
RETURNING *;

INSERT INTO "medicationSchedules" ("medicationId", "timesPerDay", "daysOfWeek", "fullMedName", "userId")
VALUES (5, 2, '{Monday, Thursday}', 'Sertraline 50 mg Tablet', 1)
RETURNING *;

INSERT INTO "medicationSchedules" ("medicationId", "timesPerDay", "daysOfWeek", "fullMedName", "userId")
VALUES (6, 3, '{Saturday, Sunday}', 'Albuterol 90 mcg Inhaler', 1)
RETURNING *;

INSERT INTO "medicationSchedules" ("medicationId", "timesPerDay", "daysOfWeek", "fullMedName", "userId")
VALUES (7, 1, '{Wednesday, Saturday}', 'Omeprazole 20 mg Capsule', 1)
RETURNING *;

INSERT INTO "medicationSchedules" ("medicationId", "timesPerDay", "daysOfWeek", "fullMedName", "userId")
VALUES (8, 4, '{Tuesday, Thursday, Sunday}', 'Ibuprofen 400 mg Tablet', 1)
RETURNING *;

INSERT INTO "medicationSchedules" ("medicationId", "timesPerDay", "daysOfWeek", "fullMedName", "userId")
VALUES (9, 2, '{Monday, Friday}', 'Simvastatin 20 mg Tablet', 1)
RETURNING *;

INSERT INTO "medicationSchedules" ("medicationId", "timesPerDay", "daysOfWeek", "fullMedName", "userId")
VALUES (10, 3, '{Tuesday, Thursday, Saturday}', 'Levothyroxine 75 mcg Tablet', 1)
RETURNING *;
