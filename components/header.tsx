'use client'

import { signOut, userIsLoggedIn, userIsAdmin } from '@/lib/pocketbase';
import { LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from './ui/button';

function Header() {
  const [showLogOutBtn, setShowLogOutBtn] = useState(false);
  const [showAdminBtn, setShowAdminBtn] = useState(false);
  const [showCalendarBtn, setShowCalendarBtn] = useState(false);

  useEffect(() => {
    userIsLoggedIn().then((res) => {
      if (res) {
        setShowLogOutBtn(true);
      }
    });

    // Show the admin button if the user is an admin and not on the admin page
    if (typeof window !== 'undefined') {
      if (!window.location.href.includes('/admin')) {
        userIsAdmin().then((res) => {
          if (res) {
            setShowAdminBtn(true);
          }
        });
      }
      else if (window.location.href.includes('/admin')) {
        setShowCalendarBtn(true);
      }
    }

  }, []);


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
              <LogOut onClick={() => signOut()} />
            </form>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;