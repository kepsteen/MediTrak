import { Separator } from '@radix-ui/react-select';
import { MoveLeft, MoveRight } from 'lucide-react';
import { MedicationIcon } from './MedicationList';
import { Button } from './ui/button';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { HoverClickPopover } from './ui/hover-click-popover';
import { MedStatusDot } from './ui/med-status-dot';
import { useCallback, useEffect, useState } from 'react';
import { readToken } from '@/lib/data';
import { Schedule } from 'data';

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

const medTimes = ['Morning', 'Noon', 'Evening', 'Bed time'];

export function MedicationSchedule() {
  const [selectedDateObj, setSelectedDateObj] = useState<Date>(new Date());
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
        console.log('schedules', schedules);
        setDailySchedules(
          schedules.filter((schedule) => schedule.dayOfWeek === days[day])
        );
      } catch (error) {
        setFetchError(error);
      }
    },
    [token]
  );

  useEffect(() => {
    setSelectedDateObj(selectedDateObj);
    fetchSchedules(selectedDateObj.getDay());
  }, [selectedDateObj, fetchSchedules]);

  const selectedDateString = `${days[selectedDateObj.getDay()]} ${
    months[selectedDateObj.getMonth()]
  }, ${dates[selectedDateObj.getDate()]}`;
  const currentDateObj = new Date();

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

  if (fetchError) {
    return (
      <>
        <p>{`fetchError : ${fetchError}`}</p>
      </>
    );
  }
  return (
    <>
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
            {medTimes.map((medTime) => (
              <div key={medTime}>
                <h3 className="text-xl font-semibold">{medTime}</h3>
                <Separator />
                <ul className="pl-4 my-4">
                  {dailySchedules.map((schedule) => {
                    if (schedule.timeOfDay === medTime) {
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
                              isClicked={schedule.taken}
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
