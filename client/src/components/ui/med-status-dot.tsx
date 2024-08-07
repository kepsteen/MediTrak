import { readToken } from '@/lib/data';
import { useState } from 'react';

type Props = {
  medicationId: number;
  isClicked: boolean;
};

export function MedStatusDot({ medicationId, isClicked }: Props) {
  const [error, setError] = useState<unknown>();
  const token = readToken();
  const [isClickedTemp, setIsClickedTemp] = useState(false);
  // Todo: move state of isClicked up to parent
  // Todo: Move handleClick up to parent and pass it down
  console.log(isClicked);
  async function handleClick() {
    try {
      const body = { operation: isClickedTemp ? 'increment' : 'decrement' };
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
    } catch (error) {
      setError(error);
    } finally {
      setIsClickedTemp((prevState) => !prevState);
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
      <div
        onClick={handleClick}
        className={`w-[24px] h-[24px] border shadow-md transition-ease border-gray-400 rounded-full ${
          isClickedTemp ? 'bg-emerald-600' : 'bg-white'
        }`}>
        {isClickedTemp}
      </div>
    </>
  );
}
