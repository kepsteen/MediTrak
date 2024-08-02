import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MedicationList } from './MedicationList';
import { MedicationSchedule } from './MedicationSchedule';

export function MedicationsLayout() {
  return (
    <>
      <Tabs defaultValue="list" className="container pt-[100px]">
        <div className="flex justify-center">
          <TabsList>
            <TabsTrigger value="list">List</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="list">
          <MedicationList />
        </TabsContent>
        <TabsContent value="schedule">
          <MedicationSchedule />
        </TabsContent>
      </Tabs>
    </>
  );
}
