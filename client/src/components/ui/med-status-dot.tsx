import { readToken } from '@/lib/data';
import { useState } from 'react';

type Props = {
  medicationId: number;
};

export function MedStatusDot({ medicationId }: Props) {
  const [isClicked, setIsClicked] = useState(false);
  const [error, setError] = useState<unknown>();
  const token = readToken();
  // Todo: move state of isClicked up to parent

  async function handleClick() {
    try {
      const body = { operation: isClicked ? 'increment' : 'decrement' };
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
      setIsClicked((prevState) => !prevState);
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
          isClicked ? 'bg-emerald-600' : 'bg-white'
        }`}>
        {isClicked}
      </div>
    </>
  );
}
