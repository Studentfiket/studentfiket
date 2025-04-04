import { Card } from "./ui/card";
import { Shift } from "@/lib/types";
import { DateTime } from "luxon";

interface Props {
  todaysShifts: Shift[];
}

export default async function HomeEventContent(props: Props) {
  console.log('props.todaysShifts', props.todaysShifts);
  const now = DateTime.now().setZone("Europe/Stockholm").toISO();
  console.log('now', now);

  const currentShift = props.todaysShifts.find(shift => {
    const start = DateTime.fromJSDate(new Date(shift.start)).toUTC().toISO();
    const end = DateTime.fromJSDate(new Date(shift.end)).toUTC().toISO();

    if (!start || !end || !now) {
      return false;
    }

    return now >= start && now < end;
  });


  return (
    <div className="items-center">
      <div className="w-full flex flex-col items-start">
        {currentShift ? (
          <div>
            <h1 className="text-white text-left text-4xl md:text-8xl font-light">
              Just nu jobbar <span className="font-bold">{currentShift.organisation}</span>
            </h1>
          </div>
        ) : (
          <h1 className="text-white text-4xl md:text-8xl font-light">Vi har just nu stängt</h1>
        )}
        {props.todaysShifts.length > 0 && (
          <div className="text-white text-4xl md:text-6xl font-light">
            <ul className="mt-2">
              {props.todaysShifts
                .filter(shift => shift.organisation && new Date(shift.start).toISOString() > now)
                .map((shift, index) => (
                  <li key={index} className="text-2xl md:text-4xl font-light">
                    {shift.organisation} : {new Date(shift.start).toLocaleString("sv-SE", { timeZone: "Europe/Stockholm", hour: "2-digit", minute: "2-digit" })} - {new Date(shift.end).toLocaleString("sv-SE", { timeZone: "Europe/Stockholm", hour: "2-digit", minute: "2-digit" })}
                  </li>
                ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}