'use client'

import React from 'react';
import { useState, useEffect } from 'react';
import { DateRange } from 'react-day-picker';
import { addDays } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';

import { DatePickerWithRange } from '@/components/datePickerWithRange';
import { createShift } from '@/lib/scheduling';
import { loadPocketBase } from '@/lib/pocketbase';
import { Progress } from '@/components/ui/progress';
import { generateNewPeriod } from '@/lib/scheduling';


export default function GeneratePeriod() {
  /// Generates new shifts for a given period.
  // const generateNewPeriod = async () => {
  //   async function generateNewDay(date: Date) {
  //     const day = date.getDay();
  //     if (day !== 0 && day !== 6) {
  //       // Generate shifts for the day
  //       for (let i = 8; i <= 15; i += 2) {
  //         // Adjust the time for the lunch shift
  //         if (i === 14) {
  //           i -= 1
  //         }
  //         // Create the shift
  //         const shiftStartTime = new Date(date.setHours(i, 0, 0, 0)).toISOString();
  //         createShift(shiftStartTime, true);
  //       }
  //     }
  //   }

  //   //#region Validation
  //   if (!date?.from || !date?.to) {
  //     console.error("No date selected");
  //     return;
  //   }
  //   //#endregion

  //   // Get number of days in the period
  //   const days = Math.floor((date.to.getTime() - date.from.getTime()) / (1000 * 60 * 60 * 24));
  //   let progress = 0;

  //   // Generate new shifts for the period
  //   for (let d = new Date(date.from); d <= date.to; d.setDate(d.getDate() + 1)) {
  //     console.log("Generating shifts for: ", d);
  //     setLoadingProgress((progress / days) * 100);
  //     await generateNewDay(d);
  //     progress++;
  //   }
  // }

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
        <Alert className='w-1/2 my-3'>
          <Progress value={loadingProgress} />
        </Alert>
      </div>
      <div className='flex flex-col sm:flex-row'>
        <DatePickerWithRange date={date} setDate={setDate} />
        <Button className='mt-4 sm:mt-0 sm:ml-4' onClick={handleSubmit}>
          Generera skift
        </Button>
      </div>
    </div>
  );
}