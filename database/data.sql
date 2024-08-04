-- Use SQL insert statements to add any
-- starting/dummy data to your database tables

-- EXAMPLE:

insert into "users" ("username", "email", "role")
  values ('cody', 'test@test.com', 'Patient');

INSERT INTO "medications" ("rxcui", "name", "dosage", "form", "notes", "prescriber", "amount", "remaining", "scheduled", "userId")
VALUES (1, 'Tylenol', '500 mg', 'Capsule', 'For headaches', 'Dr. Smith', 30, 29, true, 1);

INSERT INTO "medications" ("rxcui", "name", "dosage", "form", "notes", "prescriber", "amount", "remaining", "scheduled", "userId")
VALUES (1, 'Amoxicillin', '250 mg', 'Tablet', 'For bacterial infections', 'Dr. Johnson', 20, 20, true, 1);

INSERT INTO "medications" ("rxcui", "name", "dosage", "form", "notes", "prescriber", "amount", "remaining", "scheduled", "userId")
VALUES (1, 'Lisinopril', '10 mg', 'Tablet', 'For high blood pressure', 'Dr. Williams', 90, 85, true, 1);

INSERT INTO "medications" ("rxcui", "name", "dosage", "form", "notes", "prescriber", "amount", "remaining", "scheduled", "userId")
VALUES (1, 'Metformin', '500 mg', 'Tablet', 'For type 2 diabetes', 'Dr. Brown', 60, 58, true, 1);

INSERT INTO "medications" ("rxcui", "name", "dosage", "form", "notes", "prescriber", "amount", "remaining", "scheduled", "userId")
VALUES (1, 'Sertraline', '50 mg', 'Tablet', 'For depression and anxiety', 'Dr. Davis', 30, 28, true, 1);

INSERT INTO "medications" ("rxcui", "name", "dosage", "form", "notes", "prescriber", "amount", "remaining", "scheduled", "userId")
VALUES (1, 'Albuterol', '90 mcg', 'Inhaler', 'For asthma', 'Dr. Miller', 1, 1, true, 1);

INSERT INTO "medications" ("rxcui", "name", "dosage", "form", "notes", "prescriber", "amount", "remaining", "scheduled", "userId")
VALUES (1, 'Omeprazole', '20 mg', 'Capsule', 'For acid reflux', 'Dr. Wilson', 30, 25, true, 1);

INSERT INTO "medications" ("rxcui", "name", "dosage", "form", "notes", "prescriber", "amount", "remaining", "scheduled", "userId")
VALUES (1, 'Ibuprofen', '400 mg', 'Tablet', 'For pain and inflammation', 'Dr. Moore', 50, 48, true, 1);

INSERT INTO "medications" ("rxcui", "name", "dosage", "form", "notes", "prescriber", "amount", "remaining", "scheduled", "userId")
VALUES (1, 'Simvastatin', '20 mg', 'Tablet', 'For high cholesterol', 'Dr. Taylor', 30, 30, true, 1);

INSERT INTO "medications" ("rxcui", "name", "dosage", "form", "notes", "prescriber", "amount", "remaining", "scheduled", "userId")
VALUES (1, 'Levothyroxine', '75 mcg', 'Tablet', 'For hypothyroidism', 'Dr. Anderson', 90, 88, true, 1);


INSERT INTO "medicationSchedules" ("medicationId", "timesPerDay", "daysOfWeek", "userId", "name", "dosage", "form")
VALUES (1, 2, '{Monday, Wednesday, Friday}', 1, 'Tylenol', '500 mg', 'Capsule')
RETURNING *;

INSERT INTO "medicationSchedules" ("medicationId", "timesPerDay", "daysOfWeek", "userId", "name", "dosage", "form")
VALUES (2, 3, '{Tuesday, Thursday, Saturday}', 1, 'Amoxicillin', '250 mg', 'Tablet')
RETURNING *;

INSERT INTO "medicationSchedules" ("medicationId", "timesPerDay", "daysOfWeek", "userId", "name", "dosage", "form")
VALUES (3, 1, '{Monday, Tuesday}', 1, 'Lisinopril', '10 mg', 'Tablet')
RETURNING *;

INSERT INTO "medicationSchedules" ("medicationId", "timesPerDay", "daysOfWeek", "userId", "name", "dosage", "form")
VALUES (4, 4, '{Wednesday, Friday, Sunday}', 1, 'Metformin', '500 mg', 'Tablet')
RETURNING *;

INSERT INTO "medicationSchedules" ("medicationId", "timesPerDay", "daysOfWeek", "userId", "name", "dosage", "form")
VALUES (5, 2, '{Monday, Thursday}', 1, 'Sertraline', '50 mg', 'Tablet')
RETURNING *;

INSERT INTO "medicationSchedules" ("medicationId", "timesPerDay", "daysOfWeek", "userId", "name", "dosage", "form")
VALUES (6, 3, '{Saturday, Sunday}', 1, 'Albuterol', '90 mcg', 'Inhaler')
RETURNING *;

INSERT INTO "medicationSchedules" ("medicationId", "timesPerDay", "daysOfWeek", "userId", "name", "dosage", "form")
VALUES (7, 1, '{Wednesday, Saturday}', 1, 'Omeprazole', '20 mg', 'Capsule')
RETURNING *;

INSERT INTO "medicationSchedules" ("medicationId", "timesPerDay", "daysOfWeek", "userId", "name", "dosage", "form")
VALUES (8, 4, '{Tuesday, Thursday, Sunday}', 1, 'Ibuprofen', '400 mg', 'Tablet')
RETURNING *;

INSERT INTO "medicationSchedules" ("medicationId", "timesPerDay", "daysOfWeek", "userId", "name", "dosage", "form")
VALUES (9, 2, '{Monday, Friday}', 1, 'Simvastatin', '20 mg', 'Tablet')
RETURNING *;

INSERT INTO "medicationSchedules" ("medicationId", "timesPerDay", "daysOfWeek", "userId", "name", "dosage", "form")
VALUES (10, 3, '{Tuesday, Thursday, Saturday}', 1, 'Levothyroxine', '75 mcg', 'Tablet')
RETURNING *;
