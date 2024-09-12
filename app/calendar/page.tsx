import dynamic from 'next/dynamic';
import { cookies } from 'next/headers';
import { createShift, signOut } from '@/lib/pocketbase';

// Calendar dependencies will not work with SSR
// https://stackoverflow.com/questions/72140065/warning-prop-id-did-not-match-server-fc-dom-171-client-fc-dom-2-when-u
const CalendarView = dynamic(() => import('@/components/calendarView'), {
  ssr: false
});

export default function Home() {
  const cookie = cookies().get('pb_auth');
  // This never happens because of the middleware,
  // but we must make typescript happy
  if (!cookie) throw new Error('Not logged in');
  const { model } = JSON.parse(cookie.value);

  return (
    <div>
      <CalendarView />
      <pre>{JSON.stringify(model, null, 2)}</pre>
      <form action={signOut}>
        <button type="submit">logout</button>
      </form>
    </div>
  );
}
