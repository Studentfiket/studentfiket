'use client'

import { signOut, userIsLoggedIn, userIsAdmin } from '@/lib/pocketbase';
import { LogOut, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

function Header() {
  const [showControlBtns, setShowControlBtns] = useState(false);
  const [showAdminBtn, setShowAdminBtn] = useState(false);
  const [showCalendarBtn, setShowCalendarBtn] = useState(false);

  const router = useRouter();
  const redirect = (url: string) => {
    router.push(url);
  }


  // Make the useEffect depend on the URL, so that the buttons can change based on what page the user is on
  const pathname = usePathname()

  useEffect(() => {
    const checkUserStatus = async () => {
      const isLoggedIn = await userIsLoggedIn();
      isLoggedIn ? setShowControlBtns(true) : setShowControlBtns(false);

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
    <header className="top-0 left-0 right-0 text-white bg-primary px-4 h-[8vh]">
      <div className="flex w-full h-full justify-between items-center">
        <Link href={"/"}>
          <h1 className="text-2xl">STUDENTFIKET <span className='text-red-500'>[BETA]</span></h1>
        </Link>
        <div className='flex items-center gap-x-2'>
          {showCalendarBtn && (
            <Button variant={'outline'} onClick={() => redirect("/calendar")}>Kalender</Button>
          )}
          {showAdminBtn && (
            <Button variant={'secondary'} onClick={() => redirect("/admin")}>Admin</Button>
          )}
          {showControlBtns && (
            <div className='flex gap-x-2'>
              <Button className='px-[0.35rem]' variant={'outline'} onClick={() => redirect("/profile")}><User /></Button>
              <form action={signOut}>
                <Button className='px-[0.35rem]' variant={'outline'} onClick={() => signOut()}><LogOut /></Button>
              </form>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;