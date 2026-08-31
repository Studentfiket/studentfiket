'use client'

import { useEffect, useState } from "react";
import { Card } from "./ui/card";
import { Shift } from "@/lib/types";
import { DateTime } from "luxon";
import Link from "next/link";

interface Props {
  todaysShifts: Shift[];
}

function getNow(): string {
  return DateTime.now().setZone("Europe/Stockholm").toISO() ?? "";
}
function covertToISO(dateString: string): string {
  return getDate(dateString).toISO() ?? "";
}
function getDate(dateString: string): DateTime {
  return DateTime.fromFormat(dateString, "yyyy-MM-dd HH:mm:ss.SSS'Z'", { zone: 'utc' });
}

function formatTime(dateString: string): string {
  const date = getDate(dateString);
  return date.toFormat("HH:mm");
}

function getClosedMessage(shifts: Shift[]): string {
  const fallback = "Just nu är det stängt, engagera dig för att det ska vara öppet mer ofta :)";
  const now = DateTime.now().setZone("Europe/Stockholm");
  const isWeekend = now.weekday === 6 || now.weekday === 7;
  const nextOpenDay = isWeekend
    ? now.plus({ days: now.weekday === 6 ? 2 : 1 }).startOf("day")
    : now.plus({ days: 1 }).startOf("day");

  const nextDayShifts = shifts
    .filter((shift) => getDate(shift.start).hasSame(nextOpenDay, "day"))
    .sort((a, b) => getDate(a.start).toMillis() - getDate(b.start).toMillis());

  if (nextDayShifts[0]) {
    const time = formatTime(nextDayShifts[0].start);
    // Helg → måndag, vardag → imorgon
    return isWeekend
      ? `Just nu är det stängt, men öppnar igen på måndag kl ${time}`
      : `Just nu är det stängt, men öppnar igen imorgon kl ${time}`;
  }

  return fallback;
}

export default function HomeEventContent(props: Readonly<Props>) {
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

  //TODO: Fix better
  props.todaysShifts.forEach(shift => {
    if (shift.organisation === "" && shift.workers[0] != null) {
      shift.organisation = "Privat";
    }
  });

  // Find current shift
  const currentShift = props.todaysShifts.find(shift => {
    const start = covertToISO(shift.start);
    const end = covertToISO(shift.end);

    if (!start || !end || !now) {
      return false;
    }

    return now >= start && now < end && shift.organisation !== "";
  });

  // Get upcoming shifts
  const upcomingShifts = props.todaysShifts
    .filter(shift => shift.organisation && covertToISO(shift.start) > now && getDate(shift.start).hasSame(DateTime.now().setZone("Europe/Stockholm"), "day"))
    .sort((a, b) => getDate(a.start).hour - getDate(b.start).hour);

  return (
    <Link href={"/calendar"} className="items-center md:items-start w-full flex flex-col gap-y-6">
      {/* Current Status */}
      <Card className="p-4 w-full bg-latteBright lg:h-[150px]">
        {currentShift ? (
          <div className="flex flex-col gap-4 sm:flex-row">
            <Card className="text-3xl md:text-5xl font-bold bg-white px-4 py-6 sm:py-8 w-full sm:w-min flex items-center">ÖPPET</Card>
            <Card className="bg-white p-4 flex flex-col justify-center w-full md:min-w-64">
              <div className="text-2xl md:text-3xl font-bold">{currentShift.organisation}</div>
              <div className="text-xl">
                {formatTime(currentShift.start)} - {formatTime(currentShift.end)}
              </div>
            </Card>
          </div>
        ) : (
          <div className="flex flex-row gap-4 h-full">
            <Card className="p-4 flex items-center w-full text-xl">
              {getClosedMessage(props.todaysShifts)}
            </Card>
          </div>
        )}
      </Card>

      {/* Upcoming Shifts */}
      {upcomingShifts.length > 0 && (
        <div className="w-full bg-latteBright shadow-xl rounded-2xl p-4 lg:max-w-[600px] lg:h-full">
          <h2 className="text-2xl mb-4 font-bold">Kommande pass</h2>

          <div className="space-y-2">
            {upcomingShifts.map((shift, index) => (
              <Card
                key={shift.id}
                className={`px-6 py-3 w-full text-white border-none`}
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
    </Link>
  );
}
