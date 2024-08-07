import { MoveLeft, MoveRight } from 'lucide-react';
import { MedicationIcon } from './MedicationList';
import { Button } from './ui/button';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { HoverClickPopover } from './ui/hover-click-popover';
import { MedStatusDot } from './ui/med-status-dot';
import { useEffect, useState } from 'react';
import { readToken } from '@/lib/data';
import { Log, Schedule } from 'data';
import { Separator } from './ui/separator';

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

type ScheduleLog = Schedule & Log;

const medTimes = ['Morning', 'Noon', 'Evening', 'Bed time'];

export function MedicationSchedule() {
  const [selectedDateObj, setSelectedDateObj] = useState<Date>(new Date());
  const [fetchError, setFetchError] = useState<unknown>();
  const [dailySchedules, setDailySchedules] = useState<ScheduleLog[]>([]);
  const [dotStatusStates, setDotStatusStates] = useState<boolean[]>([]);
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
        setDotStatusStates(schedules.map((item) => item.taken));
      } catch (error) {
        setFetchError(error);
      }
    };
    setSelectedDateObj(selectedDateObj);
    fetchSchedules(selectedDateObj.getDay());
  }, [selectedDateObj, token]);

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

  async function handleClick(
    medicationId: number,
    index: number,
    scheduleId: number
  ) {
    try {
      const body = {
        operation: dotStatusStates[index] ? 'increment' : 'decrement',
      };
      const response = await fetch(
        `/api/medications/${medicationId}/inventory`,
        {
          method: 'PUT',
          headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        }
      );
      if (!response.ok) throw new Error(`Response: ${response.status}`);
      const response2 = await fetch(`/api/log/${scheduleId}`, {
        method: 'PUT',
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      if (!response2.ok) throw new Error(`Response: ${response.status}`);
    } catch (error) {
      setError(error);
    } finally {
      setDotStatusStates((prevStates) =>
        prevStates.map((state, i) => (i === index ? !state : state))
      );
    }
  }

  if (fetchError || error) {
    return (
      <>
        <p>{`fetchError : ${fetchError}`}</p>
        <p>{`Error : ${error}`}</p>
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
                  {dailySchedules.map((schedule, index) => {
                    if (schedule.timeOfDay === medTime) {
                      return (
                        <li
                          key={`${medTime}${schedule.id}${index}`}
                          className="flex items-center justify-between mb-2">
                          <HoverClickPopover
                            trigger={<span>{schedule.name}</span>}
                            content={
                              <div className="flex space-x-4">
                                <MedicationIcon type={schedule.form} />
                                <h4 className="text-sm font-semibold">
                                  {`${schedule.name} ${schedule.dosage} ${schedule.form} ${dotStatusStates[index]}`}
                                </h4>
                              </div>
                            }></HoverClickPopover>
                          {selectedDateObj.valueOf() <=
                            currentDateObj.valueOf() && (
                            <MedStatusDot
                              medicationId={schedule.medicationId}
                              isClicked={dotStatusStates[index]}
                              onClick={() =>
                                handleClick(
                                  schedule.medicationId,
                                  index,
                                  schedule.scheduleId
                                )
                              }
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
