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
    <div className="items-center md:items-start w-full flex flex-col md:max-w-[600px]">
      {/* Current Status */}
      <Card className="rounded-lg p-6 mb-6 w-full">
        {currentShift ? (
          <div>
            <div className="text-xl">Just nu jobbar</div>
            <div className="text-4xl md:text-6xl font-bold">{currentShift.organisation}</div>
            <div className="text-xl">
              {formatTime(currentShift.start)} - {formatTime(currentShift.end)}
            </div>
          </div>
        ) : (
          <div className="text-4xl md:text-6xl font-light">Vi har just nu stängt</div>
        )}
      </Card>

      {/* Upcoming Shifts */}
      {upcomingShifts.length > 0 && (
        <div className="mt-8 w-full lg:max-w-[600px]">
          <h2 className="text-2xl mb-4 text-white">Kommande pass</h2>

          <div className="space-y-2">
            {upcomingShifts.map((shift, index) => (
              <Card
                key={index}
                className={`rounded-lg px-6 py-3 w-full`}
                style={{
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