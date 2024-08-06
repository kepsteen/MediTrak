import { AddScheduleForm } from '@/components/AddScheduleForm';
import { Medication, Schedule } from '../../data';
import { useCallback, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { MedicationIcon } from './MedicationList';
import { HoverClickPopover } from './ui/hover-click-popover';
import { MedStatusDot } from './ui/med-status-dot';
import { MoveLeft, MoveRight } from 'lucide-react';
import { Button } from './ui/button';
import { readToken } from '@/lib/data';

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
  const [selectedDateObj, setSelectedDateObj] = useState<Date>(new Date());
  const [unScheduledMeds, setUnscheduledMeds] = useState<Medication[]>([]);
  const [fetchError, setFetchError] = useState<unknown>();
  const [dailySchedules, setDailySchedules] = useState<Schedule[]>([]);
  const token = readToken();

  const fetchSchedules = useCallback(
    async (day: number) => {
      try {
        const response = await fetch('/api/schedule', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok)
          throw new Error(`Response status: ${response.status}`);
        const schedules = (await response.json()) as Schedule[];
        setDailySchedules(
          schedules.filter((schedule) =>
            schedule.daysOfWeek.includes(days[day])
          )
        );
      } catch (error) {
        setFetchError(error);
      }
    },
    [token]
  );

  const selectedDateString = `${days[selectedDateObj.getDay()]} ${
    months[selectedDateObj.getMonth()]
  }, ${dates[selectedDateObj.getDate()]}`;
  const currentDateObj = new Date();

  useEffect(() => {
    setSelectedDateObj(selectedDateObj);
    fetchSchedules(selectedDateObj.getDay());
  }, [selectedDateObj, fetchSchedules]);

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

  function handleDateChange(direction: string) {
    if (direction === 'previous') {
      setSelectedDateObj(
        new Date(selectedDateObj.setDate(selectedDateObj.getDate() - 1))
      );
    } else if (direction === 'next') {
      setSelectedDateObj(
        new Date(selectedDateObj.setDate(selectedDateObj.getDate() + 1))
      );
    }
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
          <div className="flex items-center justify-between">
            <Button
              size="icon"
              variant="ghost"
              className="flex gap-2"
              onClick={() => handleDateChange('previous')}>
              <MoveLeft size={18} />
            </Button>
            <CardTitle className="text-center">{selectedDateString}</CardTitle>
            <Button
              size="icon"
              variant="ghost"
              className="flex gap-2"
              onClick={() => handleDateChange('next')}>
              <MoveRight size={18} />
            </Button>
          </div>
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
                        <li
                          key={`${medTime}${schedule.id}`}
                          className="flex items-center justify-between mb-2">
                          <HoverClickPopover
                            trigger={<span>{schedule.name}</span>}
                            content={
                              <div className="flex space-x-4">
                                <MedicationIcon type={schedule.form} />
                                <h4 className="text-sm font-semibold">
                                  {`${schedule.name} ${schedule.dosage} ${schedule.form}`}
                                </h4>
                              </div>
                            }></HoverClickPopover>
                          {selectedDateObj.valueOf() <=
                            currentDateObj.valueOf() && (
                            <MedStatusDot
                              medicationId={schedule.medicationId}
                            />
                          )}
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
