import dynamic from 'next/dynamic';
import { getShifts } from '@/lib/scheduling';

// Calendar dependencies will not work with SSR
// https://stackoverflow.com/questions/72140065/warning-prop-id-did-not-match-server-fc-dom-171-client-fc-dom-2-when-u
const CalendarView = dynamic(() => import('@/app/calendar/calendarView'), {
  ssr: false
});

export default async function CalendarContainer() {
  // Get the shifts
  const loadedShifts = await getShifts();

  if (!loadedShifts) {
    return <div>Loading...</div>;
  }

  return (
    <CalendarView loadedShifts={loadedShifts} />
  );
}