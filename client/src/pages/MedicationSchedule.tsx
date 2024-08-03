import { AddScheduleForm } from '@/components/AddScheduleForm';
import { Medication } from '../../data';
import { useEffect, useState } from 'react';

type Props = {
  medications: Medication[];
  error: unknown;
};

export function MedicationSchedule({ medications, error }: Props) {
  const [currentDay, setCurrentDay] = useState('');

  useEffect(() => {
    const days = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    const today = new Date().getDay();
    setCurrentDay(days[today]);
  }, []);

  if (error) {
    return (
      <>
        <p>{`Error : ${error}`}</p>
      </>
    );
  }
  return (
    <>
      <AddScheduleForm medications={medications} />

      <h1>{`Today is ${currentDay}`}</h1>
    </>
  );
}
