import { AddScheduleForm } from '@/components/AddScheduleForm';
import {
  fetchSchedules,
  Medication,
  ScheduleLog,
  updatedScheduledStatus,
} from '@/lib/data';
import { useCallback, useEffect, useState } from 'react';
import { MedicationSchedule } from './MedicationSchedule';
import { useUser } from './useUser';

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
  selectedPatientId: number;
};

export function MedicationScheduleLayout({
  medications,
  selectedPatientId,
}: Props) {
  const [unScheduledMeds, setUnscheduledMeds] = useState<Medication[]>([]);
  const [selectedDateObj, setSelectedDateObj] = useState<Date>(new Date());
  const [dailySchedules, setDailySchedules] = useState<ScheduleLog[]>([]);
  const [error, setError] = useState<unknown>();
  const { user } = useUser();
  if (user?.role === 'Patient') selectedPatientId = user?.userId;

  /**
   * Callback function to fetch the schedules for the current day and update the daily schedules state
   * on error sets the error state
   */
  const fetchSchedulesCallback = useCallback(
    async (day: number, selectedPatientId: number) => {
      try {
        const schedules = await fetchSchedules(day, selectedPatientId);
        setDailySchedules(schedules);
      } catch (error) {
        setError(error);
      }
    },
    []
  );

  useEffect(() => {
    // Don't fetch the schedules if there is no patient selected
    if (selectedPatientId) {
      setSelectedDateObj(selectedDateObj);
      setUnscheduledMeds(
        medications.filter((medication) => !medication.scheduled)
      );
      fetchSchedulesCallback(selectedDateObj.getDay(), selectedPatientId);
    }
  }, [fetchSchedulesCallback, selectedDateObj, selectedPatientId, medications]);

  /**
   * Sets the scheduled attribute of the medication to true and removes the medication from the unscheduled meds
   * @param medication - medication that was scheduled
   */
  async function handleScheduleComplete(medication: Medication) {
    try {
      const updatedMedication = { ...medication, scheduled: true };
      await updatedScheduledStatus(updatedMedication);
      setUnscheduledMeds((prevMeds) =>
        prevMeds.filter((med) => med.medicationId !== medication.medicationId)
      );
    } catch (error) {
      setError(error);
      // Todo: toast the error instead because whole page wont display if there is an error or alert
    }
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
          onDayChange={setDailySchedules}
          selectedPatientId={selectedPatientId}
        />
      )}
      <MedicationSchedule
        dailySchedules={dailySchedules}
        selectedDateObj={selectedDateObj}
        onDateChange={setSelectedDateObj}
      />
    </section>
  );
}
