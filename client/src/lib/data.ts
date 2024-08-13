import { User } from '../components/UserContext';

const authKey = 'um.auth';

type Auth = {
  user: User;
  token: string;
};
export type Medication = {
  medicationId: number;
  name: string;
  dosage: string;
  form: string;
  notes?: string;
  prescriber?: string;
  amount: number;
  remaining: number;
  userId: number;
  scheduled: boolean;
  createdAt: string;
};

type MedicationInput = {
  name: string;
  dosage: string;
  form: string;
  notes?: string;
  prescriber?: string;
  amount: string;
  remaining: string;
  userId: number;
  scheduled: boolean;
};

export type ScheduleEntry = {
  id: number;
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

type ScheduleTemplate = {
  medicationId: number;
  timesPerDay: number;
  daysOfWeek: string[];
  userId: number;
  name: string;
  dosage: string;
  form: string;
  currentDay: string;
};

export type Log = {
  id: number;
  medicationId: number;
  userId: number;
  scheduleId: number;
  taken: boolean;
  updatedAt: string;
};

export type CaregiverAccess = {
  userId: number;
  connectedUserId: number;
  grantedAt: string;
  active: string;
};

export type Requests = {
  requestId: number;
  requestedId: number;
  requesterId: number;
  requesterUsername: string;
  requesterFullName: string;
  status: string;
  requestedAt: string;
  updatedAt: string;
};

export type ConnectedUsers = {
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

export type ScheduleLog = ScheduleEntry & Log;

type newUser = {
  username: string;
  password: string;
  confirmPassword: string;
  role: string;
  dob: string;
  phoneNumber: string;
  notificationsEnabled: boolean;
};

type SimpleUser = {
  username: string;
  password: string;
};

const days = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export function saveAuth(user: User, token: string): void {
  const auth: Auth = { user, token };
  localStorage.setItem(authKey, JSON.stringify(auth));
}

export function removeAuth(): void {
  localStorage.removeItem(authKey);
}

export function readUser(): User | undefined {
  const auth = localStorage.getItem(authKey);
  if (!auth) return undefined;
  return (JSON.parse(auth) as Auth).user;
}

export function readToken(): string | undefined {
  const auth = localStorage.getItem(authKey);
  if (!auth) return undefined;
  return (JSON.parse(auth) as Auth).token;
}

/**
 * Fetches all the Requests for access of the current user
 * @param token - jwt token that contains the user data
 * @throws error if response is not ok
 * @returns requests
 */
export async function fetchRequests(token: string) {
  const response = await fetch('/api/requests', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error(`Response status: ${response.status}`);
  const requestsResult = (await response.json()) as ConnectedUsers[];
  return requestsResult;
}

/**
 * Fetches all the medications for the patient
 * @param patientId - the userId of the selected patient
 * @param token - jwt token that contains the user data
 * @throws error if response is not ok
 * @returns medications
 */
export async function fetchMedications(patientId: string, token: string) {
  const response = await fetch(`/api/medications/${patientId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error(`Response status: ${response.status}`);
  const medications = (await response.json()) as Medication[];
  return medications;
}

/**
 * Updates the scheduled status to true
 * @param updatedMedication - medication with scheduled property set to true
 * @param token - jwt token
 * @throws error if response is not ok
 */
export async function updatedScheduledStatus(
  updatedMedication: Medication,
  token: string
) {
  const response = await fetch('/api/medications', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updatedMedication),
  });
  if (!response.ok) throw new Error(`Response2 status: ${response.status}`);
}

/**
 * fetch the schedules for the selected day
 * @param day - day of the week e.g. 'Monday'
 * @param selectedPatientId
 * @param token - jwt token
 * @throws error if response is not ok
 * @returns schedules array
 */
export async function fetchSchedules(
  day: number,
  selectedPatientId: number,
  token: string
) {
  const response = await fetch(
    `/api/schedule/${days[day]}/${selectedPatientId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!response.ok) throw new Error(`Response status: ${response.status}`);
  const schedules = (await response.json()) as ScheduleLog[];
  return schedules;
}

/**
 * Updates the remaining count for the given medicationId in the database
 * @param medicationId
 * @param operation - Increment or Decrement
 * @param token - jwt token
 * @throws error if response is not ok
 */
export async function updateMedicationCount(
  medicationId: number,
  operation: string,
  token: string
) {
  const response = await fetch(`/api/medications/${medicationId}/inventory`, {
    method: 'PUT',
    headers: {
      'Content-type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ operation }),
  });
  if (!response.ok) throw new Error(`Response: ${response.status}`);
}

/**
 * Updates the taken attribute of the log in the database
 * @param scheduleId
 * @param operation - Increment or Decrement
 * @param token - jwt token
 * @throws error if response is not ok
 */
export async function updateLogStatus(
  scheduleId: number,
  operation: string,
  token: string
) {
  const response = await fetch(`/api/log/${scheduleId}`, {
    method: 'PUT',
    headers: {
      'Content-type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ operation }),
  });
  if (!response.ok) throw new Error(`Response: ${response.status}`);
}

/**
 * fetch the Connection Requests for the current user
 * @param token - jwt token
 * @returns all the requests including pending and accepted
 * @throws error if response is not ok
 */
export async function fetchConnectedUsers(token: string) {
  const response = await fetch('/api/requests', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error(`Response status: ${response.status}`);
  const requestsResult = (await response.json()) as ConnectedUsers[];
  return requestsResult;
}

/**
 * Updates the request status to accepted or deletes the request if it is denied
 * @param isAccepted - true if user accepts the request
 * @param requesterId - id of the user who sent the request
 * @param token - jwt token
 * @throws error if response is not ok
 */
export async function updateRequestStatus(
  isAccepted: boolean,
  requesterId: number,
  token: string
) {
  const response = await fetch('/api/requests/respond', {
    method: 'PUT',
    headers: {
      'Content-type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ isAccepted, requesterId }),
  });
  if (!response.ok) throw new Error(`Response status: ${response.status}`);
}

/**
 * Registers an new account in the database if the username is not taken
 * @param newUser -
 * @throws error if username taken or response not ok
 */
export async function registerUser(newUser: newUser) {
  const response = await fetch('/api/sign-up', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify(newUser),
  });
  if (!response.ok) {
    if (response.status === 409) {
      throw new Error(`Username ${newUser.username} is already taken.`);
    }
    throw new Error(`Response status: ${response.status}`);
  }
}

/**
 * Validates the user credentials in the database
 * @param user
 * @throws error if credentials are not valid or if response is not ok
 * @returns auth data containing the User and the token
 */
export async function validateUserCredentials(user: SimpleUser) {
  const response = await fetch('/api/sign-in', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify(user),
  });
  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }
  const authData = (await response.json()) as Auth;
  return authData;
}

/**
 * Uses the schedule template to create schedules in the database for each day and time
 * @param scheduleTemplate -
 * @param token - jwt token
 * @throws error if response is not ok
 */
export async function createSchedules(
  scheduleTemplate: ScheduleTemplate,
  token: string
): Promise<ScheduleLog[]> {
  const response = await fetch('/api/schedule', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(scheduleTemplate),
  });
  if (!response.ok) throw new Error(`Response status: ${response.status}`);
  const newSchedules = (await response.json()) as ScheduleLog[];
  return newSchedules;
}

/**
 * Adds the medication to the database
 * @param medication
 * @param token - jwt token
 * @throws error if response is not ok
 */
export async function addMedication(
  medication: MedicationInput,
  token: string
) {
  const response = await fetch('/api/medications', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(medication),
  });
  if (!response.ok) throw new Error(`Response status: ${response.status}`);
}

/**
 * Creates a request to connect with the user with the provided username
 * @param username - username to request
 * @param token - jwt token
 * @throws error if username does not match a user in the database
 * @throws error if response is not ok
 */
export async function createConnectionRequest(username: string, token: string) {
  const response = await fetch('/api/requests/add', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ username }),
  });
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`Username ${username} does not exist.`);
    } else {
      throw new Error(`Response status: ${response.status}`);
    }
  }
}
