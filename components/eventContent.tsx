import { EventApi } from '@fullcalendar/react';
import { Shift } from '../lib/types';

type Props = {
  eventId: string;
}

const EventContent = (props: Props) => {
  const shiftIsBooked = shift.organisation != "";
  const assignedClassName = shiftIsBooked ? "booked-shift" : "free-shift";
  const shiftIsEditable = !shiftIsBooked;

  console.log(shift.organisation);

  return (
    <div>
      <h2>{props.timeText}</h2>
      <>{props.event.title}</>
    </div>
  );
};

export default EventContent;