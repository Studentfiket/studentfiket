import Header from '@/components/header';
import { Suspense } from 'react';
import CalendarLoading from './calendarLoading';
import CalendarContainer from './calendarContainer';
import Footer from '@/components/footer';
import eventsource from 'eventsource';
import PocketBase from 'pocketbase';
import { getShiftRecordById, mapRecordsToShifts } from '@/lib/scheduling';

export default async function Home() {
  return (
    <div className='flex flex-col'>
      <Header />
      <Suspense fallback={<CalendarLoading />}>
        <CalendarContainer />
      </Suspense>
      <Footer />
    </div>
  );
}
