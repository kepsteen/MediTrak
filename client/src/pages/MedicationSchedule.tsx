import { AddScheduleForm } from '@/components/AddScheduleForm';
import { Medication } from '../../data';

type Props = {
  medications: Medication[];
  error: unknown;
};

export function MedicationSchedule({ medications, error }: Props) {
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

      <h1>Im the schedule</h1>
    </>
  );
}
