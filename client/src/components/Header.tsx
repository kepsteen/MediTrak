import { Pill, UserRound, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Outlet } from 'react-router';
import { Link } from 'react-router-dom';

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setHasScrolled(true);
      } else {
        setHasScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  function handleClick() {
    setIsOpen(!isOpen);
  }
  return (
    <>
      <header
        className={`fixed z-50 flex items-center justify-between w-screen px-4 py-4 md:px-10 transition-ease ${
          hasScrolled && 'bg-lightgray shadow-md'
        }`}>
        <Link to="/" className="logo">
          <h1 className="font-semibold text-redblack logo-text">
            Medi<span className="text-ruby">Trak</span>
          </h1>
        </Link>
        <button
          className={`relative flex flex-col place-content-center gap-1 w-[3rem] h-[3rem] md:w-[4rem] md:h-[4rem] rounded-full bg-redblack hover:bg-ruby transition-ease ${
            isOpen && 'opacity-0'
          }`}
          onClick={handleClick}>
          <div className={`menu-div`}></div>
          <div className={`menu-div`}></div>
          <div className={`menu-div`}></div>
        </button>
        <nav
          className={`absolute z-50 top-0 p-4 text-white transition-all delay-300 ease-in-out bg-redblack rounded-bl-md ${
            isOpen ? 'right-0' : 'right-[-1000px]'
          }`}>
          <button className="w-full" onClick={handleClick}>
            <X size={48} className="ml-auto hover:text-ruby" />
          </button>
          <ul className="h2">
            <li>
              <Link
                to="/medications"
                className="flex justify-end items-center gap-2 mb-4 transition-ease text-[2rem] hover:text-ruby"
                onClick={handleClick}>
                Medications
                <Pill size={32} />
              </Link>
            </li>
            <li>
              <span className="flex justify-end items-center gap-2 transition-ease text-[2rem] hover:text-ruby">
                Profile <UserRound size={32} />
              </span>
            </li>
          </ul>
        </nav>
      </header>
      <div className="bg-gradient"></div>
      <Outlet />
    </>
  );
}
