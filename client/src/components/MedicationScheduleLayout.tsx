import { AddScheduleForm } from '@/components/AddScheduleForm';
import { Medication } from '../../data';
import { useEffect, useState } from 'react';
import { MedicationSchedule } from './MedicationSchedule';

type Props = {
  medications: Medication[];
  error: unknown;
  updateMedication: (medication: Medication) => void;
};

export function MedicationScheduleLayout({
  medications,
  error,
  updateMedication,
}: Props) {
  const [unScheduledMeds, setUnscheduledMeds] = useState<Medication[]>([]);

  useEffect(() => {
    setUnscheduledMeds(
      medications.filter((medication) => !medication.scheduled)
    );
  }, [medications]);

  async function handleScheduleComplete(medication: Medication) {
    const updatedMedication = { ...medication, scheduled: true };
    updateMedication(updatedMedication);
    setUnscheduledMeds((prevMeds) =>
      prevMeds.filter((med) => med.medicationId !== medication.medicationId)
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
    <section className="gap-10 mb-4 lg:flex">
      {unScheduledMeds.length > 0 && (
        <AddScheduleForm
          medication={unScheduledMeds[0]}
          onScheduleComplete={handleScheduleComplete}
        />
      )}
      <MedicationSchedule />
    </section>
  );
}
