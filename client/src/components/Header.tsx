import { Pill, UserRound, X } from 'lucide-react';
import { useState } from 'react';

export function Header() {
  const [isOpen, setIsOpen] = useState(true);

  function handleClick() {
    setIsOpen(!isOpen);
  }
  return (
    <>
      <header className="fixed flex items-center justify-between w-screen px-4 pt-4 md:px-10">
        <div className="logo">
          <h1 className="font-semibold text-ruby logo-text">
            Medi<span className="text-redblack">Trak</span>
          </h1>
        </div>
        <button
          className={`relative flex flex-col place-content-center gap-1 w-[3rem] h-[3rem] md:w-[4rem] md:h-[4rem] rounded-full bg-redblack transition-ease ${
            isOpen && 'opacity-0'
          }`}
          onClick={handleClick}>
          <div className={`menu-div`}></div>
          <div className={`menu-div`}></div>
          <div className={`menu-div`}></div>
        </button>
        <nav
          className={`absolute top-0 p-4 text-white transition-all delay-300 ease-in-out bg-redblack rounded-bl-md ${
            isOpen ? 'right-0' : 'right-[-500px]'
          }`}>
          <button className="w-full" onClick={handleClick}>
            <X size={48} className="ml-auto hover:text-ruby" />
          </button>
          <ul className="h2">
            <li>
              <span className="flex justify-end items-center gap-2 mb-4 transition-ease text-[2rem] hover:text-ruby">
                Medications
                <Pill size={32} />
              </span>
            </li>
            <li>
              <span className="flex justify-end items-center gap-2 transition-ease text-[2rem] hover:text-ruby">
                Profile <UserRound size={32} />
              </span>
            </li>
          </ul>
        </nav>
      </header>
    </>
  );
}
