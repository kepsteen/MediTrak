import { LogIn, LogOut, Pill, UserRound, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { useUser } from './useUser';

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const { user, handleSignOut } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
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

  /**
   * Opens the hamburger menu
   */
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
          className={`relative flex flex-col place-content-center gap-[3px] w-[2.5rem] h-[2.5rem] md:w-[3rem] md:h-[3rem] rounded-full bg-darkred hover:bg-ruby transition-ease ${
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
            {user && (
              <li className="w-full">
                <Link
                  to="/medications"
                  className="nav-link"
                  onClick={handleClick}>
                  Medications
                  <Pill size={32} />
                </Link>
              </li>
            )}
            {user && (
              <li className="w-full">
                <Link to="/profile" onClick={handleClick} className="nav-link">
                  {user.username} <UserRound size={32} />
                </Link>
              </li>
            )}
            <li className="w-full">
              {!user ? (
                <Link to="/sign-in" onClick={handleClick} className="nav-link">
                  Register / Sign in <LogIn size={32} />
                </Link>
              ) : (
                <button
                  onClick={() => {
                    handleClick();
                    handleSignOut();
                    navigate('/');
                  }}
                  className="nav-link">
                  Sign out <LogOut size={32} />
                </button>
              )}
            </li>
          </ul>
        </nav>
      </header>
      <div className="bg-gradient"></div>
      <Outlet />
    </>
  );
}
