import { Pill, UserRound, X } from 'lucide-react';
import { useState } from 'react';

export function Header() {
  const [isOpen, setIsOpen] = useState(true);

  function handleClick() {
    setIsOpen(!isOpen);
  }
  return (
    <>
      <header className="flex justify-between w-screen px-[5%] mt-4">
        <div className="logo">
          <h1 className="h1 text-ruby">
            Medi<span className="text-redblack">Trak</span>
          </h1>
        </div>
        <button
          className="relative flex flex-col place-content-center gap-1 w-[3rem] h-[3rem] rounded-full bg-redblack"
          onClick={handleClick}>
          <div
            className={`h-[0.25rem] bg-white rounded-md w-7 mx-auto ${
              isOpen && ' rotate-45 absolute top-5 left-3'
            }`}></div>
          <div
            className={`h-[0.25rem] bg-white rounded-md w-7 mx-auto transition-all delay-75 ease-in-out ${
              isOpen && 'bg-opacity-0'
            }`}></div>
          <div
            className={`h-[0.25rem] bg-white rounded-md w-7 mx-auto ${
              isOpen && ' -rotate-45 absolute top-5 left-3'
            }`}></div>
        </button>
        <nav
          className={`absolute top-0 p-4 text-white transition-all delay-300 ease-in-out bg-redblack rounded-bl-md ${
            isOpen ? 'right-0' : 'right-[-500px]'
          }`}>
          <button className="w-full" onClick={handleClick}>
            <X size={48} className="ml-auto" />
          </button>
          <ul className="h2">
            <li>
              <div className="flex gap-2 mb-4 transition-all ease-in-out hover:text-ruby">
                Medications
                <Pill />
              </div>
            </li>
            <li>
              <div className="flex gap-2 transition-all ease-in-out hover:text-ruby">
                Profile <UserRound />
              </div>
            </li>
          </ul>
        </nav>
      </header>
    </>
  );
}
