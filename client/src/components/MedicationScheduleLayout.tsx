import { AddScheduleForm } from '@/components/AddScheduleForm';
import { Medication, ScheduleLog } from '../../data';
import { useEffect, useState } from 'react';
import { MedicationSchedule } from './MedicationSchedule';
import { readToken } from '@/lib/data';

const days = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

type Props = {
  medications: Medication[];
  updateMedication: (medication: Medication) => void;
};

export function MedicationScheduleLayout({
  medications,
  updateMedication,
}: Props) {
  const [unScheduledMeds, setUnscheduledMeds] = useState<Medication[]>([]);
  const [selectedDateObj, setSelectedDateObj] = useState<Date>(new Date());
  const [dailySchedules, setDailySchedules] = useState<ScheduleLog[]>([]);
  const [error, setError] = useState<unknown>();
  const token = readToken();

  useEffect(() => {
    const fetchSchedules = async (day: number) => {
      try {
        const response = await fetch(`/api/schedule/${days[day]}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok)
          throw new Error(`Response status: ${response.status}`);
        const schedules = (await response.json()) as ScheduleLog[];
        setDailySchedules(schedules);
      } catch (error) {
        setError(error);
      }
    };
    setSelectedDateObj(selectedDateObj);
    fetchSchedules(selectedDateObj.getDay());
  }, [selectedDateObj, token]);

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
          currentDay={days[selectedDateObj.getDay()]}
          dailySchedules={dailySchedules}
          setDailySchedules={setDailySchedules}
        />
      )}
      <MedicationSchedule
        dailySchedules={dailySchedules}
        selectedDateObj={selectedDateObj}
        setSelectedDateObj={setSelectedDateObj}
      />
    </section>
  );
}
