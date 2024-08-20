import { AddScheduleForm } from '@/components/AddScheduleForm';
import {
  resetLog,
  fetchSchedules,
  Medication,
  ScheduleLog,
  updatedScheduledStatus,
} from '@/lib/data';
import { useCallback, useEffect, useState } from 'react';
import { MedicationSchedule } from './MedicationSchedule';
import { useUser } from './useUser';
import { useToast } from './ui/use-toast';

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
  onMedicationUpdate: (value: Medication[]) => void;
};

export function MedicationScheduleLayout({
  medications,
  selectedPatientId,
  onMedicationUpdate,
}: Props) {
  const [unScheduledMeds, setUnscheduledMeds] = useState<Medication[]>([]);
  const [selectedDateObj, setSelectedDateObj] = useState<Date>(new Date());
  const [dailySchedules, setDailySchedules] = useState<ScheduleLog[]>([]);
  const { user } = useUser();
  const { toast } = useToast();
  if (user?.role === 'Patient') selectedPatientId = user?.userId;

  /**
   * Callback function to fetch the schedules for the current day and update the daily schedules state
   * on error sets the error state
   */
  const fetchSchedulesCallback = useCallback(
    async (day: number, selectedPatientId: number) => {
      try {
        const schedules = await fetchSchedules(day, selectedPatientId);
        await checkForOldLogs(schedules, day, selectedPatientId);
        setDailySchedules(schedules);
      } catch (error) {
        toast({ title: String(error), variant: 'destructive' });
      }
    },
    [toast]
  );

  /**
   * Checks for any Logs older than a week and resets them
   * @param schedules - List of schedule logs for the current selected day
   * @param dayNum - index of the days array
   * @param selectedPatientId
   */
  async function checkForOldLogs(
    schedules: ScheduleLog[],
    dayNum: number,
    selectedPatientId: number
  ) {
    for (const schedule of schedules) {
      const updatedAt = new Date(schedule.updatedAt);
      const currentDate = new Date();
      const differenceInDays: number =
        (currentDate.getTime() - updatedAt.getTime()) / (1000 * 60 * 60 * 24);
      if (differenceInDays > 7) {
        await resetLog(dayNum, selectedPatientId, schedule.scheduleId);
      }
    }
  }

  useEffect(() => {
    // Don't fetch the schedules if there is no patient selected
    if (selectedPatientId) {
      setSelectedDateObj(selectedDateObj);
      setUnscheduledMeds(
        medications.filter((medication) => medication.scheduled === false)
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
      setUnscheduledMeds(
        unScheduledMeds.filter(
          (med) => med.medicationId !== medication.medicationId
        )
      );
      const updatedMedication = { ...medication, scheduled: true };
      onMedicationUpdate(
        medications.map((med) =>
          med.medicationId === medication.medicationId ? updatedMedication : med
        )
      );
      await updatedScheduledStatus(updatedMedication);
    } catch (error) {
      toast({ title: String(error) });
    }
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
