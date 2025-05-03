'use client'
import { useEffect } from "react";
import { Card } from "./ui/card";
import { Shift } from "@/lib/types";
import { DateTime } from "luxon";
import { useState } from "react";

interface Props {
  todaysShifts: Shift[];
}

function getNow(): string {
  return DateTime.now().setZone("Europe/Stockholm").toISO() || "";
}

function formatTime(dateString: string): string {
  const date = DateTime.fromISO(dateString).setZone('utc');
  return date.toFormat("HH:mm");
}

export default function HomeEventContent(props: Props) {
  const [now, setNow] = useState(getNow());
  const upcomingShiftColors = ['#b78b64', '#bf9875', '#c7a587', '#cfb298', '#d7bfa9'];


  useEffect(() => {
    // Update current time
    setNow(getNow());

    // Set up interval to update time every minute
    const interval = setInterval(() => {
      setNow(getNow());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  // Find current shift
  const currentShift = props.todaysShifts.find(shift => {
    const start = new Date(shift.start).toISOString();
    const end = new Date(shift.end).toISOString();

    if (!start || !end || !now) {
      return false;
    }

    return now >= start && now < end;
  });

  // Get upcoming shifts
  const upcomingShifts = props.todaysShifts
    .filter(shift => shift.organisation && shift.start > now)
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

  return (
    <div className="items-center md:items-start w-full flex flex-col gap-y-6 md:max-w-[600px]">
      {/* Current Status */}
      <Card className="rounded-2xl p-4 w-full bg-[#e7d9cc]">
        {currentShift ? (
          <div className="flex flex-row gap-4">
            <div className="text-3xl md:text-6xl font-bold rounded-2xl bg-white px-4 py-8 w-min flex items-center">ÖPPET</div>
            <div className="rounded-2xl bg-white p-4 flex flex-col w-full">
              <div className="text-2xl md:text-5xl font-bold">{currentShift.organisation}</div>
              <div className="text-xl">
                {formatTime(currentShift.start)} - {formatTime(currentShift.end)}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-row gap-4">
            <div className="text-2xl md:text-6xl font-bold rounded-2xl text-white bg-shift-booked px-4 py-8 w-min flex items-center">STÄNGT</div>
            <div className="rounded-2xl bg-shift-booked text-white p-4 flex items-center w-full text-xl">
              Kom gärna tillbaka imorgon!
            </div>
          </div>
        )}


        {/* {currentShift ? (
          <div>
            <div className="text-xl">Just nu jobbar</div>
            <div className="text-4xl md:text-6xl font-bold">{currentShift.organisation}</div>
            <div className="text-xl">
              {formatTime(currentShift.start)} - {formatTime(currentShift.end)}
            </div>
          </div>
        ) : (
          <div>
            <div className="text-2xl md:text-4xl font-light">Vi har just nu</div>
            <div className="text-4xl md:text-6xl font-bold">STÄNGT</div>
          </div>
        )} */}
      </Card>

      {/* Upcoming Shifts */}
      {upcomingShifts.length > 0 && (
        <div className="w-full bg-latteBright shadow-xl rounded-2xl p-4 lg:max-w-[600px]">
          <h2 className="text-2xl mb-4">Kommande pass</h2>

          <div className="space-y-2">
            {upcomingShifts.map((shift, index) => (
              <Card
                key={index}
                className={`rounded-lg px-6 py-3 w-full text-white`}
                style={{
                  backgroundColor: upcomingShiftColors[index],
                  width: `${100 - index * 8}%`,
                  maxWidth: "100%",
                }}
              >
                <div className="font-bold text-xl">{shift.organisation}</div>
                <div className="opacity-90">
                  {formatTime(shift.start)} - {formatTime(shift.end)}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}