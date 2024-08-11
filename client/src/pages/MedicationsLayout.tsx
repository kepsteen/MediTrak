import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MedicationList } from '../components/MedicationList';
import { MedicationScheduleLayout } from '../components/MedicationScheduleLayout';
import { useEffect, useState } from 'react';
import { ConnectedUsers, Medication } from '../../data';
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
  const [connectedUsers, setConnectedUsers] = useState<ConnectedUsers[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const { user } = useUser();
  const token = readToken();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchConnectedUsers() {
      try {
        const response = await fetch('/api/requests', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok)
          throw new Error(`Response status: ${response.status}`);
        const requestsResult = (await response.json()) as ConnectedUsers[];
        setConnectedUsers(
          requestsResult.filter((request) => request.status === 'Accepted')
        );
      } catch (error) {
        setError(error);
      }
    }
    fetchConnectedUsers();
  }, [token]);

  useEffect(() => {
    if (!user) {
      navigate('/sign-in');
    }
    const fetchMedications = async (patientId: string) => {
      console.log(`fetching meds for ${patientId}`);
      if (user) {
        try {
          const response = await fetch(`/api/medications/${patientId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!response.ok)
            throw new Error(`Response status: ${response.status}`);
          const medications = (await response.json()) as Medication[];
          setMedications(medications);
        } catch (error) {
          setError(error);
        }
      }
    };
    if (selectedPatientId) fetchMedications(selectedPatientId);
    if (!selectedPatientId && user?.role === 'Patient')
      fetchMedications(String(user?.userId));
  }, [user, token, navigate, selectedPatientId]);

  async function updateMedication(updatedMedication: Medication) {
    try {
      const response2 = await fetch('/api/medications', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedMedication),
      });
      if (!response2.ok)
        throw new Error(`Response2 status: ${response2.status}`);
      setMedications((prevMeds) =>
        prevMeds.map((med) =>
          med.medicationId === updatedMedication.medicationId
            ? updatedMedication
            : med
        )
      );
    } catch (error) {
      setError(error);
    }
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
            {user?.role === 'Caregiver' && connectedUsers.length > 0 && (
              <Select
                value={selectedPatientId}
                onValueChange={setSelectedPatientId}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a patient" />
                </SelectTrigger>
                <SelectContent>
                  {connectedUsers.map((connectedUser, index) => (
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
            <MedicationList medications={medications} error={error} />
          </TabsContent>
          <TabsContent value="schedule">
            <MedicationScheduleLayout
              medications={medications}
              error={error}
              updateMedication={updateMedication}
            />
          </TabsContent>
        </Tabs>
      )}
    </>
  );
}
