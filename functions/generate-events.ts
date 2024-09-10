import { Shift } from "../lib/types";
import { EventInput } from "@fullcalendar/react";

// Takes the shift data from the database and generates events for the calendar.
function generateEvents(data: Shift[]): EventInput[] {
  // const setTitle = (shift: Shift) => {
  //   if (shift.organisation == "") {
  //     return "BOKA";
  //   }
  //   else {
  //     if (shift.organisation.length > 7)
  //       shift.organisation = shift.organisation.substring(0, 7) + "...";

  //     return `${shift.organisation} ${shift.person1} ${shift.person2}`;
  //   }
  // }

  // const events: EventInput[] = [];
  // data.forEach((shift) => {
  //   const shiftIsBooked = shift.organisation != "";
  //   const assignedClassName = shiftIsBooked ? "booked-shift" : "free-shift";
  //   const shiftIsEditable = !shiftIsBooked;

  //   console.log(shift.organisation);

  //   events.push({
  //     id: shift.id,
  //     title: setTitle(shift),
  //     start: shift.start,
  //     end: shift.end,
  //     className: assignedClassName,
  //     editable: shiftIsEditable,
  //   });
  // });
  // return events;
  return data.map((shift) => {
    return {
      id: shift.id
    };
  });
}

export default generateEvents;