'use client'

import React, { useEffect, useState } from 'react';
import PocketBase from 'pocketbase';
import { DateRange } from 'react-day-picker';
import { addDays } from 'date-fns';
import { Button } from '@/components/ui/button';

import { DatePickerWithRange } from '@/components/datePickerWithRange';
import { generateNewPeriod } from '@/lib/scheduling';
import { Progress } from '@/components/ui/progress';

export default function GeneratePeriod() {
  const handleSubmit = () => {
    if (!date?.from || !date?.to) {
      console.error("No date selected");
      return;
    }

    setIsLoading(true); // Start loading
    generateNewPeriod(date?.from, date?.to).then(() => {
      setIsLoading(false); // Start loading
    });
  };

  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [date, setDate] = React.useState<DateRange | undefined>(() => {
    const now = new Date();
    const startOfNextWeek = new Date(now.setDate(now.getDate() + (7 - now.getDay())));
    startOfNextWeek.setHours(0, 0, 0, 0);
    return {
      from: startOfNextWeek,
      to: addDays(startOfNextWeek, 6)
    };
  });

  useEffect(() => {
    const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);

    // Find out how many weekdays are in the period to be generated
    let weekdaysCount = 0;
    if (date?.from && date?.to) {
      for (let d = new Date(date.from); d <= date.to; d.setDate(d.getDate() + 1)) {
        const day = d.getDay();
        if (day !== 0 && day !== 6) { // Exclude Sundays (0) and Saturdays (6)
          weekdaysCount++;
        }
      }
      console.log(`Weekdays in period: ${weekdaysCount}`);
    }

    let shiftsCreated = 0;
    const totalShifts = weekdaysCount * 5 // 5 shifts per weekday

    // Subscribe to changes in any shifts record
    pb.collection('shifts').subscribe('*', function (e) {
      // TODO: Check for traversal when shifts are already generated in the period
      if (e.action === 'create') {
        shiftsCreated++;
        setProgress(shiftsCreated / totalShifts * 100);

        // Reset progress when all shifts are created
        shiftsCreated === totalShifts && setProgress(0);
      }
    });

    return () => {
      pb.collection('shifts').unsubscribe();
    };
  }, [date?.from, date?.to]);


  return (
    <div className='relative'>
      <div>
        <h4 className='text-lg font-semibold'>Generera skift för period</h4>
      </div>
      <div className='flex flex-row'>
        <div className='flex flex-col gap-4 sm:flex-row'>
          <DatePickerWithRange date={date} setDate={setDate} />
          {progress > 0 && <Progress value={progress} />}
          <Button
            className='sm:mt-0 sm:ml-4 py-4 flex justify-center'
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {
              isLoading ? <div className="animate-pulse"><p>Genererar</p></div> : <p>Generera skift</p>
            }
          </Button>
        </div>
      </div>
    </div>
  );
}