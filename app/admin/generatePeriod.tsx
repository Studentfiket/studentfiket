'use client'

import React from 'react';
import { useState } from 'react';
import { DateRange } from 'react-day-picker';
import { addDays } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';

import { DatePickerWithRange } from '@/components/datePickerWithRange';
import { Progress } from '@/components/ui/progress';
import { generateNewPeriod } from '@/lib/scheduling';


export default function GeneratePeriod() {
  const handleSubmit = () => {
    if (!date?.from || !date?.to) {
      console.error("No date selected");
      return;
    }

    setLoadingProgress(0); // Start loading

    generateNewPeriod(date?.from, date?.to).then(() => {
      console.log("Done");
    });
  };

  // TODO: Implement loading progress or whatever
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [date, setDate] = React.useState<DateRange | undefined>(() => {
    const now = new Date();
    const startOfNextWeek = new Date(now.setDate(now.getDate() + (7 - now.getDay())));
    startOfNextWeek.setHours(0, 0, 0, 0);
    return {
      from: startOfNextWeek,
      to: addDays(startOfNextWeek, 6)
    };
  });

  return (
    <div>
      <div>
        <h4 className='text-lg font-semibold'>Generera skift för period</h4>
      </div>
      <div className='flex flex-row'>
        <div className='flex flex-col sm:flex-row'>
          <DatePickerWithRange date={date} setDate={setDate} />
          <Button className='mt-4 sm:mt-0 sm:ml-4' disabled onClick={handleSubmit}>
            <div className="generating"></div>
          </Button>
        </div>
      </div>
    </div>
  );
}