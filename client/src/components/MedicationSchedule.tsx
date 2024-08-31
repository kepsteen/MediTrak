import { MoveLeft, MoveRight } from 'lucide-react';
import { MedicationIcon } from './MedicationList';
import { Button } from './ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from './ui/card';
import { HoverClickPopover } from './ui/hover-click-popover';
import { MedStatusDot } from './ui/med-status-dot';
import { useEffect, useState } from 'react';
import {
  Log,
  notifyMedicationDepletion,
  ScheduleEntry,
  updateLogStatus,
  updateMedicationCount,
} from '@/lib/data';
import { Separator } from './ui/separator';
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

type ScheduleLog = ScheduleEntry & Log;

const medTimes = ['Morning', 'Noon', 'Evening', 'Bed time'];

type Props = {
  dailySchedules: ScheduleLog[];
  selectedDateObj: Date;
  onDateChange: (value: Date) => void;
};

export function MedicationSchedule({
  dailySchedules,
  selectedDateObj,
  onDateChange,
}: Props) {
  // Tracks the clicked state of the dots
  const [dotStatusStates, setDotStatusStates] = useState<boolean[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    setDotStatusStates(dailySchedules.map((item) => item.taken));
  }, [dailySchedules]);

  const selectedDateString = `${days[selectedDateObj.getDay()]} ${
    months[selectedDateObj.getMonth()]
  }, ${dates[selectedDateObj.getDate()]}`;

  const currentDateObj = new Date();

  const differenceInDays =
    (currentDateObj.getTime() - selectedDateObj.getTime()) /
    (1000 * 60 * 60 * 24);

  /**
   * Updates the selectedDateObj state as user cycles through the days
   * @param direction - string indicating which direction user clicked
   */
  function handleDateChange(direction: string) {
    if (direction === 'previous') {
      onDateChange(
        new Date(selectedDateObj.setDate(selectedDateObj.getDate() - 1))
      );
    } else if (direction === 'next') {
      onDateChange(
        new Date(selectedDateObj.setDate(selectedDateObj.getDate() + 1))
      );
    }
  }

  /**
   * Handles a user click on the status dots which logs a medication and updates the UI to reflect the change
   * @param medicationId - medicationId that the dot is associated with
   * @param indexToUpdate - Index of the dotStatusStates to update to clicked or not clicked
   * @param scheduleId - Schedule Id of the log in the database
   * @returns
   */
  async function handleClick(
    medicationId: number,
    indexToUpdate: number,
    scheduleId: number
  ) {
    try {
      const operation = dotStatusStates[indexToUpdate]
        ? 'increment'
        : 'decrement';
      await updateLogStatus(scheduleId, operation);
      const updatedMedication = await updateMedicationCount(
        medicationId,
        operation
      );
      setDotStatusStates((prevStates) =>
        prevStates.map((state, index) =>
          index === indexToUpdate ? !state : state
        )
      );
      if (updatedMedication.remaining < 1 && operation === 'decrement') {
        await notifyMedicationDepletion(updatedMedication.medicationId);
      }
    } catch (error) {
      toast({ title: String(error), variant: 'destructive' });
    }
  }

  return (
    <>
      <Card className="container max-w-[500px] pt-4">
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
          <CardDescription className="text-center">
            Click on the dots to log your medications.
          </CardDescription>
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
                                  {`${schedule.name} ${schedule.dosage} ${schedule.form}`}
                                </h4>
                              </div>
                            }></HoverClickPopover>
                          {selectedDateObj.valueOf() <=
                            currentDateObj.valueOf() &&
                            differenceInDays < 7 && (
                              <>
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
                                <span className="sr-only">{`Log ${schedule.name}`}</span>
                              </>
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
