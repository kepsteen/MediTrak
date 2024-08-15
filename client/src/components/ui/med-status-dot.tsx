type Props = {
  medicationId: number;
  isClicked: boolean;
  onClick: () => void;
};

export function MedStatusDot({ isClicked, onClick }: Props) {
  return (
    <>
      <button
        onClick={onClick}
        className={`w-[24px] h-[24px] border shadow-md transition-ease border-gray-400 rounded-full ${
          isClicked ? 'bg-emerald-600' : 'bg-white'
        }`}>
        {isClicked}
      </button>
    </>
  );
}
