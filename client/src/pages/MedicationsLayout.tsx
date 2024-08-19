import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MedicationList } from '../components/MedicationList';
import { MedicationScheduleLayout } from '../components/MedicationScheduleLayout';
import { useCallback, useEffect, useState } from 'react';
import {
  ConnectedUsers,
  fetchMedications,
  fetchRequests,
  Medication,
} from '@/lib/data';
import { useUser } from '@/components/useUser';
import { useNavigate } from 'react-router';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';

export function MedicationsLayout() {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [patients, setPatients] = useState<ConnectedUsers[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const { user } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();

  /**
   * Sets the patients state variable to the patients that have given this account access to their data.
   * on error sets Error state.
   */
  const fetchPatientsCallback = useCallback(async () => {
    try {
      const requests = await fetchRequests();
      setPatients(requests.filter((request) => request.status === 'Accepted'));
    } catch (error) {
      toast({ title: String(error), variant: 'destructive' });
    }
  }, [toast]);

  /**
   * Sets the medication state variable to the fetched medications
   * @param patientId - Id of the selected patient
   */
  const fetchMedicationsCallback = useCallback(
    async (patientId: string) => {
      if (user) {
        try {
          const medications = await fetchMedications(patientId);
          setMedications(medications);
        } catch (error) {
          toast({ title: String(error) });
        }
      }
    },
    [user, toast]
  );

  useEffect(() => {
    if (!user) {
      navigate('/sign-in');
      return;
    }
    if (user?.role === 'Caregiver') fetchPatientsCallback();
    if (selectedPatientId) fetchMedicationsCallback(selectedPatientId);
    if (!selectedPatientId && user?.role === 'Patient')
      fetchMedicationsCallback(String(user?.userId));
  }, [
    user,
    navigate,
    selectedPatientId,
    fetchMedicationsCallback,
    fetchPatientsCallback,
  ]);

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
              onMedicationUpdate={setMedications}
            />
          </TabsContent>
        </Tabs>
      )}
    </>
  );
}
