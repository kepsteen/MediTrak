import { AddScheduleForm } from '@/components/AddScheduleForm';
import { Medication } from '../../data';
import { useEffect, useState } from 'react';

type Props = {
  medications: Medication[];
  error: unknown;
  updateMedication: (medication: Medication) => void;
};

export function MedicationSchedule({
  medications,
  error,
  updateMedication,
}: Props) {
  const [currentDay, setCurrentDay] = useState('');
  const [unScheduledMeds, setUnscheduledMeds] = useState<Medication[]>([]);

  useEffect(() => {
    const days = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    const today = new Date().getDay();
    setCurrentDay(days[today]);
  }, []);

  useEffect(() => {
    setUnscheduledMeds(
      medications.filter((medication) => !medication.scheduled)
    );
  }, [medications]);

  async function handleScheduleComplete(medication: Medication) {
    const updatedMedication = { ...medication, scheduled: true };
    updateMedication(updatedMedication);
    setUnscheduledMeds((prevMeds) =>
      prevMeds.filter((med) => med.id !== medication.id)
    );
  }

  if (error) {
    return (
      <>
        <p>{`Error : ${error}`}</p>
      </>
    );
  }
  return (
    <>
      {unScheduledMeds.length > 0 && (
        <AddScheduleForm
          medication={unScheduledMeds[0]}
          onScheduleComplete={handleScheduleComplete}
        />
      )}

      <h1>{`Today is ${currentDay}`}</h1>
    </>
  );
}
