import dynamic from 'next/dynamic';
import { getShiftRecordById, getShifts, mapRecordsToShifts } from '@/lib/scheduling';
import { getUser, getUserOrganisations } from '@/lib/pocketbase';
import { redirect } from "next/navigation";
import PocketBase from 'pocketbase';
import eventsource from 'eventsource';
// import { updateShiftCollection } from '@/lib/scheduling';
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
  if (!user) {
    // Redirect to login if no user
    redirect("/login");
  }
  user.organisations = await getUserOrganisations();

  // global.EventSource = eventsource;

  // const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);
  // pb.collection('shifts').subscribe('workers', async function (e) {
  //   if (e.action === 'update') {
  //     console.log("Record updated", e.record);
  //     if (!loadedShifts) {
  //       return;
  //     }
  //     const updatedRecord = await getShiftRecordById(e.record.id);
  //     if (!updatedRecord) {
  //       return;
  //     }
  //     // For some reason the subscription is triggered like 4 times, so we need to 
  //     // disable auto cancellation to fetch the shift from the server
  //     pb.autoCancellation(false);
  //     const updatedShift = mapRecordsToShifts([updatedRecord])[0];
  //     console.log("Shift mapped", updatedShift);
  //     loadedShifts = updateShiftCollection(loadedShifts, updatedShift);
  //     pb.autoCancellation(true);
  //   }
  // }, { /* other options like expand, custom headers, etc. */ });


  if (!loadedShifts) {
    return <div>Loading...</div>;
  }

  return (
    <CalendarView loadedShifts={loadedShifts} user={user} />
  );
}