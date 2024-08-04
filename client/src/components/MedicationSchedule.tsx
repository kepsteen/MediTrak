import { AddScheduleForm } from '@/components/AddScheduleForm';
import { Medication, Schedule } from '../../data';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { MedicationIcon } from './MedicationList';
import { HoverClickPopover } from './ui/hover-click-popover';

type Props = {
  medications: Medication[];
  error: unknown;
  updateMedication: (medication: Medication) => void;
};

const days = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const dates = [
  '',
  '1st',
  '2nd',
  '3rd',
  '4th',
  '5th',
  '6th',
  '7th',
  '8th',
  '9th',
  '10th',
  '11th',
  '12th',
  '13th',
  '14th',
  '15th',
  '16th',
  '17th',
  '18th',
  '19th',
  '20th',
  '21st',
  '22nd',
  '23rd',
  '24th',
  '25th',
  '26th',
  '27th',
  '28th',
  '29th',
  '30th',
  '31st',
];

const medTimes = ['Morning', 'Noon', 'Evening', 'Before Bed'];

export function MedicationSchedule({
  medications,
  error,
  updateMedication,
}: Props) {
  const [currentDay, setCurrentDay] = useState('');
  const [currentDate, setCurrentDate] = useState<string>();
  const [unScheduledMeds, setUnscheduledMeds] = useState<Medication[]>([]);
  const [fetchError, setFetchError] = useState<unknown>();
  const [dailySchedules, setDailySchedules] = useState<Schedule[]>([]);

  useEffect(() => {
    const dateObj = new Date();
    const today = dateObj.getDay();
    const month = dateObj.getMonth();
    const date = dateObj.getDate();
    setCurrentDay(days[today]);
    setCurrentDate(`${months[month]}, ${dates[date]}`);
    async function fetchSchedules() {
      try {
        const response = await fetch('/api/schedule');
        if (!response.ok)
          throw new Error(`Response status: ${response.status}`);
        const schedules = (await response.json()) as Schedule[];
        setDailySchedules(
          schedules.filter((schedule) =>
            schedule.daysOfWeek.includes(days[today])
          )
        );
      } catch (error) {
        setFetchError(error);
      }
    }
    fetchSchedules();
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

  if (error || fetchError) {
    return (
      <>
        <p>{`Error : ${error}`}</p>
        <p>{`fetchError : ${fetchError}`}</p>
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

      <Card className="container max-w-[500px]">
        <CardHeader>
          <CardTitle>{`Today ${currentDay} ${currentDate}`}</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            {medTimes.map((medTime, index) => (
              <div key={medTime}>
                <h3 className="text-xl font-semibold">{medTime}</h3>
                <Separator />
                <ul className="pl-4 my-4">
                  {dailySchedules.map((schedule) => {
                    if (schedule.timesPerDay >= index + 1) {
                      return (
                        <li key={`${medTime}${schedule.id}`}>
                          <HoverClickPopover
                            trigger={
                              <h3>{schedule.fullMedName.split(' ').shift()}</h3>
                            }
                            content={
                              <div className="flex space-x-4">
                                <MedicationIcon
                                  type={schedule.fullMedName.split(' ').pop()}
                                />
                                <h4 className="text-sm font-semibold">
                                  {schedule.fullMedName}
                                </h4>
                              </div>
                            }></HoverClickPopover>
                        </li>
                      );
                    }
                  })}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
