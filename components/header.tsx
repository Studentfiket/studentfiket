'use client'

import { signOut, userIsLoggedIn, userIsAdmin } from '@/lib/pocketbase';
import { LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { usePathname } from 'next/navigation';

function Header() {
  const [showLogOutBtn, setShowLogOutBtn] = useState(false);
  const [showAdminBtn, setShowAdminBtn] = useState(false);
  const [showCalendarBtn, setShowCalendarBtn] = useState(false);

  // Make the useEffect depend on the URL, so that the buttons can change based on what page the user is on
  const pathname = usePathname()

  useEffect(() => {
    const checkUserStatus = async () => {
      const isLoggedIn = await userIsLoggedIn();
      isLoggedIn ? setShowLogOutBtn(true) : setShowLogOutBtn(false);

      // If we're not in the browser, we can't check the URL (makes typescript happy)
      if (typeof window === 'undefined')
        return;

      const isAdmin = await userIsAdmin();
      switch (pathname) {
        case '/admin':
          setShowAdminBtn(false);
          setShowCalendarBtn(true);
          break;
        case '/calendar':
          isAdmin && setShowAdminBtn(true);
          setShowCalendarBtn(false);
          break;
        default:
          setShowAdminBtn(false);
          setShowCalendarBtn(false);
          break;
      }
    };

    checkUserStatus();
  }, [pathname]);


  return (
    <header className="top-0 left-0 right-0 text-white bg-primary px-4 h-[8vh] mb-2">
      <div className="flex w-full h-full justify-between items-center">
        <h1 className="text-2xl">STUDENTFIKET <span className='text-red-500'>[BETA]</span></h1>
        <div className='flex items-center gap-x-4'>
          {showCalendarBtn && (
            <Button variant={'outline'}><a href="/calendar">Kalender</a></Button>
          )}
          {showAdminBtn && (
            <Button variant={'outline'}><a href="/admin">Admin</a></Button>
          )}
          {showLogOutBtn && (
            <form action={signOut}>
              <LogOut className='hover:cursor-pointer' onClick={() => signOut()} />
            </form>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;