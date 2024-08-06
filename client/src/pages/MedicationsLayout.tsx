import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MedicationList } from '../components/MedicationList';
import { MedicationSchedule } from '../components/MedicationSchedule';
import { useEffect, useState } from 'react';
import { Medication } from '../../data';
import { useUser } from '@/components/useUser';
import { readToken } from '@/lib/data';
import { useNavigate } from 'react-router';

export function MedicationsLayout() {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [error, setError] = useState<unknown>();
  const { user } = useUser();
  const token = readToken();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/sign-in');
    }
    const fetchMedications = async () => {
      if (user) {
        try {
          const response = await fetch(`/api/medications/${user.userId}`, {
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
    fetchMedications();
  }, [user, token, navigate]);

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
          med.id === updatedMedication.id ? updatedMedication : med
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
          <div className="flex justify-center">
            <TabsList>
              <TabsTrigger value="list">List</TabsTrigger>
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="list">
            <MedicationList medications={medications} error={error} />
          </TabsContent>
          <TabsContent value="schedule">
            <MedicationSchedule
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
