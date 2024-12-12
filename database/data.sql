-- Use SQL insert statements to add any
-- starting/dummy data to your database tables

-- EXAMPLE:

insert into "users" ("username", "hashedPassword", "role", "fullName", "dateOfBirth", "phoneNumber", "notificationsEnabled")
  values ('JaneDoe39', '$argon2id$v=19$m=65536,t=3,p=4$09z0xFl8vOK1bXwAwAUlfQ$yqnmj+WFQ0BPctyis3bboMm1nVNMa+Rw+2OgNmjCE0A', 'Patient', 'Jane Doe', '03/15/1997', '9499222057', true);

insert into "users" ("username", "hashedPassword", "role", "fullName", "dateOfBirth", "phoneNumber", "notificationsEnabled")
  values ('JohnDoe77', '$argon2id$v=19$m=65536,t=3,p=4$09z0xFl8vOK1bXwAwAUlfQ$yqnmj+WFQ0BPctyis3bboMm1nVNMa+Rw+2OgNmjCE0A', 'Caregiver', 'John Doe', '03/15/1997', '9499222057', true);

insert into "users" ("username", "hashedPassword", "role", "fullName", "dateOfBirth", "phoneNumber", "notificationsEnabled")
  values ('patient2', '$argon2id$v=19$m=65536,t=3,p=4$6MeIFikxuRTxoEhixGGNVg$0CYkAeAu2KRdxbOrMIXAezn0T8/kmyjJA0L9eLZEwUg', 'Patient', 'Patient Two', '03/15/1997', '9499222057', true);

insert into "users" ("username", "hashedPassword", "role", "fullName", "dateOfBirth", "phoneNumber", "notificationsEnabled")
  values ('caregiver2', '$argon2id$v=19$m=65536,t=3,p=4$6MeIFikxuRTxoEhixGGNVg$0CYkAeAu2KRdxbOrMIXAezn0T8/kmyjJA0L9eLZEwUg', 'Caregiver', 'Caregiver Two', '03/15/1997', '9499222057', true);

insert into "users" ("username", "hashedPassword", "role", "fullName", "dateOfBirth", "phoneNumber", "notificationsEnabled")
  values ('patient3', '$argon2id$v=19$m=65536,t=3,p=4$6MeIFikxuRTxoEhixGGNVg$0CYkAeAu2KRdxbOrMIXAezn0T8/kmyjJA0L9eLZEwUg', 'Patient', 'Patient Three', '03/15/1997', '9499222057', true);

insert into "users" ("username", "hashedPassword", "role", "fullName", "dateOfBirth", "phoneNumber", "notificationsEnabled")
  values ('caregiver3', '$argon2id$v=19$m=65536,t=3,p=4$6MeIFikxuRTxoEhixGGNVg$0CYkAeAu2KRdxbOrMIXAezn0T8/kmyjJA0L9eLZEwUg', 'Caregiver', 'Caregiver Three', '03/15/1997', '9499222057', true);

insert into "users" ("username", "hashedPassword", "role", "fullName", "dateOfBirth", "phoneNumber", "notificationsEnabled")
  values ('test-patient', '$argon2id$v=19$m=65536,t=3,p=4$09z0xFl8vOK1bXwAwAUlfQ$yqnmj+WFQ0BPctyis3bboMm1nVNMa+Rw+2OgNmjCE0A', 'Patient', 'Test Patient', '03/15/1997', '9499222057', true);

insert into "accessRequests" ("requestedId", "requesterId", "requesterUsername", "requesterFullName", "status")
values  (2, 1, 'patient', 'Patient One', 'Pending'),
        (2, 3, 'patient2', 'Patient Two', 'Accepted'),
        (3, 4, 'caregiver2', 'Caregiver Two', 'Pending'),
        (6, 5, 'patient3', 'Patient Three', 'Accepted'),
        (1, 6, 'caregiver3', 'Caregiver Three', 'Pending');


INSERT INTO "medications" ("rxcui", "name", "dosage", "form", "notes", "prescriber", "amount", "remaining", "scheduled", "userId")
VALUES (1, 'Tylenol', '500 mg', 'Capsule', 'For headaches', 'Dr. Smith', 30, 30, false, 1);


INSERT INTO "medications" ("rxcui", "name", "dosage", "form", "notes", "prescriber", "amount", "remaining", "scheduled", "userId")
VALUES (1, 'Lisinopril', '10 mg', 'Tablet', 'For high blood pressure', 'Dr. Williams', 90, 90, false, 1);

INSERT INTO "medications" ("rxcui", "name", "dosage", "form", "notes", "prescriber", "amount", "remaining", "scheduled", "userId")
VALUES (1, 'Metformin', '500 mg', 'Tablet', 'For type 2 diabetes', 'Dr. Brown', 60, 60, false, 1);

INSERT INTO "medications" ("rxcui", "name", "dosage", "form", "notes", "prescriber", "amount", "remaining", "scheduled", "userId")
VALUES (1, 'Sertraline', '50 mg', 'Tablet', 'For depression and anxiety', 'Dr. Davis', 30, 30, false, 1);

INSERT INTO "medications" ("rxcui", "name", "dosage", "form", "notes", "prescriber", "amount", "remaining", "scheduled", "userId")
VALUES (1, 'Albuterol', '90 mcg', 'Inhaler', 'For asthma', 'Dr. Miller', 1, 1, false, 1);

INSERT INTO "medications" ("rxcui", "name", "dosage", "form", "notes", "prescriber", "amount", "remaining", "scheduled", "userId")
VALUES (1, 'Omeprazole', '20 mg', 'Capsule', 'For acid reflux', 'Dr. Wilson', 30, 30, false, 1);

INSERT INTO "medications" ("rxcui", "name", "dosage", "form", "notes", "prescriber", "amount", "remaining", "scheduled", "userId")
VALUES (1, 'Ibuprofen', '400 mg', 'Tablet', 'For pain and inflammation', 'Dr. Moore', 50, 50, false, 1);

INSERT INTO "medications" ("rxcui", "name", "dosage", "form", "notes", "prescriber", "amount", "remaining", "scheduled", "userId")
VALUES (1, 'Simvastatin', '20 mg', 'Tablet', 'For high cholesterol', 'Dr. Taylor', 30, 30, false, 1);

INSERT INTO "medications" ("rxcui", "name", "dosage", "form", "notes", "prescriber", "amount", "remaining", "scheduled", "userId")
VALUES (1, 'Levothyroxine', '75 mcg', 'Tablet', 'For hypothyroidism', 'Dr. Anderson', 90, 90, false, 1);

INSERT INTO "medications" ("rxcui", "name", "dosage", "form", "notes", "prescriber", "amount", "remaining", "scheduled", "userId")
VALUES (1, 'Tylenol', '500 mg', 'Capsule', 'For headaches', 'Dr. Smith', 30, 30, false, 3);

INSERT INTO "medications" ("rxcui", "name", "dosage", "form", "notes", "prescriber", "amount", "remaining", "scheduled", "userId")
VALUES (1, 'Amoxicillin', '250 mg', 'Tablet', 'For bacterial infections', 'Dr. Johnson', 20, 20, false, 3);

INSERT INTO "medications" ("rxcui", "name", "dosage", "form", "notes", "prescriber", "amount", "remaining", "scheduled", "userId")
VALUES (1, 'Simvastatin', '20 mg', 'Tablet', 'For high cholesterol', 'Dr. Taylor', 30, 30, false, 3);

INSERT INTO "medications" ("rxcui", "name", "dosage", "form", "notes", "prescriber", "amount", "remaining", "scheduled", "userId")
VALUES (1, 'Levothyroxine', '75 mcg', 'Tablet', 'For hypothyroidism', 'Dr. Anderson', 90, 90, false, 3);

INSERT INTO "medications" ("rxcui", "name", "dosage", "form", "notes", "prescriber", "amount", "remaining", "scheduled", "userId")
VALUES (1, 'Alprazolam', '75 mg', 'Tablet', 'For anxiety', 'Dr. Anderson', 90, 90, false, 3);
