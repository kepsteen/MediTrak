-- Use SQL insert statements to add any
-- starting/dummy data to your database tables

-- EXAMPLE:

insert into "users" ("username", "hashedPassword", "role", "dateOfBirth", "phoneNumber", "notificationsEnabled")
  values ('cody', '$argon2id$v=19$m=65536,t=3,p=4$6MeIFikxuRTxoEhixGGNVg$0CYkAeAu2KRdxbOrMIXAezn0T8/kmyjJA0L9eLZEwUg', 'Patient', '03/15/1997', '9499222057', true);

insert into "users" ("username", "hashedPassword", "role", "dateOfBirth", "phoneNumber", "notificationsEnabled")
  values ('cody2', '$argon2id$v=19$m=65536,t=3,p=4$6MeIFikxuRTxoEhixGGNVg$0CYkAeAu2KRdxbOrMIXAezn0T8/kmyjJA0L9eLZEwUg', 'Caregiver', '03/15/1997', '9499222057', true);

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

-- -- Tylenol
-- INSERT INTO "medicationSchedules" ("medicationId", "timeOfDay", "dayOfWeek", "userId", "name", "dosage", "form")
-- VALUES (1, 'Morning', 'Monday', 1, 'Tylenol', '500 mg', 'Capsule'),
--        (1, 'Noon', 'Monday', 1, 'Tylenol', '500 mg', 'Capsule'),
--        (1, 'Evening', 'Monday', 1, 'Tylenol', '500 mg', 'Capsule'),
--        (1, 'Bed time', 'Monday', 1, 'Tylenol', '500 mg', 'Capsule'),
--        (1, 'Morning', 'Tuesday', 1, 'Tylenol', '500 mg', 'Capsule'),
--        (1, 'Noon', 'Tuesday', 1, 'Tylenol', '500 mg', 'Capsule'),
--        (1, 'Evening', 'Tuesday', 1, 'Tylenol', '500 mg', 'Capsule'),
--        (1, 'Bed time', 'Tuesday', 1, 'Tylenol', '500 mg', 'Capsule'),
--        (1, 'Morning', 'Wednesday', 1, 'Tylenol', '500 mg', 'Capsule'),
--        (1, 'Noon', 'Wednesday', 1, 'Tylenol', '500 mg', 'Capsule'),
--        (1, 'Evening', 'Wednesday', 1, 'Tylenol', '500 mg', 'Capsule'),
--        (1, 'Bed time', 'Wednesday', 1, 'Tylenol', '500 mg', 'Capsule'),
--        (1, 'Morning', 'Thursday', 1, 'Tylenol', '500 mg', 'Capsule'),
--        (1, 'Noon', 'Thursday', 1, 'Tylenol', '500 mg', 'Capsule'),
--        (1, 'Evening', 'Thursday', 1, 'Tylenol', '500 mg', 'Capsule'),
--        (1, 'Bed time', 'Thursday', 1, 'Tylenol', '500 mg', 'Capsule'),
--        (1, 'Morning', 'Friday', 1, 'Tylenol', '500 mg', 'Capsule'),
--        (1, 'Noon', 'Friday', 1, 'Tylenol', '500 mg', 'Capsule'),
--        (1, 'Evening', 'Friday', 1, 'Tylenol', '500 mg', 'Capsule'),
--        (1, 'Bed time', 'Friday', 1, 'Tylenol', '500 mg', 'Capsule'),
--        (1, 'Morning', 'Saturday', 1, 'Tylenol', '500 mg', 'Capsule'),
--        (1, 'Noon', 'Saturday', 1, 'Tylenol', '500 mg', 'Capsule'),
--        (1, 'Evening', 'Saturday', 1, 'Tylenol', '500 mg', 'Capsule'),
--        (1, 'Bed time', 'Saturday', 1, 'Tylenol', '500 mg', 'Capsule'),
--        (1, 'Morning', 'Sunday', 1, 'Tylenol', '500 mg', 'Capsule'),
--        (1, 'Noon', 'Sunday', 1, 'Tylenol', '500 mg', 'Capsule'),
--        (1, 'Evening', 'Sunday', 1, 'Tylenol', '500 mg', 'Capsule'),
--        (1, 'Bed time', 'Sunday', 1, 'Tylenol', '500 mg', 'Capsule');

-- -- Amoxicillin
-- INSERT INTO "medicationSchedules" ("medicationId", "timeOfDay", "dayOfWeek", "userId", "name", "dosage", "form")
-- VALUES (2, 'Morning', 'Tuesday', 1, 'Amoxicillin', '250 mg', 'Tablet'),
--        (2, 'Noon', 'Tuesday', 1, 'Amoxicillin', '250 mg', 'Tablet'),
--        (2, 'Evening', 'Tuesday', 1, 'Amoxicillin', '250 mg', 'Tablet'),
--        (2, 'Morning', 'Thursday', 1, 'Amoxicillin', '250 mg', 'Tablet'),
--        (2, 'Noon', 'Thursday', 1, 'Amoxicillin', '250 mg', 'Tablet'),
--        (2, 'Evening', 'Thursday', 1, 'Amoxicillin', '250 mg', 'Tablet'),
--        (2, 'Morning', 'Saturday', 1, 'Amoxicillin', '250 mg', 'Tablet'),
--        (2, 'Noon', 'Saturday', 1, 'Amoxicillin', '250 mg', 'Tablet'),
--        (2, 'Evening', 'Saturday', 1, 'Amoxicillin', '250 mg', 'Tablet');

-- -- Lisinopril
-- INSERT INTO "medicationSchedules" ("medicationId", "timeOfDay", "dayOfWeek", "taken", "userId", "name", "dosage", "form")
-- VALUES (3, 'Morning', 'Monday', 1, 'Lisinopril', '10 mg', 'Tablet'),
--        (3, 'Morning', 'Tuesday', 1, 'Lisinopril', '10 mg', 'Tablet');

-- -- Metformin
-- INSERT INTO "medicationSchedules" ("medicationId", "timeOfDay", "dayOfWeek", "userId", "name", "dosage", "form")
-- VALUES (4, 'Morning', 'Wednesday', 1, 'Metformin', '500 mg', 'Tablet'),
--        (4, 'Noon', 'Wednesday', 1, 'Metformin', '500 mg', 'Tablet'),
--        (4, 'Evening', 'Wednesday', 1, 'Metformin', '500 mg', 'Tablet'),
--        (4, 'Bed time', 'Wednesday', 1, 'Metformin', '500 mg', 'Tablet'),
--        (4, 'Morning', 'Friday', 1, 'Metformin', '500 mg', 'Tablet'),
--        (4, 'Noon', 'Friday', 1, 'Metformin', '500 mg', 'Tablet'),
--        (4, 'Evening', 'Friday', 1, 'Metformin', '500 mg', 'Tablet'),
--        (4, 'Bed time', 'Friday', 1, 'Metformin', '500 mg', 'Tablet'),
--        (4, 'Morning', 'Sunday', 1, 'Metformin', '500 mg', 'Tablet'),
--        (4, 'Noon', 'Sunday', 1, 'Metformin', '500 mg', 'Tablet'),
--        (4, 'Evening', 'Sunday', 1, 'Metformin', '500 mg', 'Tablet'),
--        (4, 'Bed time', 'Sunday', 1, 'Metformin', '500 mg', 'Tablet');

-- -- Sertraline
-- INSERT INTO "medicationSchedules" ("medicationId", "timeOfDay", "dayOfWeek", "userId", "name", "dosage", "form")
-- VALUES (5, 'Morning', 'Monday', 1, 'Sertraline', '50 mg', 'Tablet'),
--        (5, 'Evening', 'Monday', 1, 'Sertraline', '50 mg', 'Tablet'),
--        (5, 'Morning', 'Thursday', 1, 'Sertraline', '50 mg', 'Tablet'),
--        (5, 'Evening', 'Thursday', 1, 'Sertraline', '50 mg', 'Tablet');

-- -- Albuterol
-- INSERT INTO "medicationSchedules" ("medicationId", "timeOfDay", "dayOfWeek", "userId", "name", "dosage", "form")
-- VALUES (6, 'Morning', 'Saturday', 1, 'Albuterol', '90 mcg', 'Inhaler'),
--        (6, 'Noon', 'Saturday', 1, 'Albuterol', '90 mcg', 'Inhaler'),
--        (6, 'Evening', 'Saturday', 1, 'Albuterol', '90 mcg', 'Inhaler'),
--        (6, 'Morning', 'Sunday', 1, 'Albuterol', '90 mcg', 'Inhaler'),
--        (6, 'Noon', 'Sunday', 1, 'Albuterol', '90 mcg', 'Inhaler'),
--        (6, 'Evening', 'Sunday', 1, 'Albuterol', '90 mcg', 'Inhaler');

-- -- Omeprazole
-- INSERT INTO "medicationSchedules" ("medicationId", "timeOfDay", "dayOfWeek", "userId", "name", "dosage", "form")
-- VALUES (7, 'Morning', 'Wednesday', 1, 'Omeprazole', '20 mg', 'Capsule'),
--        (7, 'Morning', 'Saturday', 1, 'Omeprazole', '20 mg', 'Capsule');

-- -- Ibuprofen
-- INSERT INTO "medicationSchedules" ("medicationId", "timeOfDay", "dayOfWeek", "userId", "name", "dosage", "form")
-- VALUES (8, 'Morning', 'Tuesday', 1, 'Ibuprofen', '400 mg', 'Tablet'),
--        (8, 'Noon', 'Tuesday', 1, 'Ibuprofen', '400 mg', 'Tablet'),
--        (8, 'Evening', 'Tuesday', 1, 'Ibuprofen', '400 mg', 'Tablet'),
--        (8, 'Bed time', 'Tuesday', 1, 'Ibuprofen', '400 mg', 'Tablet'),
--        (8, 'Morning', 'Thursday', 1, 'Ibuprofen', '400 mg', 'Tablet'),
--        (8, 'Noon', 'Thursday', 1, 'Ibuprofen', '400 mg', 'Tablet'),
--        (8, 'Evening', 'Thursday', 1, 'Ibuprofen', '400 mg', 'Tablet'),
--        (8, 'Bed time', 'Thursday', 1, 'Ibuprofen', '400 mg', 'Tablet'),
--        (8, 'Morning', 'Sunday', 1, 'Ibuprofen', '400 mg', 'Tablet'),
--        (8, 'Noon', 'Sunday', 1, 'Ibuprofen', '400 mg', 'Tablet'),
--        (8, 'Evening', 'Sunday', 1, 'Ibuprofen', '400 mg', 'Tablet'),
--        (8, 'Bed time', 'Sunday', 1, 'Ibuprofen', '400 mg', 'Tablet');

-- -- Simvastatin
-- INSERT INTO "medicationSchedules" ("medicationId", "timeOfDay", "dayOfWeek", "userId", "name", "dosage", "form")
-- VALUES (9, 'Morning', 'Monday', 1, 'Simvastatin', '20 mg', 'Tablet'),
--        (9, 'Evening', 'Monday', 1, 'Simvastatin', '20 mg', 'Tablet'),
--        (9, 'Morning', 'Friday', 1, 'Simvastatin', '20 mg', 'Tablet'),
--        (9, 'Evening', 'Friday', 1, 'Simvastatin', '20 mg', 'Tablet');

-- -- Levothyroxine
-- INSERT INTO "medicationSchedules" ("medicationId", "timeOfDay", "dayOfWeek", "userId", "name", "dosage", "form")
-- VALUES (10, 'Morning', 'Tuesday', 1, 'Levothyroxine', '75 mcg', 'Tablet'),
--        (10, 'Noon', 'Tuesday', 1, 'Levothyroxine', '75 mcg', 'Tablet'),
--        (10, 'Evening', 'Tuesday', 1, 'Levothyroxine', '75 mcg', 'Tablet'),
--        (10, 'Morning', 'Thursday', 1, 'Levothyroxine', '75 mcg', 'Tablet'),
--        (10, 'Noon', 'Thursday', 1, 'Levothyroxine', '75 mcg', 'Tablet'),
--        (10, 'Evening', 'Thursday', 1, 'Levothyroxine', '75 mcg', 'Tablet'),
--        (10, 'Morning', 'Saturday', 1, 'Levothyroxine', '75 mcg', 'Tablet'),
--        (10, 'Noon', 'Saturday', 1, 'Levothyroxine', '75 mcg', 'Tablet'),
--        (10, 'Evening', 'Saturday', 1, 'Levothyroxine', '75 mcg', 'Tablet');

-- -- Simulating logs for the past 3 days
-- -- Day 1: Some medications taken, some missed
-- -- INSERT INTO "medicationLogs" ("medicationId", "userId", "scheduleId", "taken")
-- -- VALUES
-- -- (1, 1, 1, true),   -- Tylenol, Morning, Monday
-- -- (1, 1, 2, true),   -- Tylenol, Noon, Monday
-- -- (1, 1, 3, false),  -- Tylenol, Evening, Monday (missed)
-- -- (1, 1, 4, true),   -- Tylenol, Bed time, Monday
-- -- (3, 1, 29, true),  -- Lisinopril, Morning, Monday
-- -- (5, 1, 71, true),  -- Sertraline, Morning, Monday
-- -- (5, 1, 72, false), -- Sertraline, Evening, Monday (missed)


-- -- -- Day 2: All scheduled medications taken
-- -- INSERT INTO "medicationLogs" ("medicationId", "userId", "scheduleId", "taken")
-- -- VALUES
-- -- (1, 1, 5, true),   -- Tylenol, Morning, Tuesday
-- -- (1, 1, 6, true),   -- Tylenol, Noon, Tuesday
-- -- (1, 1, 7, true),   -- Tylenol, Evening, Tuesday
-- -- (1, 1, 8, true),   -- Tylenol, Bed time, Tuesday
-- -- (2, 1, 30, true),  -- Amoxicillin, Morning, Tuesday
-- -- (2, 1, 31, true),  -- Amoxicillin, Noon, Tuesday
-- -- (2, 1, 32, true),  -- Amoxicillin, Evening, Tuesday
-- -- (3, 1, 30, true),  -- Lisinopril, Morning, Tuesday
-- -- (8, 1, 83, true),  -- Ibuprofen, Morning, Tuesday
-- -- (8, 1, 84, true),  -- Ibuprofen, Noon, Tuesday
-- -- (8, 1, 85, true),  -- Ibuprofen, Evening, Tuesday
-- -- (8, 1, 86, true),  -- Ibuprofen, Bed time, Tuesday

-- -- -- Day 3: Some medications taken, some missed
-- -- INSERT INTO "medicationLogs" ("medicationId", "userId", "scheduleId", "taken")
-- -- VALUES
-- -- (1, 1, 9, true),   -- Tylenol, Morning, Wednesday
-- -- (1, 1, 10, false), -- Tylenol, Noon, Wednesday (missed)
-- -- (1, 1, 11, true),  -- Tylenol, Evening, Wednesday
-- -- (1, 1, 12, true),  -- Tylenol, Bed time, Wednesday
-- -- (4, 1, 41, true),  -- Metformin, Morning, Wednesday
-- -- (4, 1, 42, true),  -- Metformin, Noon, Wednesday
-- -- (4, 1, 43, false), -- Metformin, Evening, Wednesday (missed)
-- -- (4, 1, 44, true),  -- Metformin, Bed time, Wednesday

-- insert into "medicationLogs" ("medicationId", "userId", "scheduleId", "taken")
--   values
--   (1, 1, 9, true),
--   (1, 1, 10, true),
--   (1, 1, 11, false),
--   (1, 1, 12, true)
