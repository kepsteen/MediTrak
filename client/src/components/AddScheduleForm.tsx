import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from './ui/checkbox';
import React, { useEffect, useState } from 'react';
import { Medication } from 'data';
import { Progress } from '@/components/ui/progress';

const days = [
  {
    id: 'Monday',
    label: 'Monday',
  },
  {
    id: 'Tuesday',
    label: 'Tuesday',
  },
  {
    id: 'Wednesday',
    label: 'Wednesday',
  },
  {
    id: 'Thursday',
    label: 'Thursday',
  },
  {
    id: 'Friday',
    label: 'Friday',
  },
  {
    id: 'Saturday',
    label: 'Saturday',
  },
  {
    id: 'Sunday',
    label: 'Sunday',
  },
];

type Schedule = {
  medicationId: number;
  userId: number;
  days: string[];
  frequency: number;
};

type Props = {
  medications: Medication[];
};

export function AddScheduleForm({ medications }: Props) {
  const [unScheduledMeds, setUnscheduleMeds] = useState<Medication[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [checkedState, setCheckedState] = useState<boolean[]>(
    new Array(days.length).fill(false)
  );
  const [timesPerDay, setTimesPerDay] = useState<string>('');
  const [error, setError] = useState<unknown>();
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setUnscheduleMeds(
      medications.filter((medication) => !medication.scheduled)
    );
  }, [medications]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isLoading) {
      timer = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress >= 100) {
            clearInterval(timer);
            return 100;
          }
          return prevProgress + 25;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isLoading]);

  function handleCheckedChange(position: number) {
    const updatedCheckedState = checkedState.map((item, index) =>
      index === position ? !item : item
    );
    setCheckedState(updatedCheckedState);
  }

  async function handleSubmit(e: React.FormEvent) {
    setIsLoading(true);
    setProgress(0);
    e.preventDefault();
    try {
      if (Number(timesPerDay) !== 0) {
        const newSchedule = {
          medicationId: unScheduledMeds[selectedIndex].id,
          timesPerDay: timesPerDay,
          daysOfWeek: checkedState.map(
            (item, index) => item && days[index].label
          ),
          userId: 1,
        };
        console.log('new schedule', newSchedule);

        const response = await fetch('/api/medications/schedule', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newSchedule),
        });
        if (!response.ok)
          throw new Error(`Response status: ${response.status}`);

        const schedule = (await response.json()) as Schedule;
        console.log('schedule', schedule);
      }

      const updatedMedication = {
        medicationId: unScheduledMeds[selectedIndex].id,
        scheduled: true,
      };

      const response2 = await fetch('/api/medications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedMedication),
      });
      if (!response2.ok)
        throw new Error(`Response2 status: ${response2.status}`);
      const medication = (await response2.json()) as Medication;
      console.log('medication', medication);
    } catch (error) {
      setError(error);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
        setCheckedState(new Array(days.length).fill(false));
        setTimesPerDay('');
        setSelectedIndex((prev) => prev + 1);
      }, 4000);
    }
  }

  if (error) {
    return (
      <>
        <p>{`Error: ${error}`}</p>
      </>
    );
  }
  return (
    <>
      {selectedIndex < unScheduledMeds.length && (
        <section className="container pt-4">
          <Card className={`relative pt-4 ${isLoading && 'opacity-0'}`}>
            <CardHeader className="text-2xl text-redblack">
              <CardTitle>{unScheduledMeds[selectedIndex].name}</CardTitle>
              <CardDescription>{`Add ${unScheduledMeds[selectedIndex].name} to your schedule`}</CardDescription>
            </CardHeader>
            <CardContent>
              <form action="" onSubmit={(e) => handleSubmit(e)}>
                <ul>
                  {days.map((day, index) => (
                    <li key={day.id} className="flex items-center gap-2 mb-3">
                      <Checkbox
                        id={day.id}
                        checked={checkedState[index]}
                        onCheckedChange={() => handleCheckedChange(index)}
                      />
                      <label
                        htmlFor={day.id}
                        className="text-lg font-medium leading-none text-redblack peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        {day.label}
                      </label>
                    </li>
                  ))}
                </ul>
                <div className="flex flex-col gap-4 pt-4">
                  <label htmlFor="" className="text-lg text-redblack">
                    How many doses do you take per day?
                  </label>
                  <Select
                    value={timesPerDay}
                    onValueChange={(value) => setTimesPerDay(value)}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select a frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">PRN</SelectItem>
                      <SelectItem value="1">One</SelectItem>
                      <SelectItem value="2">Two</SelectItem>
                      <SelectItem value="3">Three</SelectItem>
                      <SelectItem value="4">Four</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  type="submit"
                  size="md"
                  className="w-full col-span-2 mt-4">
                  Submit
                </Button>
              </form>
            </CardContent>
          </Card>
          {isLoading && (
            <div className="absolute top-[180px] left-[40px] right-[40px] bottom-[50%] bg-white rounded-md ">
              <div className="flex flex-col justify-center h-full gap-4 mx-10">
                <p className="text-2xl text-center text-redblack">{`Adding ${unScheduledMeds[selectedIndex].name} to your schedule.`}</p>
                <Progress value={progress} />
              </div>
            </div>
          )}
        </section>
      )}
    </>
  );
}
