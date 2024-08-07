-- Use SQL insert statements to add any
-- starting/dummy data to your database tables

-- EXAMPLE:

insert into "users" ("username", "hashedPassword", "role")
  values ('cody', '$argon2id$v=19$m=65536,t=3,p=4$6MeIFikxuRTxoEhixGGNVg$0CYkAeAu2KRdxbOrMIXAezn0T8/kmyjJA0L9eLZEwUg', 'Patient');

INSERT INTO "medications" ("rxcui", "name", "dosage", "form", "notes", "prescriber", "amount", "remaining", "scheduled", "userId")
VALUES (1, 'Tylenol', '500 mg', 'Capsule', 'For headaches', 'Dr. Smith', 30, 30, true, 1);

INSERT INTO "medications" ("rxcui", "name", "dosage", "form", "notes", "prescriber", "amount", "remaining", "scheduled", "userId")
VALUES (1, 'Amoxicillin', '250 mg', 'Tablet', 'For bacterial infections', 'Dr. Johnson', 20, 20, true, 1);

INSERT INTO "medications" ("rxcui", "name", "dosage", "form", "notes", "prescriber", "amount", "remaining", "scheduled", "userId")
VALUES (1, 'Lisinopril', '10 mg', 'Tablet', 'For high blood pressure', 'Dr. Williams', 90, 90, true, 1);

INSERT INTO "medications" ("rxcui", "name", "dosage", "form", "notes", "prescriber", "amount", "remaining", "scheduled", "userId")
VALUES (1, 'Metformin', '500 mg', 'Tablet', 'For type 2 diabetes', 'Dr. Brown', 60, 60, true, 1);

INSERT INTO "medications" ("rxcui", "name", "dosage", "form", "notes", "prescriber", "amount", "remaining", "scheduled", "userId")
VALUES (1, 'Sertraline', '50 mg', 'Tablet', 'For depression and anxiety', 'Dr. Davis', 30, 30, true, 1);

INSERT INTO "medications" ("rxcui", "name", "dosage", "form", "notes", "prescriber", "amount", "remaining", "scheduled", "userId")
VALUES (1, 'Albuterol', '90 mcg', 'Inhaler', 'For asthma', 'Dr. Miller', 1, 1, true, 1);

INSERT INTO "medications" ("rxcui", "name", "dosage", "form", "notes", "prescriber", "amount", "remaining", "scheduled", "userId")
VALUES (1, 'Omeprazole', '20 mg', 'Capsule', 'For acid reflux', 'Dr. Wilson', 30, 30, true, 1);

INSERT INTO "medications" ("rxcui", "name", "dosage", "form", "notes", "prescriber", "amount", "remaining", "scheduled", "userId")
VALUES (1, 'Ibuprofen', '400 mg', 'Tablet', 'For pain and inflammation', 'Dr. Moore', 50, 50, true, 1);

INSERT INTO "medications" ("rxcui", "name", "dosage", "form", "notes", "prescriber", "amount", "remaining", "scheduled", "userId")
VALUES (1, 'Simvastatin', '20 mg', 'Tablet', 'For high cholesterol', 'Dr. Taylor', 30, 30, true, 1);

INSERT INTO "medications" ("rxcui", "name", "dosage", "form", "notes", "prescriber", "amount", "remaining", "scheduled", "userId")
VALUES (1, 'Levothyroxine', '75 mcg', 'Tablet', 'For hypothyroidism', 'Dr. Anderson', 90, 90, true, 1);

-- Tylenol
INSERT INTO "medicationSchedules" ("medicationId", "timeOfDay", "dayOfWeek", "taken", "userId", "name", "dosage", "form")
VALUES (1, 'Morning', 'Monday', false, 1, 'Tylenol', '500 mg', 'Capsule'),
       (1, 'Noon', 'Monday', false, 1, 'Tylenol', '500 mg', 'Capsule'),
       (1, 'Evening', 'Monday', false, 1, 'Tylenol', '500 mg', 'Capsule'),
       (1, 'Bed time', 'Monday', false, 1, 'Tylenol', '500 mg', 'Capsule'),
       (1, 'Morning', 'Tuesday', false, 1, 'Tylenol', '500 mg', 'Capsule'),
       (1, 'Noon', 'Tuesday', false, 1, 'Tylenol', '500 mg', 'Capsule'),
       (1, 'Evening', 'Tuesday', false, 1, 'Tylenol', '500 mg', 'Capsule'),
       (1, 'Bed time', 'Tuesday', false, 1, 'Tylenol', '500 mg', 'Capsule'),
       (1, 'Morning', 'Wednesday', false, 1, 'Tylenol', '500 mg', 'Capsule'),
       (1, 'Noon', 'Wednesday', false, 1, 'Tylenol', '500 mg', 'Capsule'),
       (1, 'Evening', 'Wednesday', false, 1, 'Tylenol', '500 mg', 'Capsule'),
       (1, 'Bed time', 'Wednesday', false, 1, 'Tylenol', '500 mg', 'Capsule'),
       (1, 'Morning', 'Thursday', false, 1, 'Tylenol', '500 mg', 'Capsule'),
       (1, 'Noon', 'Thursday', false, 1, 'Tylenol', '500 mg', 'Capsule'),
       (1, 'Evening', 'Thursday', false, 1, 'Tylenol', '500 mg', 'Capsule'),
       (1, 'Bed time', 'Thursday', false, 1, 'Tylenol', '500 mg', 'Capsule'),
       (1, 'Morning', 'Friday', false, 1, 'Tylenol', '500 mg', 'Capsule'),
       (1, 'Noon', 'Friday', false, 1, 'Tylenol', '500 mg', 'Capsule'),
       (1, 'Evening', 'Friday', false, 1, 'Tylenol', '500 mg', 'Capsule'),
       (1, 'Bed time', 'Friday', false, 1, 'Tylenol', '500 mg', 'Capsule'),
       (1, 'Morning', 'Saturday', false, 1, 'Tylenol', '500 mg', 'Capsule'),
       (1, 'Noon', 'Saturday', false, 1, 'Tylenol', '500 mg', 'Capsule'),
       (1, 'Evening', 'Saturday', false, 1, 'Tylenol', '500 mg', 'Capsule'),
       (1, 'Bed time', 'Saturday', false, 1, 'Tylenol', '500 mg', 'Capsule'),
       (1, 'Morning', 'Sunday', false, 1, 'Tylenol', '500 mg', 'Capsule'),
       (1, 'Noon', 'Sunday', false, 1, 'Tylenol', '500 mg', 'Capsule'),
       (1, 'Evening', 'Sunday', false, 1, 'Tylenol', '500 mg', 'Capsule'),
       (1, 'Bed time', 'Sunday', false, 1, 'Tylenol', '500 mg', 'Capsule')
RETURNING *;

-- Amoxicillin
INSERT INTO "medicationSchedules" ("medicationId", "timeOfDay", "dayOfWeek", "taken", "userId", "name", "dosage", "form")
VALUES (2, 'Morning', 'Tuesday', false, 1, 'Amoxicillin', '250 mg', 'Tablet'),
       (2, 'Noon', 'Tuesday', false, 1, 'Amoxicillin', '250 mg', 'Tablet'),
       (2, 'Evening', 'Tuesday', false, 1, 'Amoxicillin', '250 mg', 'Tablet'),
       (2, 'Morning', 'Thursday', false, 1, 'Amoxicillin', '250 mg', 'Tablet'),
       (2, 'Noon', 'Thursday', false, 1, 'Amoxicillin', '250 mg', 'Tablet'),
       (2, 'Evening', 'Thursday', false, 1, 'Amoxicillin', '250 mg', 'Tablet'),
       (2, 'Morning', 'Saturday', false, 1, 'Amoxicillin', '250 mg', 'Tablet'),
       (2, 'Noon', 'Saturday', false, 1, 'Amoxicillin', '250 mg', 'Tablet'),
       (2, 'Evening', 'Saturday', false, 1, 'Amoxicillin', '250 mg', 'Tablet')
RETURNING *;

-- Lisinopril
INSERT INTO "medicationSchedules" ("medicationId", "timeOfDay", "dayOfWeek", "taken", "userId", "name", "dosage", "form")
VALUES (3, 'Morning', 'Monday', false, 1, 'Lisinopril', '10 mg', 'Tablet'),
       (3, 'Morning', 'Tuesday', false, 1, 'Lisinopril', '10 mg', 'Tablet')
RETURNING *;

-- Metformin
INSERT INTO "medicationSchedules" ("medicationId", "timeOfDay", "dayOfWeek", "taken", "userId", "name", "dosage", "form")
VALUES (4, 'Morning', 'Wednesday', false, 1, 'Metformin', '500 mg', 'Tablet'),
       (4, 'Noon', 'Wednesday', false, 1, 'Metformin', '500 mg', 'Tablet'),
       (4, 'Evening', 'Wednesday', false, 1, 'Metformin', '500 mg', 'Tablet'),
       (4, 'Bed time', 'Wednesday', false, 1, 'Metformin', '500 mg', 'Tablet'),
       (4, 'Morning', 'Friday', false, 1, 'Metformin', '500 mg', 'Tablet'),
       (4, 'Noon', 'Friday', false, 1, 'Metformin', '500 mg', 'Tablet'),
       (4, 'Evening', 'Friday', false, 1, 'Metformin', '500 mg', 'Tablet'),
       (4, 'Bed time', 'Friday', false, 1, 'Metformin', '500 mg', 'Tablet'),
       (4, 'Morning', 'Sunday', false, 1, 'Metformin', '500 mg', 'Tablet'),
       (4, 'Noon', 'Sunday', false, 1, 'Metformin', '500 mg', 'Tablet'),
       (4, 'Evening', 'Sunday', false, 1, 'Metformin', '500 mg', 'Tablet'),
       (4, 'Bed time', 'Sunday', false, 1, 'Metformin', '500 mg', 'Tablet')
RETURNING *;

-- Sertraline
INSERT INTO "medicationSchedules" ("medicationId", "timeOfDay", "dayOfWeek", "taken", "userId", "name", "dosage", "form")
VALUES (5, 'Morning', 'Monday', false, 1, 'Sertraline', '50 mg', 'Tablet'),
       (5, 'Evening', 'Monday', false, 1, 'Sertraline', '50 mg', 'Tablet'),
       (5, 'Morning', 'Thursday', false, 1, 'Sertraline', '50 mg', 'Tablet'),
       (5, 'Evening', 'Thursday', false, 1, 'Sertraline', '50 mg', 'Tablet')
RETURNING *;

-- Albuterol
INSERT INTO "medicationSchedules" ("medicationId", "timeOfDay", "dayOfWeek", "taken", "userId", "name", "dosage", "form")
VALUES (6, 'Morning', 'Saturday', false, 1, 'Albuterol', '90 mcg', 'Inhaler'),
       (6, 'Noon', 'Saturday', false, 1, 'Albuterol', '90 mcg', 'Inhaler'),
       (6, 'Evening', 'Saturday', false, 1, 'Albuterol', '90 mcg', 'Inhaler'),
       (6, 'Morning', 'Sunday', false, 1, 'Albuterol', '90 mcg', 'Inhaler'),
       (6, 'Noon', 'Sunday', false, 1, 'Albuterol', '90 mcg', 'Inhaler'),
       (6, 'Evening', 'Sunday', false, 1, 'Albuterol', '90 mcg', 'Inhaler')
RETURNING *;

-- Omeprazole
INSERT INTO "medicationSchedules" ("medicationId", "timeOfDay", "dayOfWeek", "taken", "userId", "name", "dosage", "form")
VALUES (7, 'Morning', 'Wednesday', false, 1, 'Omeprazole', '20 mg', 'Capsule'),
       (7, 'Morning', 'Saturday', false, 1, 'Omeprazole', '20 mg', 'Capsule')
RETURNING *;

-- Ibuprofen
INSERT INTO "medicationSchedules" ("medicationId", "timeOfDay", "dayOfWeek", "taken", "userId", "name", "dosage", "form")
VALUES (8, 'Morning', 'Tuesday', false, 1, 'Ibuprofen', '400 mg', 'Tablet'),
       (8, 'Noon', 'Tuesday', false, 1, 'Ibuprofen', '400 mg', 'Tablet'),
       (8, 'Evening', 'Tuesday', false, 1, 'Ibuprofen', '400 mg', 'Tablet'),
       (8, 'Bed time', 'Tuesday', false, 1, 'Ibuprofen', '400 mg', 'Tablet'),
       (8, 'Morning', 'Thursday', false, 1, 'Ibuprofen', '400 mg', 'Tablet'),
       (8, 'Noon', 'Thursday', false, 1, 'Ibuprofen', '400 mg', 'Tablet'),
       (8, 'Evening', 'Thursday', false, 1, 'Ibuprofen', '400 mg', 'Tablet'),
       (8, 'Bed time', 'Thursday', false, 1, 'Ibuprofen', '400 mg', 'Tablet'),
       (8, 'Morning', 'Sunday', false, 1, 'Ibuprofen', '400 mg', 'Tablet'),
       (8, 'Noon', 'Sunday', false, 1, 'Ibuprofen', '400 mg', 'Tablet'),
       (8, 'Evening', 'Sunday', false, 1, 'Ibuprofen', '400 mg', 'Tablet'),
       (8, 'Bed time', 'Sunday', false, 1, 'Ibuprofen', '400 mg', 'Tablet')
RETURNING *;

-- Simvastatin
INSERT INTO "medicationSchedules" ("medicationId", "timeOfDay", "dayOfWeek", "taken", "userId", "name", "dosage", "form")
VALUES (9, 'Morning', 'Monday', false, 1, 'Simvastatin', '20 mg', 'Tablet'),
       (9, 'Evening', 'Monday', false, 1, 'Simvastatin', '20 mg', 'Tablet'),
       (9, 'Morning', 'Friday', false, 1, 'Simvastatin', '20 mg', 'Tablet'),
       (9, 'Evening', 'Friday', false, 1, 'Simvastatin', '20 mg', 'Tablet')
RETURNING *;

-- Levothyroxine
INSERT INTO "medicationSchedules" ("medicationId", "timeOfDay", "dayOfWeek", "taken", "userId", "name", "dosage", "form")
VALUES (10, 'Morning', 'Tuesday', false, 1, 'Levothyroxine', '75 mcg', 'Tablet'),
       (10, 'Noon', 'Tuesday', false, 1, 'Levothyroxine', '75 mcg', 'Tablet'),
       (10, 'Evening', 'Tuesday', false, 1, 'Levothyroxine', '75 mcg', 'Tablet'),
       (10, 'Morning', 'Thursday', false, 1, 'Levothyroxine', '75 mcg', 'Tablet'),
       (10, 'Noon', 'Thursday', false, 1, 'Levothyroxine', '75 mcg', 'Tablet'),
       (10, 'Evening', 'Thursday', false, 1, 'Levothyroxine', '75 mcg', 'Tablet'),
       (10, 'Morning', 'Saturday', false, 1, 'Levothyroxine', '75 mcg', 'Tablet'),
       (10, 'Noon', 'Saturday', false, 1, 'Levothyroxine', '75 mcg', 'Tablet'),
       (10, 'Evening', 'Saturday', false, 1, 'Levothyroxine', '75 mcg', 'Tablet')
RETURNING *;
