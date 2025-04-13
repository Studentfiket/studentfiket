'use client'

import { userIsLoggedIn, userIsAdmin } from '@/lib/pocketbase';
import { User, Calendar, ShieldCheck, Menu, Home } from 'lucide-react';
import { IoIosBug } from "react-icons/io";
import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet"
import MobileButtons from '@/components/ui/custom/mobileButton';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

function Header() {
  const [showControlBtns, setShowControlBtns] = useState(false);
  const [showAdminBtn, setShowAdminBtn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pageIndex, setPageIndex] = useState(0);                  // 0 = calendar, 1 = admin, 2 = profile

  const router = useRouter();
  const redirect = (url: string) => {
    router.push(url);
  }

  // Make the useEffect depend on the URL, so that the buttons can change based on what page the user is on
  const pathname = usePathname()

  useEffect(() => {
    const checkUserStatus = async () => {
      // To mark the active page
      const pageMap: { [key: string]: number } = {
        '/': 0,
        '/home': 0,
        '/calendar': 1,
        '/login': 1,
        '/register': 1,
        '/admin': 2,
        '/profile': 3,
      };

      setPageIndex(pageMap[pathname] ?? -1);

      const isLoggedIn = await userIsLoggedIn();
      setLoading(false);
      isLoggedIn ? setShowControlBtns(true) : setShowControlBtns(false);

      // If we're not in the browser, we can't check the URL (makes typescript happy)
      if (typeof window === 'undefined')
        return;

      const isAdmin = await userIsAdmin();
      isAdmin && setShowAdminBtn(true);

    };

    checkUserStatus();
  }, [pathname]);

  return (
    <header className={`top-0 left-0 right-0 text-white px-4 h-[8vh] z-20 ${pageIndex == 0 ? 'bg-transparent' : 'bg-primary'}`}>
      <div className="flex w-full h-full justify-between items-center">
        {pageIndex != 0 ? (
          <Link className='flex' href={"/"}>
            <h1 className="text-2xl">STUDENTFIKET</h1>
            <h1 className='text-red-700 text-sm ml-1'>[BETA]</h1>
          </Link>
        ) : (
          <div />
        )}
        <div className='hidden md:flex items-center gap-x-2'>
          {!loading && (
            <div className='flex items-center gap-x-2'>
              <Button variant={pageIndex == 0 ? 'secondary' : 'outline'} onClick={() => redirect("/home")}>Hem</Button>
              <Button variant={pageIndex == 1 ? 'secondary' : 'outline'} onClick={() => redirect("/calendar")}>Kalender</Button>
              {showControlBtns && (
                <div className='flex gap-x-2'>
                  {showAdminBtn && (
                    <Button variant={pageIndex == 2 ? 'secondary' : 'outline'} onClick={() => redirect("/admin")}>Admin</Button>
                  )}
                  <Button className='px-[0.35rem]' variant={pageIndex == 3 ? 'secondary' : 'outline'} onClick={() => redirect("/profile")}><User /></Button>
                </div>
              )}
            </div>
          )}
        </div>
        {/* Mobile burger menu */}
        <div className='flex items-center md:hidden'>
          <Sheet>
            <SheetTrigger><Menu /></SheetTrigger>
            <SheetContent className='bg-slate-50'>
              <SheetHeader>
                <SheetTitle className='text-left text-xl'>
                  {/* Random welcome message */}
                  {["Hej där!", "Hallå där!", "Välkommen hit!", "Hej igen!", "Kul att se dig!", "Trevligt att träffas!", "Välkommen tillbaka!", "Hur mår du idag?"][Math.floor(Math.random() * 8)]}
                </SheetTitle>
                <SheetDescription className='flex flex-col'>
                  <span className='flex flex-col gap-y-2'>
                    <MobileButtons pageIndex={pageIndex} onClick={() => redirect("/home")} index={0}>
                      <Home /> Hem
                    </MobileButtons>
                    <MobileButtons pageIndex={pageIndex} onClick={() => redirect("/calendar")} index={1}>
                      <Calendar /> Kalender
                    </MobileButtons>
                    {showControlBtns && (
                      <span className='flex flex-col gap-y-2'>
                        {showAdminBtn && (
                          <MobileButtons pageIndex={pageIndex} onClick={() => redirect("/admin")} index={2}>
                            <ShieldCheck />Admin
                          </MobileButtons>
                        )}
                        <MobileButtons pageIndex={pageIndex} onClick={() => redirect("/profile")} index={3}>
                          <User /> Användare
                        </MobileButtons>
                      </span>
                    )}
                  </span>
                  <div className='absolute bottom-0 left-0 p-6 w-full'>
                    <MobileButtons pageIndex={pageIndex} onClick={() => redirect("/feedback")} index={4}>
                      <IoIosBug className='mr-1' /> Skicka feedback
                    </MobileButtons>
                  </div>
                </SheetDescription>
              </SheetHeader>
            </SheetContent>
          </Sheet>
        </div>

      </div >
    </header >
  );
}

export default Header;
