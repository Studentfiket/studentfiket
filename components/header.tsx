'use client'

import { userIsLoggedIn, userIsAdmin } from '@/lib/pocketbase';
import { User, Calendar, ShieldCheck, Menu } from 'lucide-react';
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
      const isLoggedIn = await userIsLoggedIn();
      setLoading(false);
      isLoggedIn ? setShowControlBtns(true) : setShowControlBtns(false);

      // If we're not in the browser, we can't check the URL (makes typescript happy)
      if (typeof window === 'undefined')
        return;

      const isAdmin = await userIsAdmin();
      isAdmin && setShowAdminBtn(true);

      // To mark the active page
      const pageMap: { [key: string]: number } = {
        '/calendar': 0,
        '/admin': 1,
        '/profile': 2,
      };

      setPageIndex(pageMap[pathname] ?? 0);
    };

    checkUserStatus();
  }, [pathname]);

  return (
    <header className="top-0 left-0 right-0 text-white bg-primary px-4 h-[8vh]">
      <div className="flex w-full h-full justify-between items-center">
        <Link className='flex' href={"/"}>
          <h1 className="text-2xl">STUDENTFIKET</h1>
          <h1 className='text-red-500 text-sm ml-1'>[BETA]</h1>
        </Link>
        <div className='hidden md:flex items-center gap-x-2'>
          {!loading && (
            <div className='flex items-center gap-x-2'>
              <Button variant={pageIndex == 0 ? 'secondary' : 'outline'} onClick={() => redirect("/calendar")}>Kalender</Button>
              {showControlBtns && (
                <div className='flex gap-x-2'>
                  {showAdminBtn && (
                    <Button variant={pageIndex == 1 ? 'secondary' : 'outline'} onClick={() => redirect("/admin")}>Admin</Button>
                  )}
                  <Button className='px-[0.35rem]' variant={pageIndex == 2 ? 'secondary' : 'outline'} onClick={() => redirect("/profile")}><User /></Button>
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
                <SheetDescription className='flex flex-col gap-y-2'>
                  <MobileButtons pageIndex={pageIndex} onClick={() => redirect("/calendar")} index={0}>
                    <Calendar /> Kalender
                  </MobileButtons>
                  {showControlBtns && (
                    <div className='flex flex-col gap-y-2'>
                      <MobileButtons pageIndex={pageIndex} onClick={() => redirect("/admin")} index={1}>
                        <ShieldCheck />Admin
                      </MobileButtons>
                      <MobileButtons pageIndex={pageIndex} onClick={() => redirect("/profile")} index={2}>
                        <User /> Användare
                      </MobileButtons>
                    </div>
                  )}
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
