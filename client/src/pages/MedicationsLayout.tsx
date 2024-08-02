import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MedicationList } from './MedicationList';
import { MedicationSchedule } from './MedicationSchedule';
import { useEffect, useState } from 'react';
import { Medication } from '../../data';

export function MedicationsLayout() {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [error, setError] = useState<unknown>();

  const userId = 1;
  useEffect(() => {
    const fetchMedications = async () => {
      try {
        const response = await fetch(`/api/medications/${userId}`);
        if (!response.ok)
          throw new Error(`Response status: ${response.status}`);
        const medications = (await response.json()) as Medication[];
        setMedications(medications);
      } catch (error) {
        setError(error);
      }
    };
    fetchMedications();
  }, []);
  return (
    <>
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
          <MedicationSchedule medications={medications} error={error} />
        </TabsContent>
      </Tabs>
    </>
  );
}
