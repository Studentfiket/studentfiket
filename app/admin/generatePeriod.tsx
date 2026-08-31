'use client'

import React, { useEffect, useState } from 'react';
import PocketBase from 'pocketbase';
import { DateRange } from 'react-day-picker';
import { addDays } from 'date-fns';
import { Button } from '@/components/ui/button';

import { DatePickerWithRange } from '@/app/admin/datePickerWithRange';
import { generateNewPeriod } from '@/lib/scheduling';
import { Progress } from '@/components/ui/progress';
import { Alert } from '@/components/ui/alert';

// Alla möjliga pass (starttimme → label)
const SHIFT_OPTIONS = [
  { hour: 8, label: '08–10' },
  { hour: 10, label: '10–12' },
  { hour: 12, label: '12–13' },
  { hour: 13, label: '13–15' },
  { hour: 15, label: '15–17' },
] as const;

export default function GeneratePeriod() {
  const handleSubmit = () => {
    // man kan ha valt bara en dag (from utan to) – då genererar vi den dagen
    if (!date?.from) {
      console.error("No date selected");
      return;
    }
    const from = date.from;
    const to = date.to ?? date.from; // en dag = from och to samma

    // Inga pass ikryssade → gör inget
    if (selectedHours.length === 0) {
      console.error("No shifts selected");
      return;
    }

    // Start loading and hide confirmation
    setShowConfirmation(false);
    setIsLoading(true);
    // skicka en kopia av ikryssade tider till servern
    const hoursToCreate = [...selectedHours].sort((a, b) => a - b);
    console.log("Genererar pass med tider:", hoursToCreate);
    generateNewPeriod(from, to, hoursToCreate).then(() => {
      // Stop loading and show confirmation
      setIsLoading(false);
      setShowConfirmation(true);
    });
  };

  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  // Alla ikryssade som default
  const [selectedHours, setSelectedHours] = useState<number[]>(
    SHIFT_OPTIONS.map((option) => option.hour)
  );
  const [date, setDate] = React.useState<DateRange | undefined>(() => {
    const now = new Date();
    const startOfNextWeek = new Date(now.setDate(now.getDate() + (7 - now.getDay())));
    startOfNextWeek.setHours(0, 0, 0, 0);
    return {
      from: startOfNextWeek,
      to: addDays(startOfNextWeek, 6)
    };
  });

  const toggleHour = (hour: number) => {
    setSelectedHours((prev) =>
      prev.includes(hour) ? prev.filter((h) => h !== hour) : [...prev, hour].sort((a, b) => a - b)
    );
  };

  useEffect(() => {
    const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);

    // Find out how many weekdays are in the period to be generated
    let weekdaysCount = 0;
    if (date?.from) {
      const rangeEnd = date.to ?? date.from; // samma fix som vid generering
      for (let d = new Date(date.from); d <= rangeEnd; d.setDate(d.getDate() + 1)) {
        const day = d.getDay();
        if (day !== 0 && day !== 6) { // Exclude Sundays (0) and Saturdays (6)
          weekdaysCount++;
        }
      }
      console.log(`Weekdays in period: ${weekdaysCount}`);
    }

    let shiftsCreated = 0;
    // progress beror på hur många pass man kryssat i
    const totalShifts = weekdaysCount * selectedHours.length;

    // Subscribe to changes in any shifts record
    pb.collection('shifts').subscribe('*', function (e) {
      // TODO: Check for traversal when shifts are already generated in the period
      if (e.action === 'create') {
        shiftsCreated++;
        setProgress(totalShifts > 0 ? shiftsCreated / totalShifts * 100 : 0);

        // Reset progress when all shifts are created
        shiftsCreated === totalShifts && setProgress(0);
      }
    });

    return () => {
      pb.collection('shifts').unsubscribe();
    };
  }, [date?.from, date?.to, selectedHours.length]);


  return (
    <div className='relative flex flex-col gap-4'>
      <div>
        <h4 className='text-lg font-semibold'>Generera skift för period</h4>
      </div>

      {/* kunna avmarkera vissa pass innan generering */}
      <div className='flex flex-wrap gap-3'>
        {SHIFT_OPTIONS.map((option) => (
          <label
            key={option.hour}
            className='flex items-center gap-2 cursor-pointer rounded-md border px-3 py-2 text-sm'
          >
            <input
              type='checkbox'
              checked={selectedHours.includes(option.hour)}
              onChange={() => toggleHour(option.hour)}
              disabled={isLoading}
              className='h-4 w-4'
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>

      <div className='flex flex-row'>
        <div className='flex flex-col gap-4 sm:flex-row sm:items-center'>
          <DatePickerWithRange date={date} setDate={setDate} />
          {isLoading && <Progress value={progress} />}
          {showConfirmation && <Alert className='bg-shift-free text-white font-semibold'>Skift genererade</Alert>}
          <Button
            className='sm:mt-0 sm:ml-4 py-4 flex justify-center'
            onClick={handleSubmit}
            disabled={isLoading || selectedHours.length === 0}
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
