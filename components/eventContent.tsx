import { EventApi } from '@fullcalendar/react';
import { Shift } from '../lib/types';

type Props = {
  eventId: string;
}

const EventContent = (props: Props) => {
  const setTitle = (shift: Shift) => {
    if (shift.organisation == "") {
      return "BOKA";
    }
    else {
      if (shift.organisation.length > 7)
        shift.organisation = shift.organisation.substring(0, 7) + "...";

      return `${shift.organisation} ${shift.person1} ${shift.person2}`;
    }
  }

  const shiftIsBooked = shift.organisation != "";
  const assignedClassName = shiftIsBooked ? "booked-shift" : "free-shift";
  const shiftIsEditable = !shiftIsBooked;

  console.log(shift.organisation);

  events.push({
    id: shift.id,
    title: setTitle(shift),
    start: shift.start,
    end: shift.end,
    className: assignedClassName,
    editable: shiftIsEditable,
  });
});
return events;

return (
  <div>
    <h2>{props.timeText}</h2>
    <>{props.event.title}</>
  </div>
);
};

export default EventContent;