import dynamic from 'next/dynamic';

// Calendar dependencies will not work with SSR
// https://stackoverflow.com/questions/72140065/warning-prop-id-did-not-match-server-fc-dom-171-client-fc-dom-2-when-u
const CalendarView = dynamic(() => import('@/components/calendarView'), {
  ssr: false
});

export default function Home() {
  return (
    <div>
      <CalendarView />
    </div>
  );
}
