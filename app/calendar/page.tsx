import Header from '@/components/header';
import { Suspense } from 'react';
import CalendarLoading from './calendarLoading';
import CalendarContainer from './calendarContainer';
import Footer from '@/components/footer';

// Next.js will invalidate the cache when a
// request comes in, at most once every second.
export const revalidate = 1

// We'll prerender only the params from `generateStaticParams` at build time.
// If a request comes in for a path that hasn't been generated,
// Next.js will server-render the page on-demand.
export const dynamicParams = true // or false, to 404 on unknown paths

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
