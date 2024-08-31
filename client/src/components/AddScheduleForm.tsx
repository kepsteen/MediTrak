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
import { createSchedules, Medication, ScheduleLog } from '@/lib/data';
import { Progress } from '@/components/ui/progress';
import { useUser } from './useUser';
import { useToast } from './ui/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

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

type Props = {
  medication: Medication;
  onScheduleComplete: (medication: Medication) => void;
  currentDay: string;
  dailySchedules: ScheduleLog[];
  onDayChange: (value: ScheduleLog[]) => void;
  selectedPatientId: number;
};

export function AddScheduleForm({
  medication,
  onScheduleComplete,
  currentDay,
  dailySchedules,
  onDayChange,
  selectedPatientId,
}: Props) {
  // An array of booleans which is updated to reflect the checked status of the checkboxes
  const [checkedState, setCheckedState] = useState<boolean[]>(
    new Array(days.length).fill(false)
  );
  const [isChecked, setIsChecked] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const [timesPerDay, setTimesPerDay] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { user } = useUser();
  const { toast } = useToast();

  if (user?.role === 'Patient') selectedPatientId = user?.userId;

  // A 4-second loading screen is implemented to prevent a flush
  // resync error in the radix ui checkboxes.
  // where rapid clicks could cause database consistency errors.
  // The progress bar increments by 25% each second to provide visual feedback.
  // This artificial delay ensures proper synchronization between
  // frontend state and backend operations.
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
    setIsChecked(updatedCheckedState.includes(true));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isChecked || !isSelected) return;
    setIsLoading(true);
    setProgress(0);
    try {
      if (+timesPerDay > 0) {
        const daysAdded: string[] = [];
        // Adds each day checked by the user to the daysAdded array
        for (let i = 0; i < checkedState.length; i++) {
          if (checkedState[i]) daysAdded.push(days[i].label);
        }
        const newSchedule = {
          medicationId: medication.medicationId,
          timesPerDay: parseInt(timesPerDay),
          daysOfWeek: daysAdded,
          userId: selectedPatientId,
          name: medication.name,
          dosage: medication.dosage,
          form: medication.form,
          currentDay,
        };

        const newSchedules = await createSchedules(newSchedule);
        setTimeout(() => {
          onDayChange(dailySchedules.concat(newSchedules));
        }, 4000);
      }
    } catch (error) {
      toast({ title: String(error), variant: 'destructive' });
    } finally {
      if (isChecked && isSelected) {
        setTimeout(() => {
          setIsLoading(false);
          setCheckedState(new Array(days.length).fill(false));
          setTimesPerDay('');
          onScheduleComplete(medication);
        }, 4000);
      }
    }
  }

  return (
    <>
      <div className="max-w-[600px] max-h-[620px] mx-auto">
        <Card className="relative w-full h-full pt-4">
          <CardHeader className={`text-2xl ${isLoading && 'hidden'}`}>
            <CardTitle className="text-center">{medication.name}</CardTitle>
            <CardDescription className="text-center">{`Add ${medication.name} to your schedule`}</CardDescription>
          </CardHeader>
          <CardContent className="relative">
            <Alert
              variant="destructive"
              className={`mb-2 ${isChecked && isSelected && 'hidden'}`}>
              <AlertCircle className="w-4 h-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                You must select a day of the week and a frequency.
              </AlertDescription>
            </Alert>
            <form onSubmit={(e) => handleSubmit(e)}>
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
                      className="text-lg font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      {day.label}
                    </label>
                  </li>
                ))}
              </ul>
              <div className="flex flex-col gap-4 pt-4">
                <label htmlFor="doses" className="text-lg">
                  How many doses do you take per day?
                </label>
                <Select
                  value={timesPerDay}
                  onValueChange={(value) => {
                    setTimesPerDay(value);
                    setIsSelected(true);
                  }}
                  required>
                  <SelectTrigger className="w-[180px]" id="doses">
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
                className="w-full col-span-2 mt-4 bg-darkred">
                Submit
              </Button>
            </form>
            {isLoading && (
              <div className="absolute inset-0 bg-white rounded-md ">
                <div className="flex flex-col justify-center h-full gap-4 mx-10">
                  <p className="text-2xl text-center text-redblack">{`Adding ${medication.name} to your schedule.`}</p>
                  <Progress value={progress} />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
