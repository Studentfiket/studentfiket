import { Shift } from "../lib/types";
import { EventInput } from "@fullcalendar/core";

// Takes the shift data from the database and generates events for the calendar.
function generateEvents(data: Shift[]): EventInput[] {

  return data.map((shift) => {
    return {
      id: shift.id
    };
  });
}

export default generateEvents;