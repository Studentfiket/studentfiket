import dynamic from 'next/dynamic';
import { getShiftRecordById, getShifts, mapRecordsToShifts } from '@/lib/scheduling';
import { getUser, getUserOrganisations } from '@/lib/pocketbase';
import { redirect } from "next/navigation";
import PocketBase from 'pocketbase';
import eventsource from 'eventsource';
// import { updateShiftCollection } from '@/lib/scheduling';
import { Shift } from '@/lib/types';

const updateShiftCollection = (loadedShifts: Shift[], updatedShift: Shift) => {
  console.log("Updating shift collection", updatedShift);

  const updatedShiftIndex = loadedShifts.findIndex(shift => shift.id === updatedShift.id);
  if (updatedShiftIndex > -1) {
    console.log("Shift found in collection", loadedShifts[updatedShiftIndex]);
    loadedShifts[updatedShiftIndex] = updatedShift;
  }
  return loadedShifts;
}

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
  if (!user) {
    // Redirect to login if no user
    redirect("/login");
  }
  user.organisations = await getUserOrganisations();
  global.EventSource = eventsource;

  const pb = new PocketBase(process.env.POCKETBASE_URL);
  // Subscribe to changes in any record in the collection
  pb.collection('shifts').subscribe('*', async function (e) {
    if (e.action === 'update') {
      if (!loadedShifts) {
        return;
      }
      const updatedRecord = await getShiftRecordById(e.record.id);
      if (!updatedRecord) {
        return;
      }
      const updatedShift = mapRecordsToShifts([updatedRecord])[0];
      console.log("Shift mapped", updatedShift);
      loadedShifts = updateShiftCollection(loadedShifts, updatedShift);
      console.log("Shift updated", loadedShifts.find(shift => shift.id === e.record.id));
    }
  }, { /* other options like expand, custom headers, etc. */ });


  if (!loadedShifts) {
    return <div>Loading...</div>;
  }

  return (
    <CalendarView loadedShifts={loadedShifts} user={user} />
  );
}