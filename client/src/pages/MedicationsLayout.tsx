import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MedicationList } from '../components/MedicationList';
import { MedicationScheduleLayout } from '../components/MedicationScheduleLayout';
import { useCallback, useEffect, useState } from 'react';
import {
  ConnectedUsers,
  fetchMedications,
  fetchRequests,
  Medication,
} from '../../data';
import { useUser } from '@/components/useUser';
import { readToken } from '@/lib/data';
import { useNavigate } from 'react-router';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function MedicationsLayout() {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [error, setError] = useState<unknown>();
  const [patients, setPatients] = useState<ConnectedUsers[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const { user } = useUser();
  const token = readToken();
  const navigate = useNavigate();

  /**
   * Sets the patients state variable to the patients that have given this account access to their data.
   * on error sets Error state.
   */
  const fetchPatientsCallback = useCallback(async () => {
    if (!token) return;
    try {
      const requests = await fetchRequests(token);
      setPatients(requests.filter((request) => request.status === 'Accepted'));
    } catch (error) {
      setError(error);
    }
  }, [token]);

  /**
   * Sets the medication state variable to the fetched medications
   * @param patientId - Id of the selected patient
   * @param token - jwt token of the current user
   */
  const fetchMedicationsCallback = useCallback(
    async (patientId: string, token: string) => {
      if (user) {
        try {
          const medications = await fetchMedications(patientId, token);
          setMedications(medications);
        } catch (error) {
          setError(error);
        }
      }
    },
    [user]
  );

  useEffect(() => {
    if (!user) {
      navigate('/sign-in');
      return;
    }
    if (!token) return;
    if (user?.role === 'Caregiver') fetchPatientsCallback();
    if (selectedPatientId) fetchMedicationsCallback(selectedPatientId, token);
    if (!selectedPatientId && user?.role === 'Patient')
      fetchMedicationsCallback(String(user?.userId), token);
  }, [
    user,
    token,
    navigate,
    selectedPatientId,
    fetchMedicationsCallback,
    fetchPatientsCallback,
  ]);

  // async function updateMedication(updatedMedication: Medication) {
  //   if (!token) return;
  //   await updatedScheduledStatus(updatedMedication, token);
  //   setMedications((prevMeds) =>
  //     prevMeds.map((med) =>
  //       med.medicationId === updatedMedication.medicationId
  //         ? updatedMedication
  //         : med
  //     )
  //   );
  // }

  if (error) {
    return (
      <>
        <p>{`Error : ${error}`}</p>
      </>
    );
  }

  return (
    <>
      {user && (
        <Tabs defaultValue="list" className="container pt-[110px]">
          <div className="flex flex-col items-center justify-center gap-2">
            <TabsList>
              <TabsTrigger value="list">List</TabsTrigger>
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
            </TabsList>
            {user?.role === 'Caregiver' && patients.length > 0 && (
              <Select
                value={selectedPatientId}
                onValueChange={setSelectedPatientId}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a patient" />
                </SelectTrigger>
                <SelectContent>
                  {patients.map((connectedUser, index) => (
                    <SelectItem
                      key={`${connectedUser.requestId}${index}`}
                      value={String(
                        connectedUser.requestedId === user?.userId
                          ? connectedUser.requesterId
                          : connectedUser.requestedId
                      )}>
                      {connectedUser.requestedId === user?.userId
                        ? connectedUser.requesterFullName
                        : connectedUser.requestedFullName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
          <TabsContent value="list">
            <MedicationList
              medications={medications}
              selectedPatientId={parseInt(selectedPatientId)}
            />
          </TabsContent>
          <TabsContent value="schedule">
            <MedicationScheduleLayout
              medications={medications}
              selectedPatientId={parseInt(selectedPatientId)}
            />
          </TabsContent>
        </Tabs>
      )}
    </>
  );
}
