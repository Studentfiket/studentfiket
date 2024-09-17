

import Header from '@/components/header';
import { signOut } from '@/lib/pocketbase';
import { Suspense } from 'react';
import CalendarLoading from './calendarLoading';
import CalendarContainer from './calendarContainer';

export default async function Home() {
  return (
    <div>
      <Header />
      <Suspense fallback={<CalendarLoading />}>
        <CalendarContainer />
      </Suspense>
      <form action={signOut}>
        <button type="submit">logout</button>
      </form>
    </div>
  );
}
