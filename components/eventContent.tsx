import { getShiftById } from "@/lib/pocketbase";
import { Shift } from "@/lib/types";

type Props = {
  eventId: string;
  eventTime: string;
  view: string;
}

const EventContent = (props: Props) => {
  console.log(props.eventId);

  const shift: Shift | undefined = getShiftById(props.eventId);
  if (!shift) {
    throw new Error(`Shift ${props.eventId} not found`);
  }

  const shiftIsBooked = shift.organisation !== "";

  console.log(shift);


  return (
    <div className='event-container w-full h-full py-1 overflow-hidden'>
      <div className="grid">
        <div>
          <h2 className="text-sm">{props.eventTime}</h2>
          {shiftIsBooked ? <h3>{shift.organisation}</h3> : <h3>BOKA</h3>}
        </div>
        <div>
          <p>{shift.person1}</p>
          <p>{shift.person2}</p>
        </div>
      </div>
    </div>
  );
};

export default EventContent;