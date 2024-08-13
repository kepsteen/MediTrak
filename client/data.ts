export type Medication = {
  medicationId: number;
  name: string;
  dosage: string;
  form: string;
  notes: string;
  prescriber: string;
  amount: number;
  remaining: number;
  userId: number;
  scheduled: boolean;
  createdAt: string;
};

export type Schedule = {
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

export type ScheduleLog = Schedule & Log;

const days = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

/**
 * Fetches all the Requests for access of the current user
 * @param token - jwt token that contains the user data
 * @throws error if the response is not ok
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
