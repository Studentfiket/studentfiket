import dynamic from 'next/dynamic';
import { getShifts } from '@/lib/scheduling';
import { getUser, getUserOrganisations } from '@/lib/pocketbase';
import { redirect } from "next/navigation";

// Calendar dependencies will not work with SSR
// https://stackoverflow.com/questions/72140065/warning-prop-id-did-not-match-server-fc-dom-171-client-fc-dom-2-when-u
const CalendarView = dynamic(() => import('@/app/calendar/calendarView'), {
  ssr: false
});

export default async function CalendarContainer() {
  // Get the shifts
  const loadedShifts = await getShifts();

  // Get the user
  const user = await getUser();
  console.log("user", user);
  if (!user) {
    // Redirect to login if no user
    redirect("/login");
  }
  user.organisations = await getUserOrganisations();

  if (!loadedShifts) {
    return <div>Loading...</div>;
  }

  return (
    <CalendarView loadedShifts={loadedShifts} user={user} />
  );
}