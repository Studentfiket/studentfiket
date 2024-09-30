'use client'

import { signOut, userIsLoggedIn, userIsAdmin } from '@/lib/pocketbase';
import { LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from './ui/button';

function Header() {
  const [showLogOut, setShowLogOut] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);

  // TODO: This is a stupid solution, but it works for now.
  useEffect(() => {
    userIsLoggedIn().then((res) => {
      if (res) {
        setShowLogOut(true);
      }
    });

    if (typeof window !== 'undefined') {
      if (!window.location.href.includes('/admin')) {
        userIsAdmin().then((res) => {
          if (res) {
            setShowAdmin(true);
          }
        });
      }
    }

  }, []);


  return (
    <header className="top-0 left-0 right-0 text-white bg-primary px-4 h-[8vh] mb-2">
      <div className="flex w-full h-full justify-between items-center">
        <h1 className="text-2xl">STUDENTFIKET</h1>
        <div className='flex items-center gap-x-4'>
          {showAdmin && (
            <Button variant={'outline'}><a href="/admin">Admin</a></Button>
          )}
          {showLogOut && (
            <form action={signOut}>
              <LogOut onClick={() => signOut()} />
              {/* <button type="submit">Logga ut</button> */}
            </form>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;