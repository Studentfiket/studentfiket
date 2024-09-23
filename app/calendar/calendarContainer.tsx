import dynamic from 'next/dynamic';
import { getShifts } from '@/lib/scheduling';
import { getUser, getUserOrganisations } from '@/lib/pocketbase';
import { redirect } from "next/navigation";
import PocketBase from 'pocketbase';
import eventsource from 'eventsource';
import { updateShiftCollection } from '@/lib/scheduling';
import { Shift } from '@/lib/types';

// Calendar dependencies will not work with SSR
// https://stackoverflow.com/questions/72140065/warning-prop-id-did-not-match-server-fc-dom-171-client-fc-dom-2-when-u
const CalendarView = dynamic(() => import('@/app/calendar/calendarView'), {
  ssr: false
});

export default async function CalendarContainer() {
  // Get the shifts
  let loadedShifts = await getShifts();

  // Get the user
  const user = await getUser();
  console.log("user", user);
  if (!user) {
    // Redirect to login if no user
    redirect("/login");
  }
  user.organisations = await getUserOrganisations();
  global.EventSource = eventsource;

  const pb = new PocketBase(process.env.POCKETBASE_URL);
  // Subscribe to changes in any record in the collection
  pb.collection('shifts').subscribe('*', function (e) {
    if (e.action === 'update') {
      if (!loadedShifts) {
        return;
      }
      const shiftRecord: Shift = {
        id: e.record.id,
        organisation: e.record.organisation,
        person1: e.record.person1,
        person2: e.record.person2,
        start: e.record.start,
        end: e.record.end,
        // Add any other properties that are part of the Shift type
      };
      loadedShifts = updateShiftCollection(loadedShifts, shiftRecord);
    }
  }, { /* other options like expand, custom headers, etc. */ });


  if (!loadedShifts) {
    return <div>Loading...</div>;
  }

  return (
    <CalendarView loadedShifts={loadedShifts} user={user} />
  );
}